import React from "react";
import { Link } from "react-scroll";
import "../assets/styles.css"; 

export default function Inicio() {
  const youtubeEmbedId = "6GZJkofDm6o"; 
  
  // ✅ CORRECCIÓN: Usamos controls=0 y showinfo/modestbranding para limpiar la interfaz
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${youtubeEmbedId}?autoplay=1&mute=1&loop=1&playlist=${youtubeEmbedId}&controls=0&modestbranding=1&rel=0`;

  return (
    <>
      <section id="banner">
        
        <div style={styles.videoWrapper}>
            <div style={styles.videoResponsive}>
                <iframe
                    title="Video Cinemático de Autos"
                    width="100%"
                    height="100%"
                    src={youtubeEmbedUrl}
                    frameBorder="0"
                    allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={styles.iframeStyle}
                ></iframe>
            </div>
        </div>

        <div className="content">
          <header>
            <h2>Busca tu auto del futuro</h2>
            <p>El auto que buscas en un solo lugar, y te está esperando...</p>
          </header>
        </div>
        
        <Link
          to="one"
          className="goto-next scrolly"
          smooth={true}
          duration={800}
          role="button"
          tabIndex="0"
        >
          &#x2193;
        </Link>
      </section>
      
      {/* Las otras secciones se mantienen */}

      <section id="one" className="spotlight style1 bottom">
        <span className="image fit main"><img src="/assets/images/DSC_0108.jpg" alt="auto" /></span>
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-4 col-12-medium">
                <header>
                  <h2>Encuentra tu auto ideal con nosotros</h2>
                  <p>Ofrecemos una amplia selección de vehículos, desde autos compactos hasta modelos de lujo.</p>
                </header>
              </div>
              <div className="col-4 col-12-medium">
                <p>Variedad y opciones para todos los gustos. Desde coches eficientes hasta SUVs familiares.</p>
              </div>
              <div className="col-4 col-12-medium">
                <p>Cada auto es revisado por expertos y garantizado para tu seguridad y satisfacción.</p>
              </div>
            </div>
          </div>
        </div>
        <a href="#two" className="goto-next scrolly"></a>
      </section>

      <section id="two" className="spotlight style2 right">
        <span className="image fit main"><img src="/assets/images/64786f3d739a8300323b5f25.jpg" alt="" /></span>
        <div className="content">
          <header>
            <h2>Asesoramiento personalizado</h2>
            <p>Nuestro equipo de asesores está listo para ayudarte a elegir el vehículo perfecto según tus necesidades.</p>
          </header>
          <p>Te acompañamos en cada paso del proceso de compra y financiamiento.</p>
        </div>
        
      </section>

      <section id="videoCinematica" className="wrapper style1 special fade-up">
        <div className="container">
          <header className="major">
            <h2>Cinemática de Autos Deportivos</h2>
            <p>Disfruta de nuestra ultima adquisición</p>
          </header>
          <div className="video-container" style={{ textAlign: "center" }}>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/YAFUyPp_238?si=oSvgcR4yrkfpEXn2"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      <footer id="footer">
        <ul className="icons">
          <li><a href="#" className="icon brands alt fa-twitter"><span className="label">Twitter</span></a></li>
          <li><a href="#" className="icon brands alt fa-facebook-f"><span className="label">Facebook</span></a></li>
          <li><a href="#" className="icon brands alt fa-linkedin-in"><span className="label">LinkedIn</span></a></li>
          <li><a href="#" className="icon brands alt fa-instagram"><span className="label">Instagram</span></a></li>
        </ul>
        <ul className="copyright">
          <li>&copy; IgnaBen Motors. Todos los derechos reservados.</li>
        </ul>
      </footer>
    </>
  );
}

const styles = {
    // ESTILOS PARA EL CONTENEDOR PRINCIPAL DEL VIDEO (CUBRE LA PANTALLA)
    videoWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        zIndex: 0, 
    },
    videoResponsive: {
        position: 'relative',
        minHeight: '100%',
        minWidth: '100%',
    },
    iframeStyle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        // Asegura que cubra el 100% del viewport
        minWidth: '100vw',
        minHeight: '100vh',
        width: 'auto',
        height: 'auto',
        pointerEvents: 'none', 
    }
}