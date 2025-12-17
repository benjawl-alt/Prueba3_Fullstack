import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";
import { CARRITO_API_URL, AUTOS_API_URL } from "../config";


const Carrito = () => {
    
    const { usuario } = useContext(CarritoContext); 
    
    const [cartItems, setCartItems] = useState([]); 
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    const userId = usuario?.id; 

    
    const fetchCartItems = async () => {
        if (!userId) return;

        setCargando(true);
        try {
            
            const cartResponse = await fetch(`${CARRITO_API_URL}/${userId}`);
            
            
            if (!cartResponse.ok && cartResponse.status !== 404) {
                 throw new Error(`Error al obtener carrito: ${cartResponse.status}`);
            }
            
            const cartData = await cartResponse.json();
            
            
            if (!cartData || cartData.length === 0) {
                 setCartItems([]);
                 return;
            }

            
            const detailedItems = await Promise.all(
                cartData.map(async (item) => {
                    const autoResponse = await fetch(`${AUTOS_API_URL}/${item.autoId}`);
                    
                    
                    if (!autoResponse.ok) {
                        console.warn(`Detalles del Auto ID ${item.autoId} no encontrados.`);
                        return null; 
                    }
                    
                    const autoDetails = await autoResponse.json();
                    
                    
                    return {
                        ...item, 
                        ...autoDetails,
                        itemId: item.id 
                    };
                })
            );

            
            const validDetailedItems = detailedItems.filter(item => item !== null);
            setCartItems(validDetailedItems);

        } catch (error) {
            console.error("Error al cargar el carrito o detalles del auto:", error);
            
        } finally {
            
            setCargando(false); 
        }
    };

    
    useEffect(() => {
        fetchCartItems();
        
        
        const handleCartUpdate = () => { fetchCartItems(); };
        window.addEventListener('carritoActualizado', handleCartUpdate);
        
        return () => { window.removeEventListener('carritoActualizado', handleCartUpdate); };
    }, [userId]); 


    
    const handleActualizarCantidad = async (itemId, nuevaCantidad) => {
        const cantidadEntera = parseInt(nuevaCantidad);
        if (cantidadEntera < 1 || isNaN(cantidadEntera)) return;

        
        setCartItems(prev => prev.map(item => 
            item.itemId === itemId ? { ...item, cantidad: cantidadEntera } : item
        ));

        try {
            
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


    
    const handleEliminar = async (itemId) => {
        try {
            
            const response = await fetch(`${CARRITO_API_URL}/${itemId}`, { method: 'DELETE' });
            
            if (response.ok) {
                
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