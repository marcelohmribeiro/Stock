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
    image: {
        type: db.Sequelize.STRING
    },
    imageName: {
        type: db.Sequelize.STRING
    }
}, {
    timestamps: false
})

const User = db.sequelize.define('users', {
    name: {
        type: db.Sequelize.STRING
    },
    email: {
        type: db.Sequelize.STRING
    },
    password: {
        type: db.Sequelize.STRING
    },
    role: {
        type: db.Sequelize.ENUM('admin', 'user')
    },
    createdAt: {
        type: db.Sequelize.DATE
    }
}, {
    timestamps: false
})

const Order = db.sequelize.define('orders', {
    user: {
        type: db.Sequelize.STRING
    },
    data: {
        type: db.Sequelize.DATE,
        defaultValue: db.Sequelize.NOW
    },
    total: {
        type: db.Sequelize.DECIMAL(10, 2)
    },
    payment_method: {
        type: db.Sequelize.STRING
    },
    parcelas: {
        type: db.Sequelize.INTEGER
    }
}, {
    timestamps: false
})

const OrderItem = db.sequelize.define('orders_itens', {
    quantity: {
        type: db.Sequelize.INTEGER
    },
    budget: {
        type: db.Sequelize.DECIMAL(10, 2)
    },
    item_name: {
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

Order.hasMany(OrderItem, {
    foreignKey: 'order_id',
    as: 'itens'
})

OrderItem.belongsTo(Order, {
    foreignKey: 'order_id',
    as: 'order'
})

module.exports = {
    Item: Item,
    Category: Category,
    User: User,
    Order: Order,
    OrderItem: OrderItem
}