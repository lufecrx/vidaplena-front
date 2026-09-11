'use client';

import React, { useState } from "react";
import { AxiosError } from "axios";
import Link from "next/link";
import Button from "@/app/components/Button";
import {
    AuthFormError,
    AuthPageHeader,
    AuthPageLayout,
    authInputClass,
} from "@/app/components/auth/AuthPageLayout";
import { useAuth } from "@/app/auth/Authcontext";

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

function PasswordToggleButton({
    showPassword,
    onToggle,
    disabled,
}: {
    showPassword: boolean;
    onToggle: () => void;
    disabled: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onToggle}
            disabled={disabled}
            className="absolute right-0 top-0 h-full px-3 flex items-center text-gray-400 hover:text-vp-azul-700 focus:outline-none focus:text-vp-azul-700 disabled:cursor-not-allowed"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={showPassword}
        >
            {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path
                        d="M10.6 5.2A10.9 10.9 0 0112 5c5 0 9 4.2 10 7-.4 1.1-1.1 2.3-2.1 3.4M6.6 6.6C4.5 8 3 9.9 2 12c1 2.8 5 7 10 7 1.4 0 2.7-.3 3.9-.8"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M9.5 9.8a3 3 0 004.2 4.2"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                        d="M2 12c1-2.8 5-7 10-7s9 4.2 10 7c-1 2.8-5 7-10 7s-9-4.2-10-7z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                    />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                </svg>
            )}
        </button>
    );
}

export default function Login() {
    const { login, isLoading: authLoading } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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
            <div className="flex items-center justify-center min-h-screen min-w-full bg-[#F3F6F1]">
                <p className="text-gray-600" role="status" aria-live="polite">
                    Carregando...
                </p>
            </div>
        );
    }

    const isFormDisabled = isSubmitting;

    return (
        <AuthPageLayout>
            <AuthPageHeader title="Entrar" />

            <form
                className="flex flex-col items-center justify-center w-full gap-4"
                onSubmit={handleLogin}
                noValidate
                aria-busy={isSubmitting}
            >
                {formError && <AuthFormError message={formError} />}

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
                        className={authInputClass(!!fieldErrors.email)}
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
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
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
                            className={authInputClass(!!fieldErrors.password, "pr-11")}
                        />
                        <PasswordToggleButton
                            showPassword={showPassword}
                            onToggle={() => setShowPassword((v) => !v)}
                            disabled={isFormDisabled}
                        />
                    </div>
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

                <p className="text-sm text-gray-600">
                    Ainda não tem uma conta?{" "}
                    <Link href="/cadastro" className="font-medium text-vp-azul-700 hover:underline">
                        Cadastre-se
                    </Link>
                </p>

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
            </form>
        </AuthPageLayout>
    );
}
