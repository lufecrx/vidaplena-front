import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const TOKEN_STORAGE_KEY = 'vidaplena_token'

let accessToken: string | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
  }
}

export function getAccessToken(): string | null {
  if (!accessToken && typeof window !== 'undefined') {
    accessToken = localStorage.getItem(TOKEN_STORAGE_KEY)
  }
  return accessToken
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // envia o refreshToken cookie httpOnly caso disponível
})

// ── Request: injeta Bearer token ──────────────────────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response: trata 401 e tenta refresh ──────────────────────────────────
let isRefreshing = false
let queue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null) {
  queue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token as string)
  })
  queue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Ignora erros que não sejam 401 ou que já tentaram refresh
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    // Se for endpoint de autenticação pública, não intercepta para refresh
    if (
      original.url?.includes('/api/v1/auth/login') ||
      original.url?.includes('/api/v1/auth/forgot-password') ||
      original.url?.includes('/api/v1/auth/reset-password')
    ) {
      return Promise.reject(error)
    }

    // Se não há token ativo (nenhuma sessão iniciada), rejeita sem redirecionar
    const activeToken = getAccessToken()
    if (!activeToken) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      // Outros pedidos aguardam o refresh terminar
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject })
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`
        return api(original)
      })
    }

    original._retry = true
    isRefreshing = true

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'
      // O refreshToken viria via cookie httpOnly
      const { data } = await axios.post<{ token?: string; accessToken?: string }>(
        `${baseUrl}/api/v1/auth/refresh`,
        {},
        { withCredentials: true },
      )

      const novoToken = data.accessToken || data.token
      if (!novoToken) {
        throw new Error('Refresh token não retornou novo token')
      }

      setAccessToken(novoToken)
      processQueue(null, novoToken)
      original.headers.Authorization = `Bearer ${novoToken}`
      return api(original)
    } catch (refreshError) {
      processQueue(refreshError, null)
      const hadSession = !!getAccessToken()
      setAccessToken(null)

      // Redireciona para login apenas se não estiver já na tela de login e se havia sessão iniciada
      if (typeof window !== 'undefined' && window.location.pathname !== '/login' && hadSession) {
        window.location.href = '/login'
      }
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)