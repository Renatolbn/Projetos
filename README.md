OBS para montar exercicios 

O problema é que o código usa prompt() para pegar os valores, mas o seu sistema já tem inputs dinâmicos. Basta reescrever a função para usar parâmetros no lugar dos prompts.
No modal, preencha assim:
Título: Média de Notas
Categoria: conditional
Descrição: Calcula a média entre duas notas e retorna o resultado.
Inputs: adicione 2 inputs:

nota1 → Número
nota2 → Número

Código da função — cole isso:
jsnota1 = parseFloat(nota1);
nota2 = parseFloat(nota2);

if (isNaN(nota1) || nota1 < 0 || isNaN(nota2) || nota2 < 0) {
  return "Valor inválido!";
}

const media = (nota1 + nota2) / 2;

if (media === 10) {
  return `${media} - Aprovado com mérito!`;
} else if (media >= 7) {
  return `${media} - Aprovado`;
} else {
  return `${media} - Reprovado!`;
}
A diferença principal:
js// ❌ antes — pegava valor pelo prompt
let nota1 = parseFloat(prompt("Primeira nota:"));

// ✅ agora — recebe como parâmetro vindo do input do card
nota1 = parseFloat(nota1);
O seu montarFuncao() já transforma os labels dos inputs em parâmetros da função automaticamente — por isso nota1 e nota2 já chegam prontos, só precisam do parseFloat para garantir que são números. E troque todos os console.log por return, senão o resultado não aparece no card.caso eu esteja estudando funçoes como procederia no exercicio?21:03Interpretou questão sobre procedimento de exercício de funçõesInterpretou questão sobre procedimento de exercício de funçõesFunções têm uma particularidade: o código que você digita no modal já roda dentro de uma função (é como o montarFuncao funciona). Então você pode demonstrar conceitos de funções de duas formas:

Exemplo 1 — Função simples (sem input)
Inputs: nenhum
Código:
jsfunction saudacao(nome) {
  return `Olá, ${nome}!`;
}

return saudacao("João");

Exemplo 2 — Função com parâmetro vindo do input
Inputs: nome → Texto
Código:
jsfunction saudacao(nome) {
  return `Olá, ${nome}!`;
}

return saudacao(nome);
Aqui o aluno digita o nome no input e vê o resultado — fica mais interativo.

Exemplo 3 — Função com retorno numérico
Inputs: base → Número, altura → Número
Código:
jsfunction calcularArea(b, h) {
  return b * h;
}

return `Área: ${calcularArea(base, altura)}`;

A regra geral é:
js// 1. Declare a função normalmente dentro do código
function minhaFuncao(params) {
  return algumValor;
}

// 2. Chame ela no final com return obrigatório
return minhaFuncao(inputDoCard);
O return no final é o que faz o resultado aparecer no card. Sem ele, a função executa mas não mostra nada.
 
