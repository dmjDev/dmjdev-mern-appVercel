import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

import User from './user.model.js'
import Roles from './roles.model.js'
import { createAccessToken } from '../../libs/jwt.js'

const TOKENTIME = parseInt(process.env.TOKENTIME, 10) * 60 * 1000 // Minutos de vida del token

// Registro de usuario -> se ejecuta al hacer la llamada a ONSUBMIT de REGISTERPAGE en el FRONTEND -> a través de router.post('/register'
export const register = async (req, res) => {
    const { username, email, fullName, password } = req.body    // Recuperamos a través de REQ.BODY los datos del formulario FRONTEND
    const clientIp = req.ip // Recuperamos a traves de REQ.IP la IP proveniente del FRONTEND de forma segura al utilizar set('trust proxy' en APP
    const ahora = new Date();
    const dia = ahora.getDate();
    const mes = ahora.getMonth() + 1;
    const año = ahora.getFullYear();
    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    const segundos = ahora.getSeconds().toString().padStart(2, '0');
    const fecha = `${dia}/${mes}/${año}-${horas}:${minutos}:${segundos}`;
    // CLIENTIP_TOUP añade con cada registro la Ip de conexión y la fecha
    const clientIp_toUp = `${clientIp}-${fecha}`

    try {
        const userFound = await User.findOne({ email }) // si el email introducido está en la base de datos NO seguimos con el registro
        if (userFound) return res.status(400).json(["Looks like you already have an account! \n Sign in to start."])

        const passwordHash = await bcrypt.hash(password, 10)    // encriptamos el password
        const newUser = new User({  // montamos el userSchema de MONGOOSE
            username,
            email,
            password: passwordHash,
            fullName,
            phone: '',
            company: '',
            userRol: 1,
            failLogin: 0,
            isActive: true,
            clientIp: clientIp_toUp
        })
        const userSaved = await newUser.save()  // Guardamos los datos con MONGOOSE
        const token = await createAccessToken({ id: userSaved._id })    // utilizamos jwt para crear un nuevo token en libs/jwt.js
        res.cookie('token', token, {    // añadimos a nuestra respuesta hacia el FRONTEND el token generado
            httpOnly: true, // El navegador no puede acceder vía JS (previene XSS)
            secure: true,   // Solo se envía por HTTPS
            sameSite: 'strict', // strict - Previene ataques CSRF
            maxAge: TOKENTIME
        })
        res.cookie('isLoggedIn', 'true')
        res.json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            fullName: userSaved.fullName,
            phone: userSaved.phone,
            company: userSaved.company,
            userRol: userSaved.userRol,
            failLogin: userSaved.failLogin,
            isActive: userSaved.isActive,
            clientIp: userSaved.clientIp,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const login = async (req, res) => {
    const { email, password, failCode } = req.body
    let failCodeGet = failCode  // Parámetro failCode enviado desde LoginPage.jsx donde llega como valor GET, si no existe es null. FailCode viene dado por el email de recuperación de cuenta al hacer varios intentos y quedar bloqueada

    try {
        const userFound = await User.findOne({ email }) // si el email introducido no está en la base de datos NO seguimos con el login
        if (!userFound) return res.status(400).json(["User not found - (dev)serverEmail"])

        // si el usuario no está activo NO seguimos con el login
        if (!userFound.isActive) return res.status(403).json(["Unauthorized user, please contact the Administrator"])

        // Si el valor de FAILCODEGET no es null y coincide con el valor en DB de este usuario, lo ponemos a 0 y seguimos permitiendo 6 nuevos intentos de login
        if (failCodeGet != null && userFound.failLogin == failCodeGet) {
            await User.updateOne(
                { _id: userFound._id },
                { $set: { failLogin: 0 } }
            )
            userFound.failLogin = 0
            failCodeGet = null
        }

        // si FAILLOGIN es mayor a 5 NO seguimos con el login 
        if (userFound.failLogin <= 5) {
            const isMatch = await bcrypt.compare(password, userFound.password)  // comparamos el password enviado con el de la base de datos
            // si los password no coincide NO seguimos con el login sumando 1 a FAILLOGIN o dándole un valor random si es el sexto intento
            if (!isMatch) {
                if (userFound.failLogin == 5) {
                    const rand = Math.floor(Math.random() * (999999999 - 999 + 1)) + 999
                    // await enviarEmail(userFound.email, userFound._id, userFound.username, rand)  // Descomentar en producción
                    await User.updateOne(
                        { _id: userFound._id },
                        { $set: { failLogin: rand } }
                    )
                } else {
                    await User.updateOne(
                        { _id: userFound._id },
                        { $inc: { failLogin: 1 } } // Suma 1 al valor que ya exista en la base de datos
                    )
                }

                return res.status(400).json(["User not found - (dev)serverPass"])
            }

            // Si el login se ha realizado y failLogin en la base de datos es diferente a 0 se pone a 0
            if (userFound.failLogin > 0) {
                await User.updateOne(
                    { _id: userFound._id },
                    { $set: { failLogin: 0 } }
                )
                userFound.failLogin = 0
            }
            // CLIENTIP_TOUP -> En cada login, se añade al final de la cadena de texto actual en base de datos CLIENTIP, la Ip de conexión y la fecha actual
            // Recuperamos a traves de REQ.IP la IP proveniente del FRONTEND de forma segura al utilizar set('trust proxy' en APP
            const clientIp = req.ip
            // Conseguimos la fecha en el formato deseado
            const ahora = new Date();
            const dia = ahora.getDate();
            const mes = ahora.getMonth() + 1;
            const año = ahora.getFullYear();
            const horas = ahora.getHours().toString().padStart(2, '0');
            const minutos = ahora.getMinutes().toString().padStart(2, '0');
            const segundos = ahora.getSeconds().toString().padStart(2, '0');
            const fecha = `${dia}/${mes}/${año}-${horas}:${minutos}:${segundos}`
            // A los datos contenidos en clientId de la base datos concatenamos la IP y la fecha obtenida
            const clientIp_toUp = `${userFound.clientIp} ${clientIp}-${fecha}`

            // Nos quedamos con los ultimos registros de clientIp para evitar que el string se haga demasiado grande
            let array_clientIp_toUp = clientIp_toUp.split(' ');
            const numMax = 10
            if (array_clientIp_toUp.length > numMax) {
                array_clientIp_toUp = array_clientIp_toUp.slice(-numMax);
            }
            let resultado_clientIp_toUp = array_clientIp_toUp.join(' ');

            await User.updateOne(
                { _id: userFound._id },
                { $set: { clientIp: resultado_clientIp_toUp } }
            )
            userFound.clientIp = resultado_clientIp_toUp

            // console.log('tk time', TOKENTIME)
            const token = await createAccessToken({ id: userFound._id }) // utilizamos jwt para crear un nuevo token en libs/jwt.js
            res.cookie('token', token, {    // añadimos a nuestra respuesta hacia el FRONTEND el token generado
                httpOnly: true, // El navegador no puede acceder vía JS (previene XSS)
                secure: true,   // Solo se envía por HTTPS
                sameSite: 'strict', // strict - Previene ataques CSRF
                maxAge: TOKENTIME
            })
            res.cookie('isLoggedIn', 'true')
            res.json({
                id: userFound._id,
                username: userFound.username,
                email: userFound.email,
                fullName: userFound.fullName,
                phone: userFound.phone,
                company: userFound.company,
                userRol: userFound.userRol,
                failLogin: userFound.failLogin,
                isActive: userFound.isActive,
                clientIp: userFound.clientIp,
                createdAt: userFound.createdAt,
                updatedAt: userFound.updatedAt
            })
        } else {
            return res.status(503).json({ message: 'Service Unavailable', failLogin: userFound.failLogin })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// Envío de email al usuario cuya cuenta a tenido 6 intentos de acceso erróneos
// Durante el sexto intento en LOGIN, el campo FAILLOGIN se actualiza con un código aleatorio CODIGOVERIFICACION
// El enlace de recuperación ejecuta LOGIN enviando el código de verificación de forma que si coincide con el que hay en la base de datos permite de nuevo el acceso si se introduce el password correctamente
const enviarEmail = async (emailDestino, id, username, codigoVerificacion) => {
    // console.log(process.env.EMAIL_APP, process.env.EMAIL_APP_PASS)
    // console.log(emailDestino, id, username, codigoVerificacion)
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465, // Usamos 465
        secure: true, // true para 465
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASS,
        },
    })

    const info = await transporter.sendMail({
        from: `"dmjDev MERN Login" <${process.env.EMAIL_APP}>`,
        to: emailDestino,
        subject: "Account Locked",
        // URL para la recuperación del acceso tras varios intentos fallidos de acceder con un email existente y passwords erróneas
        // codigoVerificacion es el número random asignado a failLogin de este email tras varios intentos fallidos
        html: `<h1>Hi ${username}</h1><p>Someone has tried to access your <b>dmjDev MERN Login</b> account unsuccessfully</p><a href="${process.env.URL_FRONTEND_NP}/login/${codigoVerificacion}">To login and unlock your account click here</a>`
    })

    console.log("Correo enviado con ID: ", info.messageId)
}

export const getProfile = async (req, res) => {
    try {
        const userFound = await User.findById(req.user.id)
        if (!userFound) return res.status(400).json({ message: "User not found" })
        const rolFound = await Roles.findOne({ rolCode: userFound.userRol })
        if (!rolFound) return res.status(400).json({ message: "User not found - Rol fail" })
        const data = { "user": userFound, "rol": rolFound }
        return res.json(data)
    } catch (error) {
        return res.status(404).json({ message: `User not found: ${error}` })
    }
}

export const updateUser = async (req, res) => {
    const { email, company, fullName, phone, username } = req.body
    const updateData = { email, company, fullName, phone, username }
    const userId = req.params.id

    try {
        // console.log(userId)
        // console.log(email, company, fullName, phone, username)
        const userFound = await User.findOne({ email })
        if (userFound && userFound._id != userId) return res.status(400).json(["Invalid email, please check your email address."])

        const newUser = await User.findByIdAndUpdate(userId, updateData, { new: true })
        if (!newUser) return res.status(404).json(["User not updated"])
        return res.json(newUser)
    } catch (error) {
        return res.status(404).json([`User not updated: ${error}`])
    }
}

export const updatePass = async (req, res) => {
    const { currentPass, newPass } = req.body
    const userId = req.params.id

    try {
        // Hay que verificar si el currentPass es realmente el password del usuario con id = userId con bcrypt.compare
        const userFound = await User.findById(userId)
        if (!userFound) return res.status(400).json(["There has been a problem, user data not found, please contact the administrator"])
        const isMatch = await bcrypt.compare(currentPass, userFound.password)
        if (!isMatch) return res.status(400).json(["Invalid Password"])

        // // Hay que insertar el newPass a ese usuario con id = userId encriptado con bcrypt.hash
        const passwordHash = await bcrypt.hash(newPass, 10)
        const newUser = await User.findByIdAndUpdate(userId, { password: passwordHash }, { new: true })
        if (!newUser) return res.status(404).json(["Password not updated"])
        return res.json(newUser)
    } catch (error) {
        return res.status(404).json([`Password not updated: ${error}`])
    }
}

export const logout = async (req, res) => {
    // Borra la cookie con las mismas opciones que fue creada
    try {
        const logoutTimer = setTimeout(() => {
            res.clearCookie('token', {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            })
            res.clearCookie('isLoggedIn')
            // Forzamos la eliminación de todas las cookies en el Frontend, únicamente funciona con HTTPS y en LOCALHOST
            res.setHeader('Clear-Site-Data', '"cookies", "storage", "cache"')
            res.status(200).json({ message: "Sesión cerrada" })
            clearTimeout(logoutTimer)
        }, 1000);
    } catch (error) {
        res.status(400).json({ message: `ERROR deleting cookies: ${error}` })
    }
}

export const updateToken = async (req, res) => {
    const { token } = req.cookies
    // console.log(token)
    // console.log('tk time', TOKENTIME)

    if (!token) {
        res.clearCookie('isLoggedIn')
        console.log('isLoggedIn KO')
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {
        // 1. Decodificamos el token actual (ignorando la expiración para poder renovarlo)
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET, { ignoreExpiration: true });

        // 2. Creamos un NUEVO token con el mismo payload pero nueva expiración
        // Eliminamos propiedades automáticas del payload anterior si existen
        const { iat, exp, ...payload } = decoded;
        const newToken = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: `${TOKENTIME}m` }); // Ajusta a tu TOKENTIME

        // 3. Enviamos la cookie y cerramos la respuesta
        res.cookie('token', newToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: TOKENTIME
        }).status(200).json({ message: "Token renovado" }); // ¡IMPORTANTE cerrar la respuesta!

    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
}

// VERIFICA EL TOKEN PARA ASEGURARSE QUE SE ESTÁ LOGUEADO CORRECTAMENTE, SUCEDE AL INTENTAR ACCEDER POR LA URL
export const verifyToken = async (req, res) => {
    const { token } = req.cookies // recuperamos el token de las cookies del FRONTEND gracias a cookieParser
    console.log('token', token)

    if (!token) {
        res.clearCookie('isLoggedIn')
        console.log('isLoggedIn KO')
        return res.status(401).json({ message: "Unauthorized" })
    }
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(401).json({ message: "Unauthorized" })
        const userFound = await User.findById(user.id)
        if (!userFound) return res.status(401).json({ message: "Unauthorized" })

        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            fullName: userFound.fullName,
            phone: userFound.phone,
            company: userFound.company,
            userRol: userFound.userRol,
            failLogin: userFound.failLogin,
            isActive: userFound.isActive,
            clientIp: userFound.clientIp,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt
        })
    })
}