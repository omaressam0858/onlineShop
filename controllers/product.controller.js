const {getProductById} = require('../models/product.model');
exports.getProduct = async (req, res) => {
    let id = req.params.id;
    if(!id) 
        return res.status(400).send('Id is required');
    getProductById(id)
        .then(product =>{
            res.render('product', {
                product: product,
                title: product ? product.name : "Product",
                isUser: req.session.userId,
                validationErrors: req.flash('validationErrors'),
                isAdmin: req.session.isAdmin
            })
        })
        

    
}