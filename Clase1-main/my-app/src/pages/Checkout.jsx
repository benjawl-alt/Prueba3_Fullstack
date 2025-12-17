import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";

const Checkout = () => {
    const navigate = useNavigate();
    const { usuario } = useContext(CarritoContext); 

    const [form, setForm] = useState({
        nombre: "",
        correo: "",
        apellido: "",
        calle: "",
        departamento: "",
        region: "",
        comuna: "",
        indicaciones: "",
    });

    const [touched, setTouched] = useState({});
    const [total, setTotal] = useState(0);

    
    useEffect(() => {
        
        const totalGuardado = Number(sessionStorage.getItem("currentCartTotal")) || 0;
        
        setTotal(totalGuardado);
        
        
        setForm((prev) => ({
            ...prev,
            nombre: usuario?.nombre || "", 
            correo: usuario?.email || "",
        }));

        
        const datosEntregaPrevios = JSON.parse(sessionStorage.getItem("datosEntrega")) || {};
        if (datosEntregaPrevios.calle) {
             setForm(prev => ({
                ...prev,
                ...datosEntregaPrevios
            }));
        }

    }, [usuario]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched({ ...touched, [name]: true });
    };

    
    const handlePagar = (e) => {
        e.preventDefault();

        
        const camposObligatorios = ["apellido", "calle", "region", "comuna"];
        const faltantes = camposObligatorios.filter((campo) => !form[campo]?.trim());

        if (faltantes.length > 0) {
            const nuevosTouched = { ...touched };
            faltantes.forEach((campo) => (nuevosTouched[campo] = true));
            setTouched(nuevosTouched);
            return;
        }

        
        sessionStorage.setItem("datosEntrega", JSON.stringify(form));

        navigate("/comprobante");
    };

    const mostrarError = (campo, label) => {
        if (touched[campo] && !form[campo]?.trim()) {
            return <p style={styles.errorMsg}>{label} es obligatorio.</p>;
        }
        return null;
    };

    return (
        <div style={styles.container}>
            <h2>Carrito de compra</h2>
            <p>
                Total a pagar: <b>${parseInt(total).toLocaleString("es-CL")}</b>
            </p>

            <form onSubmit={handlePagar}>
                <h3>Información del cliente</h3>

                {/* Nombre y Apellido */}
                <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Nombre"
                    style={styles.input}
                    disabled={!!usuario?.nombre} 
                />

                <input
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Apellido *"
                    style={styles.input}
                />
                {mostrarError("apellido", "El apellido")}

                {/* Correo */}
                <input
                    name="correo"
                    type="email"
                    value={form.correo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Correo electrónico"
                    style={styles.input}
                    disabled={!!usuario?.email} // Deshabilitar si viene del Contexto
                />

                <h3>Dirección de entrega</h3>

                {/* Dirección */}
                <input
                    name="calle"
                    value={form.calle}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Calle *"
                    style={styles.input}
                />
                {mostrarError("calle", "La calle")}

                <input
                    name="departamento"
                    value={form.departamento}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Departamento (opcional)"
                    style={styles.input}
                />

                <input
                    name="region"
                    value={form.region}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Región *"
                    style={styles.input}
                />
                {mostrarError("region", "La región")}

                <input
                    name="comuna"
                    value={form.comuna}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Comuna *"
                    style={styles.input}
                />
                {mostrarError("comuna", "La comuna")}

                <textarea
                    name="indicaciones"
                    value={form.indicaciones}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Indicaciones para la entrega"
                    style={styles.textarea}
                />

                <button type="submit" style={styles.btnPagar}>
                    Pagar ahora ${parseInt(total).toLocaleString("es-CL")}
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: { padding: "30px", maxWidth: "500px", margin: "auto" },
    input: {
        width: "100%",
        padding: "10px",
        margin: "6px 0 0 0",
        borderRadius: "8px",
        border: "1px solid #ccc",
    },
    textarea: {
        width: "100%",
        padding: "10px",
        marginTop: "8px",
        borderRadius: "8px",
        border: "1px solid #ccc",
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
    errorMsg: {
        color: "#e74c3c",
        fontSize: "0.9rem",
        marginBottom: "5px",
        marginTop: "3px",
    },
};

export default Checkout;