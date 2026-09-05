'use client';

import { useRouter } from "next/navigation";
import Button from "@/app/components/Button";
import { AuthPageHeader, AuthPageLayout } from "@/app/components/auth/AuthPageLayout";
import { useAuth } from "@/app/auth/Authcontext";

export default function SemPermissao() {
    const router = useRouter();
    const { logout } = useAuth();

    return (
        <AuthPageLayout>
            <AuthPageHeader
                title="Acesso não permitido"
                description="Seu perfil não tem permissão para acessar essa página."
            />

            <div className="flex flex-col items-center justify-center w-full gap-4">
                <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => router.back()}
                >
                    Voltar
                </Button>

                <Button
                    variant="transparent"
                    size="md"
                    className="w-full"
                    onClick={() => logout()}
                >
                    Sair
                </Button>
            </div>
        </AuthPageLayout>
    );
}
