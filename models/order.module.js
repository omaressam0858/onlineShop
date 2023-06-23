const mongoose = require('mongoose');

const dbUrl = process.env.dbURL;


const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    phone: {
        type:String,
        required: true
    },
    address: {
        type:String,
        required: true
    },
    timestamp:{
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
    },
    products: {
        type: Array,
        required: false
    },
    total: {
        type: Number,
        required: true
    }
})

const Order = mongoose.model('order', orderSchema)

const orderProducts = require('./orderDetail.module')
const products = require('./product.model')
const cartItem = require('./cart.module')
const { Users } = require('./user.model')
exports.addOrder = async (data) =>{
    try{
        await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
        const order = new Order(data)
        let total = 0
        let cart = await cartItem.Item.find({userId: data.userId},{},{sort:{timestamp:-1}})
        if(cart.length > 0){
            for(let item of cart){
                let itemToSave = new orderProducts.Product({
                    orderId: order._id,
                    productId: item.productId,
                    amount: item.amount
                })
                await itemToSave.save()
                let product = await products.products.findById(item.productId)
                total = total + (product.price * item.amount)
            }
            await cartItem.Item.deleteMany({userId: data.userId})
            order.total = total
            await order.save()
        }
        mongoose.disconnect()
    }catch(error){
        throw error
    }
}

exports.getOrders = async (userId) => {
    try{
        await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
        let orders = await Order.find({userId: userId})
        for(let index = 0; index < orders.length; index++){
            let productsInOrder = await orderProducts.Product.find({orderId: orders[index]._id})
            let productsOrigin = await Promise.all(productsInOrder.map(async (item) => {
                let amount = item.amount
                item = await products.products.findById(item.productId)
                item = JSON.parse(JSON.stringify(item))
                item.amount = amount
                return item
            }))
            orders[index].products = productsOrigin
        }
        await mongoose.disconnect()
        return orders
    }catch(error){
        throw error
    }
}


exports.getAllOrders = async () => {
    try{
        await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
        let orders = await Order.find() 
        for(let index = 0; index < orders.length; index++){
            let productsInOrder = await orderProducts.Product.find({orderId: orders[index]._id})
            let productsOrigin = await Promise.all(productsInOrder.map(async (item) => {
                let amount = item.amount
                item = await products.products.findById(item.productId)
                item = JSON.parse(JSON.stringify(item))
                item.amount = amount
                return item
            }))
            orders[index].products = productsOrigin
        }
        await mongoose.disconnect()
        return orders
    }catch(error){
        throw error
    }
}

exports.updateOrder = async (id, status) => {
    try{
        await mongoose.connect(dbUrl,{ useNewUrlParser: true, useUnifiedTopology: true })
        let order = await Order.findById(id)
        if(order){
            order.status = status
            await order.save()
        }else{
            throw 'Order not found'
        }
    }catch(e){
        throw e
    }
}

exports.getOrderByStatus = async (statusId) => {
    try{
        await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
        let orders = await Order.find({status: statusId}) 
        for(let index = 0; index < orders.length; index++){
            let productsInOrder = await orderProducts.Product.find({orderId: orders[index]._id})
            let productsOrigin = await Promise.all(productsInOrder.map(async (item) => {
                let amount = item.amount
                item = await products.products.findById(item.productId)
                item = JSON.parse(JSON.stringify(item))
                item.amount = amount
                return item
            }))
            orders[index].products = productsOrigin
        }
        await mongoose.disconnect()
        return orders
    }catch(error){
        throw error
    }
}

exports.getOrderByEmail = async (userEmail) => {
    try{
        await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
        let user = await Users.findOne({email: userEmail})
        if(!user)
            return false;
        let orders = await Order.find({userId: user._id}) 
        for(let index = 0; index < orders.length; index++){
            let productsInOrder = await orderProducts.Product.find({orderId: orders[index]._id})
            let productsOrigin = await Promise.all(productsInOrder.map(async (item) => {
                let amount = item.amount
                item = await products.products.findById(item.productId)
                item = JSON.parse(JSON.stringify(item))
                item.amount = amount
                return item
            }))
            orders[index].products = productsOrigin
        }
        await mongoose.disconnect()
        return orders
    }catch(error){
        throw error
    }
}

exports.getOrderByEmailAndFilter = async (data) => {
    try{
        await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
        let user = await Users.findOne({email: data.email})
        if(!user)
            return false;
        let orders = await Order.find({userId: user._id, status: data.status}) 
        for(let index = 0; index < orders.length; index++){
            let productsInOrder = await orderProducts.Product.find({orderId: orders[index]._id})
            let productsOrigin = await Promise.all(productsInOrder.map(async (item) => {
                let amount = item.amount
                item = await products.products.findById(item.productId)
                item = JSON.parse(JSON.stringify(item))
                item.amount = amount
                return item
            }))
            orders[index].products = productsOrigin
        }
        await mongoose.disconnect()
        return orders
    }catch(error){
        throw error
    }
}