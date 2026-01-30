import jwt from 'jsonwebtoken'

export const authRequired = (req, res, next) => {
    const { token } = req.cookies   // recuperamos el token de las cookies del FRONTEND gracias a cookieParser
    console.log('token', token)

    if (!token) {
        res.clearCookie('isLoggedIn')
        console.log('isLoggedIn KO')
        return res.status(401).json({ message: "No token authorization, access denied" })
    }
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" })
        req.user = user
        next()
    })
}