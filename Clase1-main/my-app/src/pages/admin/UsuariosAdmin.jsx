import React, { useEffect, useState } from "react";
import { USUARIOS_API_URL,ORDENES_API_URL} from "../../config";

export default function UsuariosAdmin() {
    const [usuarios, setUsuarios] = useState([]);
    const [ordenes, setOrdenes] = useState([]); 
    const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: "", email: "", password: "" });
    const [editando, setEditando] = useState(null);
    const [editado, setEditado] = useState({});
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    
    const cargarDatos = async () => {
        setCargando(true);
        setError(null);
        try {
            const usersResponse = await fetch(USUARIOS_API_URL);
            const usersData = await usersResponse.json();
            setUsuarios(usersData);
            
            const ordersResponse = await fetch(ORDENES_API_URL);
            const ordersData = await ordersResponse.json();
            setOrdenes(ordersData);

        } catch (err) {
            console.error("Error al obtener datos del Admin:", err);
            setError("Fallo al conectar con los microservicios (8081 o 8083).");
        } finally {
            setCargando(false);
        }
    };
    
    useEffect(() => {
        cargarDatos();
    }, []);

    

    const handleCrear = async () => {
        if (!nuevoUsuario.nombre.trim() || !nuevoUsuario.email.trim()) {
            return alert("Completa al menos nombre y correo.");
        }
        
        setCargando(true);
        try {
            const response = await fetch(`${USUARIOS_API_URL}/registrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    nombre: nuevoUsuario.nombre, 
                    email: nuevoUsuario.email, 
                    password: "TemporalPassword123" 
                })
            });

            if (response.status === 400) {
                 return alert("Ya existe un usuario con ese correo o datos inválidos.");
            }
            if (!response.ok) {
                 throw new Error(`Error ${response.status}: Fallo al crear.`);
            }

            await cargarDatos(); 
            setNuevoUsuario({ nombre: "", email: "", password: "" }); 
        } catch (err) {
            setError(`Fallo al agregar usuario: ${err.message}`);
        } finally {
            setCargando(false);
        }
    };

    const handleGuardarEdicion = async () => {
        setCargando(true);
        const userActualizado = {
            id: editado.id, 
            nombre: editado.nombre,
            email: editado.email,
            rol: editado.rol || "USER"
        };

        try {
            const response = await fetch(`${USUARIOS_API_URL}/${editado.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userActualizado),
            });
            
            if (!response.ok) {
                 throw new Error(`Error ${response.status}: Fallo al guardar edición.`);
            }

            await cargarDatos();
            setEditando(null);
            setEditado({});
        } catch (err) {
            setError(`Fallo al guardar: ${err.message}`);
        } finally {
            setCargando(false);
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Eliminar este usuario? Esta acción es permanente.")) return;
        
        setCargando(true);
        try {
            const response = await fetch(`${USUARIOS_API_URL}/${id}`, { method: 'DELETE' });
            
            if (!response.ok) {
                 throw new Error(`Error ${response.status}: Fallo al eliminar.`);
            }

            await cargarDatos(); 
        } catch (err) {
            setError(`Fallo al eliminar: ${err.message}`);
        } finally {
            setCargando(false);
        }
    };

    const iniciarEdicion = (u) => {
        setEditando(u.id);
        setEditado({ id: u.id, nombre: u.nombre, email: u.email, rol: u.rol }); 
    };

    const cancelarEdicion = () => {
        setEditando(null);
        setEditado({});
    };
    
    const obtenerHistorial = (userId) => {
        return ordenes.filter((o) => o.userId === userId);
    };

    // --- Renderizado ---

    if (cargando) return <div style={styles.container}>Cargando datos del administrador...</div>;
    if (error) return <div style={{...styles.container, color: '#e74c3c'}}>Error: {error}</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Gestión de Usuarios</h1>

            {error && <p style={styles.errorMessage}>Error: {error}</p>}
            {cargando && <p style={styles.loadingMessage}>Cargando/Procesando...</p>}

            {/* ✅ CONTENEDOR PRINCIPAL HORIZONTAL (50/50) */}
            <div style={styles.mainContentFlex}>

                {/* 1. ➕ FORMULARIO DE CREACIÓN (Izquierda - 35%) */}
                <div style={styles.formColumn}>
                    <div style={styles.crear}>
                        <h3>Crear nuevo usuario</h3>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={nuevoUsuario.nombre}
                            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
                            style={styles.input}
                        />
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={nuevoUsuario.email}
                            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
                            style={styles.input}
                        />
                        <button onClick={handleCrear} style={styles.btnCrear} disabled={cargando}>
                            Agregar usuario
                        </button>
                    </div>
                </div>

                {/* 2. 📋 LISTA DE USUARIOS Y HISTORIAL (Derecha - 65%) */}
                <div style={styles.listColumn}>
                    <h3 style={{ marginBottom: "15px" }}>Lista de Usuarios ({usuarios.length})</h3>

                    {/* Encabezado de la Lista */}
                    <div style={styles.listHeader}>
                        <div style={{width: '40%'}}>Usuario / Correo</div>
                        <div style={{width: '15%'}}>Rol</div>
                        <div style={{width: '25%'}}>Historial</div>
                        <div style={{width: '20%'}}>Acciones</div>
                    </div>

                    {/* Lista de Usuarios */}
                    {usuarios.length === 0 ? (
                        !cargando && <p>No hay usuarios registrados.</p>
                    ) : (
                        <ul style={styles.lista}>
                            {usuarios.map((u) => {
                                const historial = obtenerHistorial(u.id);
                                return (
                                <li key={u.id} style={styles.usuario}>
                                    
                                    {/* Fila de Usuario */}
                                    {editando === u.id ? (
                                        // Estado de Edición (Horizontalmente Ajustado)
                                        <div style={styles.editRow}>
                                            <div style={{width: '40%'}}>
                                                <input 
                                                    type="text" 
                                                    value={editado.nombre} 
                                                    onChange={(e) => setEditado({ ...editado, nombre: e.target.value })} 
                                                    style={styles.editInput} 
                                                    placeholder="Nombre"
                                                />
                                            </div>
                                            <div style={{width: '15%'}}>
                                                <input 
                                                    type="text" 
                                                    value={editado.rol} 
                                                    onChange={(e) => setEditado({ ...editado, rol: e.target.value.toUpperCase() })} 
                                                    style={styles.editInput} 
                                                    placeholder="ROL"
                                                />
                                            </div>
                                            <div style={{...styles.userHistory, ...styles.editActions}}>
                                                <button onClick={handleGuardarEdicion} style={styles.saveBtn}>Guardar</button>
                                                <button onClick={cancelarEdicion} style={styles.cancelBtn}>Cancelar</button>
                                            </div>
                                        </div>
                                    ) : (
                                        // Estado Normal (Fila Horizontal)
                                        <div style={styles.userRow}>
                                            <div style={styles.userInfo}>
                                                <b>{u.nombre}</b><br/>
                                                <span style={{color: '#999', fontSize: '0.9rem'}}>{u.email}</span>
                                            </div>
                                            <div style={styles.userRole}>{u.rol}</div>
                                            <div style={styles.userHistory}>
                                                {historial.length} compra{historial.length !== 1 ? 's' : ''}
                                            </div>
                                            <div style={styles.userActions}>
                                                <button onClick={() => iniciarEdicion(u)} style={styles.btnEditar}>Editar</button>
                                                <button onClick={() => handleEliminar(u.id)} style={styles.btnEliminar}>Eliminar</button>
                                            </div>
                                        </div>
                                    )}
                                    {/* Historial Detallado */}
                                    {historial.length > 0 && !editando && (
                                        <details style={styles.historialDetails}>
                                            <summary>Ver Historial de {historial.length} Compras</summary>
                                            <HistorialCompras userId={u.id} ordenes={ordenes} />
                                        </details>
                                    )}
                                </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

// Componente para renderizar el historial 
const HistorialCompras = ({ userId, ordenes }) => {
    const historial = ordenes.filter(o => o.userId === userId);
    
    if (historial.length === 0) {
        return <p style={{ color: "#888" }}>Sin compras registradas.</p>;
    }

    return (
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '8px' }}>
            {historial.map((c) => (
                <li key={c.id} style={styles.compra}>
                    <p style={{ margin: '0' }}>
                        <b>Orden #{c.id}</b> — Total: ${c.total?.toLocaleString("es-CL") ?? 0}
                    </p>
                    <details style={{ marginTop: "4px", marginLeft: '10px' }}>
                        <summary>Productos ({c.items?.length || 0})</summary>
                        <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
                            {c.items?.map((item, idx) => (
                                <li key={idx} style={{fontSize: '0.9rem', color: '#ccc'}}>
                                    {item.marcaModelo} x {item.cantidad}
                                </li>
                            ))}
                        </ul>
                    </details>
                </li>
            ))}
        </ul>
    );
};


const styles = {
    // ✅ AJUSTES DE COLUMNAS PRINCIPALES
    container: { padding: "30px", maxWidth: "95%", margin: "auto", color: '#fff' },
    title: { textAlign: "center", marginBottom: "20px" },
    
    // ✅ CONTENEDOR FLEX PRINCIPAL
    mainContentFlex: {
        display: 'flex',
        gap: '30px', 
        alignItems: 'flex-start',
    },
    // COLUMNA IZQUIERDA (Formulario)
    formColumn: {
        flex: '0 0 35%', // 35% para el formulario
        maxWidth: '35%',
        paddingTop: '38px', // Ajusta para alinear la parte superior con el título de la lista
    },
    // COLUMNA DERECHA (Lista)
    listColumn: {
        flex: '1 1 65%', // 65% para la lista (ocupa el resto)
        minWidth: '500px',
    },
    // --- Estilos de Formulario y Lista ---
    crear: { background: "#2a2a3d", padding: '15px', borderRadius: '8px' },
    input: {
        display: "block",
        width: "100%",
        margin: "5px 0",
        padding: "8px",
        borderRadius: "6px",
        border: "1px solid #444",
        backgroundColor: "#3a3a4d",
        color: "#fff",
    },
    btnCrear: {
        background: "#4a8ef0",
        color: "#fff",
        border: "none",
        padding: "8px 15px",
        borderRadius: "6px",
        cursor: "pointer",
        marginTop: '10px'
    },
    // --- LISTA Y FILA HORIZONTAL ---
    listHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 15px',
        marginBottom: '10px',
        color: '#adb5bd',
        fontWeight: 'bold',
        borderBottom: '1px solid #444',
        paddingBottom: '5px'
    },
    lista: { listStyle: "none", padding: 0 },
    usuario: {
        background: "#1e1e2f",
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "10px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
    },
    userRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '10px',
        paddingBottom: '10px',
        borderBottom: '1px solid #333'
    },
    userInfo: { width: '40%', wordBreak: 'break-word' },
    userRole: { width: '15%', fontWeight: 'bold', color: '#2ecc71', textAlign: 'left' },
    userHistory: { width: '25%', color: '#f1c40f', fontSize: '0.9rem', textAlign: 'center' },
    userActions: { display: 'flex', gap: '8px', width: '20%', justifyContent: 'flex-end' },
    // --- ESTILOS DE EDICIÓN ---
    editRow: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
        paddingBottom: '10px',
        gap: '10px'
    },
    editInput: {
        padding: "6px",
        borderRadius: "6px",
        backgroundColor: "#333",
        color: "#fff",
        border: "1px solid #555",
        width: '100%', 
        flexGrow: 1,
        marginRight: '8px'
    },
    editActions: { display: 'flex', gap: '8px' },
    // --- OTROS ESTILOS ---
    btnEditar: {
        background: "#f1c40f",
        border: "none",
        padding: "6px 12px",
        borderRadius: "6px",
        cursor: "pointer",
    },
    btnEliminar: {
        background: "#e74c3c",
        border: "none",
        padding: "6px 12px",
        borderRadius: "6px",
        color: "#fff",
        cursor: "pointer",
    },
    saveBtn: {
        background: "#2ecc71",
        border: "none",
        padding: "6px 12px",
        borderRadius: "6px",
        color: "white",
        cursor: "pointer",
    },
    cancelBtn: {
        background: "#555",
        border: "none",
        padding: "6px 12px",
        borderRadius: "6px",
        color: "white",
        cursor: "pointer",
        marginLeft: '5px'
    },
    historialDetails: { 
        marginTop: "10px", 
        borderTop: "1px dashed #333", 
        paddingTop: "10px" 
    },
    compra: {
        background: "#2a2a3d",
        padding: "8px",
        borderRadius: "6px",
        marginBottom: "6px",
        border: "1px solid #444",
        listStyleType: 'none',
        fontSize: '0.95rem'
    },
};