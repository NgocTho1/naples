const express = require('express');
const router = express.Router();

const connection = require('../config/connection.js');
const passport=require("passport");

// router.use(function(req, res ,next) {
//     if(req.isAuthenticated() && req.user.roles == 'user'){
//         res.redirect('/')
//     }
//     next()
// })

function replaceName(ds) {
    ds = ds.replace(/-/, '_');
    return ds; 
}

router.get('/', (req, res) => {
    res.render('./admin/signin.ejs');  
    console.log('vao dAY');
    
});

router.post('/', passport.authenticate('local-signin', { falureRedirect : './admin', successRedirect : '/admin/profile'}));

router.get('/profile', (req, res) => {
    connection.query('SELECT * FROM danh_sach', (err, cate) => {
        res.render('./admin/profile.ejs', {cate : cate});  
    })
    
});

router.get('/:cate', isAdmin, (req, res) => {
    const cate = req.params.cate;
    const cateAlias = replaceName(cate);
    Promise.all([
        connection.query('SELECT * FROM danh_sach'),
        connection.query(`SELECT * FROM ${cateAlias}`)
    ])
    .then(([cate, pro]) => {
        res.render('./admin/cate.ejs', {cate : cate, pro : pro, cateAlias : req.params.cate});
    } )
    .catch(err => console.log(err)) 
});






function isAdmin(req, res, next){
    if(req.isAuthenticated() && req.user.roles == 'supperAdmin'){
        return next()
    };
    res.redirect('/');
}
module.exports = router;