import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { FaEye } from "react-icons/fa"
import { FaEyeSlash } from "react-icons/fa";

import { useAuth } from '../../context/auth/AuthContext'

const RegisterPage = () => {
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const { signup, isAuthenticated, errors: registerErrors, loading } = useAuth()
    const { register, handleSubmit, watch, setFocus, formState: { errors } } = useForm()
    const navigate = useNavigate()

    // Si el usuario está autenticado se redirige a Home
    useEffect(() => {
        if (isAuthenticated) navigate('/')
    }, [isAuthenticated])

    const onSubmit = handleSubmit((values) => {
        signup(values)  // AUTHCONTEXT FUNCTION
    })

    const password = watch("password");
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
                    // muestra errors de AUTHCONTEXT renombrados aquí como registerErrors, map porque puede ser una array de varios errores
                    registerErrors?.map((error, i) => (
                        <div className='authErrors' key={i}>
                            {error}
                        </div>
                    ))
                }

                <h1 className="authTitle">Register</h1>
                {/* noValidate evita que HTML valide el formulario impidiendo que muestre los mensajes propios del navegador como los de email */}
                <form onSubmit={onSubmit} noValidate>
                    <div className="input-container">
                        <input
                            type='text'
                            className='inputForm'
                            placeholder='Username'
                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                            {...register("username", { required: true })} // Validación de react-hook-form - "username" sustituye a name del input
                        />
                        <label htmlFor="username">Username{errors.username && (<span className='input-error'> : Username is required</span>)}</label>
                    </div>
                    <div className="input-container">
                        <input
                            type='email'
                            className='inputForm'
                            placeholder='Email'
                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: "Invalid email address"
                                }
                            })} // Validación de react-hook-form - "email" sustituye a name del input
                        />
                        <label htmlFor="email">Email some@domain.ext{errors.email && (<span className='input-error'> : {errors.email.message}</span>)}</label>
                    </div>
                    <div className="input-container">
                        <input
                            type='text'
                            className='inputForm'
                            placeholder='Name and Surname (Not required)'
                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                            {...register("fullName")} // Validación de react-hook-form - "fullName" sustituye a name del input
                        />
                        <label htmlFor="fullName">Name and Surname</label>
                    </div>
                    <hr />
                    <div className="flex input-container">
                        <input
                            type={mostrarPassword ? "text" : "password"}
                            className='inputForm'
                            placeholder='Password'
                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                            {...register("password", { required: true })} // Validación de react-hook-form - "password" sustituye a name del input
                        />
                        <label htmlFor="password">Password{errors.password && <span className='input-error'> : Password is required</span>}</label>
                        <button
                            onClick={togglePassword}
                            className="eyeButton">{mostrarPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <div className="input-container">
                        <input
                            type="password"
                            className='inputForm'
                            placeholder='Repeat password'
                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                            {...register("confirmPassword", {
                                required: "Confirmation is required",
                                validate: (value) => value === password || "Passwords don't match"
                            })} // Validación de react-hook-form - "confirmPassword" sustituye a name del input
                        />
                        <label htmlFor="confirmPassword">Repeat password{errors.confirmPassword && <span className='input-error'> : {errors.confirmPassword.message}</span>}</label>
                    </div>
                    <p className='authComment'>Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number</p>
                    <button type='submit' className='formButton'>Save</button>
                </form>
                <p className="authFoot">
                    Go into your account <Link to='/login' className="linkStyle-lg group" title='Login'>
                        Sing in
                        <span className="decoLinkStyle"></span>
                    </Link>
                </p>
            </div>
        </div>

    const jsxmlLoading =
        <div className="containerLoad">
            <div className="subContainerLoad">
                <h1 className="loadText">Loading...</h1>
            </div>
        </div>

    if (loading) {
        return jsxmlLoading
    }
    if (!isAuthenticated) {
        return jsxml
    }
}

export default RegisterPage