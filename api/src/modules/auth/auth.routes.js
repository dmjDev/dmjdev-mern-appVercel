import { Router } from 'express'

import multer from 'multer'
import fs from 'node:fs'
import path from 'node:path'

import { authRequired } from '../../middlewares/validateToken.js'
import { validateSchema } from '../../middlewares/validator.middleware.js'
import { login, register, updateUser, getProfile, updatePass, verifyToken, updateToken, logout } from './auth.controller.js'
import { registerSchema, loginSchema, updateUserSchema, updatePassSchema } from './auth.scheme.js'
import { processImage } from './auth.image.controller.js';
import { loginGoogle } from './auth.google.controller.js';

// Iniciamos las rutas EXPRESS
const router = Router()

// Definimos cada ruta según su METODO, con los param si se necesitan, los middlewares y la función que va a ejecutar al ser llamada la ruta
router.post('/register', validateSchema(registerSchema), register)
router.post('/login', validateSchema(loginSchema), login)
router.post('/loginGoogle', loginGoogle)
router.get('/profile/:id', authRequired, getProfile)
router.put('/profile/:id', authRequired, validateSchema(updateUserSchema), updateUser)
router.put('/profile/pass/:id', authRequired, validateSchema(updatePassSchema), updatePass)
router.get('/verify', verifyToken)
router.post('/updateToken', authRequired, updateToken)
router.post('/logout', logout)

// Middleware encargado de manejar los archivos enviados desde el FRONTEND de tipo multipart/form-data
// Se almacena el archivo en memoria
// Se genera con MULTER el upload, con la memoria del archivo y los filtros de validación necesarios
// Ejecutamos el enrutamiento aplicando MULTER como MIDDLEWARE
const storage = multer.memoryStorage()
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        // Validar extensiones permitidas antes de procesar
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/tiff']
        // console.log('tipo', file.mimetype)
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Unsupported file format. Please use JPG, PNG or TIF.'))
        }
    }
})
router.post('/upload', authRequired, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Errores propios de Multer (ej. archivo demasiado grande)
            return res.status(400).json({ message: `Multer Error: ${err.message}` })
        } else if (err) {
            // El error que lanzaste en fileFilter: "Unsupported file format..."
            return res.status(400).json({ message: err.message })
        }
        next()
    })
}, processImage)

// IMAGENES
// Erutamiento para la carga de imágenes de forma protegida desde el FRONTEND
router.get('/get-image/:filename', authRequired, (req, res) => {
    const { filename } = req.params
    const filePath = path.join(process.cwd(), 'uploads', 'avatar', filename)
    // console.log('Buscando archivo en:', filePath)

    // 1. Verificar si el archivo existe físicamente
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found' })
    }

    // 2. Forzar el envío como imagen
    // Esto cambia el Content-Type de text/html a image/jpeg
    res.type('image/jpeg')
    
    res.sendFile(filePath, (err) => {
        if (err) {
            // Si hay un error al enviar el archivo, evitamos enviar HTML
            if (!res.headersSent) {
                res.status(500).json({ message: 'File transfer error' })
            }
        }
    })
})



export default router
