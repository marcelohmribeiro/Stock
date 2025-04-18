const { Sequelize } = require('sequelize')
require("dotenv").config()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // necessário com Neon
    },
  },
})

sequelize.authenticate()
  .then(() => console.log("Conectado ao banco PostgreSQL via Neon"))
  .catch(err => console.error("Erro ao conectar:", err))

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}