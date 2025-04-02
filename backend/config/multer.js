const multer = require('multer')
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const cloudinary = require("cloudinary").v2
const path = require('path')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        // Pasta onde o arquivo será salvo
        folder: "uploads",
        // Formato do arquivo
        format: async (req, file) => path.extname(file.originalname).replace(".", ""),
        // Nome do arquivo
        public_id: (req, file) => `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`,
    },
})

const upload = multer({
    // Tamanho maximo permitido do arquivo (2MB)
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    // Formato de imagens permitidas
    fileFilter: (req, file, cb) => {
        const allowedImages = ["image/jpeg", "image/jpg", "image/png"];
        // Verificando se o arquivo é permitido
        if (allowedImages.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error("Invalid file type."))
        }
    },
})

module.exports = upload
