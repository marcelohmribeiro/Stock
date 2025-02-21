const Sequelize = require('sequelize')
require("dotenv").config(); // Carregar variáveis de ambiente

// Conexão com o banco de dados
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        port: process.env.DB_PORT
    }
)

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}