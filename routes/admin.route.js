const router = require('express').Router();
const adminController = require('../controllers/admin.controller');
const {isAdmin} = require('./gaurds/admin.gaurd');
const check = require('express-validator').check;
const multer = require('multer');

  
const categories = adminController.categories;


router.get('/add', isAdmin, adminController.getAddProduct);

router.post('/add', isAdmin, multer({
    storage: multer.diskStorage({
        destination: (req,file,cb) => {
            cb(null, 'images')
        },
        filename: (req,file,cb) => {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
}).single('image'), 
check('name').not().isEmpty().withMessage('Name is required'),

check('price').not().isEmpty().withMessage('Price is required'),

check('description').not().isEmpty().withMessage('Description is required'),

check('category').not().isEmpty().withMessage('Category is required')
.custom((value, {req}) => {
    if(categories.includes(value))
        return true
    else
        throw 'Invalid Category'
}),

check('image').custom((value, {req}) => {
    if(req.file)
        return true
    else
        throw 'Image is required'
}),

adminController.postAddProduct);

router.post('/delete', isAdmin, adminController.postDeleteProduct);

router.get('/orders', isAdmin, adminController.getOrders);

router.get('/orders/:filter', isAdmin, adminController.getOrderFilter);


router.post('/orders/update', isAdmin, 
check('status').not().isEmpty().withMessage('Status is required')

.isInt({min:-1, max:3}).withMessage('Invalid Status'),

check('orderId').not().isEmpty().withMessage('Order Id is required'),
adminController.postUpdateOrder);
module.exports = router