const Order = require('../models/order.module');
const validationResult = require('express-validator').validationResult;
exports.getOrders = (req, res, next) => {
    Order.getOrders(req.session.userId).then((orders) => {
        res.render('orders', {
            title: "Orders",
            isUser: true,
            orders: orders,
            validationErrors: req.flash('validationErrors'),
            isAdmin: req.session.isAdmin
        })
    })
}

exports.addOrder = (req, res, next) => {
    if(validationResult(req).isEmpty()){
        Order.addOrder({
            userId: req.session.userId,
            phone: req.body.phone,
            address: req.body.address,
            timestamp: Date.now(),
            status: 0 // 0 => not confirmed, 1 => confirmed -1 => rejected 2 => delivered 3 => done

        }).then(() => {
            res.redirect('/order')
        })
    }else{
        req.flash('validationErrors', validationResult(req).array({ onlyFirstError: true }))
        res.redirect('/cart')
    }
}