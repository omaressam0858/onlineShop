const mongoose = require('mongoose');

const dbUrl = process.env.dbURL;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        require: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
    }
})

const products = mongoose.model('Product', productSchema);

exports.getAllProducts = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
            let allProducts = await products.find({});
            resolve(allProducts);
            mongoose.disconnect();
        } catch (e) {
            reject(e);
        }


    })
}



exports.getProductByCategory = (category) => {
    return new Promise(async (resolve, reject) => {
        try {
            await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
            let allProducts = await products.find({ category: category });
            resolve(allProducts);
            mongoose.disconnect()
        } catch (e) {
            reject(e);
        }


    })
}

exports.getProductById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
            let product = await products.findOne({ _id: id });
            
            resolve(product);
            mongoose.disconnect();
        } catch (e) {
            reject(e);
        }
    })
}

exports.addProduct =  async (product) => {
    try{
        await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        let newProduct = new products(product);
        await newProduct.save();
        mongoose.disconnect();
    }catch(e){
        reject(e)
    }
}

exports.deleteProduct = async (id) => {
    try{
        await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        await products.findByIdAndDelete(id);
        mongoose.disconnect();
    }catch(e){
        reject(e)
    }
}

exports.products = products;