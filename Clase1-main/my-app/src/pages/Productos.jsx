import React, { useContext, useState, useEffect } from "react";
import { CarritoContext } from "../context/CarritoContext";
import { AUTOS_API_URL,CARRITO_API_URL } from "../config";

const Productos = () => {
    // Categorías base para que los botones iniciales siempre existan
    const categoriasBase = ["Todos", "Sedán", "Deportivo", "SUV"]; 

    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos"); 
    const [mensaje, setMensaje] = useState(null);
    const { agregarAlCarrito, usuario } = useContext(CarritoContext);
    
    const [categorias, setCategorias] = useState(categoriasBase); 
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true); 

    // --- LÓGICA DE CARGA ---

    const cargarProductos = async () => {
        setCargando(true);
        try {
            const response = await fetch(AUTOS_API_URL);
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            
            const data = await response.json();
            
            // ✅ FILTRO CRÍTICO: Excluye el producto fantasma ("Z-Admin") y registros nulos
            const productosValidos = data.filter(p => 
                p.marca && p.modelo && p.marca !== "Z-Admin" 
            ); 
            
            setProductos(productosValidos);
            
            // Cargar categorías dinámicamente (se usa 'data' original para incluir 'Camion', por ejemplo)
            cargarCategoriasDinamicas(data);

        } catch (error) {
            setMensaje("❌ Error al cargar el inventario. Verifique que la API (8080) esté activa.");
        } finally {
            setCargando(false);
        }
    };
    
    // Función para extraer categorías de los datos de la API
    const cargarCategoriasDinamicas = (data) => {
        const categoriasDeAPI = Array.from(new Set(
            data.map(p => p.categoria).filter(c => c && typeof c === 'string')
        ));
        
        const todasUnicas = Array.from(new Set([...categoriasBase, ...categoriasDeAPI]));
        
        setCategorias(todasUnicas);
    };


    useEffect(() => {
        cargarProductos(); 
        
        const actualizar = () => { cargarProductos(); };
        window.addEventListener("productosActualizados", actualizar);
        window.addEventListener("storage", actualizar);

        return () => {
            window.removeEventListener("productosActualizados", actualizar);
            window.removeEventListener("storage", actualizar);
        };
    }, []); 

    // 4. Lógica de filtrado
    const productosFiltrados =
        categoriaSeleccionada === "Todos"
            ? productos
            : productos.filter((p) => p.categoria === categoriaSeleccionada);
            
    // 5. handleAgregar (POST a Carrito - 8082)
    const handleAgregar = async (producto) => {
        if (!usuario || !usuario.id) {
            alert("Debes iniciar sesión para agregar productos al carrito.");
            return;
        }

        const cartItem = { userId: usuario.id, autoId: producto.id, cantidad: 1 };

        try {
            await fetch(CARRITO_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cartItem),
            });
            
            setMensaje(`✅ ${producto.marca} ${producto.modelo} agregado al carrito.`);
            window.dispatchEvent(new Event('carritoActualizado')); 

        } catch (error) {
            setMensaje(`❌ Error al añadir el producto: ${error.message}`);
        }
    };

    useEffect(() => {
        if (!mensaje) return;
        const timer = setTimeout(() => setMensaje(null), 2500);
        return () => clearTimeout(timer);
    }, [mensaje]);

    // --- Renderizado ---

    return (
        <div style={styles.container}>
            <h2 style={styles.titulo}>Catálogo de Autos</h2>

            {cargando && <div style={styles.mensajeExito}>Cargando inventario...</div>}

            {/* 🔽 Filtros de categorías */}
            {!cargando && (
                <div style={styles.filtros}>
                    {categorias.map((categoria) => (
                        <button
                            key={categoria}
                            onClick={() => setCategoriaSeleccionada(categoria)}
                            style={{
                                ...styles.boton,
                                backgroundColor: categoriaSeleccionada === categoria ? "#4a8ef0" : "#555", 
                            }}
                        >
                            {categoria}
                        </button>
                    ))}
                </div>
            )}

            {mensaje && <div style={styles.mensajeExito}>{mensaje}</div>}

            {/* 🧱 Grilla de productos */}
            <div style={styles.grid}>
                {!cargando && productosFiltrados.length === 0 ? (
                    <p style={{ color: "#fff" }}>No hay productos en esta categoría.</p>
                ) : (
                    productosFiltrados.map((p) => (
                        <div key={p.id} style={styles.card}>
                            <img src={p.imagen} alt={p.modelo} style={styles.imagen} /> 
                            <h3 style={styles.nombre}>
                                {p.marca} {p.modelo}
                            </h3>
                            <p style={styles.precio}>${p.precio ? p.precio.toLocaleString("es-CL") : 'N/A'}</p>
                            
                            <p style={styles.details}>Categoría: {p.categoria || 'N/A'}</p> 
                            
                            <button style={styles.btn} onClick={() => handleAgregar(p)}>
                                Agregar
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { padding: "30px", textAlign: "center", maxWidth: "1200px", margin: "auto" },
    titulo: { fontSize: "2rem", marginBottom: "20px", color: "#fff" },
    filtros: { display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", marginBottom: "25px" },
    boton: { padding: "10px 15px", border: "none", borderRadius: "10px", backgroundColor: "#555", color: "#fff", cursor: "pointer", transition: "0.3s" },
    grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "25px", justifyContent: "center", justifyItems: "center" },
    card: {
        backgroundColor: "#645c5cff",
        borderRadius: "15px",
        padding: "15px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        textAlign: "center",
        transition: "transform 0.2s, box-shadow 0.2s",
        width: "100%",
        maxWidth: "320px",
    },
    imagen: { width: "100%", height: "220px", objectFit: "contain", borderRadius: "10px" },
    nombre: { marginTop: "10px", fontWeight: "bold", fontSize: "1.1rem", color: "#fff" },
    precio: { fontWeight: "bold", color: "#e8edf0ff", margin: "10px 0" },
    details: { fontSize: "0.9rem", color: "#ccc" },
    btn: {
        marginTop: "10px",
        padding: "10px 15px",
        backgroundColor: "#4739389a",
        border: "none",
        borderRadius: "8px",
        color: "#fff",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "all 0.3s ease",
    },
    mensajeExito: { backgroundColor: "#28a745", color: "white", padding: "10px", borderRadius: "5px", marginBottom: "20px" },
    mensajeError: { backgroundColor: "#dc3545", color: "white", padding: "10px", borderRadius: "5px", marginBottom: "20px" },
};

export default Productos;