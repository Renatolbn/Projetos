import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

let exercicios = [];

// GET
app.get("/exercicios", (req, res) => {
  res.json(exercicios);
});

// POST
app.post("/exercicios", (req, res) => {
  exercicios.push(req.body);
  res.json({ ok: true });
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});

// DELETE
app.delete("/exercicios/:id", (req, res) => {
  const { id } = req.params;

  const index = exercicios.findIndex((ex) => ex.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: "Exercício não encontrado" });
  }

  exercicios.splice(index, 1);

  res.json({ ok: true });
});

// PUT (editar)
app.put("/exercicios/:id", (req, res) => {
  const { id } = req.params;

  const index = exercicios.findIndex((ex) => ex.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: "Exercício não encontrado" });
  }

  exercicios[index] = req.body;

  res.json({ ok: true });
});