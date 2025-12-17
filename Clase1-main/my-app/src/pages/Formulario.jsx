import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";
import { REGISTER_API_URL } from "../config";

export default function Formulario() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const { login } = useContext(CarritoContext);  

  const manejarRegistro = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const response = await fetch(REGISTER_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre,   
          email: email,     
          password: password,
        }),
      });

      if (!response.ok) {
        setMensaje("❌ Error al registrar usuario.");
        return;
      }

      const userData = await response.json();

      
      login(userData);

      setMensaje(`Registro exitoso, bienvenido ${userData.nombre}!`);
      setTimeout(() => navigate("/"), 1000);

    } catch (error) {
      console.error("Error:", error);
      setMensaje("❌ Error de conexión con el servidor.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Registro</h2>

      <form onSubmit={manejarRegistro}>

        <div style={{ marginBottom: "15px" }}>
          <label>Nombre Completo:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "8px" }}
          />
        </div>

        <button type="submit" style={{ padding: "10px 20px", borderRadius: "8px" }}>
          Registrarse
        </button>
      </form>

      {mensaje && <p style={{ marginTop: "15px" }}>{mensaje}</p>}
    </div>
  );
}
