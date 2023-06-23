const router = require('express').Router();
const bodyParser = require('body-parser');
const check = require('express-validator').check;
const authGuard = require('./gaurds/auth.gaurd');

router.use(bodyParser.urlencoded({extended: false}))
router.use(bodyParser.json())

const cartController = require('../controllers/cart.controller');

router.get('/', authGuard.isAuth, cartController.getCart)

router.post('/', authGuard.isAuth,
check('amount').not().isEmpty().withMessage('Amount Is Required')
.isInt({min: 1}).withMessage('Amount Must Be Greater Than 0'),
check('id').not().isEmpty().withMessage('Product Id Is Required'),
check('image').not().isEmpty().withMessage('Product Image Is Required'),
check('name').not().isEmpty().withMessage('Product Name Is Required'),
check('price').not().isEmpty().withMessage('Product Price Is Required')
, cartController.postCart);


router.post('/update' ,authGuard.isAuth, 
check('amount').not().isEmpty().withMessage('Amount Is Required')
.isInt({min: 1}).withMessage('Amount Must Be Greater Than 0'),
check('cartId').not().isEmpty().withMessage('Cart Id Is Required')
,cartController.postSaveCart)
module.exports = router; 

router.post('/delete', authGuard.isAuth, 
check('cartId').not().isEmpty().withMessage('Cart Id Is Required'), 
cartController.postDeleteCart)