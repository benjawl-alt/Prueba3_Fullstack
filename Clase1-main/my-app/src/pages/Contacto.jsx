import React, { useState, useRef } from "react";

export default function Contacto() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [enviado, setEnviado] = useState(false);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, message } = formData;
    let newErrors = {};

    if (!name.trim()) newErrors.name = "Por favor, ingrese su nombre.";
    else if (name.length > 100)
      newErrors.name = "El nombre no puede superar los 100 caracteres.";

    if (!email.trim()) newErrors.email = "Por favor, ingrese su correo.";
    else if (email.length > 100)
      newErrors.email = "El correo no puede superar los 100 caracteres.";
    else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
      if (!emailRegex.test(email))
        newErrors.email =
          "El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.";
    }

    if (!message.trim()) newErrors.message = "Por favor, escriba un mensaje.";
    else if (message.length > 500)
      newErrors.message = "El mensaje no puede superar los 500 caracteres.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.name) nameRef.current.focus();
      else if (newErrors.email) emailRef.current.focus();
      else if (newErrors.message) messageRef.current.focus();
      return;
    }

    const mensajesGuardados = JSON.parse(localStorage.getItem("mensajesContacto")) || [];
mensajesGuardados.push({
  ...formData,
  fecha: new Date().toLocaleString("es-CL"),
});
localStorage.setItem("mensajesContacto", JSON.stringify(mensajesGuardados));

setEnviado(true);
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", message: "" });
    setErrors({});
    setEnviado(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.titulo}> Contacto</h2>
      <p style={styles.subtitulo}>
        Complete el formulario para comunicarse con nosotros.
      </p>

      {!enviado ? (
        <form onSubmit={handleSubmit} onReset={handleReset} style={styles.form}>
          {/* Nombre */}
          <div style={styles.field}>
            <label style={styles.label}>Nombre</label>
            <input
              ref={nameRef}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              maxLength="100"
              style={{
                ...styles.input,
                borderColor: errors.name ? "#ff5b5b" : "#555",
              }}
            />
            {errors.name && <p style={styles.error}>{errors.name}</p>}
          </div>

          {/* Correo */}
          <div style={styles.field}>
            <label style={styles.label}>Correo electrónico</label>
            <input
              ref={emailRef}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              maxLength="100"
              style={{
                ...styles.input,
                borderColor: errors.email ? "#ff5b5b" : "#555",
              }}
            />
            {errors.email && <p style={styles.error}>{errors.email}</p>}
          </div>

          {/* Mensaje */}
          <div style={styles.field}>
            <label style={styles.label}>Mensaje</label>
            <textarea
              ref={messageRef}
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              maxLength="500"
              style={{
                ...styles.textarea,
                borderColor: errors.message ? "#ff5b5b" : "#555",
              }}
            />
            {errors.message && <p style={styles.error}>{errors.message}</p>}
          </div>

          {/* Botones */}
          <div style={styles.actions}>
            <button type="submit" style={styles.btnPrimary}>
              Enviar
            </button>
            <button type="reset" style={styles.btnReset}>
              Borrar
            </button>
          </div>
        </form>
      ) : (
        <div style={styles.confirmacion}>
          <strong>Gracias, {formData.name}.</strong>
          <p>
            <strong>Correo:</strong> {formData.email}
            <br />
            <strong>Mensaje:</strong> {formData.message}
          </p>
          <small>Pronto nos pondremos en contacto contigo. </small>
          <br />
          <button onClick={handleReset} style={styles.btnVolver}>
            Enviar otro mensaje
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    background: "#2a2a3d",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
    color: "#fff",
    textAlign: "center",
  },
  titulo: {
    fontSize: "2rem",
    marginBottom: "10px",
    color: "#41b0e4",
  },
  subtitulo: {
    color: "#ccc",
    marginBottom: "30px",
  },
  form: {
    textAlign: "left",
  },
  field: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold",
    color: "#e0e0e0",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #555",
    background: "#1e1e2f",
    color: "#fff",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #555",
    background: "#1e1e2f",
    color: "#fff",
    outline: "none",
  },
  error: {
    color: "#ff5b5b",
    fontSize: "0.9rem",
    marginTop: "6px",
  },
  actions: {
    textAlign: "center",
    marginTop: "25px",
  },
  btnPrimary: {
    background: "#41b0e4",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#000",
    fontWeight: "bold",
    marginRight: "10px",
  },
  btnReset: {
    background: "#888",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#fff",
  },
  confirmacion: {
    backgroundColor: "#41b0e4",
    color: "#000",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(3, 3, 3, 0.3)",
  },
  btnVolver: {
    marginTop: "15px",
    background: "#2a2a3d",
    color: "#fff",
    border: "1px solid #000",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
