import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CarritoContext } from "../src/context/CarritoContext";
import Comprobante_pago from "../src/pages/Comprobante_pago";
import { vi } from "vitest";

// 🧩 Mock de useNavigate para evitar errores de navegación
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// 🧪 Utilidad para renderizar el componente con contexto
const renderComprobante = (contextValue) => {
  return render(
    <MemoryRouter>
      <CarritoContext.Provider value={contextValue}>
        <Comprobante_pago />
      </CarritoContext.Provider>
    </MemoryRouter>
  );
};

beforeEach(() => {
  localStorage.clear();
});


test("⚠️ muestra mensaje si no hay carrito ni datos", () => {
  renderComprobante({ vaciarCarrito: vi.fn() });

  expect(screen.getByText("No se encontró información del carrito.")).toBeInTheDocument();
  expect(screen.getByText("No se encontraron datos de envío.")).toBeInTheDocument();
});

test("🧹 al presionar 'Volver al inicio' se limpia el carrito", () => {
  const vaciarMock = vi.fn();

  localStorage.setItem("carrito", JSON.stringify([{ id: 1, marca: "Audi", modelo: "A4", cantidad: 2, precio: 60000 }]));
  localStorage.setItem("total", JSON.stringify(120000));
  localStorage.setItem("datosEntrega", JSON.stringify({ nombre: "Carlos", correo: "carlos@test.com" }));

  renderComprobante({ vaciarCarrito: vaciarMock });

  const boton = screen.getByText("Volver al inicio");
  fireEvent.click(boton);

  expect(vaciarMock).toHaveBeenCalled(); // se vacía el contexto
  expect(localStorage.getItem("carrito")).toBeNull(); // se limpia localStorage
});
