const express = require('express')
const app = express()
const cors = require('cors')
require("dotenv").config()
const router = require('./routes')
const PORT = process.env.PORT
const frontendUrl = process.env.FRONTEND_URL

// Liberando conexão com o front-end
app.use(cors({
    origin: `${frontendUrl}`
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router)

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))