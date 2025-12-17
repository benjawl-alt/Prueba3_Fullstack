import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";


import { ORDENES_API_URL, CARRITO_API_URL } from "../config";

const Comprobante_pago = () => {
    const { vaciarCarrito, usuario } = useContext(CarritoContext);
    const navigate = useNavigate();

    const [carrito, setCarrito] = useState([]);
    const [datosEntrega, setDatosEntrega] = useState({});
    const [total, setTotal] = useState(0);
    const [fechaCompra, setFechaCompra] = useState("");
    const [idCompra, setIdCompra] = useState("");

    
    useEffect(() => {
        const newIdCompra = Date.now().toString(36).toUpperCase();
        const newFecha = new Date().toLocaleDateString("es-CL", {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });

        const carritoGuardado = JSON.parse(sessionStorage.getItem("currentCartItems")) || [];
        const totalGuardado = Number(sessionStorage.getItem("currentCartTotal")) || 0;
        const datosEntrega = JSON.parse(sessionStorage.getItem("datosEntrega")) || {};

        setCarrito(carritoGuardado);
        setTotal(totalGuardado);
        setDatosEntrega(datosEntrega);
        setFechaCompra(newFecha);
        setIdCompra(newIdCompra);
        
        if (carritoGuardado.length === 0 || totalGuardado === 0) {
            navigate("/", { replace: true });
        }
    }, [navigate]);

    
    const handleVolverInicio = async () => { 
        const userId = usuario?.id;
        
        if (carrito.length === 0 || total === 0) {
            navigate("/");
            return;
        }
        
        
        const nuevaOrden = {
            userId: userId, 
            nombreCliente: (datosEntrega.nombre || "") + " " + (datosEntrega.apellido || ""), 
            correoCliente: datosEntrega.correo,
            total: total,
            
            
            items: carrito.map((item) => ({
                autoId: item.id, 
                marcaModelo: item.marca + " " + item.modelo, 
                precioUnitario: item.precio,
                cantidad: item.cantidad,
            })),
            
            
            calle: datosEntrega.calle,
            comuna: datosEntrega.comuna,
            region: datosEntrega.region,
        };

        try {
            
            await fetch(ORDENES_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevaOrden),
            });

            
            if (userId) {
                 await fetch(`${CARRITO_API_URL}/vaciar/${userId}`, { method: 'DELETE' });
            }
            
            
            sessionStorage.removeItem("currentCartItems");
            sessionStorage.removeItem("currentCartTotal");
            sessionStorage.removeItem("datosEntrega"); 
            if (vaciarCarrito) vaciarCarrito();
            
            
            navigate("/");

        } catch (error) {
            console.error("Fallo la transacción de compra:", error);
            navigate("/"); 
        }
    };
    
    if (carrito.length === 0) return null;

    return (
        <div style={styles.container}>
            <div style={styles.comprobante}>
                <h2 style={styles.title}>Comprobante de Pago</h2>
                <p style={styles.headerInfo}>
                    <b>N° de Transacción:</b> {idCompra}
                </p>
                <p style={styles.headerInfo}>
                    <b>Fecha:</b> {fechaCompra}
                </p>
                <hr style={styles.hr} />

                <h3 style={styles.sectionTitle}>Cliente</h3>
                <p style={styles.pCompact}>
                    <b>Nombre:</b> {datosEntrega.nombre} {datosEntrega.apellido}
                </p>
                <p style={styles.pCompact}>
                    <b>Correo:</b> {datosEntrega.correo}
                </p>
                <p style={styles.pCompact}>
                    Gracias por tu compra, <b>{usuario?.nombre || "Cliente"}</b>!
                </p>
                <hr style={styles.hr} />

                <h3 style={styles.sectionTitle}>Dirección de Entrega</h3>
                <p style={styles.pCompact}>
                    <b>Calle:</b> {datosEntrega.calle}, {datosEntrega.departamento}
                </p>
                <p style={styles.pCompact}>
                    <b>Comuna:</b> {datosEntrega.comuna}, {datosEntrega.region}
                </p>
                <p style={styles.pCompact}>
                    <b>Indicaciones:</b> {datosEntrega.indicaciones || "Ninguna"}
                </p>
                <hr style={styles.hr} />

                <h3 style={styles.sectionTitle}>Detalle de la Compra</h3>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={{...styles.th, width: '40%'}}>Producto</th>
                            <th style={{...styles.th, width: '25%'}}>Precio Unitario</th>
                            <th style={{...styles.th, width: '10%'}}>Cantidad</th>
                            <th style={{...styles.th, width: '25%'}}>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carrito.map((item, index) => (
                            <tr key={index}>
                                <td style={styles.tdNombre}>
                                    {item.marca} {item.modelo}
                                </td>
                                <td style={styles.td}>
                                    ${item.precio ? item.precio.toLocaleString("es-CL") : 0}
                                </td>
                                <td style={styles.td}>{item.cantidad}</td>
                                <td style={styles.td}>
                                    ${item.precio ? (item.precio * item.cantidad).toLocaleString("es-CL") : 0}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <hr style={styles.hrTotal} />

                <h3 style={styles.totalText}>
                    TOTAL PAGADO: ${total.toLocaleString("es-CL")}
                </h3>
            </div>

            <button style={styles.btnInicio} onClick={handleVolverInicio}>
                Volver al inicio
            </button>
        </div>
    );
};

const styles = {
    container: { 
        padding: "5px 30px 5px 30px", 
        textAlign: "center", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center" 
    },
    comprobante: {
        maxWidth: "800px",
        width: "100%",
        padding: "10px 20px 10px 20px", 
        backgroundColor: "#1c1d26",
        color: "#f8f9fa",
        border: "1px solid #444",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
        marginBottom: "5px", 
    },
    title: { 
        textAlign: "center", 
        color: "#f8f9fa",
        marginTop: '0', 
        marginBottom: "5px" 
    },
    headerInfo: { 
        fontSize: "0.9rem", 
        margin: "1px 0"
    },
    sectionTitle: {
        marginTop: "5px", 
        marginBottom: "3px", 
        color: "#adb5bd",
        borderBottom: "1px dashed #555",
        paddingBottom: "3px",
    },
    pCompact: { 
        margin: '1px 0',
        fontSize: '0.95rem'
    },
    hr: {
        border: "none",
        borderTop: "1px solid #444",
        margin: "5px 0", 
    },
    hrTotal: {
        border: "none",
        borderTop: "2px dashed #adb5bd",
        margin: "8px 0", 
    },
    table: { 
        width: "100%", 
        borderCollapse: "collapse", 
        marginTop: "5px",
        tableLayout: 'fixed',
    },
    th: {
        borderBottom: "1px solid #444",
        padding: "4px 5px", 
        textAlign: "left",
        backgroundColor: "#2c2f3d",
        fontSize: '0.9rem',
    },
    td: {
        borderBottom: "1px dotted #444",
        padding: "3px 5px", 
        textAlign: "left",
        whiteSpace: 'normal',
        wordWrap: 'break-word',
    },
    tdNombre: {
        borderBottom: "1px dotted #444",
        padding: "3px 5px", 
        textAlign: "left",
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        fontSize: '0.9rem',
        lineHeight: '1.2',
    },
    totalText: {
        textAlign: "right",
        color: "#2ecc71",
        fontSize: "1.5rem",
        marginTop: "8px", 
    },
    btnInicio: {
        backgroundColor: "#3498db",
        color: "white",
        border: "none",
        padding: "8px 18px",
        borderRadius: "8px",
        cursor: "pointer",
        marginTop: "8px", 
        marginBottom: '0', 
    },
};

export default Comprobante_pago;