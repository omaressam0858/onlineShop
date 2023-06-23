const mongoose = require('mongoose');

const dbUrl = process.env.dbURL;


const productSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    productId: {
        type:String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
})

const Product = mongoose.model('orderproducts', productSchema)

exports.Product = Product