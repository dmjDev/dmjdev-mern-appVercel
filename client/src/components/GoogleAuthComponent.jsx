import { useState } from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'

import { useAuth } from "../context/auth/AuthContext"

const GoogleAuthComponent = () => {
    const { signinGoogle } = useAuth()
    const [googleError, setGoogleError] = useState(null)

    const GOOGLE_CID = import.meta.env.VITE_GOOGLE_CLIENT_ID

    const handleSuccess = (credentialResponse) => {
        try {
            signinGoogle({ token: credentialResponse.credential })
        } catch (err) {
            console.googleError('Error en la petición con Axios:', err)
            setGoogleError('Error al conectar con el servidor o token inválido.')
        }
    }

    const handleFailure = () => {
        setGoogleError('Error en la comunicación con Google.')
    }

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CID}>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                {
                    <>
                        <GoogleLogin
                            theme="filled_black" // Opciones: 'outline', 'filled_blue', 'filled_black'
                            size="medium"        // Opciones: 'small', 'medium', 'large'
                            shape="pill"        // Opciones: 'rectangular', 'pill', 'circle', 'square'
                            width="250"         // Ancho en píxeles (mínimo 200px)
                            text="continue_with"  // Opciones: 'signup_with', 'continue_with', etc.
                            locale="EN"
                            onSuccess={handleSuccess}
                            onError={handleFailure}
                            useOneTap
                        />
                        {googleError && <p style={{ color: 'red' }}>{googleError}</p>}
                    </>
                }
            </div>
        </GoogleOAuthProvider>
    )
}

export default GoogleAuthComponent
