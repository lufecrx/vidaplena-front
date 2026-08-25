import Link from "next/link";

import Button from "@/app/components/Button";

export default function AdminPage() {

   return (
      <div className="Dashboard-container">
         <h1>Dashboard do administrador</h1>

         <Button size="lg">
            <Link href={"/admin/usuarios"}>
               Gerenciar usuarios
            </Link>
         </Button>

      </div>
   )
}
