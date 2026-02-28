function nota(nota1, nota2) {
  nota1 = parseFloat(nota1);
  nota2 = parseFloat(nota2);
  
  if (isNaN(nota1) || nota1 < 0 || isNaN(nota2) || nota2 < 0) {
    return "Valor inválido!";
  }
  
  const media = (nota1 + nota2) / 2;
  
  if (media === 10) {
    return `${media} Aprovado com mérito!`;
  } else if (media >= 7) {
    return `${media} Aprovado`;
  } else {
    return `${media} Reprovado!`;
  }
}


