import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CarritoContext } from "../src/context/CarritoContext";
import Carrito from "../src/pages/Carrito";
import { vi } from "vitest";

// 🧩 Mock del hook de navegación de react-router-dom
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// 🧰 Función auxiliar para renderizar con contexto y router
const renderCarrito = (contextValue) => {
  return render(
    <MemoryRouter>
      <CarritoContext.Provider value={contextValue}>
        <Carrito />
      </CarritoContext.Provider>
    </MemoryRouter>
  );
};

// 🧪 Pruebas del componente Carrito
test("✅ muestra mensaje si el usuario no ha iniciado sesión", () => {
  renderCarrito({
    carrito: [],
    usuario: null,
    eliminarDelCarrito: vi.fn(),
    actualizarCantidad: vi.fn(),
  });

  expect(
    screen.getByText("Debes iniciar sesión para ver tu carrito.")
  ).toBeInTheDocument();
});

test("✅ muestra el contenido del carrito correctamente", () => {
  const carrito = [
    { id: 1, marca: "BMW", modelo: "M3", precio: 50000, cantidad: 1, imagen: "bmw-m3.jpg" },
  ];

  renderCarrito({
    carrito,
    usuario: "Benjamín",
    eliminarDelCarrito: vi.fn(),
    actualizarCantidad: vi.fn(),
  });

  expect(screen.getByText(/Carrito de Benjamín/)).toBeInTheDocument();
  expect(screen.getByText(/BMW M3/)).toBeInTheDocument();
  expect(screen.getAllByText(/\$50.000/)).toHaveLength(3); // precio, subtotal y total
});

test("✅ permite eliminar un producto del carrito", () => {
  const eliminarMock = vi.fn();

  const carrito = [
    { id: 1, marca: "Audi", modelo: "A4", precio: 60000, cantidad: 1, imagen: "audi-a4.jpg" },
  ];

  renderCarrito({
    carrito,
    usuario: "Benjamín",
    eliminarDelCarrito: eliminarMock,
    actualizarCantidad: vi.fn(),
  });

  fireEvent.click(screen.getByText("Eliminar"));
  expect(eliminarMock).toHaveBeenCalledWith(1);
});

test("✅ actualiza la cantidad del producto", () => {
  const actualizarMock = vi.fn();

  const carrito = [
    { id: 1, marca: "Mercedes", modelo: "C63", precio: 70000, cantidad: 1, imagen: "mercedes-c63.jpg" },
  ];

  renderCarrito({
    carrito,
    usuario: "Benjamín",
    eliminarDelCarrito: vi.fn(),
    actualizarCantidad: actualizarMock,
  });

  fireEvent.change(screen.getByDisplayValue("1"), { target: { value: "2" } });
  expect(actualizarMock).toHaveBeenCalledWith(1, 2);
});

test("✅ muestra mensaje cuando el carrito está vacío", () => {
  renderCarrito({
    carrito: [],
    usuario: "Benjamín",
    eliminarDelCarrito: vi.fn(),
    actualizarCantidad: vi.fn(),
  });

  expect(screen.getByText("No tienes productos en tu carrito.")).toBeInTheDocument();
});
