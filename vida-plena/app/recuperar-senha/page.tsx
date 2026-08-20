'use client';

import React, { useState } from 'react';
import Button from '../components/Button';
import { useRouter } from "next/navigation";
import { authService } from '../services/authService';

export default function RecuperarSenha() {
    const [email, setEmail] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const router = useRouter();

    const [fieldErrors, setFieldErrors] = useState<{
        email?: string;
    }>({});

    const validateForm = () => {
        const errors: { email?: string } = {};

        if (!email.trim()) {
            errors.email = 'Informe seu e-mail.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Informe um e-mail válido.';
        }

        setFieldErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setFormError(null);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await authService.forgotPassword(email.trim());
            setEmailSent(true);
        } catch (error) {
            console.error(error);
            setFormError(
                'Não foi possível solicitar a recuperação da senha. Tente novamente.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormDisabled = isSubmitting;

    return (
        <div className="flex flex-col-reverse md:flex-row items-center justify-center min-h-screen min-w-full p-4 md:p-0 gap-0 bg-gray-100">
            <div className="flex flex-col items-center justify-center w-full md:max-w-5/12 h-auto md:h-3/4 p-6 bg-white rounded-b-lg md:rounded-b-none md:rounded-l-lg md:rounded-bl-lg shadow-lg">
                <div className="flex flex-col items-center justify-center w-full sm:w-5/6 md:w-2/3 h-full">
                    {emailSent ? (
                        <div className="flex flex-col items-center justify-center w-full gap-4 text-center">
                            <div
                                className="flex items-center justify-center w-14 h-14 rounded-full bg-green-50"
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

                            <h1 className="w-full text-2xl font-semibold text-gray-900">
                                Verifique seu e-mail
                            </h1>

                            <p className="text-sm text-gray-600">
                                Se <span className="font-medium text-gray-800">{email.trim()}</span> estiver cadastrado, você receberá um e-mail com as instruções para redefinir sua senha em instantes.
                            </p>

                            <Button
                                variant="primary"
                                size="md"
                                className="w-full"
                                onClick={() => router.push('/login')}
                            >
                                Voltar para o login
                            </Button>

                            <Button
                                variant="transparent"
                                size="md"
                                className="w-full"
                                onClick={() => {
                                    setEmailSent(false);
                                    setEmail('');
                                }}
                            >
                                Usar outro e-mail
                            </Button>
                        </div>
                    ) : (
                        <>
                            <h1 className="w-full mb-2 text-2xl font-semibold text-gray-900 text-center">
                                Esqueceu sua senha?
                            </h1>

                            <p className="mb-6 text-center text-sm text-gray-600">
                                Informe seu e-mail para receber as instruções de
                                recuperação.
                            </p>

                            <form
                                className="flex flex-col items-center justify-center w-full h-full gap-4"
                                onSubmit={handleSubmit}
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
                                    <label
                                        htmlFor="email"
                                        className="mb-1 block text-sm font-medium text-gray-700"
                                    >
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
                                                setFieldErrors((prev) => ({
                                                    ...prev,
                                                    email: undefined,
                                                }));
                                            }

                                            if (formError) {
                                                setFormError(null);
                                            }
                                        }}
                                        disabled={isFormDisabled}
                                        aria-invalid={!!fieldErrors.email}
                                        aria-describedby={
                                            fieldErrors.email
                                                ? 'email-error'
                                                : undefined
                                        }
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                                            fieldErrors.email
                                                ? 'border-vp-coral-500 focus:ring-vp-coral-500'
                                                : 'border-gray-300 focus:ring-vp-azul-700'
                                        }`}
                                    />

                                    {fieldErrors.email && (
                                        <p
                                            id="email-error"
                                            className="mt-1 text-sm text-vp-coral-700"
                                            role="alert"
                                        >
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
                                    {isSubmitting
                                        ? 'Enviando...'
                                        : 'Enviar instruções'}
                                </Button>

                                <Button
                                    variant="transparent"
                                    size="md"
                                    className="w-full"
                                    disabled={isFormDisabled}
                                    onClick={() => router.push('/login')}
                                >
                                    Voltar para o login
                                </Button>
                            </form>
                        </>
                    )}
                </div>
            </div>
            <div
                className="w-full md:max-w-5/12 h-24 md:h-3/4 bg-brand-wellness rounded-t-lg md:rounded-t-none md:rounded-r-lg shadow-lg"
                aria-hidden="true"
            />
        </div>
    );
}