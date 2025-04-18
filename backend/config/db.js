const { Sequelize } = require('sequelize')
require("dotenv").config()

// Conexão com o banco de dados
const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
    host: process.env.PGHOST,
    dialect: "postgres",
  })

sequelize.authenticate()
    .then(() => console.log("Conectado ao banco PostgreSQL via Neon"))
    .catch(err => console.error("Erro ao conectar:", err))

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}