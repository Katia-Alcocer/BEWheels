import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API Wheels funcionando");
});

// Ruta de prueba con base de datos
app.get("/test-db", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows);
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor backend en puerto ${process.env.PORT}`);
});
