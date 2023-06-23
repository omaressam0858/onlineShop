const {getAllProducts,getProductByCategory} = require('../models/product.model');

exports.getHome = (req, res) => {
    if(req.query.category) {
        if(req.query.category === 'all') {
            return res.redirect('/')
        }
        getProductByCategory(req.query.category)
        .then(products => {
            res.render('home', {
                category: req.query.category,
                categories: require('./admin.controller').categories,
                products: products,
                title:"Home",
                isUser:req.session.userId,
                validationErrors: req.flash('validationErrors'),
                isAdmin: req.session.isAdmin
            })
        }) 
        .catch(err => {res.status(500).send(err)})
    } else {
        getAllProducts()
        .then(products => {
            res.render('home', {
                products: products,
                categories: require('./admin.controller').categories,
                title:"Home",
                isUser:req.session.userId,
                validationErrors: req.flash('validationErrors'),
                isAdmin: req.session.isAdmin
            })
        })
        .catch(err => {res.status(500).send(err)})
    }
}