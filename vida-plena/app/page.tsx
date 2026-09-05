
import Button from "./components/Button";
import Link from "next/link";

export default function Home() {

  return (
  <>

  <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "var(--background)"}}>
    <div>
      <Button>
         <Link href={'/login'}>
            Fazer Login
         </Link>
      </Button>
    </div>
  </div>
  </>
  );
}
