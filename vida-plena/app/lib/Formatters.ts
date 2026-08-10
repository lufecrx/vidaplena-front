export function formatarCPF(cpf: string) {
   const numeros = cpf.replace(/\D/g, "")

   return numeros
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

export function limparCPF(cpf: string) {
   return cpf.replace(/\D/g, "");
}
