import sharp from 'sharp';
import path from 'path';
import fs from 'fs'

export const processImage = async (req, res) => {
    const { customName } = req.body
    // Tenemos la imagen en req.file y los parámetros en req.body

    try {
        if (!req.file) return res.status(400).json({ message: 'No file found' });

        // Recuperamos el nombre que queremos darle a la imagen
        const fileName = `${customName}.jpg`;

        // process.cwd() apunta a la raíz del proyecto dmjdev-mern-login
        // Luego entramos en uploads
        const uploadPath = path.join(process.cwd(), 'uploads', 'avatar', fileName);

        // Opcional: Verificar si la carpeta existe, si no, crearla
        const dir = path.join(process.cwd(), 'uploads', 'avatar');
        // Manipulamos carpetas y archivos con FS de NODE
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // SHARP - Libreria NODE para la manipulación de imágenes, redimensiona, fuerza un formato y almacena el archivo final en uploadPath
        await sharp(req.file.buffer)
            .resize({
                width: 150,
                height: 150,
                fit: 'cover', // Esto asegura que el lado más corto sea de 150px y recorte el sobrante
                position: 'center' // Centra el recorte
            })
            .toFormat('jpeg')   // Convierte a jpg si es necesario
            .jpeg({ quality: 90 })
            .toFile(uploadPath);

        res.status(200).json({
            message: 'Processed and saved file',
            fileName: fileName
        });

    } catch (error) {
        console.error('SHARP ERROR:', error);
        res.status(500).json({ message: 'Internal ERROR processing file' });
    }
};

