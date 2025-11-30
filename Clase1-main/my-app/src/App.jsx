import React from "react";
import { Routes, Route } from "react-router-dom";
import { CarritoProvider } from "./context/CarritoContext";
import Navbar from "./components/Navbar";

import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import Nosotros from "./pages/Nosotros";
import Formulario from "./pages/Formulario";
import Carrito from "./pages/Carrito";
import Login from "./pages/Login";
import Blogs from "./pages/Blogs";
import Contacto from "./pages/Contacto";
import Comprobante_pago from "./pages/Comprobante_pago";
import Checkout from "./pages/Checkout";

import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Ordenes from "./pages/admin/Ordenes";
import ProductosAdmin from "./pages/admin/ProductosAdmin";
import CategoriasAdmin from "./pages/admin/CategoriasAdmin";
import UsuariosAdmin from "./pages/admin/UsuariosAdmin";

import "./App.css";

function App() {
  return (
    <CarritoProvider>
      {}
      <Navbar />

      {}
      <div style={{ paddingTop: "80px" }}>
        <Routes>
          {}
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/formulario" element={<Formulario />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/comprobante" element={<Comprobante_pago />} />

          {}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} /> {}
            <Route path="dashboard" element={<Dashboard />} /> {}
            <Route path="ordenes" element={<Ordenes />} />
            <Route path="productos" element={<ProductosAdmin />} />
            <Route path="categorias" element={<CategoriasAdmin />} />
            <Route path="usuarios" element={<UsuariosAdmin />} />
          </Route>
        </Routes>
      </div>
    </CarritoProvider>
  );
}

export default App;
