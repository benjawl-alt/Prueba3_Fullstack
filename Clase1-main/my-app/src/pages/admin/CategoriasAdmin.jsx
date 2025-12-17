import React, { useEffect, useState } from "react";
import { AUTOS_API_URL} from "../../config";

export default function CategoriasAdmin() {
    // Categorías base que no se pueden eliminar.
    const categoriasBase = ["Sedán", "SUV", "Deportivo"]; 
    
    const [categoriasEnUso, setCategoriasEnUso] = useState([]);
    const [nuevaCategoria, setNuevaCategoria] = useState(""); 
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    
    const cargarCategorias = async () => {
        setCargando(true);
        setError(null);
        try {
            const response = await fetch(AUTOS_API_URL);
            if (!response.ok) throw new Error(`Error ${response.status}: Fallo al cargar productos.`);
            
            const data = await response.json();
            
            
            const categoriasDeAPI = Array.from(new Set(
                data
                    .map(p => p.categoria)
                    .filter(c => c && typeof c === 'string') 
            ));
            
            
            const todasUnicas = Array.from(new Set([...categoriasBase, ...categoriasDeAPI]));

            
            setCategoriasEnUso(todasUnicas.filter(c => c !== "Todos")); 

        } catch (err) {
            console.error("Error fetching categories:", err);
            setError("No se pudo conectar con la API de Autos (8080).");
        } finally {
            setCargando(false);
        }
    };
    
    useEffect(() => {
        cargarCategorias();
        
        window.addEventListener("productosActualizados", cargarCategorias);
        return () => window.removeEventListener("productosActualizados", cargarCategorias);
    }, []);

    
    const agregarCategoria = async () => {
        const nombre = nuevaCategoria.trim();
        if (!nombre) return;
        
        
        if (categoriasEnUso.some(c => c.toLowerCase() === nombre.toLowerCase())) {
            return alert(`La categoría '${nombre}' ya está registrada.`);
        }

        
        const productoFantasma = {
            marca: "Z-Admin", 
            modelo: "Base", 
            anio: 2000, 
            precio: 1.00,
            imagen: "",
            categoria: nombre, 
        };

        setCargando(true);
        try {
            await fetch(AUTOS_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productoFantasma),
            });
            
            await cargarCategorias(); 
            setNuevaCategoria("");
            
            
            window.dispatchEvent(new Event("productosActualizados")); 

        } catch (err) {
            setError(`Fallo al agregar la categoría: ${err.message}`);
        } finally {
            setCargando(false);
        }
    };

    
    const handleEliminarCategoria = async (nombre) => {
        if (categoriasBase.includes(nombre)) {
            return alert("No puedes eliminar una categoría base.");
        }
        
        if (!window.confirm(`¿Estás seguro de eliminar la categoría '${nombre}'? Esto podría afectar a los productos que la usan.`)) {
            return;
        }

        setCargando(true);
        try {
            
            const searchResponse = await fetch(AUTOS_API_URL);
            const allProducts = await searchResponse.json();
            
            
            const fantasma = allProducts.find(p => 
                p.marca === "Z-Admin" && p.categoria === nombre
            );

            if (fantasma && fantasma.id) { 
               
                await fetch(`${AUTOS_API_URL}/${fantasma.id}`, { method: 'DELETE' });
                
                
                await cargarCategorias(); 
                window.dispatchEvent(new Event("productosActualizados"));
            } else {
                 
                 alert(`La categoría '${nombre}' es usada por productos reales. No se puede eliminar.`);
            }

        } catch (err) {
            setError(`Fallo al eliminar: ${err.message}`);
        } finally {
            setCargando(false);
        }
    }


    if (cargando) return <div style={styles.container}>Cargando categorías...</div>;
    if (error) return <div style={{...styles.container, color: '#e74c3c'}}>Error: {error}</div>;

    return (
        <div style={styles.container}>
            <h1>Gestión de Categorías</h1>
            <p style={styles.infoText}>
                Aca puedes editar la categoria....
            </p>

            {/* ✅ FORMULARIO DE CREACIÓN */}
            <div style={styles.crearForm}>
                <input
                    type="text"
                    value={nuevaCategoria}
                    onChange={(e) => setNuevaCategoria(e.target.value)}
                    placeholder="Nueva categoría"
                    style={styles.input}
                />
                <button onClick={agregarCategoria} style={styles.addBtn} disabled={cargando}>
                    Agregar Categoría
                </button>
            </div>
            {/* ------------------------------------------- */}

            <ul style={styles.lista}>
                {categoriasEnUso.map((cat, i) => {
                    const esBase = categoriasBase.includes(cat);
                    
                    return (
                    <li
                        key={i}
                        style={styles.categoriaItem}
                    >
                        <span>{cat}</span>
                        <div>
                            {esBase ? (
                                // Si es base, mostramos un botón de información
                                <button
                                    onClick={() => alert(`La categoría '${cat}' es base y no puede ser eliminada.`)}
                                    style={styles.btnInfo}
                                >
                                    Base
                                </button>
                            ) : (
                                // Si es personalizada, mostramos el botón de ELIMINAR
                                <button
                                    onClick={() => handleEliminarCategoria(cat)}
                                    style={styles.btnEliminar}
                                    disabled={cargando}
                                >
                                    Eliminar
                                </button>
                            )}
                        </div>
                    </li>
                    );
                })}
            </ul>
        </div>
    );
}

const styles = {
    container: { padding: "30px", maxWidth: "600px", margin: "auto", color: '#fff' },
    infoText: { marginBottom: "20px", color: '#bbb', borderBottom: '1px solid #444', paddingBottom: '10px' },
    crearForm: { display: 'flex', marginBottom: '25px', gap: '10px', alignItems: 'center' }, // Nuevo estilo
    input: {
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #555",
        backgroundColor: "#3b3b3b",
        color: "#fff",
        flexGrow: 1,
    },
    addBtn: {
        padding: "10px 15px",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#4a8ef0",
        color: "white",
        cursor: "pointer",
        fontWeight: 'bold',
    },
    lista: { listStyle: "none", padding: 0 },
    categoriaItem: {
        background: "#1e1e2f",
        marginBottom: "8px",
        padding: "10px",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    },
    btnInfo: {
        background: "#555", // Gris para las categorías base
        border: "none",
        padding: "6px 12px",
        borderRadius: "6px",
        color: "white",
        cursor: "default",
    },
    btnEliminar: {
        background: "#e74c3c", // Rojo para eliminar
        border: "none",
        padding: "6px 12px",
        borderRadius: "6px",
        color: "white",
        cursor: "pointer",
        fontWeight: 'bold',
    },
};