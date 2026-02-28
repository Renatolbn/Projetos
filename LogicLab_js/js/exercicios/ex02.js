function executarEx02(altura) {
  altura = parseFloat(altura);
  
  if (isNaN(altura) || altura < 0) {
    return "Informe um valor válido!!";
  }
  
  const pesoIdeal = 72.7 * altura - 58;
  
  return `A altura é: ${altura} e o peso ideal é: ${pesoIdeal.toFixed(2)}`;
}

registrarExercicio({
  id: "02",
  title: "Peso Ideal",
  category: "Imperativo",
  description: "Tendo como dados de entrada a altura de uma pessoa, construa um algoritmo que calcule seu peso ideal, usando a seguinte fórmula: (72.7 * altura) - 58.",
  inputs: [
    { label: "Altura (m)", type: "number" }
  ],
  executar: executarEx02
});
