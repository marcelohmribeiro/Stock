const Sequelize = require('sequelize')
require("dotenv").config()

// Conexão com o banco de dados
const sequelize = new Sequelize({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
})

sequelize.authenticate()
    .then(() => console.log("Conectado"))
    .catch(err => console.error("Erro ao conectar:", err))

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}