exports.isAuth =(req, res, next) => {
    if (req.session.userId) next();
    else res.redirect('/login')
}

exports.isUnAuth =(req, res, next) => {
    if (!req.session.userId) next();
    else res.redirect('/')
}