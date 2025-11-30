import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import Dashboard from "../src/pages/admin/Dashboard";

// 🧠 Simular localStorage antes de cada test
beforeEach(() => {
  const mockData = {
    productos: [
      { nombre: "Camiseta", stock: 5 },
      { nombre: "Pantalón", stock: 3 },
    ],
    usuarios: [
      { nombre: "Carlos", fechaRegistro: new Date().toISOString() },
      { nombre: "Ana", fechaRegistro: new Date().toISOString() },
    ],
    compras: [
      { total: 15000 },
      { total: 25000 },
    ],
    mensajesContacto: [
      {
        name: "Benjamín",
        email: "benjamin@duoc.cl",
        message: "Hola, tengo una duda sobre mi compra.",
        fecha: "2025-10-26",
      },
    ],
  };

  for (let key in mockData) {
    localStorage.setItem(key, JSON.stringify(mockData[key]));
  }
});

afterEach(() => {
  localStorage.clear();
});

describe("🧭 Pruebas del componente Dashboard.jsx", () => {
  // 🧩 1️⃣ Renderizado inicial
  it("✅ Renderiza correctamente los títulos y tarjetas del dashboard", () => {
    render(<Dashboard />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Resumen general de tu tienda")).toBeInTheDocument();

    // Verifica tarjetas principales
    expect(screen.getByText("Compras")).toBeInTheDocument();
    expect(screen.getByText("Productos")).toBeInTheDocument();
    expect(screen.getByText("Usuarios")).toBeInTheDocument();
    expect(screen.getByText("Crecimiento")).toBeInTheDocument();
  });

  // 🧩 2️⃣ Renderizado condicional de reportes
  it("🧾 Muestra y oculta los reportes de contacto al hacer clic en el botón", async () => {
    render(<Dashboard />);
    const boton = screen.getByRole("button", { name: /ver reportes de contacto/i });

    // Inicialmente no hay reportes visibles
    expect(screen.queryByText("📨 Mensajes de contacto")).not.toBeInTheDocument();

    // Click para mostrar
    fireEvent.click(boton);
    await waitFor(() => {
      expect(screen.getByText("📨 Mensajes de contacto")).toBeInTheDocument();
      expect(screen.getByText("Benjamín")).toBeInTheDocument();
      expect(screen.getByText("benjamin@duoc.cl")).toBeInTheDocument();
      expect(
        screen.getByText("Hola, tengo una duda sobre mi compra.")
      ).toBeInTheDocument();
    });

    // Click para ocultar
    fireEvent.click(boton);
    await waitFor(() => {
      expect(screen.queryByText("📨 Mensajes de contacto")).not.toBeInTheDocument();
    });
  });

  // 🧩 3️⃣ Estado (state)
  it("📊 Calcula correctamente las estadísticas de productos, usuarios y compras", async () => {
    render(<Dashboard />);

    // Espera que el número de productos y usuarios se haya calculado
    await waitFor(() => {
      expect(screen.getByText(/Productos/i)).toBeInTheDocument();
      expect(screen.getByText(/Usuarios/i)).toBeInTheDocument();
      expect(screen.getByText(/Compras/i)).toBeInTheDocument();
    });

    // Comprueba que el total de compras aparezca correctamente
    const total = 15000 + 25000;
    expect(screen.getByText(`$${total.toLocaleString("es-CL")}`)).toBeInTheDocument();
  });

  // 🧩 4️⃣ Condición sin mensajes
  it("❌ Muestra mensaje cuando no hay mensajes de contacto", async () => {
    localStorage.setItem("mensajesContacto", JSON.stringify([]));
    render(<Dashboard />);

    const boton = screen.getByRole("button", { name: /ver reportes de contacto/i });
    fireEvent.click(boton);

    await waitFor(() => {
      expect(screen.getByText("No hay mensajes registrados.")).toBeInTheDocument();
    });
  });
});
