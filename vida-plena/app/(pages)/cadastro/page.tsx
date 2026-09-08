'use client';

import { useState } from "react";
import Link from "next/link";
import { AxiosError } from "axios";
import Button from "@/app/components/Button";
import {
    AuthFormError,
    AuthPageHeader,
    AuthPageLayout,
    authInputClass,
} from "@/app/components/auth/AuthPageLayout";
import { authService } from "@/app/services/authService";
import { formatarCPF, formatarTelefone, limparCPF, limparTelefone } from "@/app/lib/Formatters";
import { cpfValido, dataValida, emailValido, senhaValida, telefoneValido } from "@/app/lib/Validation";
import type { CriarUsuarioRequest, TipoUsuario } from "@/app/types/usuario";
import { useRouter } from "next/navigation";

const tiposDisponiveis: Array<{ value: TipoUsuario; label: string }> = [
    { value: "PACIENTE", label: "Paciente" },
    { value: "RESPONSAVEL", label: "Responsável" },
    { value: "MEDICO", label: "Médico" },
    { value: "NUTRICIONISTA", label: "Nutricionista" },
    { value: "PERSONAL_TRAINER", label: "Personal trainer" },
    { value: "FUNCIONARIO_ADMINISTRATIVO", label: "Funcionário administrativo" },
    { value: "CUIDADOR", label: "Cuidador" },
    { value: "REPRESENTANTE_EMPRESA", label: "Representante de empresa" },
];

type FieldErrors = Partial<Record<"nome" | "cpf" | "email" | "senha" | "repetirSenha" | "telefone" | "dataNascimento" | "tipos", string>>;

function getRegisterErrorMessage(error: unknown): string {
    if (error instanceof AxiosError) {
        if (!error.response) return "Não foi possível conectar ao servidor. Tente novamente.";
        if (error.response.status === 409) return "O CPF ou e-mail informado já está cadastrado.";
        if (error.response.status >= 500) return "Serviço temporariamente indisponível. Tente novamente em instantes.";
    }

    return "Não foi possível concluir o cadastro. Verifique seus dados e tente novamente.";
}

export default function Cadastro() {
    const [form, setForm] = useState({
        nome: "",
        cpf: "",
        email: "",
        senha: "",
        repetirSenha: "",
        telefone: "",
        dataNascimento: "",
    });
    const [tipos, setTipos] = useState<TipoUsuario[]>(["PACIENTE"]);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    function updateField(field: keyof typeof form, value: string) {
        const formattedValue = field === "cpf" ? formatarCPF(value) : field === "telefone" ? formatarTelefone(value) : value;
        setForm((current) => ({ ...current, [field]: formattedValue }));
        setFieldErrors((current) => ({ ...current, [field]: undefined }));
        setFormError(null);
    }

    function toggleTipo(tipo: TipoUsuario) {
        setTipos((current) => current.includes(tipo) ? current.filter((item) => item !== tipo) : [...current, tipo]);
        setFieldErrors((current) => ({ ...current, tipos: undefined }));
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (isSubmitting) return;

        const cpf = limparCPF(form.cpf);
        const telefone = limparTelefone(form.telefone);
        const errors: FieldErrors = {};

        if (!form.nome.trim()) errors.nome = "Informe seu nome completo.";
        if (!cpfValido(cpf)) errors.cpf = "Informe um CPF válido.";
        if (!emailValido(form.email.trim())) errors.email = "Informe um e-mail válido.";
        if (!senhaValida(form.senha, form.repetirSenha)) errors.senha = "A senha deve ter ao menos 8 caracteres e coincidir com a confirmação.";
        if (form.senha !== form.repetirSenha) errors.repetirSenha = "As senhas não coincidem.";
        if (!telefoneValido(telefone)) errors.telefone = "Informe um telefone válido.";
        if (!dataValida(form.dataNascimento)) errors.dataNascimento = "Você precisa ter pelo menos 18 anos para se cadastrar.";
        if (tipos.length === 0) errors.tipos = "Selecione ao menos um tipo de usuário.";

        setFieldErrors(errors);
        setFormError(null);
        if (Object.keys(errors).length > 0) return;

        const data: CriarUsuarioRequest = {
            nome: form.nome.trim(),
            cpf,
            email: form.email.trim(),
            senha: form.senha,
            telefone,
            dataNascimento: form.dataNascimento,
            tipos,
        };

        setIsSubmitting(true);
        try {
            await authService.register(data);
            setSuccess(true);

            router.push("/login");
        } catch (error) {
            setFormError(getRegisterErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    }


    const input = (field: keyof typeof form, label: string, type: string, placeholder: string, autoComplete: string) => (
        <div className="w-full">
            <label htmlFor={field} className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
            <input
                id={field}
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                value={form[field]}
                onChange={(event) => updateField(field, event.target.value)}
                disabled={isSubmitting}
                aria-invalid={!!fieldErrors[field]}
                className={authInputClass(!!fieldErrors[field])}
            />
            {fieldErrors[field] && <p className="mt-1 text-sm text-vp-coral-700" role="alert">{fieldErrors[field]}</p>}
        </div>
    );

    return (
        <AuthPageLayout>
            <AuthPageHeader title="Criar conta" description="Comece a cuidar melhor da sua saúde." />
            <form onSubmit={handleSubmit} noValidate className="flex w-full flex-col gap-4" aria-busy={isSubmitting}>
                {formError && <AuthFormError message={formError} />}
                {input("nome", "Nome completo", "text", "Maria da Silva", "name")}
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                    {input("cpf", "CPF", "text", "000.000.000-00", "off")}
                    {input("dataNascimento", "Data de nascimento", "date", "", "bday")}
                </div>
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                    {input("email", "E-mail", "email", "seu@email.com", "email")}
                    {input("telefone", "Telefone", "tel", "(71) 98765-4321", "tel")}
                </div>
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                    {input("senha", "Senha", "password", "Mínimo de 8 caracteres", "new-password")}
                    {input("repetirSenha", "Confirmar senha", "password", "Repita sua senha", "new-password")}
                </div>
                <fieldset className="w-full">
                    <legend className="mb-2 text-sm font-medium text-gray-700">Como você usará a plataforma?</legend>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {tiposDisponiveis.map((tipo) => (
                            <label key={tipo.value} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                                <input type="checkbox" checked={tipos.includes(tipo.value)} onChange={() => toggleTipo(tipo.value)} disabled={isSubmitting} className="h-4 w-4 accent-vp-azul-700" />
                                {tipo.label}
                            </label>
                        ))}
                    </div>
                    {fieldErrors.tipos && <p className="mt-1 text-sm text-vp-coral-700" role="alert">{fieldErrors.tipos}</p>}
                </fieldset>
                <Button variant="primary" size="md" className="w-full" type="submit" loading={isSubmitting} disabled={isSubmitting}>
                    {isSubmitting ? "Criando conta..." : "Criar conta"}
                </Button>
                <p className="text-center text-sm text-gray-600">
                    Já tem uma conta? <Link href="/login" className="font-medium text-vp-azul-700 hover:underline">Entrar</Link>
                </p>
            </form>
        </AuthPageLayout>
    );
}