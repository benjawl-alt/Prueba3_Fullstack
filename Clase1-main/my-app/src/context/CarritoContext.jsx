import React, { createContext, useState } from "react";

export const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
    // 🛑 CARGAMOS EL USUARIO DESDE LOCALSTORAGE AL INICIAR
    const [usuario, setUsuario] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    
    // El estado del carrito se usará poco o nada, ya que Carrito.jsx lo obtendrá de la API
    const [carrito, setCarrito] = useState([]); 

    // --- FUNCIONES DE AUTENTICACIÓN (Necesarias para Login/Logout) ---
    
    const login = (userData) => {
        setUsuario(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUsuario(null);
        localStorage.removeItem('user');
        // No es necesario vaciar el carrito aquí, ya que Carrito.jsx lo obtiene de la DB
    };

    // --- FUNCIONES DE CARRITO SIMPLIFICADAS (Stubs) ---
    // Estas funciones ya NO realizan la lógica de negocio, solo evitan errores en componentes antiguos.
    const agregarAlCarrito = (producto) => {
        console.log(`[CarritoContext] Llamada a agregarAlCarrito para ${producto.marca}. La lógica de guardado está en Productos.jsx.`);
        // No modificar el estado local aquí.
    };

    const eliminarDelCarrito = (id) => {
        console.log(`[CarritoContext] Llamada a eliminarDelCarrito para ID: ${id}. La lógica de eliminado está en Carrito.jsx.`);
    };

    const vaciarCarrito = () => {
        setCarrito([]); 
    };

    const actualizarCantidad = (id, nuevaCantidad) => {
        console.log(`[CarritoContext] La cantidad para ID ${id} se actualizará via API en Carrito.jsx.`);
    };

    return (
        <CarritoContext.Provider
            value={{
                carrito,
                agregarAlCarrito,
                eliminarDelCarrito,
                vaciarCarrito,
                actualizarCantidad,
                usuario,
                setUsuario,
                login,
                logout,
            }}
        >
            {children}
        </CarritoContext.Provider>
    );
};