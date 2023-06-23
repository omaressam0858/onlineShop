const Product = require('../models/product.model')
const Order = require('../models/order.module')
const validationResult = require('express-validator').validationResult
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret
});

exports.categories = ['phones', 'laptops', 'accessories', 'speakers', 'headphones', 'cameras']

exports.getAddProduct = (req, res, next) => {
    res.render('addProduct', {
        title: 'Add Product',
        isUser: true,
        isAdmin: true,
        validationErrors: req.flash('error'),
        categories: exports.categories
    })
}

exports.postAddProduct = async (req, res, next) => {
    if(validationResult(req).isEmpty()){

        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'onlineShop' });

        await Product.addProduct({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            description: req.body.description,
            image: result.secure_url
        })
        res.redirect('/')
    }else{
        req.flash('error', validationResult(req).array({ onlyFirstError: true }))
        res.redirect('/admin/add')
    }
}

exports.postDeleteProduct = async (req, res, next) => {
    await Product.deleteProduct(req.body.id)
    res.redirect('/')
}

exports.getOrders = async (req, res, next) => {
    if(!req.query.email){
        let orders = await Order.getAllOrders()
        res.render('manageOrders', {
            title: 'Admin Orders',
            isUser: true,
            isAdmin: true,
            orders: orders,
            validationErrors: req.flash('validationErrors')
        })
    }else{
        var filteredOrders = await Order.getOrderByEmail(req.query.email)
        if(!filteredOrders)
        {
        req.flash('validationErrors', "No Email Found")
        res.redirect('/admin/orders')
        }
        res.render('manageOrders', {
            title: 'Admin Orders',
            isUser: true,
            isAdmin: true,
            orders: filteredOrders,
            validationErrors: req.flash('validationErrors')
        })
    }
}

exports.postUpdateOrder = async (req, res, next) => {
    if(validationResult(req).isEmpty()){
        try{
            await Order.updateOrder(req.body.orderId, req.body.status)
        }catch(error){
            console.log(error)
        }
        res.redirect('/admin/orders')
    }else{
        req.flash('validationErrors', validationResult(req).array({ onlyFirstError: true }))
        res.redirect('/admin/orders')
    }
}

exports.getOrderFilter = async (req, res, next) => {
    let filter = req.params.filter
    let email = req.query.email
    switch(filter){
        case 'pending':
            filter=0
            break;
        case 'delivered':
            filter=2
            break;
        case 'refused':
            filter=-1
            break;
        default:
            filter=0
            break;
    }
    if(!email){
        let filteredOrders = await Order.getOrderByStatus(filter)
        res.render('manageOrders', {
            title: 'Admin Orders',
            isUser: true,
            isAdmin: true,
            orders: filteredOrders,
            validationErrors: req.flash('validationErrors')
        })
    }else{
        let filteredOrders = await Order.getOrderByEmailAndFilter({
            email:email,
            status:filter
        })
        res.render('manageOrders', {
            title: 'Admin Orders',
            isUser: true,
            isAdmin: true,
            orders: filteredOrders,
            validationErrors: req.flash('validationErrors')
        })
    }
}