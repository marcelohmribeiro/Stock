const express = require('express')
const app = express()
const cors = require('cors')
const { Item, Category } = require('./models/Item')

// Liberando conexão com o front-end
app.use(cors({
    origin: 'http://localhost:5173'
}))
app.use(express.json())

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
app.post('/itens', async (req, res) => {
    try {
        const newItem = await Item.create({
            name: req.body.name,
            budget: req.body.budget,
            desc: req.body.desc,
            categoryId: req.body.categoryId
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
        const delItem = await Item.destroy({
            where: {
                id: req.params.id
            }
        })
        res.json(delItem)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Editar Item
app.patch('/itens/:id', async (req, res) => {
    try {
        const patItem = await Item.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        res.json(patItem)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.listen(8081, function () {
    console.log("Servidor rodando na url http://localhost:8081")
})