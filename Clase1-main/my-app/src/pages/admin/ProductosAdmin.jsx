import React, { useEffect, useState } from "react";
import { AUTOS_API_URL } from "../../config"; 

export default function ProductosAdmin() {
    const [productos, setProductos] = useState([]);
    const [nuevo, setNuevo] = useState({
        marca: "", modelo: "", anio: "", precio: "", color: "", descripcion: "", 
        categoria: "", imagen: "", stock: "",
    });
    const [editando, setEditando] = useState(null);
    const [editado, setEditado] = useState({});
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    
    const cargarProductos = async () => {
        setCargando(true);
        setError(null);
        try {
            const response = await fetch(AUTOS_API_URL);
            if (!response.ok) throw new Error(`Error ${response.status}: Fallo al cargar los datos.`);
            
            const data = await response.json();
            
            
            const productosReales = data.filter(p => p.marca !== "Z-Admin");
            
            setProductos(productosReales); 
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("No se pudo conectar con la API de Autos. Revisa la consola.");
        } finally {
            setCargando(false);
        }
    };
    
    useEffect(() => {
        cargarProductos();
        window.addEventListener("productosActualizados", cargarProductos);
        return () => window.removeEventListener("productosActualizados", cargarProductos);
    }, []);

    
    const agregarProducto = async () => {
        // Validación básica
        if (!nuevo.marca || !nuevo.modelo || !nuevo.precio) {
            return alert("Completa al menos marca, modelo y precio.");
        }

        
        const producto = {
            ...nuevo,
            anio: parseInt(nuevo.anio) || 2024, 
            precio: parseFloat(nuevo.precio) || 0.0,
            stock: parseInt(nuevo.stock) || 0,
            categoria: nuevo.categoria || 'Otro', 
        };
        
        console.log("Enviando producto:", producto); 

        setCargando(true);
        try {
            const response = await fetch(AUTOS_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(producto),
            });
            
            if (!response.ok) {
                const errorData = await response.text(); 
                throw new Error(`Error ${response.status}: ${errorData}`);
            }
            
            await cargarProductos(); 
            
            
            setNuevo({ marca: "", modelo: "", anio: "", precio: "", color: "", descripcion: "", categoria: "", imagen: "", stock: "", });
            
            
            window.dispatchEvent(new Event("productosActualizados")); 
            alert("Producto agregado exitosamente.");

        } catch (err) {
            console.error("Error al agregar:", err);
            setError(`Fallo al agregar: ${err.message}`);
        } finally {
            setCargando(false);
        }
    };

    
    const eliminarProducto = async (id) => {
        if (!window.confirm("¿Eliminar este producto? Esta acción es permanente.")) return;
        
        setCargando(true);
        try {
            const response = await fetch(`${AUTOS_API_URL}/${id}`, { method: 'DELETE' });
            
            if (!response.ok) {
                 throw new Error(`Error ${response.status}: Fallo al eliminar.`);
            }
            
            await cargarProductos(); 

        } catch (err) {
            setError(`Fallo al eliminar: ${err.message}`);
        } finally {
            setCargando(false);
        }
    };

    
    const iniciarEdicion = (p) => {
        setEditando(p.id);
        setEditado({ ...p });
    };

    const guardarEdicion = async () => {
        setCargando(true);
        
        const productoActualizado = {
            ...editado,
            anio: parseInt(editado.anio) || null,
            precio: parseFloat(editado.precio) || 0,
            stock: parseInt(editado.stock) || 0,
            categoria: editado.categoria || 'Otro',
        };

        try {
            const response = await fetch(`${AUTOS_API_URL}/${editado.id}`, {
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productoActualizado),
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: Fallo al guardar edición.`);
            }
            
            await cargarProductos();
            setEditando(null);
            setEditado({});
            window.dispatchEvent(new Event("productosActualizados"));

        } catch (err) {
            setError(`Fallo al guardar: ${err.message}`);
        } finally {
            setCargando(false);
        }
    };

    const cancelarEdicion = () => {
        setEditando(null);
        setEditado({});
    };

    

    if (cargando && productos.length === 0) return <div style={styles.container}>Cargando datos del administrador...</div>;
    
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Gestión de Productos</h1>

            {error && <p style={styles.errorMessage}>Error: {error}</p>}
            {cargando && <p style={styles.loadingMessage}>Procesando...</p>}

            {/* ✅ CONTENEDOR PRINCIPAL HORIZONTAL (50/50) */}
            <div style={styles.mainContent}>

                {/* 1. ➕ FORMULARIO DE CREACIÓN (Columna izquierda) */}
                <div style={styles.formColumn}>
                    <div style={styles.card}>
                        <h3 style={{ marginBottom: "10px" }}>Agregar producto</h3>
                        <div style={styles.formGrid}>
                            {[
                                ["marca", "Marca"], ["modelo", "Modelo"], ["anio", "Año", "number"], 
                                ["precio", "Precio", "number"], ["color", "Color"], ["categoria", "Categoría"], 
                                ["imagen", "URL Imagen"], ["stock", "Stock", "number"], 
                            ].map(([key, label, type]) => (
                                <input key={key} type={type || "text"} placeholder={label} value={nuevo[key]} 
                                    onChange={(e) => setNuevo({ ...nuevo, [key]: e.target.value })} style={styles.input} />
                            ))}
                            <textarea placeholder="Descripción" value={nuevo.descripcion}
                                onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
                                style={{ ...styles.input, gridColumn: "span 2", minHeight: '80px' }} />
                        </div>
                        <button onClick={agregarProducto} style={styles.addBtn} disabled={cargando}>
                            Agregar producto
                        </button>
                    </div>
                </div>

                {/* 2. 📋 LISTA DE PRODUCTOS (Columna derecha) */}
                <div style={styles.listColumn}>
                    <h3 style={styles.listTitle}>Lista de productos ({productos.length})</h3>

                    {productos.length === 0 ? (
                        <p style={{color: '#999'}}>No hay productos registrados.</p>
                    ) : (
                        <div style={styles.listContainer}>
                            {productos.map((p) => (
                                <div key={p.id} style={styles.productCard}>
                                    {p.imagen && (
                                        <img 
                                            src={p.imagen} 
                                            alt={p.modelo} 
                                            style={styles.image}
                                            onError={(e) => e.target.style.display = 'none'} // Ocultar si falla
                                        />
                                    )}
                                    <div style={styles.info}>
                                        {/* Lógica de edición en línea */}
                                        {editando === p.id ? (
                                            <>
                                                <div style={styles.editGrid}>
                                                    {Object.keys(p).filter(key => key !== 'id' && key !== 'descripcion' && key !== 'imagen').map(key => (
                                                        <input key={key} value={editado[key]} onChange={(e) => setEditado({ ...editado, [key]: e.target.value })} placeholder={key} style={styles.editInput} />
                                                    ))}
                                                    <textarea value={editado.descripcion} onChange={(e) => setEditado({ ...editado, descripcion: e.target.value })} placeholder="Descripción" style={{...styles.editInput, gridColumn: 'span 4'}} />
                                                </div>
                                                <button onClick={guardarEdicion} style={styles.saveBtn} disabled={cargando}>Guardar</button>
                                                <button onClick={cancelarEdicion} style={styles.cancelBtn} disabled={cargando}>Cancelar</button>
                                            </>
                                        ) : (
                                            <>
                                                <h4 style={styles.productTitle}>
                                                    {p.marca} {p.modelo} ({p.anio || 'N/A'})
                                                </h4>
                                                <p style={styles.desc}>{p.descripcion || 'Sin descripción.'}</p>
                                                <p style={styles.details}>
                                                    ${p.precio?.toLocaleString("es-CL")} | Cat: {p.categoria || 'N/A'} | Stock: {p.stock || 0} | Color: {p.color || 'N/A'}
                                                </p>
                                                <div style={styles.actions}>
                                                    <button onClick={() => iniciarEdicion(p)} style={styles.editBtn}>Editar</button>
                                                    <button onClick={() => eliminarProducto(p.id)} style={styles.deleteBtn}>Eliminar</button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { padding: "10px 25px 25px 25px", maxWidth: "1200px", margin: "auto", color: "#fff" }, 
    title: { textAlign: "center", marginBottom: "15px", marginTop: '0' },
    mainContent: {
        display: 'flex',
        gap: '25px',
        alignItems: 'flex-start', 
    },
    formColumn: { flex: '0 0 40%', maxWidth: '40%' },
    listColumn: { flex: '1 1 60%' },
    listTitle: { marginTop: '0', marginBottom: '10px' }, 
    card: { background: "#2a2a3d", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" },
    formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
    input: { padding: "8px", borderRadius: "8px", border: "1px solid #444", backgroundColor: "#3a3a4d", color: "#fff", display: 'block', width: '100%', margin: '0' },
    addBtn: { marginTop: "10px", padding: "8px 15px", border: "none", borderRadius: "8px", backgroundColor: "#4a8ef0", color: "#fff", cursor: "pointer" },
    listContainer: { display: "flex", flexDirection: "column", gap: "15px", marginTop: "10px" },
    productCard: { display: "flex", alignItems: "flex-start", background: "#1e1e2f", padding: "15px", borderRadius: "10px", gap: "15px", boxShadow: "0 3px 8px rgba(0,0,0,0.25)" },
    image: { width: "120px", height: "90px", objectFit: "cover", borderRadius: "8px" },
    info: { flex: 1 },
    productTitle: { margin: "0 0 5px" },
    desc: { fontSize: "0.9rem", color: "#ccc" },
    details: { fontSize: "0.85rem", color: "#aaa" },
    actions: { marginTop: "8px", display: "flex", gap: "8px" },
    editBtn: { background: "#f1c40f", border: "none", borderRadius: "6px", color: "#fff", padding: "6px 10px", cursor: "pointer" },
    deleteBtn: { background: "#e74c3c", border: "none", borderRadius: "6px", color: "#fff", padding: "6px 10px", cursor: "pointer" },
    saveBtn: { background: "#2ecc71", border: "none", borderRadius: "6px", color: "white", padding: "6px 10px", marginTop: "5px", cursor: "pointer" },
    cancelBtn: { background: "#555", border: "none", borderRadius: "6px", color: "#fff", padding: "6px 10px", marginLeft: "5px", cursor: "pointer" },
    editGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: '5px' },
    editInput: { padding: "6px", borderRadius: "6px", backgroundColor: "#333", color: "#fff", border: "1px solid #555" },
    errorMessage: { color: '#e74c3c', fontWeight: 'bold', textAlign: 'center', marginTop: '15px' },
    loadingMessage: { color: '#4a8ef0', textAlign: 'center', marginTop: '15px' }
};