import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  BarChart2,
  FileText,
  Package,
  Layers,
  Users,
  Store,
  LogOut,
} from "lucide-react";


import Dashboard from "./Dashboard";
import Ordenes from "./Ordenes";
import ProductosAdmin from "./ProductosAdmin";
import CategoriasAdmin from "./CategoriasAdmin";
import UsuariosAdmin from "./UsuariosAdmin";
import "../../assets/admin.css"; 
import { BASE_SERVER_IP } from "../../config";


const ORDENES_API_URL = `${BASE_SERVER_IP}:8083/api/ordenes`;
const PRODUCTOS_API_URL = `${BASE_SERVER_IP}:8080/api/autos`;
const USUARIOS_API_URL = `${BASE_SERVER_IP}:8081/api/usuarios`;

export default function Admin() {
  const navigate = useNavigate();
  
  const [estadisticas, setEstadisticas] = useState({
    totalCompras: 0,
    totalIngresos: 0,
    totalProductos: 0,
    totalUsuarios: 0,
    aumentoCompras: 0, 
    aumentoUsuarios: 0, 
    cargando: true,
  });

  // --- FUNCIÓN DE CARGA DE ESTADÍSTICAS DESDE LAS APIS ---
  const cargarEstadisticas = async () => {
    setEstadisticas(prev => ({ ...prev, cargando: true }));

    try {
      // 1. Fetch de datos de los 3 microservicios
      const [comprasResponse, productosResponse, usuariosResponse] = await Promise.all([
        fetch(ORDENES_API_URL),
        fetch(PRODUCTOS_API_URL),
        fetch(USUARIOS_API_URL),
      ]);

      const comprasData = await comprasResponse.json();
      const productosData = await productosResponse.json();
      const usuariosData = await usuariosResponse.json();

      // Cálculo de Estadísticas
      const totalCompras = comprasData.length;
      const totalIngresos = comprasData.reduce(
        (acc, compra) => acc + (compra.total || 0),
        0
      );
      const totalProductos = productosData.length;
      const totalUsuarios = usuariosData.length;

      // Cálculos Simulados
      const aumentoCompras = totalCompras > 0 ? Math.floor(Math.random() * 30) : 0;
      const aumentoUsuarios = totalUsuarios > 0 ? Math.floor(Math.random() * 20) : 0;

      setEstadisticas({
        totalCompras,
        totalIngresos,
        totalProductos,
        totalUsuarios,
        aumentoCompras,
        aumentoUsuarios,
        cargando: false,
      });

    } catch (error) {
      console.error("Fallo al cargar estadísticas del administrador:", error);
      setEstadisticas(prev => ({ ...prev, cargando: false }));
    }
  };
  
  
  useEffect(() => {
    cargarEstadisticas();
    
    
    const handleUpdate = () => cargarEstadisticas();
    window.addEventListener("productosActualizados", handleUpdate);
    window.addEventListener("usuarioCreado", handleUpdate);
    
    return () => {
        window.removeEventListener("productosActualizados", handleUpdate);
        window.removeEventListener("usuarioCreado", handleUpdate);
    };
  }, []);

  const handleLogout = () => {
    
    localStorage.removeItem("usuarioActivo");
    navigate("/");
  };

  if (estadisticas.cargando) {
      return (
          <div className="admin-container" style={{padding: '50px', textAlign: 'center', color: 'white'}}>
              Cargando panel de administración desde microservicios...
          </div>
      );
  }


  return (
    <div className="admin-layout"> {/* Usar admin-layout según tu CSS */}
      {/* Sidebar */}
      <aside className="sidebar"> {/* Usar 'sidebar' según tu CSS */}
        <h2 className="sidebar-title">Admin Panel</h2> {/* Usar 'sidebar-title' según tu CSS */}
        <nav className="admin-nav">
          <button onClick={() => navigate("/admin/dashboard")}>
            <BarChart2 size={18} /> Dashboard
          </button>
          <button onClick={() => navigate("/admin/ordenes")}>
            <FileText size={18} /> Órdenes
          </button>
          <button onClick={() => navigate("/admin/productos")}>
            <Package size={18} /> Productos
          </button>
          <button onClick={() => navigate("/admin/categorias")}>
            <Layers size={18} /> Categorías
          </button>
          <button onClick={() => navigate("/admin/usuarios")}>
            <Users size={18} /> Usuarios
          </button>
        </nav>

        <div className="admin-footer">
          <button onClick={() => navigate("/")} className="btn-store">
            <Store size={18} /> Tienda
          </button>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={18} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="admin-main">
        {/* --- Tarjetas de resumen (Horizontal 3x1) --- */}
        <div className="admin-cards"> {/* La clase admin-cards tiene grid-template-columns: repeat(3, 1fr) */}
          
          {/* Compras */}
          <div className="card blue">
            <h3 style={{ margin: 0 }}>Compras</h3>
            <p className="number" style={{ margin: "8px 0" }}>
              {estadisticas.totalCompras}
            </p>
            <p style={{ margin: 0 }}>
              Total ingresos:{" "}
              <strong>
                ${estadisticas.totalIngresos.toLocaleString("es-CL")}
              </strong>
            </p>
            <p style={{ marginTop: 8 }}>
              Probabilidad de aumento:{" "}
              <strong>{estadisticas.aumentoCompras}%</strong>
            </p>
          </div>

          {/* Productos */}
          <div className="card green">
            <h3 style={{ margin: 0 }}>Productos</h3>
            <p className="number" style={{ margin: "8px 0" }}>
              {estadisticas.totalProductos}
            </p>
            <p style={{ margin: 0 }}>
              Inventario actual:{" "}
              <strong>
                {estadisticas.totalProductos}
              </strong>
            </p>
            <p style={{ marginTop: 8 }}>
              Nuevos este mes:{" "}
              <strong>{Math.floor(estadisticas.totalProductos / 5)}</strong>
            </p>
          </div>

          {/* Usuarios */}
          <div className="card yellow">
            <h3 style={{ margin: 0 }}>Usuarios</h3>
            <p className="number" style={{ margin: "8px 0" }}>
              {estadisticas.totalUsuarios}
            </p>
            <p style={{ margin: 0 }}>
              Nuevos este mes:{" "}
              <strong>{Math.floor(estadisticas.totalUsuarios / 3)}</strong>
            </p>
            <p style={{ marginTop: 8 }}>
              Crecimiento: <strong>{estadisticas.aumentoUsuarios}%</strong>
            </p>
          </div>
        </div>

        {/* Rutas internas del admin */}
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="ordenes" element={<Ordenes />} />
          <Route path="productos" element={<ProductosAdmin />} />
          <Route path="categorias" element={<CategoriasAdmin />} />
          <Route path="usuarios" element={<UsuariosAdmin />} />
          {/* Ruta por defecto: redirigir a dashboard si se entra a /admin */}
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}