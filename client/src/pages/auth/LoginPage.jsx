import { useEffect, useState } from "react"
import { useNavigate, Link, useParams } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { FaEye } from "react-icons/fa"
import { FaEyeSlash } from "react-icons/fa";

import { useAuth } from "../../context/auth/AuthContext"
import GoogleAuthComponent from "../../components/GoogleAuthComponent"

const LoginPage = () => {
    const { signin, isAuthenticated, errors: signinErrors, loading, failLogin } = useAuth()
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const { register, handleSubmit, setFocus, formState: { errors } } = useForm()
    const navigate = useNavigate()
    const params = useParams()

    // Si el usuario está autenticado se redirige a Home
    // Si el valor de estado actual ed mayor o igual a 5 se redirige a Home - durante el último intento de autenticación fallido se envió un email al email al que se han intentado autenticar 6 veces con uin código de desbloqueo
    useEffect(() => {
        if (isAuthenticated || failLogin >= 5) navigate('/')
    }, [isAuthenticated, failLogin])

    const onSubmit = handleSubmit((data) => {
        // Recoge el failCode enviado por el método GET si existe, dato enviado mediante GET desde enviarEmail en auth.controller.js
        // Lo adjuntamos al paquete de datos enviados a signin(data) del AuthContext
        params.failCode ? data.failCode = params.failCode : data.failCode = null
        signin(data) // AUTHCONTEXT FUNCTION
    })

    // Función para alternar el estado mostrarPassword
    const togglePassword = (e) => {
        e.preventDefault()
        setMostrarPassword(!mostrarPassword);
        setFocus('password')
    };

    const jsxml =
        <div className="containerAuth">
            <div className="subContainerAuth shadow-glow">
                {
                    // muestra errors de AUTHCONTEXT renombrados aquí como signinErrors, map porque puede ser una array de varios errores
                    signinErrors?.map((error, i) => (
                        <div className='authErrors' key={i}>
                            {error}
                        </div>
                    ))
                }
                <h1 className="authTitle">Login</h1>
                {/* noValidate evita que HTML valide el formulario impidiendo que muestre los mensajes propios del navegador como los de email */}
                <form onSubmit={onSubmit} noValidate>
                    <div className="input-container">
                        <input
                            type='email'
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: "Invalid email address"
                                }
                            })} // Validación de react-hook-form - "email" sustituye a name del input
                            className='inputForm'
                            placeholder='Email'
                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                        />
                        <label htmlFor="email">Email{errors.email && (<span className='input-error'> : {errors.email.message}</span>)}</label>
                    </div>
                    <div className="flex input-container">
                        <input
                            type={mostrarPassword ? "text" : "password"}
                            {...register("password", { required: true })} // Validación de react-hook-form - "password" sustituye a name del input
                            className='inputForm'
                            placeholder='Password'
                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                        />
                        <label htmlFor="password">Password{errors.password && <span className='input-error'> : Password is required</span>}</label>
                        <button
                            onClick={togglePassword}
                            className="eyeButton">{mostrarPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <button type='submit' className='formButton'>Go</button>
                </form>
                <p className="authFoot">
                    Create an account! <Link to='/register' className="linkStyle-lg group" title="Register">
                        Register
                        <span className="decoLinkStyle"></span>
                    </Link>
                </p>
                <GoogleAuthComponent />
            </div>
        </div>

    const jsxmlLoading =
        <div className="containerLoad">
            <div className="subContainerLoad">
                <h1 className="loadText">Loading...</h1>
            </div>
        </div>

    if (loading || failLogin >= 5) {
        return jsxmlLoading
    }
    if (!isAuthenticated) {
        return jsxml
    }
}

export default LoginPage