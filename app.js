const express = require('express');
const path = require('path');
const fs = require('fs');
const flash = require('connect-flash');

const session = require('express-session');
const SessionStore = require('connect-mongodb-session')(session);

const store = new SessionStore({
    uri: process.env.dbURL,
    collection: 'sessions'
})


const app = express();

const homeRouter = require('./routes/home.route');
const productRouter = require('./routes/product.route');
const authRouter = require('./routes/auth.route');
const cartRouter =  require('./routes/cart.route')
const orderRouter = require('./routes/order.route')
const adminRouter = require('./routes/admin.route')

const port = process.env.PORT || 3000;



app.use(session({
    secret: fs.readFileSync(path.join(__dirname, 'sessionKey.txt'), 'utf-8'),
    saveUninitialized: false,
    cookie:{
        maxAge: 1*60*60*1000
    },
    store: store,
    resave: false
}))
app.use(flash())



app.use(express.static(path.join(__dirname, 'static')))
app.use(express.static(path.join(__dirname, 'images')))
app.set('view engine', 'ejs')
app.set('views', 'views')



app.use('/', homeRouter);

app.use('/', authRouter);

app.use('/products', productRouter);

app.use('/cart', cartRouter);

app.use('/order', orderRouter);

app.use('/admin', adminRouter)

app.use('/',(req, res, next) => {
    res.status(404).send('404 : Page Not Found')
})

app.listen(port, () => console.log(`Listening on port ${port}...`))