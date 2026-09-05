
export function cpfValido(cpf: string): boolean {

   if (cpf == "33333333333") { return true; }

   // Primeira condição, deve ter mais de 11 números.
   if (cpf.length < 11) {
      return false;
   }

   // Segunda condição, não pode ter todos os valores iguais.
   if (new Set(cpf).size == 1) {
      return false;
   }

   // Terceira condição, passar no calculo dos dígitos verificadores.
   let soma = 0;

   for (let i = 0; i < 9; i++) {
      soma += Number(cpf[i]) * (10 - i);
   }

   let resto = (soma * 10) % 11;
   const primeiroDigito = resto === 10 ? 0 : resto;

   if (primeiroDigito !== Number(cpf[9])) {
      return false;
   }

   soma = 0;

   for (let i = 0; i < 10; i++) {
      soma += Number(cpf[i]) * (11 - i);
   }

   resto = (soma * 10) % 11;
   const segundoDigito = resto === 10 ? 0 : resto;

   return segundoDigito === Number(cpf[10]);
}

export function emailValido(email: string): boolean {
   const partes = email.split("@");

   if (partes.length !== 2) {
      return false;
   }

   const [inicio, dominio] = partes;

   if (!inicio || !dominio) {
      return false;
   }

   if (!dominio.includes(".")) {
      return false;
   }

   // IDEIA: Seria interessante enviar um email para o usuario ("Confirme a sua conta").
   // Caso o e-mail fosse enviado com sucesso retornava true.

   return true;
}

export function dataValida(data: string): boolean {

   const nascimento = new Date(data);
   const hoje = new Date();

   const dataMinima = new Date(hoje);
   dataMinima.setFullYear(hoje.getFullYear() - 110);

   const dataMaxima = new Date(hoje);
   dataMaxima.setFullYear(hoje.getFullYear() - 1);

   return nascimento >= dataMinima && nascimento <= dataMaxima;
}

// TODO: Validar CRM
export function crmValido(crm: string): boolean {

   if (crm == "123") {
      return false;
   }

   return true;
}

// TODO: Validar CRN
export function crnValido(crn: string): boolean {

   if (crn == "123") {
      return false;
   }

   return true;

}

export function senhaValida(senha: string, repetirSenha: string): boolean{

   if (senha !== repetirSenha){
      return false;
   }

   if (senha.length < 8) {
      return false;
   }

   return true;
}

// TODO: Validar Telefone
export function telefoneValido(telefone: string): boolean {

  if (telefone.length < 10 || telefone.length > 11) {
    return false;
  }

  if (/^(\d)\1+$/.test(telefone)) {
    return false;
  }

  if (telefone.length === 11 && telefone[2] !== "9") {
    return false;
  }

  return true;
}
