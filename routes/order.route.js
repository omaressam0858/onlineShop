const router = require('express').Router()
const check = require('express-validator').check
const bodyParse = require('body-parser')

const authGuard = require('./gaurds/auth.gaurd')
const orderController = require('../controllers/order.controller')

router.use(bodyParse.urlencoded({extended: true}))
router.use(bodyParse.json())

router.post('/add', authGuard.isAuth, 
check('phone').not().isEmpty().withMessage('Phone is required')
.custom((value) => {
    
    if(/^(?:\+20|0)?1\d{9}$/.test(value))
        return true
    else
        throw 'Invalid Phone Number'
    
}),
check('address').not().isEmpty().withMessage('Address is required')
,orderController.addOrder)


router.get('/', authGuard.isAuth, orderController.getOrders)
module.exports = router