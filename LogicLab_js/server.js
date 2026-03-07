import express from "express";
import cors from "cors";
import fs from "fs"; // O módulo File System do Node.js permite ler e escrever arquivos no computador.
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app = express();
const ARQUIVO = "exercicios.json"; 

app.use(cors());
app.use(express.json());
app.use(express.static(".")); //Isso faz o Express servir os arquivos estáticos do diretório atual.

// Funções auxiliares para ler e salvar
function lerExercicios() {
  if (!fs.existsSync(ARQUIVO)) return []; // Se o arquivo não existir, retorna array vazio
  const dados = fs.readFileSync(ARQUIVO, "utf-8");
  return JSON.parse(dados);
}

function salvarExercicios(exercicios) {
  fs.writeFileSync(ARQUIVO, JSON.stringify(exercicios, null, 2));
}

/**
 * @swagger
 * /exercicios:
 *   get:
 *     summary: Lista todos os exercicios
 *     responses:
 *       200:
 *         description: Retornado com sucesso
 */

// GET (criar futuramente filtro de categoria dos exercícios)
app.get("/exercicios", (req, res) => {
  res.json(lerExercicios());
});

/**
 * @swagger
 * /exercicios:
 *   post:
 *     summary: Cria um novo exercicio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               codigo:
 *                 type: string
 *               explicacao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Criado com sucesso
 */

// POST
app.post("/exercicios", (req, res) => {
  const exercicios = lerExercicios();
  exercicios.push(req.body);
  salvarExercicios(exercicios);
  res.json({ ok: true });
});

/**
 * @swagger
 * /exercicios/{id}:
 *   delete:
 *     summary: Deleta um exercicio
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deletado com sucesso
 *       404:
 *         description: Nao encontrado
 */

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

/**
 * @swagger
 * /exercicios/{id}:
 *   put:
 *     summary: Edita um exercicio
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Atualizado com sucesso
 *       404:
 *         description: Nao encontrado
 */

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

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LogicLab API",
      version: "1.0.0",
      description: "API para gerenciar exercícios de programação",
    },
  },
  apis: ["./server.js"], // 👈 onde estão os comentários da documentação
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req, res) => {
  res.json({
    message: "LogicLab API rodando!",
    docs: "http://localhost:3000/docs",
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});

/* ----OBSERVAÇÕES----   

 ***Importações das bibliotecas***

 
*/
