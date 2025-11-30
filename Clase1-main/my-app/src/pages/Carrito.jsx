import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";
import { CARRITO_API_URL, AUTOS_API_URL } from "../config";


const Carrito = () => {
    // Solo necesitamos el objeto usuario del contexto
    const { usuario } = useContext(CarritoContext); 
    
    const [cartItems, setCartItems] = useState([]); // Ítems detallados para la tabla
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    const userId = usuario?.id; 

    // 1. 🌐 Función para obtener los datos del carrito desde la API
    const fetchCartItems = async () => {
        if (!userId) return;

        setCargando(true);
        try {
            // 1. Obtener ítems del carrito (ID de auto, cantidad)
            const cartResponse = await fetch(`${CARRITO_API_URL}/${userId}`);
            
            // Si la respuesta es 404 o no OK, asumimos carrito vacío.
            if (!cartResponse.ok && cartResponse.status !== 404) {
                 throw new Error(`Error al obtener carrito: ${cartResponse.status}`);
            }
            
            const cartData = await cartResponse.json();
            
            // Si el carrito está vacío, terminamos la carga.
            if (!cartData || cartData.length === 0) {
                 setCartItems([]);
                 return;
            }

            // 2. Obtener los detalles de cada Auto desde el microservicio de Autos
            const detailedItems = await Promise.all(
                cartData.map(async (item) => {
                    const autoResponse = await fetch(`${AUTOS_API_URL}/${item.autoId}`);
                    
                    // 🛑 Manejo de Auto no encontrado
                    if (!autoResponse.ok) {
                        console.warn(`Detalles del Auto ID ${item.autoId} no encontrados.`);
                        return null; 
                    }
                    
                    const autoDetails = await autoResponse.json();
                    
                    // Combina los datos para el renderizado
                    return {
                        ...item, 
                        ...autoDetails,
                        itemId: item.id // ID del registro de la tabla carrito_items
                    };
                })
            );

            // Filtra cualquier resultado nulo que provenga de un auto eliminado
            const validDetailedItems = detailedItems.filter(item => item !== null);
            setCartItems(validDetailedItems);

        } catch (error) {
            console.error("Error al cargar el carrito o detalles del auto:", error);
            // Dejamos un mensaje para el usuario si es un error de conexión grave.
        } finally {
            // ✅ CRÍTICO: Asegura que el estado de carga termine.
            setCargando(false); 
        }
    };

    // 2. 🔄 Carga de datos al montar (y al actualizarse)
    useEffect(() => {
        fetchCartItems();
        
        // Listener para recargar cuando se añade un nuevo ítem desde Productos.jsx
        const handleCartUpdate = () => { fetchCartItems(); };
        window.addEventListener('carritoActualizado', handleCartUpdate);
        
        return () => { window.removeEventListener('carritoActualizado', handleCartUpdate); };
    }, [userId]); 


    // 3. 🆕 Manejador para actualizar cantidad (PUT a la API)
    const handleActualizarCantidad = async (itemId, nuevaCantidad) => {
        const cantidadEntera = parseInt(nuevaCantidad);
        if (cantidadEntera < 1 || isNaN(cantidadEntera)) return;

        // 1. Optimista: Actualizamos la UI inmediatamente
        setCartItems(prev => prev.map(item => 
            item.itemId === itemId ? { ...item, cantidad: cantidadEntera } : item
        ));

        try {
            // 2. LLAMADA PUT A LA API de Carrito
            const response = await fetch(`${CARRITO_API_URL}/${itemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cantidad: cantidadEntera }), 
            });

            if (!response.ok) {
                // Si falla en el backend, recargamos para revertir el cambio visual
                console.error("Fallo al actualizar en la API. Revertiendo.");
                fetchCartItems(); 
            }

        } catch (error) {
            console.error("Error de conexión al actualizar cantidad:", error);
            alert("Error de conexión. Intente de nuevo.");
            fetchCartItems();
        }
    };


    // 4. 🗑️ Manejador para eliminar (DELETE a la API)
    const handleEliminar = async (itemId) => {
        try {
            // Llamada DELETE a la API de Carrito
            const response = await fetch(`${CARRITO_API_URL}/${itemId}`, { method: 'DELETE' });
            
            if (response.ok) {
                // Si la API tuvo éxito, actualizamos el estado local
                setCartItems(prev => prev.filter(item => item.itemId !== itemId));
            } else {
                 alert("No se pudo eliminar el ítem del carrito.");
            }
        } catch (error) {
            console.error("Error al eliminar el ítem:", error);
            alert("Error de conexión al eliminar.");
        }
    };
    

    const total = cartItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    const handlePagar = () => {
        if (!cartItems || cartItems.length === 0) {
            alert("Tu carrito está vacío.");
            return;
        }
        
        // Guardamos el carrito completo y el total en la SESIÓN
        sessionStorage.setItem("currentCartItems", JSON.stringify(cartItems));
        sessionStorage.setItem("currentCartTotal", total.toString());

        navigate("/checkout");
    };

    if (!usuario)
        return <p style={styles.msg}>Debes iniciar sesión para ver tu carrito.</p>;
        
    if (cargando)
        return <p style={styles.msg}>Cargando carrito...</p>;


    return (
        <div style={styles.container}>
            <h2>Carrito de {usuario.nombre}</h2> 

            {cartItems.length === 0 ? (
                <p>No tienes productos en tu carrito.</p>
            ) : (
                <>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th>Imagen</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Subtotal</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.itemId}> 
                                    <td>
                                        <img src={item.imagen} alt={item.modelo} style={styles.img} />
                                    </td>
                                    <td>{item.marca} {item.modelo}</td>
                                    <td>${item.precio.toLocaleString("es-CL")}</td>
                                    <td>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.cantidad}
                                            style={styles.inputCantidad}
                                            onChange={(e) =>
                                                handleActualizarCantidad(item.itemId, e.target.value)
                                            }
                                        />
                                    </td>
                                    <td>${(item.precio * item.cantidad).toLocaleString("es-CL")}</td>
                                    <td>
                                        <button
                                            style={styles.btnEliminar}
                                            onClick={() => handleEliminar(item.itemId)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h3 style={{ marginTop: "20px" }}>Total: ${total.toLocaleString("es-CL")}</h3>
                    <button style={styles.btnPagar} onClick={handlePagar}>
                        Pagar
                    </button>
                </>
            )}
        </div>
    );
};

// ... (Styles) ...
const styles = {
    container: { padding: "30px", textAlign: "center" },
    table: { width: "100%", borderCollapse: "collapse", marginTop: "20px" },
    img: { width: "70px", borderRadius: "6px" },
    btnEliminar: {
        background: "#e74c3c",
        border: "none",
        color: "#fff",
        borderRadius: "6px",
        padding: "6px 10px",
        cursor: "pointer",
    },
    btnPagar: {
        background: "#27ae60",
        color: "#fff",
        border: "none",
        padding: "10px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        marginTop: "15px",
    },
    msg: { padding: "40px", textAlign: "center", fontSize: "1.1rem" },
};

export default Carrito;