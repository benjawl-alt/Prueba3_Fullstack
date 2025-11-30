import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";
import { REGISTER_API_URL } from "../config";

const Formulario = () => {
  // 🛑 USAMOS 'login' DEL CONTEXTO (que también llama a setUsuario y persiste la sesión)
  const { login } = useContext(CarritoContext); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    password: "",
    confirmarPassword: "",
  });

  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => { // ⬅️ Hacemos la función asíncrona
    e.preventDefault();
    setError("");
    setCargando(true);

    const { nombre, correo, password, confirmarPassword } = formData;

    if (!nombre || !correo || !password || !confirmarPassword) {
      setError("Todos los campos son obligatorios.");
      setCargando(false);
      return;
    }

    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      setCargando(false);
      return;
    }
    
    // 🛑 1. CONSTRUIR EL OBJETO DE REGISTRO (Rol "USER" por defecto en el backend)
    const newUser = {
        nombre,
        email: correo, // La API espera 'email', no 'correo'
        password,
    };

    try {
        // 🛑 2. POST AL MICROSERVICIO DE USUARIOS
        const response = await fetch(REGISTER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        });

        const userData = await response.json();

        if (response.ok) {
            // Registro exitoso: Iniciamos la sesión inmediatamente
            // La API ya devuelve el objeto completo con 'id' y 'rol'
            login(userData); 

            // Redirigir después del registro
            setTimeout(() => navigate("/"), 1000);
            
        } else if (response.status === 400 && userData.message?.includes('violates unique constraint')) {
            // Manejar error si el email ya existe (depende de la respuesta exacta de Spring Boot)
            setError("❌ El correo electrónico ya se encuentra registrado.");
        } else {
            // Otros errores del servidor
            setError(`❌ Error al registrar: ${response.statusText}`);
        }
    } catch (apiError) {
        console.error("Fallo la conexión con la API de Registro:", apiError);
        setError("❌ Error de conexión con el servidor (8081).");
    } finally {
        setCargando(false);
    }
  };
  
  // 🛑 ELIMINAMOS TODA LA LÓGICA DE LOCALSTORAGE (usuariosPrevios, usuarioRegistrado, etc.)

  return (
    <div style={styles.container}>
      <h2 style={styles.titulo}>Registro de Usuario</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        {/* Nombre */}
        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          value={formData.nombre}
          onChange={handleChange}
          style={styles.input}
        />
        {/* Correo (Usamos 'correo' en el frontend, mapeado a 'email' para el backend) */}
        <input
          type="email"
          name="correo"
          placeholder="Correo electrónico"
          value={formData.correo}
          onChange={handleChange}
          style={styles.input}
        />
        {/* Contraseña */}
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
        />
        {/* Confirmar Contraseña */}
        <input
          type="password"
          name="confirmarPassword"
          placeholder="Confirmar contraseña"
          value={formData.confirmarPassword}
          onChange={handleChange}
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.btn} disabled={cargando}>
          {cargando ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
};

const styles = {
    // ... (Tus estilos se mantienen igual)
    container: {
        padding: "40px",
        maxWidth: "400px",
        margin: "40px auto",
        backgroundColor: "#2c2c2c",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        textAlign: "center",
        color: "#fff",
    },
    titulo: {
        marginBottom: "20px",
        fontSize: "1.8rem",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    input: {
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #555",
        backgroundColor: "#3b3b3b",
        color: "#fff",
    },
    btn: {
        backgroundColor: "#27ae60",
        color: "#fff",
        border: "none",
        padding: "10px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        marginTop: "10px",
    },
    error: {
        color: "#e74c3c",
        fontSize: "0.9rem",
    },
};

export default Formulario;