const express = require('express');
const app = express();
var path = require("path")
const bodyParser = require("body-parser");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
// pass passport for configuration


// const mysql = require('mysql');

// const con = mysql.createConnection({
//     host : "localhost",
//     port : "",
//     user : "thotho633",
//     password : "ngoctho1A",
//     database : "thotho633"
// })
// con.connect(err => {
//     if(err) throw err;
//     console.log('Connected');
// });


const index = require('./router/index.js');
const user = require('./router/user.js');
const admin = require('./router/admin.js');
const product = require('./router/product.js');
const cart= require('./router/cart.js');

app.set("view engine","ejs");
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(session({secret:"ngoctho1A",name : 'ga', cookie: { maxAge: 1000*60*100, httpOnly : false }}))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.listen(process.env.PORT ||4300);

require("./config/passport.js")(passport);
app.use(function(req, res, next){
    if(req.isAuthenticated()){
        res.locals.user = req.user.ho_ten;
        
    }
    res.locals.success_msg = req.flash('success_msg');  
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
})
app.use('/', index);
app.use('/user', user);
app.use('/admin', admin);
app.use('/admin/product', product);
app.use('/admin/cart' , cart);
module.exports = app;
