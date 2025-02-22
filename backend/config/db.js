const Sequelize = require('sequelize')
require("dotenv").config()
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err);
    } else {
        console.log('Conexão bem-sucedida ao MySQL!');
    }
});

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}