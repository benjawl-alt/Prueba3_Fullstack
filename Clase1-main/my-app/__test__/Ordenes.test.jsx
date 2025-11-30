import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, beforeEach, expect } from "vitest";
import Ordenes from "../src/pages/admin/Ordenes";

describe("🧾 Pruebas del componente Ordenes.jsx", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("✅ muestra mensaje si no hay órdenes registradas", () => {
    render(<Ordenes />);
    expect(screen.getByText("No hay órdenes registradas.")).toBeInTheDocument();
  });

  it("✅ muestra las órdenes guardadas en localStorage", () => {
  const comprasMock = [
    {
      total: 1500000,
      fecha: "2025-10-26",
      usuario: "Benjamín",
      metodo: "Tarjeta de crédito",
      items: [
        { marca: "Toyota", modelo: "Corolla", precio: 1000000 },
        { marca: "Nissan", modelo: "Versa", precio: 500000 },
      ],
    },
  ];
  localStorage.setItem("compras", JSON.stringify(comprasMock));

  render(<Ordenes />);

  expect(screen.getByText("Orden #1")).toBeInTheDocument();
  expect(screen.getByText(/Total:/i)).toBeInTheDocument();

  // 👇 Nueva forma robusta de verificar el total
  expect(
    screen.getByText((content) => content.includes("1.500.000"))
  ).toBeInTheDocument();

  expect(screen.getByText(/Benjamín/i)).toBeInTheDocument();
});

  it("✅ abre y cierra el detalle de una orden al hacer clic en los botones", () => {
    const comprasMock = [
      {
        total: 2500000,
        fecha: "2025-10-25",
        usuario: "Cliente Test",
        metodo: "Transferencia",
        items: [
          { marca: "Ford", modelo: "Focus", precio: 1250000 },
          { marca: "Chevrolet", modelo: "Sail", precio: 1250000 },
        ],
      },
    ];
    localStorage.setItem("compras", JSON.stringify(comprasMock));

    render(<Ordenes />);

    // Clic en el botón "Ver detalle"
    const botonVer = screen.getByText("Ver detalle");
    fireEvent.click(botonVer);

    // Ver que aparece el detalle
    expect(screen.getByText("Detalle de la orden")).toBeInTheDocument();
    // 👇 En lugar de getByText, usamos getAllByText porque aparece en dos lugares
    const clientes = screen.getAllByText(/Cliente Test/i);
    expect(clientes.length).toBeGreaterThan(0);

    expect(screen.getByText(/Ford Focus/)).toBeInTheDocument();

    // Cerrar el detalle
    const botonCerrar = screen.getByText("Cerrar");
    fireEvent.click(botonCerrar);

    // Ya no debería estar visible el modal
    expect(screen.queryByText("Detalle de la orden")).not.toBeInTheDocument();
  });
});
