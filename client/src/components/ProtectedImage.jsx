import { useEffect, useState } from 'react'
import axios from 'axios'

const ProtectedImage = ({ filename, alt, className }) => {
    const [imageSrc, setImageSrc] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let objectUrl

        const fetchImage = async () => {
            try {
                // Hacemos la petición a la ruta que ya creaste en Express
                const response = await axios.get(`/api/get-image/${filename}`, {
                    responseType: 'blob', // OBLIGATORIO: recibir datos binarios
                    withCredentials: true // OBLIGATORIO: enviar cookies de sesión
                });
                // VALIDACIÓN CRÍTICA: Si el servidor envió HTML por error, el tipo del blob será text/html
                if (response.data.type === 'text/html') {
                    console.error("El servidor devolvió HTML en lugar de una imagen. Revisa la ruta o el token.")
                    setImageSrc('/user.jpg')
                    // Convertimos el blob a texto para ver qué error es
                    // const text = await response.data.text();
                    // console.log("Contenido recibido del servidor:", text);
                    return;
                }

                // Convertimos el binario en una URL que el navegador entienda
                objectUrl = URL.createObjectURL(response.data)
                setImageSrc(objectUrl)
            } catch (error) {
                // console.error("Error cargando imagen protegida", error)
                // Aquí puedes poner una imagen por defecto si falla
                setImageSrc('/user.jpg')
            } finally {
                setLoading(false)
            }
        }

        if (filename) fetchImage()

        // Limpieza de memoria al desmontar el componente
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl)
        }
    }, [filename])

    if (loading) return <div>Loading...</div>
    // console.log('imageSrc', imageSrc)
    return <img src={imageSrc} title={alt} alt={alt} className={className} />
}

export default ProtectedImage
