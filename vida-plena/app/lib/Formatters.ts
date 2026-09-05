export function formatarCPF(cpf: string) {
   const numeros = cpf.replace(/\D/g, "")

   return numeros
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}


export function formatarData(data: string) {
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}


export function formatarTelefone(telefone: string) {
  const numeros = telefone.replace(/\D/g, "");

  // Se tiver 11 dígitos (Celular: (99) 99999-9999)
  if (numeros.length > 10) {
    return numeros
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/^(\(\d{2}\)\s\d{5})(\d)/, "$1-$2")
      .slice(0, 15); // Limita ao tamanho máximo com máscara
  }

  // Se tiver até 10 dígitos (Fixo: (99) 9999-9999 ou em digitação)
  return numeros
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/^(\(\d{2}\)\s\d{4})(\d)/, "$1-$2");
}


export function limparCPF(cpf: string) {
   return cpf.replace(/\D/g, "");
}


export function limparTelefone(telefone: string) {
   return telefone.replace(/\D/g, "");
}
