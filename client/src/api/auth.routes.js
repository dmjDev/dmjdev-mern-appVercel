import axios from './_axios'

// Llamada de las rutas para la obtención de información o envío de datos según el método empleado (GET, POST, PUT, DELETE) hacia el BACKEND
// CONST -> Funciones llamadas desde AuthProvider dentro de las funciones que se ejecutan según la interacción del usuario con el FRONTEND
// = -> (parámetros recibidos desde la llamada en AuthProvider)
// => Método de AXIOS GET, POST, PUT, DELETE y (Ruta a enlazar con "auth.routes" del BACKEND y cómo se le pasan los parámetros anteriores)
export const registerRequest = (user) => axios.post('/register', user)
export const loginRequest = (user) => axios.post('/login', user)
export const loginGoogleRequest = (googleToken) => axios.post('/loginGoogle', googleToken)
export const getUserRequest = (id) => axios.get(`/profile/${id}`)
export const updateUserRequest = (id, user) => axios.put(`/profile/${id}`, user)
export const updatePassRequest = (id, passData) => axios.put(`/profile/pass/${id}`, passData)
export const uploadImageRequest = (formData, onProgress) => axios.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    // Opcional: Monitor de progreso (característica de Axios)
    onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        // Llamamos al callback con el valor actual
        if (onProgress) onProgress(percentCompleted) // Mientras esté cargando devuelve el valor del porcentaje a través de onProgress a AuthProvider
    }
})
export const verifyTokenRequest = () => axios.get('/verify')
export const updateTokenRequest = () => axios.post('/updateToken')
export const logoutRequest = () => axios.post('/logout')