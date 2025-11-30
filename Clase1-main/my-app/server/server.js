import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const conexion = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "autos_db"
});

conexion.connect((error) => {
  if (error) {
    console.error("Error al conectar a MySQL:", error);
    return;
  }
  console.log("Conectado a la base de datos MySQL");
});

// Ruta para obtener productos
app.get("/productos", (req, res) => {
  conexion.query("SELECT * FROM productos", (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Error al obtener productos" });
    }
    res.json(results);
  });
});

// Ruta para agregar un producto (POST)
app.post("/productos", (req, res) => {
  const { nombre, precio } = req.body;
  if (!nombre || !precio) {
    return res.status(400).json({ message: "Faltan datos del producto" });
  }
  const sql = "INSERT INTO productos(nombre, precio) VALUES (?, ?)";
  conexion.query(sql, [nombre, precio], (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Error al agregar producto" });
    }
    res.status(201).json({ message: "Producto agregado éxito" });
  });
});

const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
