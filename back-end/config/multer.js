const multer = require('multer')
const path = require('path')

// Armazenamento do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Diretório dos arquivos
        cb(null, path.resolve(__dirname, '..', 'tmp', 'uploads'))
    },
    filename: (req, file, cb) => {
        // Juntando o nome que o multer da para o arquivo com o nome original
        const filename = `${Date.now()}_${file.originalname}`
        cb(null, filename)
    }
})

module.exports = {
    // Tamanho maximo permitido do arquivo (2MB)
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    // Formato de imagens permitidas
    fileFilter: (req, file, cb) => {
        const allowedImages = [
            'image/jpeg',
            'image/jpg',
            'image/png'
        ]
        
        // Verificando se o arquivo é permitido
        if (allowedImages.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Invalid file type.'))
        }
    }
}
