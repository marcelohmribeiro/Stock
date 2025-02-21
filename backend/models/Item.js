const db = require('../config/db')

// Modelos
const Category = db.sequelize.define('categories', {
    name: {
        type: db.Sequelize.STRING
    }
}, {
    timestamps: false
})

const Item = db.sequelize.define('itens', {
    name: {
        type: db.Sequelize.STRING
    },
    budget: {
        type: db.Sequelize.FLOAT
    },
    desc: {
        type: db.Sequelize.TEXT
    },
    categoryId: {
        type: db.Sequelize.INTEGER
    },
    image: {
        type: db.Sequelize.STRING
    },
    imageName: {
        type: db.Sequelize.STRING
    }
}, {
    timestamps: false
})

// Relacionando as tabelas
Category.hasMany(Item, {
    foreignKey: 'categoryId',
    as: 'itens'
})

Item.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category'
})

module.exports = {
    Item: Item,
    Category: Category
}