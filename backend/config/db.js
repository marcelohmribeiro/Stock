const { Sequelize } = require('sequelize')
require("dotenv").config()

// Conexão com o banco de dados
const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.PGHOST,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  })

sequelize.authenticate()
    .then(() => console.log("Conectado ao banco PostgreSQL via Neon"))
    .catch(err => console.error("Erro ao conectar:", err))

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}