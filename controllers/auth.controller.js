const Users = require('../models/user.model');
const validationResults = require('express-validator').validationResult;

exports.getSignup = (req, res) => {
    res.render('auth/signup',
    {title: 'Signup',
    authError: req.flash('authError')[0],
    validationErrors: req.flash('validationErrors'),
    isUser:false,
    isAdmin: false});
}

exports.postSignup = (req, res) => { 
    if(validationResults(req).isEmpty()){
        Users.createNewUser(req.body.name,req.body.email,req.body.password).then(() => {
            res.redirect('/login')
        }).catch((err) => {
            if(err.code === 11000){
                req.flash('authError','Email already exists')
                res.redirect('/signup')
                return;
            }
            res.redirect('/signup')
        })
    }else{
        req.flash('validationErrors',validationResults(req).array({ onlyFirstError: true }))
        res.redirect('/signup')
    }
}

exports.getLogin = (req, res) => {
    res.render('auth/login',
    {title: 'Login',
    authError: req.flash('authError')[0],
    validationErrors: req.flash('validationErrors'),
    isUser:false,
    isAdmin:false});
}

exports.postLogin = (req, res) => {
    if(validationResults(req).isEmpty()){
        Users.login(req.body.email,req.body.password).then(result => {
            req.session.userId = result.id;
            req.session.isAdmin = result.admin;
            res.redirect('/')
        }).catch((err) => {
            req.flash('authError', err.message)
            res.redirect('/login')
        })
    }else{
        req.flash('validationErrors',validationResults(req).array({ onlyFirstError: true }))
        res.redirect('/login')
    }
}

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    });
}