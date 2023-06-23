const router = require('express').Router();
const bodyParser = require('body-parser');
const check = require('express-validator').check;
const authController = require('../controllers/auth.controller');

const authGaurd = require('./gaurds/auth.gaurd');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


//signups
router.get('/signup',authGaurd.isUnAuth,authController.getSignup);

router.post('/signup'
,authGaurd.isUnAuth  

,check('name').not().isEmpty().withMessage('Name is required')

,check('email').not().isEmpty().withMessage('Email is required')
.isEmail().withMessage('Invalid Email')

,check('password').isLength({min:6,max:30}).withMessage('Password must be between 6 and 30 characters'),
check('confirmPassword').custom((value,{req}) => {
    if(value === req.body.password) return true;
    else throw 'Password does not match';
})
,authController.postSignup);


//logins
router.get('/login',authGaurd.isUnAuth,authController.getLogin);


router.post('/login'
,authGaurd.isUnAuth

,check('email').not().isEmpty().withMessage('Email is required')
.isEmail().withMessage('Invalid Email')

,check('password').not().isEmpty().withMessage('Password is required')
.isLength({min:6,max:30}).withMessage('Password must be between 6 and 30 characters')

,authController.postLogin); 

router.all('/logout',authGaurd.isAuth,authController.logout);
module.exports = router;