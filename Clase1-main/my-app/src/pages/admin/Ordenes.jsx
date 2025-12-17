import React, { useEffect, useState } from "react";
import { ORDENES_API_URL} from "../../config";

export default function Ordenes() {
    const [ordenes, setOrdenes] = useState([]);
    const [detalle, setDetalle] = useState(null); 
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    
    const cargarOrdenes = async () => {
        setCargando(true);
        setError(null);
        try {
            const response = await fetch(ORDENES_API_URL);
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: Fallo al cargar las órdenes.`);
            }
            
            const data = await response.json();
            
            setOrdenes(data); 

        } catch (err) {
            console.error("Error al obtener órdenes:", err);
            setError("No se pudo conectar con el microservicio de Órdenes (8083).");
        } finally {
            setCargando(false);
        }
    };
    
    
    useEffect(() => {
        cargarOrdenes();
        
    }, []);

    const verDetalle = (orden) => {
        setDetalle(orden);
    };

    const cerrarDetalle = () => {
        setDetalle(null);
    };

    

    if (cargando) {
        return <div style={{ padding: "20px", color: "#fff" }}>Cargando historial de órdenes...</div>;
    }
    
    if (error) {
        return <div style={{ padding: "20px", color: "#e74c3c" }}>{error}</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Historial de Órdenes (Admin)</h1>

            {ordenes.length === 0 ? (
                <p>No hay órdenes registradas.</p>
            ) : (
                <div style={styles.listGrid}>
                    {ordenes.map((o) => (
                        <div key={o.id} style={styles.card}> 
                            <h3>Orden #{o.id}</h3>
                            <p style={styles.pCompact}>
                                <strong>Total:</strong>{" "}
                                ${o.total?.toLocaleString("es-CL") ?? 0}
                            </p>
                            <p style={styles.pCompact}>
                                <strong>Fecha:</strong> {new Date(o.fechaCompra).toLocaleDateString()}
                            </p>
                            <p style={styles.pCompact}>
                                <strong>Cliente:</strong> {o.nombreCliente}
                            </p>
                            <p style={styles.pCompact}>
                                <strong>Estado:</strong> <span style={o.estado === 'PENDIENTE' ? styles.statusPending : styles.statusComplete}>{o.estado}</span>
                            </p>
                            
                            <button
                                onClick={() => verDetalle(o)}
                                style={styles.detailBtn}
                            >
                                Ver detalle
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Detalle de la orden */}
            {detalle && (
                <div style={styles.modalBackdrop}>
                    <div style={styles.modalContent}>
                        <h2>Detalle de la Orden #{detalle.id}</h2>
                        <p><strong>Fecha:</strong> {new Date(detalle.fechaCompra).toLocaleString()}</p>
                        <p><strong>Cliente:</strong> {detalle.nombreCliente}</p>
                        <p><strong>Correo:</strong> {detalle.correoCliente}</p>
                        <p><strong>Dirección:</strong> {detalle.calle}, {detalle.comuna}</p>
                        <hr style={{margin: '10px 0', border: '1px solid #555'}}/>
                        
                        <h3>Productos:</h3>
                        <ul style={styles.itemList}>
                            {detalle.items?.map((item, idx) => (
                                <li key={idx} style={styles.item}>
                                    {item.marcaModelo} — Cantidad: {item.cantidad} (${item.precioUnitario?.toLocaleString("es-CL")})
                                </li>
                            ))}
                        </ul>
                        <hr style={{margin: '10px 0', border: '1px solid #555'}}/>
                        
                        <h3 style={{color: '#2ecc71'}}>Total Final: ${detalle.total?.toLocaleString("es-CL") ?? 0}</h3>

                        <button
                            onClick={cerrarDetalle}
                            style={styles.closeBtn}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { 
        padding: "20px", 
        color: "#fff", 
        // Aumentamos el maxWidth para darle más espacio si es necesario, aunque el 95% ya es grande
        maxWidth: "95%", 
        margin: "auto" 
    },
    title: { 
        marginBottom: "20px", 
        textAlign: "center" 
    },
    // ✅ CORRECCIÓN CLAVE: Forzamos la rejilla a 3 columnas (3xN)
    listGrid: { 
        display: "grid", 
        gridTemplateColumns: "repeat(3, 1fr)", // Fuerzas 3 columnas de igual ancho
        gap: "20px", 
        marginTop: '20px'
    },
    card: {
        border: "1px solid #444",
        borderRadius: "10px",
        padding: "15px",
        background: "#2c2c2c",
        boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
        // Ajuste interno para la altura
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%'
    },
    pCompact: {
        margin: '5px 0',
        fontSize: '0.95rem'
    },
    statusPending: {
        color: '#ffc107',
        fontWeight: 'bold'
    },
    statusComplete: {
        color: '#2ecc71',
        fontWeight: 'bold'
    },
    detailBtn: {
        background: "#4a8ef0",
        color: "white",
        border: "none",
        padding: "8px 12px",
        borderRadius: "5px",
        cursor: "pointer",
        marginTop: '10px'
    },
    // Modal Styles
    modalBackdrop: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modalContent: {
        background: "#1e1e2f", // Fondo oscuro para el modal
        padding: "25px",
        borderRadius: "10px",
        maxWidth: "600px",
        width: "90%",
        boxShadow: "0 5px 15px rgba(0,0,0,0.7)",
    },
    itemList: {
        listStyle: 'disc',
        paddingLeft: '20px',
        marginTop: '10px',
        maxHeight: '200px',
        overflowY: 'auto'
    },
    item: {
        marginBottom: '5px',
        fontSize: '0.9rem'
    },
    closeBtn: {
        marginTop: "15px",
        background: "#e74c3c",
        color: "white",
        border: "none",
        padding: "8px 12px",
        borderRadius: "5px",
        cursor: "pointer",
    },
};