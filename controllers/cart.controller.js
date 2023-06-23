const cartModel = require('../models/cart.module')
const validationResult = require('express-validator').validationResult

exports.getCart = (req,res,next) => {
    cartModel.getCart(req.session.userId)
    .then(items => {
        let subTotal = 0
        for(let item of items){
            subTotal += item.price * item.amount
        }
        res.render('cart', {
            items: items,
            isUser: true,
            title: 'Cart',
            validationErrors: req.flash('validationErrors'),
            subTotal: subTotal,
            isAdmin: req.session.isAdmin
        })
    })
    .catch(err => res.status(500).send('Error: ' + err))
}

exports.postCart = (req,res,next) => {
    if(validationResult(req).isEmpty()){
        cartModel.addItemToCart({
            userId: req.session.userId,
            image:req.body.image,
            name: req.body.name,
            price: req.body.price,
            amount: req.body.amount,
            timestamp: Date.now(),
            productId: req.body.id
        }).then(() => {
            res.redirect('/cart')
        }).catch(err => {
            console.log(err)
        })
    }else {
        req.flash('validationErrors', validationResult(req).array({ onlyFirstError: true }))
        res.redirect(req.body.redirectTo)
    }
}

exports.postSaveCart = (req,res,next) => {
    if(validationResult(req).isEmpty()){
        cartModel.editItem(req.body.cartId,req.body.amount)
        .then(() => {
            res.redirect('/cart')
        })
        .catch(err => {
            res.status(500).send('Error: ' + err)
        })
    }else {
        req.flash('validationErrors', validationResult(req).array({ onlyFirstError: true }))
        res.redirect('/cart')
    }
}

exports.postDeleteCart = (req,res,next) => {
    if(validationResult(req).isEmpty()){
        cartModel.deleteItem(req.body.cartId)
        .then(() => {
            res.redirect('/cart')
        })
        .catch(err => {
            res.status(500).send('Error: ' + err)
        })
    }else {
        req.flash('validationErrors', validationResult(req).array({ onlyFirstError: true }))
        res.redirect('/cart')
    } 
}