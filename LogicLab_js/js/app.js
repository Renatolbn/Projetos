//  LISTA  DE EXERCÍCIOS

let exercicios = [];
let todosExercicios = [];
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
    const resposta = await fetch("/exercicios");
    const dados = await resposta.json();

    console.log("Dados do backend:", dados);

    exercicios = dados.map((ex) => ({
      ...ex,
      executar: montarFuncao(ex),
    }));

    console.log("lista tratada:", exercicios);

    todosExercicios = exercicios;

    renderizarExercicios(exercicios);
  } catch (erro) {
    console.error("Erro ao carregar exercícios:", erro);
  }
}

//  RENDERIZAÇÃO DOS CARDS

function renderizarExercicios(lista = exercicios) {
  const container = document.getElementById("lista-exercicios");

  // limpa a tela para evitar duplicação
  container.innerHTML = "";

  lista.forEach((exercicio) => {
    console.log(exercicio);

    const card = document.createElement("div");
    card.classList.add("card-exercicio");

    const cardInner = document.createElement("div");
    cardInner.classList.add("card-inner");

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");

    // FRENTE DO CARD

    cardFront.innerHTML = `
      <div class= "titulo-card">
      <h3>${exercicio.title}</h3>
      <span class="tag">${exercicio.category}</span>
      </div>
      <p>${exercicio.description}</p>
    `;

    // VERSO DO CARD

    cardBack.innerHTML = `
    <h4>Código:</h4>
    <pre><code>${exercicio.codigo || "Sem código cadastrado."}</code></pre>

    <h4>Explicação:</h4>
    <p>${exercicio.explicacao || "Sem explicação cadastrada."}</p>
    `;

    // BOTÃO VER CÓDIGO (VIRAR CARD)
    const btnVerCodigo = document.createElement("button");
    btnVerCodigo.textContent = "Ver código";

    btnVerCodigo.addEventListener("click", () => {
      card.classList.toggle("virado");
    });

    // BOTÃO VOLTAR (VERSO)
    const btnVoltar = document.createElement("button");
    btnVoltar.textContent = "Voltar";

    btnVoltar.addEventListener("click", () => {
      card.classList.remove("virado");
    });

    cardFront.appendChild(btnVerCodigo);
    cardBack.appendChild(btnVoltar);

    //AÇÕES (EDITAR / EXCLUIR)

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
    cardFront.appendChild(areaAcoes);

    // ÁREA DE INPUTS

    const areaInputs = document.createElement("div");
    areaInputs.classList.add("area-inputs");

    (exercicio.inputs || []).forEach((inp) => {
      const input = document.createElement("input");
      input.placeholder = inp.label;
      input.type = inp.type || "text";

      areaInputs.appendChild(input);
    });

    cardFront.appendChild(areaInputs);

    // BOTÃO EXECUTAR

    const btnExecutar = document.createElement("button");
    btnExecutar.textContent = "Executar";

    const resultadoBox = document.createElement("p");

    btnExecutar.addEventListener("click", () => {
      try {
        const valores = [];

        areaInputs.querySelectorAll("input").forEach((i) => {
          if (i.type === "number") {
            valores.push(parseFloat(i.value));
          } else {
            valores.push(i.value);
          }
        });

        const resultado = exercicio.executar(...valores);

        // evita retorno undefined (erro silencioso)
        if (resultado === undefined) {
          throw new Error("A função não retornou nenhum resultado.");
        }

        resultadoBox.textContent = "Resultado: " + resultado;
      } catch (erro) {
        console.error("Erro ao executar exercício:", erro);
        resultadoBox.textContent = " Ocorreu um erro ao executar o exercício.";
      }
    });

    cardFront.appendChild(btnExecutar);
    cardFront.appendChild(resultadoBox);

    //BOTÃO EXCLUIR

    btnExcluir.addEventListener("click", async () => {
      console.log("clicou em excluir", exercicio.id);
      const confirmar = confirm("Tem certeza que deseja excluir?");
      if (!confirmar) return;

      await fetch(`/exercicios/${exercicio.id}`, {
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
      document.getElementById("explicacao").value = exercicio.explicacao || "";

      // limpar inputs antigos

      inputsTemp = [];
      const containerInputs = document.getElementById("inputs-container");
      containerInputs.innerHTML = "";

      (exercicio.inputs || []).forEach((input) => {
        adicionarInput();
        const ultimo = inputsTemp[inputsTemp.length - 1];
        ultimo.input.value = input.label;

        const radio = ultimo.tipo.querySelector(`input[value="${input.type}"]`);
        if (radio) radio.checked = true;
      });

      abrirModal();
    });

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);

    card.appendChild(cardInner);
    container.appendChild(card);
  });
}

//FILTROS

function aplicarFiltros() {
  const categoriaAtiva =
    document.querySelector(".btn-filtro.active").dataset.categoria;
  const textoBusca = document
    .getElementById("input-filtro")
    .value.toLowerCase();

  const filtrados = todosExercicios.filter((ex) => {
    const passaCategoria =
      categoriaAtiva === "all" || ex.category === categoriaAtiva;
    const passaBusca = ex.title.toLowerCase().includes(textoBusca);
    return passaCategoria && passaBusca;
  });
  renderizarExercicios(filtrados);
}

window.addEventListener("DOMContentLoaded", () => {
  carregarExercicios();

  //FILTRO CATEGORIA

  document.querySelectorAll(".btn-filtro").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".btn-filtro")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      aplicarFiltros();
    });
  });

  //FILTRO POR BUSCA

  document
    .getElementById("input-filtro")
    .addEventListener("input", aplicarFiltros);

  document
    .getElementById("btn-add-input")
    .addEventListener("click", adicionarInput);

  document
    .getElementById("btn-salvar")
    .addEventListener("click", salvarExercicio);

  document.getElementById("btn-cancelar").addEventListener("click", () => {
    exercicioEditando = null;
    inputsTemp = [];
    document.getElementById("inputs-container").innerHTML = "";
    fecharModal();
  });
});

// CONTROLE MODAL

function abrirModal() {
  const modal = document.getElementById("modal-exercicio");
  modal.style.display = "block";
}

function fecharModal() {
  const modal = document.getElementById("modal-exercicio");
  modal.style.display = "none";
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

  // botão deletar input
  const btnDeletar = document.createElement("button");
  btnDeletar.textContent = "Remover";

  // adiciona na tela (com wrapper)
  const wrapper = document.createElement("div");
  wrapper.appendChild(inputLabel);
  wrapper.appendChild(tipo);
  wrapper.appendChild(btnDeletar);

  // remove o wrapper do DOM e do inputsTemp
  btnDeletar.addEventListener("click", () => {
    const index = inputsTemp.findIndex((i) => i.wrapper === wrapper);
    inputsTemp.splice(index, 1);
    wrapper.remove();
  });

  container.appendChild(wrapper);

  // salva no array temporário
  inputsTemp.push({ input: inputLabel, tipo, wrapper });
}

//SALVAR EXERCÍCIO (INTEGRA COM A API)

async function salvarExercicio() {
  const exercicio = {
    id: exercicioEditando ? exercicioEditando.id : Date.now().toString(),
    title: document.getElementById("titulo").value,
    category: document.getElementById("categoria").value,
    description: document.getElementById("descricao").value,
    codigo: document.getElementById("codigo").value,
    explicacao: document.getElementById("explicacao").value,
    inputs: inputsTemp.map((i) => ({
      label: i.input.value,
      type: i.tipo.querySelector("input:checked").value,
    })),
  };

  let url = "/exercicios";
  let metodo = "POST";

  // se estiver editando
  if (exercicioEditando) {
    url = `/exercicios/${exercicio.id}`;
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
