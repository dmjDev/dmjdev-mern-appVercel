import { useState, useEffect, useRef } from "react"
import Cookies from 'js-cookie'

import { AuthContext } from './AuthContext'
import {
    registerRequest,
    loginRequest,
    loginGoogleRequest,
    getUserRequest,
    updateUserRequest,
    uploadImageRequest,
    updatePassRequest,
    verifyTokenRequest,
    logoutRequest,
    updateTokenRequest
} from '../../api/auth.routes'

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [errors, setErrors] = useState([])
    const [responseOkUser, setResponseOkUser] = useState(null)
    const [responseOkPass, setResponseOkPass] = useState(null)
    const [loading, setLoading] = useState(true)
    const [failLogin, setFailLogin] = useState(0)
    const [imgAvatar, setImgAvatar] = useState(null)
    const [progress, setProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const dialogRef = useRef(null)
    const timerRef = useRef(null)
    const timerTokenTime = useRef(null)
    const clicksRef = useRef(0)

    const TOKENTIME = (parseInt(import.meta.env.VITE_TOKENTIME) * 60 * 1000) - 15000
    const NUM_CLICS = (parseInt(import.meta.env.VITE_NUM_CLICS))
    const messageTimeOk = 3000
    const messageTimeError = 6000
    const barTime = 1000

    // Temporizador para cambiar el estado de errors, de esta forma una vez errors esté vacío de nuevo, los mensajes de error desaparecen
    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([])
            }, messageTimeError)
            return () => clearTimeout(timer)
        }
    }, [errors])

    useEffect(() => {
        async function checkLogin() {
            const cookies = Cookies.get()   // en el FRONTEND necesitamos js-cookie para leer las cookies del navegador
            // console.log(cookies)
            // Si no hay cookie todo null y false
            if (!cookies.isLoggedIn) {
                // console.log('no isLoggedIn')
                setUser(null)
                setLoading(false)
                setIsAuthenticated(false)
                return
            }

            // 
            try {
                // ejecutamos verifyToken de auth.controller en el BACKEND enviando la cookie token almacenada en el navegador
                // si ha ido todo bien jwt.verify devuelve los datos de usuario
                const res = await verifyTokenRequest()
                // si no devuelve los datos correctos todo null y false
                if (!res.data) {
                    setUser(null)
                    setLoading(false)
                    setIsAuthenticated(false)
                    return
                }
                // si devuelve los datos correctos los cargamos en USER, desactivamos loading y activamos isAuthenticated
                setUser(res.data)
                setLoading(false)
                setIsAuthenticated(true)
                return
            } catch (error) {
                setUser(null)
                setLoading(false)
                setIsAuthenticated(false)
                return
            }
        }
        checkLogin()
    }, [])

    // RENOVACION TOKEN O CIERRE DE SESION POR INACTIVIDAD
    // Detector de CLIC para reiniciar con CERRARMODAL los temporizadores y el contador CLICKSREF en FRONTEND y la cookie TOKEN en BACKEND
    useEffect(() => {
        const handleContextClick = (event) => {
            if (isAuthenticated) {
                // console.log("Clic detectado en:", event.clientX, event.clientY)
                clicksRef.current += 1
                // console.log(clicksRef)
                if (clicksRef.current === NUM_CLICS) {  // Número de clics que hay que hacer antes de que vuelva a reiniciar temporizador y TOKEN
                    cerrarModal()
                }
            }
        }
        window.addEventListener('click', handleContextClick)
        // Limpiar el evento al desmontar para evitar fugas de memoria
        return () => {
            window.removeEventListener('click', handleContextClick)
        }
    }, [isAuthenticated])
    const iniciarTemporizador = () => {
        console.log(`In ${TOKENTIME} miliseconds session will be closed`)
        timerTokenTime.current = setTimeout(() => {
            // Accede a través de .current (nunca será null si el componente está montado)
            if (dialogRef.current) {
                dialogRef.current.showModal()

                timerRef.current = setTimeout(() => {
                    if (dialogRef.current?.open) {
                        dialogRef.current.close()
                        clicksRef.current = 0
                        logout()
                        // console.log("clicksRef:", clicksRef.current)
                        console.log("Session closed")
                    }
                    if (timerRef.current) clearTimeout(timerRef.current)
                }, 10000)
            }

            if (timerTokenTime.current) clearTimeout(timerTokenTime.current)
        }, TOKENTIME)
    }
    const cerrarModal = async () => {
        if (dialogRef.current) dialogRef.current.close()
        if (timerRef.current) clearTimeout(timerRef.current)
        if (timerTokenTime.current) clearTimeout(timerTokenTime.current)
        try {
            const res = await updateTokenRequest()  // ejecuta UPDATETOKEN en AUTH.CONTROLLER en BACKEND a traves de la ruta post('/updateToken')
            // console.log(res)
            clicksRef.current = 0
            iniciarTemporizador()
            // console.log("clicksRef:", clicksRef.current)
        } catch (error) {
            console.log('Update TOKEN ERROR:', error.response.data)
        }
    }

    // REGISTER
    const signup = async (user) => {
        try {
            const res = await registerRequest(user) // ejecuta la función REGISTER de AUTH.CONTROLER en el BACKEND y devuelve los datos de usuario
            // console.log('register', res.data)
            setUser(res.data)
            setIsAuthenticated(true)
            setErrors([])
            iniciarTemporizador()
        } catch (error) {
            // console.log('Register ERROR:', error.response.data)
            setErrors(error.response.data)
        }
    }

    // LOGIN
    const signin = async (user) => {
        try {
            const res = await loginRequest(user) // ejecuta la función LOGIN de AUTH.CONTROLER en el BACKEND y devuelve los datos de usuario
            // console.log('login', res.data)
            setUser(res.data)
            setIsAuthenticated(true)
            setErrors([])
            iniciarTemporizador()
        } catch (error) {
            if (Array.isArray(error.response.data) && error.response.data.length > 0) {
                // console.log('error Singin', error.response.data)
                setErrors(error.response.data)
            } else if (error.response.data.failLogin) {
                const message = error.response.data.message
                const failLogin = error.response.data.failLogin
                // console.log('failLogin', message, failLogin)
                setErrors([message])
                setFailLogin(failLogin)
            }
        }
    }
    const signinGoogle = async (googleToken) => {
        try {
            // ejecuta la función LOGIN de AUTH.CONTROLER en el BACKEND y devuelve los datos de usuario
            const res = await loginGoogleRequest(googleToken)
            // console.log('VUELTA->loginGoogle', res.data)
            setUser(res.data)
            setIsAuthenticated(true)
            setErrors([])
            iniciarTemporizador()
        } catch (error) {
            const message = error.response.data.message
            console.log("ERROR Google login: ", error)
            setErrors([message])
        }
    }

    const getUser = async (id) => {
        try {
            const res = await getUserRequest(id) // ejecuta la función GETPROFILE de AUTH.CONTROLER en el BACKEND y devuelve los datos de usuario y el nombre del ROL que tiene asignado
            return res.data
        } catch (error) {
            console.log(error)
        }
    }

    const updateUser = async (user) => {
        try {
            // ejecuta la funcion UPDATEUSER de AUTH.CONTROLER en el BACKEND, modifica únicamente los siguientes campos {email, company, fullName, phone, username}, verifica que el nuevo email no existe y devuelve el nuevo usuario
            const res = await updateUserRequest(user._id, user)
            // console.log(res.data)

            // Se actualiza USER únicamente con los campos modificados
            setUser((user) => ({
                ...user,
                username: res.data.username,
                email: res.data.email,
                fullName: res.data.fullName,
                phone: res.data.phone,
                company: res.data.company,
            }))
            setErrors([])
            setResponseOkUser('User updated succefully')
            setTimeout(() => { setResponseOkUser(null) }, messageTimeOk)
        } catch (error) {
            setErrors(error.response.data)
            // console.log('failUpate User', error.response.data)
        }
    }

    const uploadImage = async (formData) => {
        setProgress(0)
        setIsUploading(true)

        try {
            // ejecuta la función PROCESSIMAGE de AUTH.IMAGE.CONTROLLER en el BACKEND una vez cargada la imagen en el BACKEND
            await uploadImageRequest(formData, (percent) => {   // uploadImageRequest detiene el flujo del programa hasta tener un percent de 100
                setProgress(percent);
            })
            // Resetea el progreso
            setTimeout(() => setIsUploading(false), barTime)

            // Definimos la url de imgAvatar
            const timestamp = Date.now()
            setImgAvatar(`${user.id}.jpg?${timestamp}`) // cambio de estado de imgAvatar mediante ProtectedImage
            setErrors([])
        } catch (error) {
            const serverMessage = error.response?.data?.message || "Error desconocido"
            setIsUploading(false)
            setErrors([serverMessage])
        }
    }

    const updatePass = async (passData) => {
        if (passData.currentPass != '' && passData.newPass != '') {
            if (passData.currentPass != passData.newPass) {
                try {
                    // ejecuta la función UPDATEPASS de AUTH.CONTROLLER en el BACKEND, modifica el password y devuelve el usuario modificado
                    const res = await updatePassRequest(user.id, passData)
                    // console.log(res)

                    setErrors([])
                    setResponseOkPass('Password updated succefully')
                    setTimeout(() => { setResponseOkPass(null) }, messageTimeOk)
                } catch (error) {
                    setErrors(error.response.data)
                    // console.log('failUpate User', error.response.data)
                }
            } else {
                setErrors(['The new password must be different from the current one.'])
            }
        } else {
            setErrors(['You must insert the new password and the current one.'])
        }
    }

    const logout = async () => {
        try {
            // ejecuta la función LOGOUT de AUTH.CONTROLLER en el BACKEND, eliminando el token del navegador de forma segura
            const res = await logoutRequest()
            setIsAuthenticated(false)
            setUser(null)
            if (timerTokenTime.current) clearTimeout(timerTokenTime.current)
        } catch (error) {
            console.log('fail logout', error.response.data)
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            getUser,
            updateUser,
            updatePass,
            signup,
            signin,
            signinGoogle,
            logout,
            setLoading,
            uploadImage,
            setImgAvatar,
            progress, isUploading,
            imgAvatar,
            loading,
            isAuthenticated,
            errors,
            setErrors,
            failLogin,
            responseOkUser,
            responseOkPass
        }}>
            {children}

            <dialog // Cuadro de diálogo para el aviso de RENOVACION TOKEN O CIERRE DE SESION POR INACTIVIDAD
                ref={dialogRef}
                id="confirm-timer"
                className="rounded-2xl p-0 backdrop:bg-black/50 bg-transparent border-none m-auto"
            >
                <div className="w-[90vw] max-w-md rounded-2xl p-6 bg-zinc-800 text-white shadow-2xl">
                    <h2 className="text-xl font-semibold mb-4 border-b border-zinc-700 pb-2">Update TOKEN</h2>
                    <p className="pb-10 text-zinc-300">¿Are you still there? The session will close shortly.</p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={cerrarModal}
                            className="px-4 py-2 rounded-lg bg-cyan-700 text-white hover:bg-cyan-500 transition-colors cursor-pointer"
                        >
                            GO
                        </button>
                    </div>
                </div>
            </dialog>
        </AuthContext.Provider>
    )
}