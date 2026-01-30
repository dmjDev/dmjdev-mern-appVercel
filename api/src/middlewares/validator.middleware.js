// MIDDLEWARE llamado durante ROUTER, si todo va bien ejecuta NEXT siguiendo el enrutamiento
// Valida la información proveniente de req.body según el schema pasado como parámetro
// En este caso se trata de esquemas ZOD de validación de datos de formulario, aunque esta función es genérica y valida cualquier tipo de estructura de  datos
export const validateSchema = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body)
        next()
    } catch (error) {
        return res.status(400).json(error.issues.map(error => error.message))
    }
}
