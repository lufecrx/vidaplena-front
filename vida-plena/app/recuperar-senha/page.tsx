'use client';

import React, { useState } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import {
    AuthFormError,
    AuthPageHeader,
    AuthPageLayout,
    authInputClass,
} from "../components/auth/AuthPageLayout";
import { authService } from "../services/authService";

function getForgotPasswordErrorMessage(error: unknown): string {
    if (error instanceof AxiosError) {
        if (!error.response) {
            return "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";
        }

        if (error.response.status >= 500) {
            return "Serviço temporariamente indisponível. Tente novamente em instantes.";
        }
    }

    return "Não foi possível solicitar a recuperação da senha. Tente novamente.";
}

export default function RecuperarSenha() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [fieldErrors, setFieldErrors] = useState<{ email?: string }>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    function validateForm() {
        const errors: { email?: string } = {};
        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            errors.email = "Informe seu e-mail.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            errors.email = "Informe um e-mail válido.";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isSubmitting) return;

        setFormError(null);

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            await authService.forgotPassword(email.trim());
            setEmailSent(true);
        } catch (error) {
            setFormError(getForgotPasswordErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    }

    const isFormDisabled = isSubmitting;

    return (
        <AuthPageLayout>
            {emailSent ? (
                <>
                    <AuthPageHeader
                        title="Verifique seu e-mail"
                        description={`Se ${email.trim()} estiver cadastrado, você receberá um e-mail com as instruções para redefinir sua senha em instantes.`}
                    />

                    <div className="flex flex-col items-center justify-center w-full gap-4 text-center">
                        <div
                            className="flex items-center justify-center w-14 h-14 rounded-full bg-green-50 -mt-4"
                            aria-hidden="true"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-7 h-7 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                        </div>

                        <Button
                            variant="primary"
                            size="md"
                            className="w-full"
                            onClick={() => router.push("/login")}
                        >
                            Voltar para o login
                        </Button>

                        <Button
                            variant="transparent"
                            size="md"
                            className="w-full"
                            onClick={() => {
                                setEmailSent(false);
                                setEmail("");
                                setFormError(null);
                                setFieldErrors({});
                            }}
                        >
                            Usar outro e-mail
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <AuthPageHeader
                        title="Esqueceu sua senha?"
                        description="Informe seu e-mail para receber as instruções de recuperação."
                    />

                    <form
                        className="flex flex-col items-center justify-center w-full gap-4"
                        onSubmit={handleSubmit}
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
                                onChange={(event) => {
                                    setEmail(event.target.value);

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

                        <Button
                            variant="primary"
                            size="md"
                            className="w-full"
                            type="submit"
                            loading={isSubmitting}
                            disabled={isFormDisabled}
                        >
                            {isSubmitting ? "Enviando..." : "Enviar instruções"}
                        </Button>

                        <Button
                            variant="transparent"
                            size="md"
                            className="w-full"
                            disabled={isFormDisabled}
                            onClick={() => router.push("/login")}
                        >
                            Voltar para o login
                        </Button>
                    </form>
                </>
            )}
        </AuthPageLayout>
    );
}
