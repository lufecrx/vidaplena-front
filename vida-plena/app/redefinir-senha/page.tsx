'use client';

import React, { Suspense, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "../components/Button";
import {
    AuthFormError,
    AuthPageHeader,
    AuthPageLayout,
    authInputClass,
} from "../components/auth/AuthPageLayout";
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

function RedefinirSenhaForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [showNovaSenha, setShowNovaSenha] = useState(false);
    const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
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
            await authService.resetPassword(token, novaSenha, confirmarSenha);
            setResetSuccess(true);
        } catch (error) {
            setFormError(getResetErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    }

    const isFormDisabled = isSubmitting;

    if (tokenMissing) {
        return (
            <>
                <AuthPageHeader
                    title="Link inválido"
                    description="Este link de redefinição de senha é inválido ou está incompleto. Solicite um novo link para continuar."
                />

                <div className="flex flex-col items-center justify-center w-full gap-4 text-center">
                    <div
                        className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50 -mt-4"
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
            </>
        );
    }

    if (resetSuccess) {
        return (
            <>
                <AuthPageHeader
                    title="Senha redefinida!"
                    description="Sua senha foi alterada com sucesso. Agora você já pode entrar com a nova senha."
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
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>

                    <Button
                        variant="primary"
                        size="md"
                        className="w-full"
                        onClick={() => router.push("/login")}
                    >
                        Ir para o login
                    </Button>
                </div>
            </>
        );
    }

    return (
        <>
            <AuthPageHeader
                title="Redefinir senha"
                description="Escolha uma nova senha para acessar sua conta."
            />

            <form
                className="flex flex-col items-center justify-center w-full gap-4"
                onSubmit={handleSubmit}
                noValidate
                aria-busy={isSubmitting}
            >
                {formError && <AuthFormError message={formError} />}

                <div className="w-full">
                    <label htmlFor="novaSenha" className="mb-1 block text-sm font-medium text-gray-700">
                        Nova senha
                    </label>
                    <div className="relative">
                        <input
                            id="novaSenha"
                            name="novaSenha"
                            type={showNovaSenha ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="Sua nova senha"
                            value={novaSenha}
                            onChange={(e) => {
                                const value = e.target.value;
                                setNovaSenha(value);

                                setFieldErrors((prev) => {
                                    const next = { ...prev, novaSenha: undefined };

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
                            className={authInputClass(!!fieldErrors.novaSenha, "pr-11")}
                        />
                        <PasswordToggleButton
                            showPassword={showNovaSenha}
                            onToggle={() => setShowNovaSenha((v) => !v)}
                            disabled={isFormDisabled}
                        />
                    </div>
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
                    <div className="relative">
                        <input
                            id="confirmarSenha"
                            name="confirmarSenha"
                            type={showConfirmarSenha ? "text" : "password"}
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
                                    setFieldErrors((prev) => ({
                                        ...prev,
                                        confirmarSenha: "As senhas não coincidem.",
                                    }));
                                }
                            }}
                            disabled={isFormDisabled}
                            aria-invalid={!!fieldErrors.confirmarSenha}
                            aria-describedby={fieldErrors.confirmarSenha ? "confirmarSenha-error" : undefined}
                            className={authInputClass(!!fieldErrors.confirmarSenha, "pr-11")}
                        />
                        <PasswordToggleButton
                            showPassword={showConfirmarSenha}
                            onToggle={() => setShowConfirmarSenha((v) => !v)}
                            disabled={isFormDisabled}
                        />
                    </div>
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
    );
}

export default function RedefinirSenha() {
    return (
        <AuthPageLayout>
            <Suspense
                fallback={
                    <p className="text-gray-600 text-center" role="status" aria-live="polite">
                        Carregando...
                    </p>
                }
            >
                <RedefinirSenhaForm />
            </Suspense>
        </AuthPageLayout>
    );
}
