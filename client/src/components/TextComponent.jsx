import { useEffect, useState } from "react"

export const TextComponent = ({ text }) => {
    const [cardText, setCardText] = useState('')
    const [origText, setOrigText] = useState(true)
    const [fullText, setFullText] = useState(true)
    const limite = 25 // número de palabras máximo para que aparezca el diálogo Leer más/Leer menos

    // Función para alternar entre expandido/colapsado
    const toggleExpand = () => {
        if (!fullText) {
            setCardText(text)
        } else {
            setCardText(getTruncatedText(text))
        }
        setFullText(!fullText)
    }
    // Función que SOLO retorna el texto truncado si su longitud es mayor al límite establecido
    const getTruncatedText = (texto) => {
        const palabras = texto.split(/\s+/)
        if (palabras.length <= limite) {
            return texto
        }
        return palabras.slice(0, limite).join(' ') + '...'
    }
    // Función que verifica si el texto necesita truncarse
    const needsTruncate = (texto) => {
        const palabras = texto.split(/\s+/)
        return palabras.length > limite
    }

    useEffect(() => {
        if (needsTruncate(text)) {
            setCardText(getTruncatedText(text))
            setOrigText(false)
            setFullText(false)
        } else {
            setCardText(text)
        }
    }, [])


    const jsxml =
        <p className="text-slate-300" style={{ "whiteSpace": 'pre-line' }}>
            {cardText}
            {
                // Mostrar botón solo si el texto necesita truncarse
                !origText && (
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault()
                            toggleExpand()
                        }}
                        className="linkStyle-md group"
                    >
                        <span style={{ whiteSpace: 'nowrap' }}>{fullText ? 'Ver menos' : 'Ver más'}</span>
                        <span className="decoLinkStyle"></span>
                    </a>
                )
            }
        </p>

    return jsxml
}
