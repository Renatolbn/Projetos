function executarEx01(base, altura) {
  base = parseFloat(base);
  altura = parseFloat(altura);

  const area = (base * altura) / 2;

  return `A área do triângulo é ${area}`;
}

registrarExercicio({
  id: "01",
  title: "Área do Triângulo",
  category: "Imperativo",
  description: "Calcule a área de um triângulo",
  inputs: [
    { label: "Base", type: "number" },
    { label: "Altura", type: "number" }
  ],
  executar: executarEx01
});
