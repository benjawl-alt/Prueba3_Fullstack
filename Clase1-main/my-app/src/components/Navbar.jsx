import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";

export default function Navbar() {
  // ✅ CORRECCIÓN: Desestructuramos el objeto usuario completo y la función logout
  const { usuario, logout, carrito } = useContext(CarritoContext); 
  const navigate = useNavigate();

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const handleLogout = () => {
    // 🛑 Usamos la función logout del Contexto, que limpia el localStorage y el estado
    logout(); 
    navigate("/login"); // Redirigimos al login, no a la raíz
  };

  // Determinar si el usuario tiene rol de Administrador
  // Accede a usuario.rol y lo compara con "ADMIN"
  const isAdmin = usuario?.rol?.toUpperCase() === "ADMIN";

  // ✅ Lógica de navegación al panel admin
  const handleAdminClick = () => {
    if (isAdmin) {
      navigate("/admin");
    }
  };

  return (
    <header id="header" style={styles.header}>
      <nav id="nav" style={styles.nav}>
        <ul style={styles.ul}>
          <li><NavLink to="/" end>Inicio</NavLink></li>
          <li><NavLink to="/productos">Modelos</NavLink></li>
          <li><NavLink to="/blogs">Blogs</NavLink></li>
          <li><NavLink to="/carrito">Carrito</NavLink></li>
          <li><NavLink to="/nosotros">Nosotros</NavLink></li>
          <li><NavLink to="/contacto">Contacto</NavLink></li>
          <li><NavLink to="/formulario">Registro</NavLink></li>

          {/* Mostrar Iniciar Sesión solo si el usuario no existe */}
          {!usuario && (
            <li>
              <NavLink to="/login">Iniciar Sesión</NavLink>
            </li>
          )}
        </ul>

        {/* Mostrar información de usuario si el objeto usuario existe */}
        {usuario && (
          <div style={styles.user}>
            {/* Botón de usuario (muestra el nombre del objeto) */}
            <button
              onClick={handleAdminClick}
              style={{
                ...styles.invisibleButton,
                cursor: isAdmin ? "pointer" : "default", // Usa la variable isAdmin
              }}
              title={isAdmin ? "Ir al panel de administración" : ""}
            >
              {/* ✅ CORRECCIÓN: Accede a la propiedad 'nombre' del objeto */}
              {usuario.nombre} 
            </button>

            {/* Botón de cerrar sesión */}
            <button style={styles.btnLogout} onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

const styles = {
// ... (Tus estilos se mantienen igual)
// Los estilos no fueron modificados en esta corrección.
// ...
  header: {
    background: "#1c1d26",
    padding: "15px 0",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  ul: {
    display: "flex",
    gap: "25px",
    listStyle: "none",
    justifyContent: "center",
    flexGrow: 1,
    margin: 0,
    padding: 0,
  },
  user: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#fff",
    whiteSpace: "nowrap",
  },
  btnLogout: {
    background: "#e74c3c",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    padding: "6px 10px",
    cursor: "pointer",
  },
  invisibleButton: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "16px",
    cursor: "default",
  },
};