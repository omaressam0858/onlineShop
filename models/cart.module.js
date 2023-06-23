const mongoose = require('mongoose');

const dbUrl = process.env.dbURL;


const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    image: {
        type:String,
        required: true
    },
    name: {
        type:String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    timestamp:{
        type: Number,
        required: true
    },
    productId: {
        type: String,
        required: true,
    }
})

const Item = mongoose.model('Cart', cartSchema)
exports.Item = Item
exports.addItemToCart = async (data) => {
    try{
        await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
        let find = await Item.findOne({userId: data.userId, productId: data.productId})
        if(find){
            find.amount = find.amount + Number(data.amount)
            find.timestamp = Date.now()
            await find.save()
            await mongoose.disconnect()
            return true
        }
        const item = new Item(data)
        await item.save()
        mongoose.disconnect()
    }catch(error){
        throw error
    }
}

exports.getCart = async (userId) => {
    try{
        await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
        let items = await Item.find({userId: userId},{},{sort:{timestamp:-1}})
        await mongoose.disconnect()
        return items
    }catch(error){
        throw error
    }
}

exports.editItem = async (cartId,newAmount) => {
    try{
        await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
        await Item.updateOne({_id: cartId},{amount: newAmount,timestamp: Date.now()})
        await mongoose.disconnect()
    }catch(error){
        throw error
    }
}

exports.deleteItem = async (cartId) => {
    try{
        await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
        await Item.findByIdAndDelete(cartId)
        await mongoose.disconnect()
    }catch(error){
        throw error
    }
}

exports.deleteAllItems = async (userId) => {
    try{
        await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
        await Item.deleteMany({userId: userId})
        await mongoose.disconnect()
    }catch(error){
        throw error
    }
}