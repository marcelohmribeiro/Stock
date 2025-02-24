const Sequelize = require('sequelize')
require("dotenv").config()

// Conexão com o banco de dados
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true, // O Neon exige SSL
            rejectUnauthorized: false // Evita problemas de certificado
        }
    },
    logging: false, // Opcional: desativa logs SQL no console
});

sequelize.authenticate()
    .then(() => console.log("Conectado"))
    .catch(err => console.error("Erro ao conectar:", err))

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}