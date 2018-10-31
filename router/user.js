let express = require('express');
let router = express.Router();
const connection = require('../config/connection.js');
let passport = require("passport");
let daxem = require('../model/daXemSs.js');
let daxemSql = require('../model/daXemSql.js');

function chuyentien() {
    this.output = function(e){

        let vitri = e.split('');
        let result = '';
        let index = Math.ceil((vitri.length)/3);
        if(index == 2) {
            let add = vitri.length - 3;
            vitri.splice(add, 0 , '.');
            vitri.forEach(e => {
                result += e;
            });
            return result;
        }
        if(index == 3) {
            let add = vitri.length - 3;
            vitri.splice(add, 0 , '.');
            
            let add1= vitri.length - 7;
            vitri.splice(add1, 0 , '.');
            vitri.forEach(e => {
                result += e;
            });
            return result;
            
        }
        if(index == 4) {
            let add = vitri.length - 3;
            vitri.splice(add, 0 , '.');
            
            let add1 = vitri.length - 7;
            vitri.splice(add1, 0 , '.');
    
            let add2 = vitri.length - 11;
            vitri.splice(add2, 0 , '.');
            vitri.forEach(e => {
                result += e;
            });
            return result;
            
        }
    }

}


function replaceName(ds) {
    ds = ds.replace(/-/, '_');
    return ds;
}

router.get("/profile", isLoggedIn, function(req, res){
    //console.log(req.user);
    res.render("./users/profile",{username : req.user.ho_ten});
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.CartData1 = ''; 
    req.session.daxemSql = '';
    res.redirect('/');
});

router.post('/updateDX', (req, res) => {
    const idCate = req.body.cateId;
    const idPro = req.body.productId;
    if(req.isAuthenticated()) {
        const id = req.user.id;
        let daxem1 = new daxemSql(req.session.daxemSql ? req.session.daxemSql : {});
        let daxemsql = {
            idUser : id,
            idCate : idCate,
            idPro : idPro,
            connection : connection
        }
        daxem1.addNew(daxemsql, `${idCate}-${idPro}`);
        req.session.daxemSql = daxem1;  
        
        setTimeout(() => {
            
            
            res.send('abc');

        }, 50)
    }else {
        
        (async () => {
         try{
             
             let daxem1 = new daxem(req.session.ssXem ? req.session.ssXem : {});
             const cate = await connection.query(`SELECT * FROM danh_sach WHERE id = '${idCate}'`);
             const cateAlias = replaceName(cate[0].alias);
             const pro = await connection.query(`SELECT * FROM ${cateAlias} WHERE id = '${idPro}'`);
             daxem1.add(pro[0], `${cate[0].id}-${pro[0].id}`); 
             req.session.ssXem = daxem1;
             // Send save ss in IE
             res.send('abc');
            
         }catch(err) {
             console.log(err); 
             
         }
         })();
    }

    
});

router.get('/da-xem', isLoggedIn, (req, res) => {
    let outChuyentien = new chuyentien();

    const id = req.user.id; 
    connection.query(`SELECT * FROM da_xem WHERE id_user = '${id}'`, (err, rows) => {
        let daxem1 = new daxemSql(req.session.daxemSql ? req.session.daxemSql : {});
        let daxem2 = new daxem(req.session.ssXem ? req.session.ssXem : {})
        let generatess = daxem2.generateArray();
        if(!req.session.daxemSql){
            
            rows.forEach(e => {
                let daxemsql = {
                    idUser : id,
                    idCate : e.id_ds,
                    idPro : e.id_product,
                    connection : connection
                }
                daxem1.add(daxemsql, `${e.id_ds}-${e.id_product}`); 
                req.session.daxemSql = daxem1;  
            })
            setTimeout(() => {

                generatess.forEach(e => {  
                    let daxemsql = {
                        idUser : id,
                        idCate : e.item.id_ds,  
                        idPro : e.item.id,
                        connection : connection
                    }
                    daxem1.addNew(daxemsql, `${e.item.id_ds}-${e.item.id}`); 
                    req.session.daxemSql = daxem1; 
                })
            },20)

            setTimeout(() => {
                
                req.session.ssXem = '';
                let all = daxem1.generateArray().reverse();
                let lengthPage = Math.ceil(all.length / 12);
                
                
                if(req.query.page) {
                    let page = Math.ceil(req.query.page); 
                    // Just 0-9
                    let checkPage = /^[0-9]+$/; 
                    if(lengthPage < page || page < 1 || !checkPage.test(page) ){
                        let limit = all.slice(0, 12);
                        return res.status(200).render('./users/da-xem', {all : limit, lengthPage : lengthPage, chuyentien : outChuyentien, page : 1});
                    }

                    let limit = all.slice((page * 12) -12, (page * 12) )
                    
                    res.status(200).render('./users/da-xem', {all : limit, lengthPage : lengthPage, chuyentien : outChuyentien, page : page});
                }else{
                   
                    let limit = all.slice(0, 12);
                    res.status(200).render('./users/da-xem', {all : limit, lengthPage : lengthPage, chuyentien : outChuyentien, page :1});  
                }
                
                
                

            }, 50)            
        }else{

            let daxem1 = new daxem(req.session.daxemSql ? req.session.daxemSql : {})
            let all = daxem1.generateArray().reverse();
            let lengthPage = Math.ceil(all.length / 12);
            if(req.query.page) {
                let page = Math.ceil(req.query.page);
                // Just 0-9
                let checkPage = /^[0-9]+$/;
                if(lengthPage < page || page < 1 || !checkPage.test(page) ){
                    let limit = all.slice(0, 12);
                    return res.status(200).render('./users/da-xem', {all : limit, lengthPage : lengthPage, chuyentien : outChuyentien, page : 1});
                }
                let limit = all.slice((page * 12) -12, (page * 12) );
                    
                res.status(200).render('./users/da-xem', {all : limit, lengthPage : lengthPage, chuyentien : outChuyentien, page : page});
                
                
            }else{
                let limit = all.slice(0, 12);
                res.status(200).render('./users/da-xem', {all : limit, lengthPage : lengthPage, chuyentien : outChuyentien, page : 1});
            }
            
            
        }
            
        
    })
    
    
});

router.get('/don-hang', isLoggedIn, (req, res) => {
    const id = req.user.id;
    connection.query(`SELECT * FROM checkout WHERE idUser = '${id}'`, (err, checkout) => {
        connection.query(`SELECT * FROM product_checkout WHERE madh = '${id}'`, (err, proCheckout) => {
            
            res.render('./users/da-mua', {checkout : checkout});
           
            
            

            
        })
    })
});

router.get('/don-hang/:id', isLoggedIn, (req, res) => { 
    const idUser = req.user.id;
    const id = req.params.id;
    
    
    connection.query(`SELECT * FROM product_checkout WHERE madh = '${id}' AND idUser = '${idUser}'`, (err, proCheckout) => {
        if(!proCheckout[0]) {
            res.redirect('/user/don-hang');
            
        }else{
            let tenProduct = [];
            proCheckout.forEach(e => {
                connection.query(`SELECT * FROM danh_sach WHERE id = '${e.id_ds}'`, (err, alias) => {
                    const cateAlias = replaceName(alias[0].alias);
                    connection.query(`SELECT ten, link FROM ${cateAlias} WHERE id = '${e.id_product}'`, (err, pro) => {
                        tenProduct.push(pro[0]);
                    })
    
                })
            })
            
            setTimeout(() => {
                
                connection.query(`SELECT * FROM checkout WHERE id = '${id}' AND idUser = '${idUser}'`, (err, checkout) => {
                    console.log(checkout);
                    
                    res.render('./users/chitiet', {checkout : checkout[0], id : id, tenProduct : tenProduct, proCheckout : proCheckout})
                })
            }, 50);
        }
        
    });

});


router.use('/', notLoggedIn, function(req,res,next){
    next();
});

 // SIGNUP ===========================
 router.get('/signup',(req, res)=>{
            
    res.render('./users/signup', {message : req.flash('signup')});
});
// process the signup form
router.post('/signup', passport.authenticate('local-signup',{failureRedirect:'/user/signup',successRedirect:'/'}));
// successRedirect


router.get('/signin',(req, res)=>{
    res.render('./users/signin', {errEmail : req.flash('err-email'), valEmail:req.flash('valEmail')});
});
router.post('/signin', passport.authenticate('local-signin',{failureRedirect:'/user/signin',successRedirect:'/'}))

router.post('/signinCheckout', passport.authenticate('local-signin',{failureRedirect:'/checkout/orther',successRedirect:'/checkout/orther'}));


module.exports = router

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
};

function notLoggedIn(req,res,next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
   
};
