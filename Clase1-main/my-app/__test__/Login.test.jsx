import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import Login from "../src/pages/Login";
import { MemoryRouter } from "react-router-dom";
import { CarritoContext } from "../src/context/CarritoContext";

// 🧠 Mock de useNavigate para que no rompa la prueba al redirigir
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("🧪 Pruebas del componente Login.jsx", () => {
  const renderLogin = (setUsuario = vi.fn()) => {
    render(
      <CarritoContext.Provider value={{ setUsuario }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </CarritoContext.Provider>
    );
  };

  beforeEach(() => {
    localStorage.clear();
  });

  // 🧩 Caso 1: Admin
  it("✅ inicia sesión correctamente como administrador", async () => {
    renderLogin();

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "admin@tienda.com" },
    });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: "admin123" },
    });
    fireEvent.click(screen.getByText(/Ingresar/i));

    await waitFor(() => {
      expect(screen.getByText(/Bienvenido Administrador/i)).toBeInTheDocument();
    });
  });

  // 🧩 Caso 2: Usuario registrado válido
  it("✅ inicia sesión correctamente con usuario registrado", async () => {
    // Simular usuario guardado
    localStorage.setItem(
      "usuarioRegistrado",
      JSON.stringify({
        nombre: "Benjamín",
        correo: "benja@test.com",
        password: "12345",
      })
    );

    renderLogin();

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "benja@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: "12345" },
    });
    fireEvent.click(screen.getByText(/Ingresar/i));

    await waitFor(() => {
      expect(
        screen.getByText(/Inicio de sesión exitoso, bienvenido Benjamín!/i)
      ).toBeInTheDocument();
    });
  });

  // 🧩 Caso 3: Usuario incorrecto o no registrado
  it("❌ muestra error si las credenciales son incorrectas o no hay usuario", async () => {
    renderLogin();

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "fake@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByText(/Ingresar/i));

    await waitFor(() => {
      expect(
        screen.getByText(/No hay usuarios registrados|Email o contraseña incorrectos/i)
      ).toBeInTheDocument();
    });
  });
});
