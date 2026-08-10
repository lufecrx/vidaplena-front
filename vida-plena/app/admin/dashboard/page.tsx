import Link from "next/link";

export default function AdminPage() {

   return (
      <div className="Dashboard-container">
         <h1>Dashboard do administrador</h1>

         <Link href={"/admin/usuarios"}>
            Gerenciar usuarios
         </Link>
      </div>
   )
}
