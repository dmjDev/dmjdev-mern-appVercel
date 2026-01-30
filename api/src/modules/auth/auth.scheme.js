import * as z from 'zod'

// Esquemas ZOD para la validación de los datos enviados a través de las rutas AUTH.ROUTES donde se le aplica el middleware VALIDATOR.MIDDLEWARE
// se aplica a las rutas que lo precisen el middleware validateSchema() pasándoles como parámetro el esquema necesario
// se indican los parámetros que se quiera validar, indicando las propiedades necesarias, string o email, trim, min, regex, ...
// si el dato verificado no cumple la propiedad se devuelve el mensaje de error
export const registerSchema = z.object({
    username: z.string("Username must be a string").trim().min(1, { message: "Username is required" }),
    email: z.email("Invalid email").trim(),
    password: z.string()
        .trim()
        .regex(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter and one number"
        ),
})

export const loginSchema = z.object({
    email: z.email("User not found - (dev)email").trim(),
    password: z.string()
        .trim()
        .regex(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
            "User not found - (dev)regex"
        ),
})

export const updateUserSchema = z.object({
    username: z.string("Username must be a string").trim().min(1, { message: "Username is required" }),
    email: z.email("Invalid email").trim()
})

export const updatePassSchema = z.object({
    currentPass: z.string()
        .trim()
        .regex(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
            "Current password must contain at least one uppercase letter, one lowercase letter and one number"
        ),
    newPass: z.string()
        .trim()
        .regex(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
            "New password must contain at least one uppercase letter, one lowercase letter and one number"
        )
})