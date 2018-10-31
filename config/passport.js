const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const connection = require('../config/connection.js');
const bcrypt = require("bcrypt-nodejs");
const encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10),null);
};
const validPassword = (password) => {
    return bcrypt.compareSync(password, this.password);
}

module.exports = function(passport) {
    // used to serialize the user for the session
    passport.serializeUser(function(user, done){
        done(null, user.id)
        console.log(user.id);
         
    })
    
    //used to deserialize the user
    passport.deserializeUser(function(id, done){
        connection.query(`SELECT * FROM user WHERE id = '${id}'`, (err, user) => {
            done(err,user[0]);
        })
    });


    // =================================================
    // LOCAL LOGIN =====================================
    // =================================================
    passport.use("local-signin",new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback:true
    },function(req, email, password, done){
        connection.query(`SELECT * FROM user WHERE email = '${email}'`, (err, user) => {
             
              
            if(err){
                return done(err);
            }
            if(!user[0]){
                return done(null, false, req.flash('err-email', 'Email hoặc mật khẩu không hợp lệ'), req.flash('valEmail', email))
            }
            if(!bcrypt.compareSync(password, user[0].password)){
                
                return done(null, false, req.flash('err-email', 'Email hoặc mật khẩu không hợp lệ'), req.flash('valEmail', email));
            }
            // all is well, return user
            else{
                return done(null,user[0]); 
            }
        })
    }));

    // =================================================
    // LOCAL SIGNUP =====================================
    // =================================================
    passport.use('local-signup',new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback:true
    },function(req, email, password, done){
        
       connection.query(`SELECT email FROM user WHERE email = '${email}'`, (error, user) => {
            if(error) {
                return done(error);
            }
            if(user[0]){
                console.log(user);
               
                
                return done(null, false, req.flash("signup", "Tên đăng nhập đã tồn tại"));
            }
            var newUserMysql = {
                ho_ten : req.body.name,
                email: email,
                password: encryptPassword(password)
            };
            connection.query(`INSERT INTO user(ho_ten, email, password) VALUES ('${newUserMysql.ho_ten}', '${newUserMysql.email}','${newUserMysql.password}')`, (err, rows)=> {
                newUserMysql.id = rows.insertId;
                return done(null, newUserMysql);
            })
       })
    }));


}
