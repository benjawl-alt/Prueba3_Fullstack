import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../../assets/admin.css";

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="admin-layout">
      {/* Sidebar izquierda */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Panel Admin</h2>
        <nav>
          <ul>
            <li className={location.pathname.includes("/admin/dashboard") ? "active" : ""}>
              <Link to="/admin/dashboard">📊 Dashboard</Link>
            </li>
            <li className={location.pathname.includes("/admin/categorias") ? "active" : ""}>
              <Link to="/admin/categorias">📂 Categorías</Link>
            </li>
            <li className={location.pathname.includes("/admin/productos") ? "active" : ""}>
              <Link to="/admin/productos">🛒 Productos</Link>
            </li>
            <li className={location.pathname.includes("/admin/ordenes") ? "active" : ""}>
              <Link to="/admin/ordenes">📦 Órdenes</Link>
            </li>
            <li className={location.pathname.includes("/admin/usuarios") ? "active" : ""}>
              <Link to="/admin/usuarios">👥 Usuarios</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Contenido principal */}
      <section className="admin-main">
        <Outlet />
      </section>
    </div>
  );
}
