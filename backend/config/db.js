const Sequelize = require('sequelize')
require("dotenv").config(); // Carregar variáveis de ambiente

// Conexão com o banco de dados
const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    port: process.env.MYSQL_PORT,
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}