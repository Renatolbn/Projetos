//  LISTA  DE EXERCÍCIOS

let exercicios = [];

let exercicioEditando = null;

function montarFuncao(exercicio) {
  try {
    const params = exercicio.inputs.map((input) => input.label).join(", ");
    return new Function(params, exercicio.codigo);
  } catch (e) {
    return () => "Erro na função do exercício";
  }
}
// REGISTRAR EXERCÍCIO

async function carregarExercicios() {
  try {
    const resposta = await fetch("http://localhost:3000/exercicios");
    const dados = await resposta.json();

    console.log("dados do backend:", dados);

    exercicios = dados.map((ex) => ({
      ...ex,
      executar: montarFuncao(ex),
    }));

    console.log("lista tratada:", exercicios);

    renderizarExercicios();
  } catch (erro) {
    console.error("Erro ao carregar exercícios:", erro);
  }
}

//  RENDERIZAÇÃO DOS CARDS

function renderizarExercicios() {
  const container = document.getElementById("lista-exercicios");

  // limpa a tela para evitar duplicação
  container.innerHTML = "";

  exercicios.forEach((exercicio) => {
    const card = document.createElement("div"); // Cria a Div do card na memória(ainda não aparece na tela)
    card.classList.add("card-exercicio"); //Adiciona uma classe CSS nesse elemento criado, para você poder estilizar esse card no CSS

    card.innerHTML = `
      <div class= "titulo-card">
      <h3>${exercicio.title}</h3>
      <span class="tag">${exercicio.category}</span>
      </div>
      <p>${exercicio.description}</p>
    `;

    const areaAcoes = document.createElement("div");
    areaAcoes.classList.add("acoes-card");

    // botão editar
    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";

    // botão excluir
    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "Excluir";
    btnExcluir.classList.add("btn-excluir");

    areaAcoes.appendChild(btnEditar);
    areaAcoes.appendChild(btnExcluir);

    card.appendChild(areaAcoes);

    // ÁREA DE INPUTS

    const areaInputs = document.createElement("div");
    areaInputs.classList.add("area-inputs");
    (exercicio.inputs || []).forEach((inp) => {
      const input = document.createElement("input");
      input.placeholder = inp.label;
      input.type = inp.type || "text";

      areaInputs.appendChild(input);
    });

    card.appendChild(areaInputs);

    // BOTÃO EXECUTAR

    const btnExecutar = document.createElement("button");
    btnExecutar.textContent = "Executar";

    const resultadoBox = document.createElement("p");

    btnExecutar.addEventListener("click", () => {
      try {
        const valores = [];

        areaInputs.querySelectorAll("input").forEach((i) => {
          valores.push(i.value);
        });

        const resultado = exercicio.executar(...valores);

        // evita retorno undefined (erro silencioso)
        if (resultado === undefined) {
          throw new Error("A função não retornou nenhum resultado.");
        }

        resultadoBox.textContent = "Resultado: " + resultado;
      } catch (erro) {
        console.error("Erro ao executar exercício:", erro);
        resultadoBox.textContent = "⚠️ Ocorreu um erro ao executar o exercício.";
      }
    });

    btnExcluir.addEventListener("click", async () => {
      console.log("clicou em excluir", exercicio.id);
      const confirmar = confirm("Tem certeza que deseja excluir?");
      if (!confirmar) return;

      await fetch(`http://localhost:3000/exercicios/${exercicio.id}`, {
        method: "DELETE",
      });

      carregarExercicios();
    });

    //BOTÃO EDITAR

    btnEditar.addEventListener("click", () => {
      exercicioEditando = exercicio;

      document.getElementById("titulo").value = exercicio.title;
      document.getElementById("categoria").value = exercicio.category;
      document.getElementById("descricao").value = exercicio.description;
      document.getElementById("codigo").value = exercicio.codigo;

      // limpar inputs antigos
      inputsTemp = [];
      const container = document.getElementById("inputs-container");
      container.innerHTML = "";

      exercicio.inputs.forEach((input) => {
        adicionarInput();

        const ultimo = inputsTemp[inputsTemp.length - 1];
        ultimo.input.value = input.label;
        ultimo.tipo.value = input.type;
      });

      abrirModal();
    });

    card.appendChild(btnExecutar);
    card.appendChild(resultadoBox);

    container.appendChild(card);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  carregarExercicios();
});

// CONTROLE MODAL

function abrirModal() {
  document.getElementById("modal-exercicio").style.display = "block";
}

function fecharModal() {
  document.getElementById("modal-exercicio").style.display = "none";
}

// ADD INPUTS DINÂMICOS

let inputsTemp = [];

function adicionarInput() {
  const container = document.getElementById("inputs-container");

  // cria um input novo
  const inputLabel = document.createElement("input");
  inputLabel.placeholder = "Nome do input";

  // cria o select de tipo
  const tipo = document.createElement("div");
  tipo.innerHTML = `
   <label><input type="radio" name="tipo-${inputsTemp.length}" value="text" checked> Texto</label>
  <label><input type="radio" name="tipo-${inputsTemp.length}" value="number"> Número</label>
  `;

  // adiciona na tela
  container.appendChild(inputLabel);
  container.appendChild(tipo);

  // salva no array temporário
  inputsTemp.push({ input: inputLabel, tipo });
}

//SALVAR EXERCÍCIO (INTEGRA COM A API)

async function salvarExercicio() {
  const exercicio = {
    id: exercicioEditando ? exercicioEditando.id : Date.now().toString(),
    title: document.getElementById("titulo").value,
    category: document.getElementById("categoria").value,
    description: document.getElementById("descricao").value,
    codigo: document.getElementById("codigo").value,
    inputs: inputsTemp.map((i) => ({
      label: i.input.value,
      type: i.tipo.querySelector("input:checked").value,
    })),
  };

  let url = "http://localhost:3000/exercicios";
  let metodo = "POST";

  // se estiver editando
  if (exercicioEditando) {
    url = `http://localhost:3000/exercicios/${exercicio.id}`;
    metodo = "PUT";
  }

  const resposta = await fetch(url, {
    method: metodo,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(exercicio),
  });

  if (!resposta.ok) {
    console.error("Erro ao salvar");
    return;
  }

  exercicioEditando = null;
  inputsTemp = [];
  document.getElementById("inputs-container").innerHTML = "";

  fecharModal();
  carregarExercicios();
}

/*  ----OBSERVAÇÕES----            

 01. MONTAR EXERCICÍOS

  montarFuncao recebe o exercício inteiro e constrói uma função executável a partir dele.

  1. Pega os labels dos inputs e transforma em uma string de parâmetros
     inputs: [{ label: "produto1" }, { label: "produto2" }, { label: "produto3" }]
     params: "produto1, produto2, produto3"

  2. new Function(params, exercicio.codigo) monta uma função dinamicamente
     equivale a escrever:
     function(produto1, produto2, produto3) {
       produto1 = parseFloat(produto1);
       ...
       return `Você deve comprar o ${produtoEscolhido}...`;
     }

  3. Se der erro na montagem (ex: código inválido), retorna uma função segura que exibe uma mensagem de erro ao invés de quebrar a tela.
*/
