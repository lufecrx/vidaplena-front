import Image from "next/image";

export default function Home() {
  return (
  <>
  <div style={{display:"flex", alignItems: "center", justifyContent: "center", height: "100vh", textAlign:"center" }}>
    <div style={{display:"block"}}>
    <h1 style={{ fontSize: "2rem", fontWeight: "bold", }}> Hello World</h1>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "green" }}>Vida plena</h1>
    </div>
  </div>
    </>
  );
}
