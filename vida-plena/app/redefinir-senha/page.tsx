'use client';

import React, { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "../components/Button";
import { authService } from "../services/authService";

type FieldErrors = {
    novaSenha?: string;
    confirmarSenha?: string;
};

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

function getResetErrorMessage(error: unknown): string {
    if (error instanceof AxiosError) {
        if (!error.response) {
            return "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";
        }

        const status = error.response.status;

        if (status === 400 || status === 404) {
            return "Este link de redefinição é inválido ou já foi utilizado.";
        }

        if (status === 410) {
            return "Este link de redefinição expirou. Solicite um novo.";
        }

        if (status >= 500) {
            return "Serviço temporariamente indisponível. Tente novamente em instantes.";
        }
    }

    return "Não foi possível redefinir sua senha. Tente novamente.";
}

function validateForm(novaSenha: string, confirmarSenha: string): FieldErrors {
    const errors: FieldErrors = {};

    if (!novaSenha) {
        errors.novaSenha = "Informe sua nova senha.";
    } else if (!PASSWORD_REGEX.test(novaSenha)) {
        errors.novaSenha =
            "A senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e símbolo.";
    }

    if (!confirmarSenha) {
        errors.confirmarSenha = "Confirme sua nova senha.";
    } else if (novaSenha && confirmarSenha !== novaSenha) {
        errors.confirmarSenha = "As senhas não coincidem.";
    }

    return errors;
}

export default function RedefinirSenha() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [tokenMissing, setTokenMissing] = useState(false);

    useEffect(() => {
        if (!token) {
            setTokenMissing(true);
        }
    }, [token]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isSubmitting || !token) return;

        const validationErrors = validateForm(novaSenha, confirmarSenha);
        setFieldErrors(validationErrors);
        setFormError(null);

        if (Object.keys(validationErrors).length > 0) return;

        setIsSubmitting(true);

        try {
            await authService.resetPassword(
                token,
                novaSenha,
                confirmarSenha
            );
            setResetSuccess(true);
        } catch (error) {
            setFormError(getResetErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    }

    const isFormDisabled = isSubmitting;

    return (
        <div className="flex flex-col-reverse md:flex-row items-center justify-center min-h-screen min-w-full p-4 md:p-0 gap-0 bg-gray-100">
            <div className="flex flex-col items-center justify-center w-full md:max-w-5/12 h-auto md:h-3/4 p-6 bg-white rounded-b-lg md:rounded-b-none md:rounded-l-lg md:rounded-bl-lg shadow-lg">
                <div className="flex flex-col items-center justify-center w-full sm:w-5/6 md:w-2/3 h-full">
                    {tokenMissing ? (
                        <div className="flex flex-col items-center justify-center w-full gap-4 text-center">
                            <div
                                className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50"
                                aria-hidden="true"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-7 h-7 text-vp-coral-700"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>

                            <h1 className="w-full text-2xl font-semibold text-gray-900">
                                Link inválido
                            </h1>

                            <p className="text-sm text-gray-600">
                                Este link de redefinição de senha é inválido ou está incompleto. Solicite um novo link para continuar.
                            </p>

                            <Button
                                variant="primary"
                                size="md"
                                className="w-full"
                                onClick={() => router.push("/recuperar-senha")}
                            >
                                Solicitar novo link
                            </Button>

                            <Button
                                variant="transparent"
                                size="md"
                                className="w-full"
                                onClick={() => router.push("/login")}
                            >
                                Voltar para o login
                            </Button>
                        </div>
                    ) : resetSuccess ? (
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
                                        d="M4.5 12.75l6 6 9-13.5"
                                    />
                                </svg>
                            </div>

                            <h1 className="w-full text-2xl font-semibold text-gray-900">
                                Senha redefinida!
                            </h1>

                            <p className="text-sm text-gray-600">
                                Sua senha foi alterada com sucesso. Agora você já pode entrar com a nova senha.
                            </p>

                            <Button
                                variant="primary"
                                size="md"
                                className="w-full"
                                onClick={() => router.push("/login")}
                            >
                                Ir para o login
                            </Button>
                        </div>
                    ) : (
                        <>
                            <h1 className="w-full mb-2 text-2xl font-semibold text-gray-900 text-center">
                                Redefinir senha
                            </h1>

                            <p className="mb-6 text-center text-sm text-gray-600">
                                Escolha uma nova senha para acessar sua conta.
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
                                    <label htmlFor="novaSenha" className="mb-1 block text-sm font-medium text-gray-700">
                                        Nova senha
                                    </label>
                                    <input
                                        id="novaSenha"
                                        name="novaSenha"
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="Sua nova senha"
                                        value={novaSenha}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setNovaSenha(value);

                                            setFieldErrors((prev) => {
                                                const next = { ...prev, novaSenha: undefined };

                                                // Revalida a confirmação sempre que a nova senha muda
                                                if (confirmarSenha && confirmarSenha !== value) {
                                                    next.confirmarSenha = "As senhas não coincidem.";
                                                } else if (confirmarSenha) {
                                                    next.confirmarSenha = undefined;
                                                }

                                                return next;
                                            });

                                            if (formError) setFormError(null);
                                        }}
                                        disabled={isFormDisabled}
                                        aria-invalid={!!fieldErrors.novaSenha}
                                        aria-describedby={fieldErrors.novaSenha ? "novaSenha-error" : "novaSenha-hint"}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                                            fieldErrors.novaSenha
                                                ? "border-vp-coral-500 focus:ring-vp-coral-500"
                                                : "border-gray-300 focus:ring-vp-azul-700"
                                        }`}
                                    />
                                    {fieldErrors.novaSenha ? (
                                        <p id="novaSenha-error" className="mt-1 text-sm text-vp-coral-700" role="alert">
                                            {fieldErrors.novaSenha}
                                        </p>
                                    ) : (
                                        <p id="novaSenha-hint" className="mt-1 text-xs text-gray-500">
                                            Mínimo 8 caracteres, com maiúscula, minúscula, número e símbolo.
                                        </p>
                                    )}
                                </div>

                                <div className="w-full">
                                    <label htmlFor="confirmarSenha" className="mb-1 block text-sm font-medium text-gray-700">
                                        Confirmar nova senha
                                    </label>
                                    <input
                                        id="confirmarSenha"
                                        name="confirmarSenha"
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="Repita a nova senha"
                                        value={confirmarSenha}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setConfirmarSenha(value);

                                            setFieldErrors((prev) => {
                                                if (!value) {
                                                    return { ...prev, confirmarSenha: undefined };
                                                }
                                                return {
                                                    ...prev,
                                                    confirmarSenha: value !== novaSenha ? "As senhas não coincidem." : undefined,
                                                };
                                            });

                                            if (formError) setFormError(null);
                                        }}
                                        onBlur={() => {
                                            if (confirmarSenha && confirmarSenha !== novaSenha) {
                                                setFieldErrors((prev) => ({ ...prev, confirmarSenha: "As senhas não coincidem." }));
                                            }
                                        }}
                                        disabled={isFormDisabled}
                                        aria-invalid={!!fieldErrors.confirmarSenha}
                                        aria-describedby={fieldErrors.confirmarSenha ? "confirmarSenha-error" : undefined}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                                            fieldErrors.confirmarSenha
                                                ? "border-vp-coral-500 focus:ring-vp-coral-500"
                                                : "border-gray-300 focus:ring-vp-azul-700"
                                        }`}
                                    />
                                    {fieldErrors.confirmarSenha && (
                                        <p id="confirmarSenha-error" className="mt-1 text-sm text-vp-coral-700" role="alert">
                                            {fieldErrors.confirmarSenha}
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
                                    {isSubmitting ? "Redefinindo..." : "Redefinir senha"}
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
                </div>
            </div>
            <div
                className="w-full md:max-w-5/12 h-24 md:h-3/4 bg-brand-wellness rounded-t-lg md:rounded-t-none md:rounded-r-lg shadow-lg"
                aria-hidden="true"
            />
        </div>
    );
}