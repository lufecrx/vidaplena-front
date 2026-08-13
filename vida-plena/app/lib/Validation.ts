export function cpfValido(cpf: string): boolean {

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
