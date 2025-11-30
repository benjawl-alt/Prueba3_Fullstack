import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { CarritoContext } from "../src/context/CarritoContext";
import Formulario from "../src/pages/Formulario";

// 🧩 Mock de useNavigate para evitar redirección real
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// 🧪 Helper para renderizar con contexto
const renderFormulario = (contextValue = { setUsuario: vi.fn() }) => {
  return render(
    <MemoryRouter>
      <CarritoContext.Provider value={contextValue}>
        <Formulario />
      </CarritoContext.Provider>
    </MemoryRouter>
  );
};

describe("🧾 Formulario de Registro", () => {
  it("⚠️ muestra error si se intentan enviar campos vacíos", () => {
    renderFormulario();

    const boton = screen.getByText("Registrarse");
    fireEvent.click(boton);

    expect(screen.getByText("Todos los campos son obligatorios.")).toBeInTheDocument();
  });

  it("❌ muestra error si las contraseñas no coinciden", () => {
    renderFormulario();

    fireEvent.change(screen.getByPlaceholderText("Nombre completo"), {
      target: { value: "Benjamín" },
    });
    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), {
      target: { value: "benja@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "1234" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirmar contraseña"), {
      target: { value: "5678" },
    });

    fireEvent.click(screen.getByText("Registrarse"));

    expect(screen.getByText("Las contraseñas no coinciden.")).toBeInTheDocument();
  });

  it("✅ registra correctamente al usuario y lo guarda en localStorage", () => {
    const setUsuarioMock = vi.fn();

    renderFormulario({ setUsuario: setUsuarioMock });

    fireEvent.change(screen.getByPlaceholderText("Nombre completo"), {
      target: { value: "Benjamín" },
    });
    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), {
      target: { value: "benja@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "1234" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirmar contraseña"), {
      target: { value: "1234" },
    });

    fireEvent.click(screen.getByText("Registrarse"));

    // ✅ Verifica que se guarda el usuario
    const registrado = JSON.parse(localStorage.getItem("usuarioRegistrado"));
    expect(registrado).toEqual({
      nombre: "Benjamín",
      correo: "benja@test.com",
      password: "1234",
    });

    // ✅ Se llama al contexto con el nombre
    expect(setUsuarioMock).toHaveBeenCalledWith("Benjamín");
  });
});
