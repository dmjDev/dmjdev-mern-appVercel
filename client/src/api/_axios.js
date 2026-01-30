import axios from "axios";

// Iniciamos una instancia de AXIOS para conectar mediante ROUTER con el BACKEND
// Activamos las credenciales para permitir el envío de cookies hacia el backend
const instance = axios.create({
    baseURL: `${import.meta.env.VITE_URL_BACKEND}/api`,
    withCredentials: true
})

// Interceptor para ver la URL completa antes de enviar la petición
instance.interceptors.request.use((config) => {
    // Combinamos la baseURL con la url relativa de la petición
    const fullURL = `${config.baseURL}${config.url}`;
    // console.log('🚀 Petición enviada a:', fullURL);
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default instance
