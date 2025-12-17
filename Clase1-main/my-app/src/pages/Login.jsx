import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";
import { LOGIN_API_URL } from "../config";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  
  const navigate = useNavigate();
  
  const { login } = useContext(CarritoContext); 

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setCargando(true);

    
    const adminEmail = "admin@tienda.com";
    const adminPassword = "admin123";

    if (email === adminEmail && password === adminPassword) {
      const adminUser = { id: 0, nombre: "Administrador", rol: "ADMIN", email: adminEmail };
      login(adminUser); 
      setMensaje("---Bienvenido Administrador---");
      setCargando(false);
      setTimeout(() => navigate("/"), 1000);
      return;
    }

    
    try {
      const response = await fetch(LOGIN_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password }),
      });

      if (response.ok) {
        const userData = await response.json();
        
        
        login(userData); 
        
        setMensaje(`Inicio de sesión exitoso, bienvenido ${userData.nombre}!`);
        setTimeout(() => navigate("/"), 1000);
        
      } else if (response.status === 401) {
        setMensaje(" Email o contraseña incorrectos.");
      } else {
        setMensaje(" Error en el servidor al intentar iniciar sesión.");
      }
      
    } catch (error) {
      console.error("Error al conectar con la API de Login:", error);
      setMensaje(" Error de conexión: Servidor de Usuarios (8081) no disponible.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={manejarSubmit} noValidate>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="password">Contraseña:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "8px" }}
          />
        </div>

        <button type="submit" disabled={cargando} style={{ padding: "10px 20px", borderRadius: "8px" }}>
          {cargando ? 'Cargando...' : 'Ingresar'}
        </button>
      </form>

      {mensaje && (
        <p
          style={{
            marginTop: "15px",
            color: mensaje.includes("") || mensaje.includes("incorrectos") ? "red" : "green",
          }}
        >
          {mensaje}
        </p>
      )}
    </div>
  );
}