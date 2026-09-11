'use client'

import React, { useEffect } from 'react'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'

export interface ToastData {
  tipo: 'sucesso' | 'erro'
  mensagem: string
}

interface ToastNotificationProps {
  toast: ToastData | null
  onClose: () => void
  duracaoMs?: number
}

export function ToastNotification({
  toast,
  onClose,
  duracaoMs = 4000,
}: ToastNotificationProps) {
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => {
      onClose()
    }, duracaoMs)
    return () => clearTimeout(timer)
  }, [toast, onClose, duracaoMs])

  if (!toast) return null

  const isSucesso = toast.tipo === 'sucesso'

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border transition-all animate-in fade-in slide-in-from-bottom-5 bg-white max-w-md">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
          isSucesso ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
        }`}
      >
        {isSucesso ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <AlertCircle className="w-5 h-5" />
        )}
      </div>

      <div className="text-sm font-semibold text-slate-800 flex-1">
        {toast.mensagem}
      </div>

      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
