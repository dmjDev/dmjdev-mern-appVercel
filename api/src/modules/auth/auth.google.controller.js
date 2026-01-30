import { OAuth2Client } from 'google-auth-library'
import bcrypt from 'bcryptjs'

import User from './user.model.js'
import { createAccessToken } from '../../libs/jwt.js'

const TOKENTIME = parseInt(process.env.TOKENTIME, 10) * 60 * 1000 // Minutos de vida del token

export const loginGoogle = async (req, res) => {
    const { token } = req.body // Aquí recibes el 'idToken' del frontend
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

    try {
        // VALIDACIÓN: Google verifica que el token es auténtico
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID, // Tu ID de cliente
        })

        // El payload contiene la información del usuario
        // AQUÍ ESTÁN LOS DATOS que vienen de Google
        // 'sub' es el ID único de Google para ese usuario (nunca cambia)
        const { email, name, picture, sub } = ticket.getPayload()
        const password = `Google${sub}`
        // console.log('Usuario verificado:', name, email, picture, sub)
        const clientIp = req.ip // Recuperamos a traves de REQ.IP la IP proveniente del FRONTEND de forma segura al utilizar set('trust proxy' en APP
        const ahora = new Date();
        const dia = ahora.getDate();
        const mes = ahora.getMonth() + 1;
        const año = ahora.getFullYear();
        const horas = ahora.getHours().toString().padStart(2, '0');
        const minutos = ahora.getMinutes().toString().padStart(2, '0');
        const segundos = ahora.getSeconds().toString().padStart(2, '0');
        const fecha = `${dia}/${mes}/${año}-${horas}:${minutos}:${segundos}`;

        const userFound = await User.findOne({ email })
        if (!userFound) {
            try {   // REGISTRO ############################################################################################################
                // CLIENTIP_TOUP añade con cada registro la Ip de conexión y la fecha
                const clientIp_toUp = `${clientIp}-${fecha}`
                const passwordHash = await bcrypt.hash(password, 10)    // encriptamos el password
                const newUser = new User({  // montamos el userSchema de MONGOOSE
                    username: name,
                    email,
                    password: passwordHash,
                    fullName: name,
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
                    sameSite: 'none', // strict - Previene ataques CSRF
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
        } else {  // LOGIN ############################################################################################################
            try {
                // si el usuario no está activo NO seguimos con el login
                if (!userFound.isActive) return res.status(403).json(["Unauthorized user, please contact the Administrator"])

                // Si el login se ha realizado y failLogin en la base de datos es diferente a 0 se pone a 0
                if (userFound.failLogin > 0) {
                    await User.updateOne(
                        { _id: userFound._id },
                        { $set: { failLogin: 0 } }
                    )
                    userFound.failLogin = 0
                }

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
                    sameSite: 'none', // strict - Previene ataques CSRF
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
            } catch (error) {
                return res.status(500).json({ message: error.message })
            }
        }
    } catch (error) {
        console.error('Error al verificar token:', error)
        res.status(401).json({ error: 'Token inválido' })
    }
}
