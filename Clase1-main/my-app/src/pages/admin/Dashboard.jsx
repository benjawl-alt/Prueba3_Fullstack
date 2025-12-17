import React, { useEffect, useState } from "react";
import "../../assets/admin.css";
import { ORDENES_API_URL,PRODUCTOS_API_URL, USUARIOS_API_URL} from "../../config";

export default function Dashboard() {
    const [stats, setStats] = useState({
        compras: 0,
        probabilidad: 0,
        productos: 0,
        inventario: 0,
        usuarios: 0,
        nuevosUsuarios: 0,
        crecimiento: 0,
        cargando: true,
    });

    const [mensajes, setMensajes] = useState([]);
    const [mostrarReportes, setMostrarReportes] = useState(false);

    
    const cargarEstadisticas = async () => {
        setStats(prev => ({ ...prev, cargando: true }));

        try {
            
            const [comprasResponse, productosResponse, usuariosResponse] = await Promise.all([
                fetch(ORDENES_API_URL),
                fetch(PRODUCTOS_API_URL),
                fetch(USUARIOS_API_URL),
            ]);

            const comprasData = await comprasResponse.json();
            const productosData = await productosResponse.json();
            const usuariosData = await usuariosResponse.json();

            
            const totalCompras = comprasData.reduce(
                (acc, compra) => acc + (compra.total || 0),
                0
            );
            const totalProductos = productosData.length;
            const totalUsuarios = usuariosData.length;

            
            const inventario = productosData.reduce(
                (acc, p) => acc + (p.stock || 0),
                0
            );

            
            const probabilidad = Math.floor(Math.random() * 50) + 10;
            const crecimiento = Math.floor(Math.random() * 40);
            const nuevosUsuarios = Math.floor(totalUsuarios / 4); // Simulación de nuevos usuarios

            setStats({
                compras: totalCompras,
                probabilidad,
                productos: totalProductos,
                inventario,
                usuarios: totalUsuarios,
                nuevosUsuarios,
                crecimiento,
                cargando: false,
            });

            
            setMensajes([]); 
            
        } catch (error) {
            console.error("Fallo al cargar estadísticas del administrador:", error);
            setStats(prev => ({ ...prev, cargando: false }));
        }
    };
    
    
    useEffect(() => {
        cargarEstadisticas();
    }, []);


    // --- Renderizado ---
    
    if (stats.cargando) {
        return (
            <div className="admin-dashboard" style={{padding: '50px', textAlign: 'center', color: 'white'}}>
                Cargando datos del Dashboard...
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <h1> Dashboard</h1>
            <p>Resumen general de tu tienda</p>

            {/*  AJUSTE CLAVE: Aplicaremos el diseño 2x2 a admin-cards vía CSS */}
            <div className="admin-cards" style={styles.grid2x2}> 
                
                {/* 1. Compras */}
                <div className="card blue">
                    <h3>Compras (Total Ingresos)</h3>
                    <p className="number">${stats.compras.toLocaleString("es-CL")}</p>
                    <p>Probabilidad de aumento: {stats.probabilidad}%</p>
                </div>

                {/* 2. Productos */}
                <div className="card green">
                    <h3>Productos</h3>
                    <p className="number">{stats.productos}</p>
                    <p>Inventario total: {stats.inventario}</p>
                </div>

                {/* 3. Usuarios */}
                <div className="card yellow">
                    <h3>Usuarios</h3>
                    <p className="number">{stats.usuarios}</p>
                    <p>Nuevos este mes: {stats.nuevosUsuarios}</p>
                </div>

                {/* 4. Crecimiento */}
                <div className="card purple">
                    <h3>Crecimiento</h3>
                    <p className="number">{stats.crecimiento}%</p>
                    <p>Comparado con el mes pasado</p>
                </div>
            </div>

            {/*  Botón para mostrar/ocultar reportes */}
            <div style={{ marginTop: "30px", textAlign: "center" }}>
                <button
                    className="btn-reportes"
                    onClick={() => setMostrarReportes(!mostrarReportes)}
                >
                    {mostrarReportes ? "Ocultar reportes" : "Ver reportes de contacto"}
                </button>
            </div>

            {/*  Sección de reportes */}
            {mostrarReportes && (
                <div className="reportes-container">
                    <h2>📨 Mensajes de contacto</h2>
                    {mensajes.length === 0 ? (
                        <p>No hay mensajes registrados.</p>
                    ) : (
                        <ul className="lista-mensajes">
                            {mensajes.map((m, i) => (
                                <li key={i} className="mensaje-card">
                                    <p><strong>📅 Fecha:</strong> {m.fecha}</p>
                                    <p><strong>👤 Nombre:</strong> {m.name}</p>
                                    <p><strong>📧 Correo:</strong> {m.email}</p>
                                    <p><strong>💬 Mensaje:</strong> {m.message}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}


const styles = {
    
    grid2x2: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '20px',
        width: '100%',
        marginTop: '20px'
    }
};