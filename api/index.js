import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import connectDB from './src/db.js'
// Conectamos con la base de datos MONGODB
connectDB()

// Desplegamos el servidor con EXPRESS
const app = express()
// Configuramos EXPRESS para que gestione el contenido de las cabeceras con acceso únicamente desde el FRONTEND asegurando en mayor medida la recuperación de una IP correcta en AUTH.CONTROLLER para el registro de la IP en la base de datos (REGISTER)
app.set('trust proxy', true)

// Indicamos los parámetros CORS para que EXPRESS de acceso al FRONTEND, además añadimos credenciales para que el servidor tenga acceso a las cookies del FRONTEND mediante cookieParser
app.use(cors({
    origin: "*",//process.env.URL_FRONTEND,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}))

// Inicializamos MORGAN en EXPRESS, bien para desarrollo o bien para producción, según la variable de entorno
if (process.env.NODE_ENV === 'production') {
    // 'combined' usa el formato estándar de Apache, ideal para herramientas de análisis
    app.use(morgan('combined'));
} else {
    // 'dev' para una depuración rápida durante el desarrollo
    app.use(morgan('dev'));
}
// Convierte la cadena de texto JSON (max.100Kb) del cuerpo de una solicitud en un objeto de JavaScript y la asigna a req.body para que puedas usarla fácilmente (ej. req.body.usuario). Se puede ampliar el tamaño de la información emitida mediante app.use(express.json({ limit: '1mb' }))
// Este middleware solo procesará la solicitud si el cliente envía el encabezado Content-Type: application/json
app.use(express.json())
// Middleware que permite a EXPRESS leer las cookies enviadas por el navegador del cliente -> const { token } = req.cookies
app.use(cookieParser())

// RUTAS AUTH
import authRoutes from './src/modules/auth/auth.routes.js'
app.use('/api', authRoutes)

// OTRAS RUTAS
import taskRoutes from './src/modules/tasks/tasks.routes.js'
app.use('/api', taskRoutes)

export default app

// Iniciamos el servidor EXPRESS - NO EN VERCEL
// app.listen(4000, () => {
//     console.log(`Server on port 4000`)
// })