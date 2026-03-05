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

// GET (criar futuramente filtro de categoria dos exercícios)
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

 
*/
