// src/apiConfig.js

// 🛑 IMPORTANTE:
// 1. Durante el desarrollo (en tu PC), USA: http://localhost
// 2. Antes de subir a AWS EC2, REEMPLAZA ESTE VALOR con la IP o DNS público de tu instancia EC2.

// Ejemplo para desarrollo (Tu PC):
const BASE_SERVER_IP = "http://localhost"; 

// Ejemplo para producción (AWS EC2):
// const BASE_SERVER_IP = "http://54.234.123.45"; // <--- Tu IP pública de EC2
// const BASE_SERVER_IP = "http://ec2-xxxxx.compute-1.amazonaws.com"; // <--- Tu DNS de EC2

// Exportamos las URLs completas de los microservicios
export const AUTOS_API_URL = `${BASE_SERVER_IP}:8080/api/autos`;
export const USUARIOS_API_URL = `${BASE_SERVER_IP}:8081/api/usuarios`;
export const CARRITO_API_URL = `${BASE_SERVER_IP}:8082/api/carrito`; 
export const ORDENES_API_URL = `${BASE_SERVER_IP}:8083/api/ordenes`;
export const LOGIN_API_URL = `${BASE_SERVER_IP}:8081/api/usuarios/login`;
export const REGISTER_API_URL = `${BASE_SERVER_IP}:8081/api/usuarios/registrar`;
export const PRODUCTOS_API_URL = `${BASE_SERVER_IP}:8080/api/autos`;

