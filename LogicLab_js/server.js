import express from "express";
import cors from "cors";
import fs from "fs"; // 👈 Importar o módulo fs

const app = express();
const ARQUIVO = "exercicios.json"; // 👈 Nome do arquivo

app.use(cors());
app.use(express.json());

// Funções auxiliares para ler e salvar
function lerExercicios() {
  if (!fs.existsSync(ARQUIVO)) return []; // Se o arquivo não existir, retorna array vazio
  const dados = fs.readFileSync(ARQUIVO, "utf-8");
  return JSON.parse(dados);
}

function salvarExercicios(exercicios) {
  fs.writeFileSync(ARQUIVO, JSON.stringify(exercicios, null, 2));
}

// GET
app.get("/exercicios", (req, res) => {
  res.json(lerExercicios());
});

// POST
app.post("/exercicios", (req, res) => {
  const exercicios = lerExercicios();
  exercicios.push(req.body);
  salvarExercicios(exercicios);
  res.json({ ok: true });
});

// DELETE
app.delete("/exercicios/:id", (req, res) => {
  const { id } = req.params;
  const exercicios = lerExercicios();
  const index = exercicios.findIndex((ex) => ex.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: "Exercício não encontrado" });
  }

  exercicios.splice(index, 1);
  salvarExercicios(exercicios);
  res.json({ ok: true });
});

// PUT
app.put("/exercicios/:id", (req, res) => {
  const { id } = req.params;
  const exercicios = lerExercicios();
  const index = exercicios.findIndex((ex) => ex.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: "Exercício não encontrado" });
  }

  exercicios[index] = req.body;
  salvarExercicios(exercicios);
  res.json({ ok: true });
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});

/* ----OBSERVAÇÕES----   

 ***Importações das bibliotecas***

 Importamos o Express para criar o servidor e o CORS para permitir requisições externas, evitando bloqueios do navegador.

express → um framework que facilita criar servidores HTTP no Node.js.

cors → um middleware que permite que seu backend seja acessado por outros domínios (por exemplo, seu front-end rodando em outra porta).

***Criação do servidor***

Criamos a aplicação Express, que será responsável por gerenciar as rotas e requisições do servidor.

const app = express();
* Aqui você está criando uma instância do Express.
* Essa variável app é o seu servidor — é com ela que você vai definir rotas (GET, POST, etc.).

***Middlewares globais***

Middleware é uma função executada entre a requisição do cliente e a resposta do servidor, usada para tratar, validar ou modificar dados antes que cheguem à rota principal.

Usamos middlewares globais:
cors() para liberar acesso externo ao servidor
express.json() para permitir receber dados em JSON nas requisições.

Aqui você está ativando dois middlewares:

cors()

Permite que seu front-end (ex: localhost:5500) consiga acessar o backend (localhost:3000).

express.json()

Faz o Express entender dados enviados em formato JSON no corpo da requisição (req.body).

***Simulação de banco de dados***

Criamos um array chamado exercicios para simular um banco de dados em memória, onde os dados serão armazenados temporariamente.

let exercicios = [];

 Explicação:
Aqui você criou um array vazio que vai armazenar os exercícios.
Isso funciona como um banco de dados temporário em memória.

Importante:
Quando você reiniciar o servidor, esse array volta a ficar vazio.
*/
