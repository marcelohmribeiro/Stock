const Sequelize = require('sequelize')

// Conexão com o banco de dados
const sequelize = new Sequelize('stock', 'root', 'Mm280406', {
    host: "localhost",
    dialect: "mysql"
})

sequelize.authenticate()
    .then(() => {
        console.log("Banco conectado.")
    })
    .catch((err) => {
        console.log(`Erro ao conectar com o banco: ${err}`)
    })

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}