import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 1. Carga el archivo .env según el modo (development, production, etc.)
  // process.cwd() indica que busque en la raíz del proyecto
  // El tercer parámetro '' carga todas las variables, no solo las que empiezan por VITE_
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      proxy: {    // Configuramos el proxi para asegurar que Vite no bloquea las llamadas al servidor de Backend - concretamente las llamadas BLOB de AXIOS en ProtectedImage para la visualización de las imágenes de la carpeta del BACKEND llamada UPLOADS
        '/api': {
          target: env.VITE_URL_BACKEND,
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})
