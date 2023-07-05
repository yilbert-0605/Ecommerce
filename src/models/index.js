const Product = require("./Product")
const Category = require("./Category")
const Cart = require("./Cart")
const User = require("./User")
const Purchase = require("./Purchase")
const ProductImg = require("./ProductImg")

//Product -> //categoryId
Product.belongsTo(Category)
Category.hasMany(Product)

//Cart -> //userId
Cart.belongsTo(User)
User.hasOne(Cart)

//Cart -> //productId
Cart.belongsTo(Product)
Product.hasMany(Cart)

//Purchase -> //User
Purchase.belongsTo(User)
User.hasMany(Purchase)

//Purchase -> //Product
Purchase.belongsTo(Product)
Product.hasMany(Purchase)

ProductImg.belongsTo(Product)
Product.hasMany(ProductImg)