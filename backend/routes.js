const express = require('express')
const router = express()
const upload = require('./config/multer')
const jwt = require('jsonwebtoken')
const { Item, Category, User, Order, OrderItem } = require('./models/Item')
const cloudinary = require("cloudinary").v2
const bcrypt = require("bcrypt")
const authMiddleware = require('./middlewares/authMiddleare')

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
        res.status(500).json({ message: "Ocorreu um erro!" })
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
        res.status(500).json({ message: "Ocorreu um erro!" })
    }
})

// Rota Categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.findAll()
        res.json(categories)
    } catch (err) {
        res.status(500).json({ message: "Ocorreu um erro!" })
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
        res.status(500).json({ message: "Ocorreu um erro!" })
    }
})

// Deletar Item
router.delete('/itens/:id', authMiddleware, async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id)

        // Excluir o arquivo junto
        if (item.imageName) {
            await cloudinary.uploader.destroy(item.imageName);
        }
        await item.destroy()
        res.json({ message: 'Item excluído com sucesso' })
    } catch (err) {
        res.status(500).json({ message: "Ocorreu um erro!" })
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
            // Atualizando a imagem com o novo arquivo
            updatedData.image = req.file.path
            updatedData.imageName = req.file.filename
        }
        await item.update(updatedData)
        res.json(item)
    } catch (err) {
        res.status(500).json({ message: "Ocorreu um erro!" })
    }
})

// Rota Users
router.get("/users", authMiddleware, async (req, res) => {
    try {
        const users = await User.findAll()
        res.json(users)
    } catch (err) {
        res.status(500).json({ message: "Ocorreu um erro!" })
    }
})

// Login Usuário
router.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ where: { email: email } })
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" })
        }
        // Verifica se a senha está correta
        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword) {
            console.log("Senha incorreta para o usuário:", email);
            return res.status(401).json({ message: "Senha incorreta" })
        }
        // Gera o token de autenticação
        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )
        console.log("Token gerado com sucesso para o usuário:", email)
        return res.status(200).json({ user, token })
    } catch (error) {
        console.error("Erro no login:", error)
        return res.status(500).json({ message: "Erro interno no servidor" })
    }
})

// Registrar Usuário
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body
        // Verifica se o email já existe
        const userExists = await User.findOne({ where: { email: email } })
        if (userExists) {
            return res.status(400).json({ message: 'Este email já está em uso.' })
        }
        // Criptografa a senha
        const crypt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, crypt)
        // Cria o novo usuário
        const newUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword
        })
        res.json(newUser)
        console.log(newUser)
    } catch (err) {
        res.status(500).json({ message: "Ocorreu um erro!" })
        console.log(err)
    }
})

// Deletar Usuário
router.delete('/users/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id)
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' })
        }
        await user.destroy()
        res.json({ message: 'Usuario excluído com sucesso' })
    } catch (err) {
        res.status(500).json({ message: "Ocorreu um erro!" })
    }
})

// Criar Pedido
router.post('/createOrder', async (req, res) => {
    try {
        const { user, itens, total, payment_method, parcelas } = req.body
        const newOrder = await Order.create({ user, total, payment_method, parcelas })
        const orderItensData = itens.map(i => ({
            order_id: newOrder.id,
            product_id: i.product_id,
            quantity: i.quantity,
            budget: i.budget,
            item_name: i.item_name
        }))
        await OrderItem.bulkCreate(orderItensData)
        res.status(201).json({ message: 'Pedido criado com sucesso!' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erro ao criar pedido' })
    }
})

router.delete('/orders/:id', authMiddleware, async (req, res) => {
    const orderId = req.params.id
    try {
        await OrderItem.destroy({ where: { order_id: orderId } })
        await Order.destroy({ where: { id: orderId } })
        res.status(200).json({ message: "Pedido excluído com sucesso" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Erro ao excluir pedido" })
    }
})

// Buscar todos os pedidos com seus itens
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: {
                model: OrderItem,
                as: 'itens',
                include: [{
                    model: Item,
                    as: 'item',
                    attributes: ['name', 'budget']
                }]
            },
            order: [['id', 'DESC']]
        })
        res.json(orders)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erro ao buscar pedidos' })
    }
})

router.use("/", (req, res) => {
    return res.json("Bem vindo, Sua aplicação está rodando!")
})

module.exports = router