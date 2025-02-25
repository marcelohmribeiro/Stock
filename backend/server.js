const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const multer = require('multer')
const multerConfig = require('./config/multer')
const fs = require('fs')
const { Item, Category } = require('./models/Item')
const PORT = process.env.PORT

// Liberando conexão com o front-end
app.use(cors({
    origin: 'http://localhost:5173'
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.resolve(__dirname, 'tmp', 'uploads')))

// Rota Itens
app.get('/itens', async (req, res) => {
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
app.post('/itens', multer(multerConfig).single('image'), async (req, res) => {
    try {
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null // armazena a URL do arquivo
        const originalImageName = req.file ? req.file.originalname : null // armazena o nome original do arquivo

        const newItem = await Item.create({
            name: req.body.name,
            budget: req.body.budget,
            desc: req.body.desc,
            categoryId: req.body.categoryId,
            image: imagePath,
            imageName: originalImageName
        })
        res.json(newItem)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Rota Categories
app.get('/categories', async (req, res) => {
    try {
        const categories = await Category.findAll()
        res.json(categories)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Identificação pelo ID de cada Item
app.get('/itens/:id', async (req, res) => {
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
app.delete('/itens/:id', async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id)

        // Excluir o arquivo junto
        if (item.image) {
            const filePath = path.join(__dirname, 'tmp', item.image)
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
            }
        }
        await item.destroy()
        res.json({ message: 'Item excluído com sucesso' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Editar Item
app.patch('/itens/:id', multer(multerConfig).single('image'), async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id)

        if (!item) {
            return res.status(404).json({ message: 'Item não encontrado' })
        }

        const updatedData = { ...req.body }
        // Verificando se chegou um novo arquivo
        if (req.file) {
            // Deletando o arquivo antigo
            if (item.image) {
                const oldFile = path.join(__dirname, 'tmp', item.image)
                if (fs.existsSync(oldFile)) {
                    fs.unlinkSync(oldFile)
                }
            }
            updatedData.image = `/uploads/${req.file.filename}` // Atualizando a imagem com o novo arquivo
            updatedData.imageName = req.file.originalname
        }

        await item.update(updatedData)
        res.json(item)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.use("/", (req, res)=>{
    return res.json("Seja bem vindo, sua aplicação está rodando")
  })

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))