'use client';

import React, { useEffect, useState } from "react";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import { useAuth } from "../auth/Authcontext";

type FieldErrors = {
    email?: string;
    password?: string;
};

function getLoginErrorMessage(error: unknown): string {
    if (error instanceof AxiosError) {
        if (!error.response) {
            return "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";
        }

        const status = error.response.status;

        if (status === 403) {
            return "E-mail ou senha incorretos. Verifique seus dados e tente novamente.";
        }

        if (status >= 500) {
            return "Serviço temporariamente indisponível. Tente novamente em instantes.";
        }
    }

    return "Não foi possível entrar. Tente novamente.";
}

function validateForm(email: string, password: string): FieldErrors {
    const errors: FieldErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
        errors.email = "Informe seu e-mail.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        errors.email = "Informe um e-mail válido.";
    }

    if (!password) {
        errors.password = "Informe sua senha.";
    }

    return errors;
}

export default function Login() {
    const router = useRouter();
    const { login, isAuthenticated, isLoading: authLoading, usuario } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isSubmitting) return;

        const validationErrors = validateForm(email, password);
        setFieldErrors(validationErrors);
        setFormError(null);

        if (Object.keys(validationErrors).length > 0) return;

        setIsSubmitting(true);

        try {
            await login({
                email: email.trim(),
                senha: password,
            });
        } catch (error) {
            setFormError(getLoginErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    }

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen min-w-full bg-gray-100">
                <p className="text-gray-600" role="status" aria-live="polite">
                    Carregando...
                </p>
            </div>
        );
    }

    const isFormDisabled = isSubmitting;

    return (
        <div className="flex flex-col-reverse md:flex-row items-center justify-center min-h-screen min-w-full p-4 md:p-0 gap-0 bg-gray-100">
            <div className="flex flex-col items-center justify-center w-full md:max-w-5/12 h-auto md:h-3/4 p-6 bg-white rounded-b-lg md:rounded-b-none md:rounded-l-lg md:rounded-bl-lg shadow-lg">
                <div className="flex flex-col items-center justify-center w-full sm:w-5/6 md:w-2/3 h-full">
                    <h1 className="w-full mb-6 text-2xl font-semibold text-gray-900 text-center">
                        Entrar
                    </h1>
                    <form
                        className="flex flex-col items-center justify-center w-full h-full gap-4"
                        onSubmit={handleLogin}
                        noValidate
                        aria-busy={isSubmitting}
                    >
                        {formError && (
                            <div
                                className="w-full rounded-lg border border-vp-coral-500 bg-red-50 px-4 py-3 text-sm text-vp-coral-700"
                                role="alert"
                                aria-live="assertive"
                            >
                                {formError}
                            </div>
                        )}

                        <div className="w-full">
                            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                                E-mail
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                inputMode="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (fieldErrors.email) {
                                        setFieldErrors((prev) => ({ ...prev, email: undefined }));
                                    }
                                    if (formError) setFormError(null);
                                }}
                                disabled={isFormDisabled}
                                aria-invalid={!!fieldErrors.email}
                                aria-describedby={fieldErrors.email ? "email-error" : undefined}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                                    fieldErrors.email
                                        ? "border-vp-coral-500 focus:ring-vp-coral-500"
                                        : "border-gray-300 focus:ring-vp-azul-700"
                                }`}
                            />
                            {fieldErrors.email && (
                                <p id="email-error" className="mt-1 text-sm text-vp-coral-700" role="alert">
                                    {fieldErrors.email}
                                </p>
                            )}
                        </div>

                        <div className="w-full">
                            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                                Senha
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="Sua senha"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (fieldErrors.password) {
                                        setFieldErrors((prev) => ({ ...prev, password: undefined }));
                                    }
                                    if (formError) setFormError(null);
                                }}
                                disabled={isFormDisabled}
                                aria-invalid={!!fieldErrors.password}
                                aria-describedby={fieldErrors.password ? "password-error" : undefined}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                                    fieldErrors.password
                                        ? "border-vp-coral-500 focus:ring-vp-coral-500"
                                        : "border-gray-300 focus:ring-vp-azul-700"
                                }`}
                            />
                            {fieldErrors.password && (
                                <p id="password-error" className="mt-1 text-sm text-vp-coral-700" role="alert">
                                    {fieldErrors.password}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center w-full gap-2 sm:gap-0">
                            <Link
                                href="/recuperar-senha"
                                className="text-sm text-vp-azul-700 hover:underline focus:outline-none focus:ring-2 focus:ring-vp-azul-700 rounded"
                            >
                                Esqueci minha senha
                            </Link>
                        </div>

                        <Button
                            variant="primary"
                            size="md"
                            className="w-full"
                            type="submit"
                            loading={isSubmitting}
                            disabled={isFormDisabled}
                        >
                            {isSubmitting ? "Entrando..." : "Entrar"}
                        </Button>

                        <Button variant="transparent" size="md" className="w-full" disabled={isFormDisabled} onClick={() => router.push('/cadastro')}>
                            Cadastre-se
                        </Button>
                    </form>
                </div>
            </div>
            <div
                className="w-full md:max-w-5/12 h-24 md:h-3/4 bg-brand-wellness rounded-t-lg md:rounded-t-none md:rounded-r-lg shadow-lg"
                aria-hidden="true"
            />
        </div>
    );
}
