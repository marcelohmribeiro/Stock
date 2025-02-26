const express = require('express')
const router = express()
const upload = require('./config/multer')
const { Item, Category } = require('./models/Item')
const cloudinary = require("cloudinary").v2

// Rota Itens
router.get('/itens', async (req, res) => {
    try {
        const itens = await Item.findAll({
            include: [{
                model: Category,
                as: 'category'
            }]
        })
        res.json(itens)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Mostrar Item
router.post('/itens', upload.single('image'), async (req, res) => {
    try {
        const imageUrl = req.file ? req.file.path : null // armazena a URL do arquivo
        const publicId = req.file ? req.file.filename : null // armazena o nome original do arquivo

        const newItem = await Item.create({
            name: req.body.name,
            budget: req.body.budget,
            desc: req.body.desc,
            categoryId: req.body.categoryId,
            image: imageUrl,
            imageName: publicId
        })
        res.json(newItem)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Rota Categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.findAll()
        res.json(categories)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Identificação pelo ID de cada Item
router.get('/itens/:id', async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id, {
            include: [{
                model: Category,
                as: 'category'
            }]
        })
        res.json(item)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Deletar Item
router.delete('/itens/:id', async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id)

        // Excluir o arquivo junto
        if (item.imageName  ) {
            await cloudinary.uploader.destroy(item.imageName);
        }
        await item.destroy()
        res.json({ message: 'Item excluído com sucesso' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Editar Item
router.patch('/itens/:id', upload.single('image'), async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id)

        if (!item) {
            return res.status(404).json({ message: 'Item não encontrado' })
        }

        const updatedData = { ...req.body }
        // Verificando se chegou um novo arquivo
        if (req.file) {
            // Deletando o arquivo antigo
            if (item.imageName) {
                await cloudinary.uploader.destroy(item.imageName)
            }
            updatedData.image = req.file.path // Atualizando a imagem com o novo arquivo
            updatedData.imageName = req.file.filename
        }

        await item.update(updatedData)
        res.json(item)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.use("/", (req, res) => {
    return res.json("Bem vindo, Sua aplicação está rodando!")
})

module.exports = router