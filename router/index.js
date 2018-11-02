const express = require('express');
const router = express.Router();
const connection = require('../config/connection.js');
var Cart = require('../model/cart.js');
var passport=require("passport");   
var CartData = require('../model/cartdata.js');
var validator = require('validator');
let daxem = require('../model/daXemSs.js');
let daxemSql = require('../model/daXemSql.js');

function replaceName(ds) {
    ds = ds.replace(/-/, '_');
    return ds;
}



function bodauTiengViet(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/ /g, "-");
    str = str.replace(/\./g, "-");
    str = str.replace('(', '');
    str = str.replace(')', ''); 
    str = str.replace(/\//g, '-');
    return str;
}
function totalQty(req){
    var qty = 0;
    var cart = new Cart(req.session.spCart ? req.session.spCart : {});
    cart.generateArray().forEach(function(elm) { 
        qty += elm.qty; 
    });
    return req.session.totalQty = qty;
}
function totalQtyUser(req){
    var qty = 0;
    var cart = new CartData(req.session.CartData1 ? req.session.CartData1 : {});
    cart.generateArray().forEach(function(elm) {
        qty += elm.qty; 
    });
    return req.session.totalQtyUser = qty;
}
router.use('/', (req, res, next) => {
    totalQty(req);
    totalQtyUser(req);
    next();
})
// router.get('/chuyenten', (req, res) => {
//     Promise.all([
//         connection.query(`SELECT id, id_ds, ten, gia, giam_gia, hinh_anh FROM ban_phim 
//         UNION 
//         SELECT id, id_ds, ten, gia, giam_gia, hinh_anh FROM chuot 
//         UNION
//         SELECT id, id_ds, ten, gia, giam_gia, hinh_anh FROM cpu
//         UNION
//         SELECT id, id_ds, ten, gia, giam_gia, hinh_anh FROM hdd
//         UNION
//         SELECT id, id_ds, ten, gia, giam_gia, hinh_anh FROM main
//         UNION
//         SELECT id, id_ds, ten, gia, giam_gia, hinh_anh FROM man_hinh
//         UNION
//         SELECT id, id_ds, ten, gia, giam_gia, hinh_anh FROM nguon
//         UNION
//         SELECT id, id_ds, ten, gia, giam_gia, hinh_anh FROM ram
//         UNION
//         SELECT id, id_ds, ten, gia, giam_gia, hinh_anh FROM ssd
//         UNION
//         SELECT id, id_ds, ten, gia, giam_gia, hinh_anh FROM tai_nghe
//         UNION
//         SELECT id, id_ds, ten, gia, giam_gia, hinh_anh FROM tan_nhiet
//         UNION
//         SELECT id, id_ds, ten, gia, giam_gia, hinh_anh FROM thung_may
//         UNION
//         SELECT id, id_ds, ten, gia, giam_gia, hinh_anh FROM vga
//         `),
//         connection.query('SELECT * FROM danh_sach') 
//     ])
//     .then(([rows, cate]) => {
//         rows.forEach(e => {
//             cate.forEach(ca => {
//                 if(ca.id == e.id_ds) {
//                     connection.query(`UPDATE ${replaceName(ca.alias)} SET link = "${bodauTiengViet(e.ten)}" WHERE id = '${e.id}'`, (err, pro) => {
//                         if(err) console.log(err);
                        
//                     }) 
//                 }
//             })
           
//         })
//     })
   
// });

router.get('/', (req, res) => {
    var a = [];
    Promise.all([
        connection.query(`(SELECT id, id_ds, ten, gia, giam_gia, percent, hinh_anh, link FROM ban_phim ORDER BY percent DESC LIMIT 8) 
        UNION 
        (SELECT id, id_ds, ten, gia, giam_gia, percent, hinh_anh, link FROM chuot ORDER BY percent DESC LIMIT 8)
        UNION
        (SELECT id, id_ds, ten, gia, giam_gia, percent, hinh_anh, link FROM cpu ORDER BY percent DESC LIMIT 8)
        UNION
        (SELECT id, id_ds, ten, gia, giam_gia, percent, hinh_anh, link FROM hdd ORDER BY percent DESC LIMIT 8)
        UNION
        (SELECT id, id_ds, ten, gia, giam_gia, percent, hinh_anh, link FROM main ORDER BY percent DESC LIMIT 8)
        UNION
        (SELECT id, id_ds, ten, gia, giam_gia, percent, hinh_anh, link FROM man_hinh ORDER BY percent DESC LIMIT 8)
        UNION
        (SELECT id, id_ds, ten, gia, giam_gia, percent, hinh_anh, link FROM nguon ORDER BY percent DESC LIMIT 8)
        UNION
        (SELECT id, id_ds, ten, gia, giam_gia, percent, hinh_anh, link FROM ram ORDER BY percent DESC LIMIT 8)
        UNION
        (SELECT id, id_ds, ten, gia, giam_gia, percent, hinh_anh, link FROM ssd ORDER BY percent DESC LIMIT 8)
        UNION
        (SELECT id, id_ds, ten, gia, giam_gia, percent, hinh_anh, link FROM tai_nghe ORDER BY percent DESC LIMIT 8)
        UNION
        (SELECT id, id_ds, ten, gia, giam_gia, percent, hinh_anh, link FROM tan_nhiet ORDER BY percent DESC LIMIT 8)
        UNION
        (SELECT id, id_ds, ten, gia, giam_gia, percent, hinh_anh, link FROM thung_may ORDER BY percent DESC LIMIT 8)
        UNION
        (SELECT id, id_ds, ten, gia, giam_gia, percent, hinh_anh, link FROM vga ORDER BY percent DESC LIMIT 8)
        `),
        connection.query('SELECT * FROM danh_sach') 
    ])
    .then(([all, cate]) => {
        if(req.isAuthenticated() && !req.session.CartData1) {

            const id = req.user.id;
            Promise.all([
                connection.query('SELECT * FROM danh_sach'),
                connection.query(`SELECT * FROM cart WHERE id_user = '${id}'`)
            ])
            .then(([cate, pro]) => {
                let cartdata = new CartData(req.session.CartData1 ? req.session.CartData1 : {});
                let cart = new Cart(req.session.spCart ? req.session.spCart : {});
                let generateSs = cart.generateArray();
                for(var i = 0; i < pro.length; i++ ){ 
                    let data = {
                        connection : connection, 
                        idUser : id,
                        idCate : pro[i].id_ds,
                        idPro : pro[i].id_product,
                        idSession : `${pro[i].id_ds}-${pro[i].id_product}`,  
                        qtyPro : pro[i].so_luong,
                    }
                
                    cartdata.add(data); 
                    req.session.CartData1 = cartdata;
                };
                for(var i = 0; i < generateSs.length; i++ ){ 
                    let dataNew = {
                        connection : connection,
                        idUser : id,
                        idCate : generateSs[i].item.id_ds,
                        idPro : generateSs[i].item.id,
                        idSession : `${generateSs[i].item.id_ds}-${generateSs[i].item.id}`, 
                        qtyPro : generateSs[i].qty, 
                    }
                
                    cartdata.addNew(dataNew);
                    req.session.CartData1 = cartdata;  
                };
                
                
                setTimeout(() => {
                    req.session.spCart = '';
                    totalQty(req);
                    totalQtyUser(req);
                    
                    res.render('./users/index.ejs', { all : all, cate : cate}); 
                }, 100) 
                
                

            })
        }else {
            
            res.render('./users/index.ejs', { all : all, cate : cate });            
        }
        
    })

   
    
    
});


router.get('/:cate.html', (req, res) => { 

   
    (async () => {
        try{
            const cate = await connection.query(`SELECT * FROM danh_sach WHERE alias = '${req.params.cate}'`);
            
            const cateAlias = replaceName(cate[0].alias);
            // percent in product sql DESC
            const pro = await connection.query(`SELECT * FROM ${cateAlias} ORDER BY percent DESC`);
            // 20.5 => 21
            const lengthPage = Math.ceil(pro.length /12);
            //?page = 1
            if(req.query.page) {
                let page = Math.ceil(req.query.page);
                let checkPage = /^[0-9]+$/;
                // check user inter ?page = 100000 , -2000, abcs
                if(lengthPage < page || page < 1 || !checkPage.test(page) ){
                    let limit = pro.slice(0, 12);
                    return res.status(200).render('./users/cate', {all : limit, cate : cate[0], lengthPage : lengthPage, page : 1, thuonghieu : ''});
                }
                // [0-24] slice [0-12] [12-24] page = 1, page = 2
                let limit = pro.slice((page * 12) -12, (page * 12) );
                return res.status(200).render('./users/cate', {all : limit, cate : cate[0], lengthPage : lengthPage, page : page, thuonghieu : ''});
                
            }else if(req.query.thuonghieu){
                // select nsx
                
                let thuonghieu = req.query.thuonghieu;
                connection.query(`SELECT * FROM thuong_hieu WHERE alias = '${thuonghieu}'`, (err, nsx) => {
                    
                    if(err) console.log(err);
                    // ?thuonghieu = dsfsd23i
                    if(nsx[0]){

                        connection.query(`SELECT * FROM ${cateAlias} WHERE id_nsx = '${nsx[0].id}' ORDER BY percent DESC`, (err, pro) => {
                            // Maybe nothing product in nsx
                            const lengthPage = Math.ceil(pro.length /12);
                            
                            if(pro[0]){
                                if(req.query.pagensx) {
                                    let page = Math.ceil(req.query.pagensx);
                                    let checkPage = /^[0-9]+$/;
                                    // check user inter ?page = 100000 , -2000, abcs
                                    if(lengthPage < page || page < 1 || !checkPage.test(page) ){
                                        console.log('vao day1');
                                        
                                        let limit = pro.slice(0, 12);
                                        return res.status(200).render('./users/cate', {all : limit, cate : cate[0], lengthPage : lengthPage, page : 1, thuonghieu : thuonghieu});
                                    }
                                    
                                    let limit = pro.slice((page * 12) -12, (page * 12) );
                                    return res.status(200).render('./users/cate', {all : limit, cate : cate[0], lengthPage : lengthPage, page : page, thuonghieu : thuonghieu});
                                }
                                let limit = pro.slice(0 , 12); 
                                return res.status(200).render('./users/cate', {all : limit, cate : cate[0], lengthPage : lengthPage, page : 1, thuonghieu : thuonghieu});
                            }else{
                                res.status(404).render('./users/error');
                            }
                        })
                    }else{
                        res.status(404).render('./users/error');
                    }
                })
                        
                    
                
                
            }else{
                let limit = pro.slice(0, 12);
                res.render('./users/cate', {all : limit, cate : cate[0], lengthPage : lengthPage, page : 1, thuonghieu : ''});   
            }


        }catch(err){
            if(err) console.log(err);
            
            res.status(404).render('./users/error'); 
        }
    })()

});




router.get('/:link.htm', (req, res) => {
   
      
   
    const link = req.params.link;
    
    connection.query('SELECT * FROM danh_sach', (err, cate) => {
        cate.forEach(e => { 
            let cateAlias = replaceName(e.alias);
           
            connection.query(`SELECT * FROM ${cateAlias}`, (err, pro) => {
                
                pro.forEach(proId => {
                    if(proId.link == link){  
                         
                        Promise.all([
                            connection.query(`SELECT id FROM danh_sach WHERE alias = '${e.alias}'`), 
                            connection.query(`SELECT * FROM ${cateAlias} WHERE link = '${link}'`),
                            connection.query(`SELECT * FROM thuong_hieu`), 
                            
                        ])
                        .then(([cate, pro, thuonghieu]) => {
                            
                            if(!cate[0] || !pro[0]) {  
                                return res.status(404).render('./users/error');
                            }else {
                                connection.query(`SELECT * FROM ${cateAlias} WHERE id != '${pro[0].id}' ORDER BY RAND() LIMIT 8`, (err, recommend) => {
                                    if(err) console.log(err);

                                    // is user
                                    if(req.isAuthenticated()){
                                        // res.redirect(/da-xem)
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
                                                    return res.render(`./users/product/${e.alias}`, {pro : pro, cate : cate, thuonghieu : thuonghieu, recommend : recommend, daxem : all});

                                                },50)
                                            }else {
                                                let all = daxem1.generateArray().reverse();
                                                return res.render(`./users/product/${e.alias}`, {pro : pro, cate : cate, thuonghieu : thuonghieu, recommend : recommend, daxem : all});

                                            }

                                        })
                                    }else {

                                        let daxem2 = new daxem(req.session.ssXem ? req.session.ssXem : {});
                                        return res.render(`./users/product/${e.alias}`, {pro : pro, cate : cate, thuonghieu : thuonghieu, recommend : recommend, daxem : daxem2.generateArray().reverse()});
                                    }

                                   
                                    
                                })
                            }
                        })
                        .catch(err => {
                            console.log(err); 
                            
                            res.status(404).render('./users/error');
                        }
                        );  
                    }
                })
            })
        })
    })
    
    // connection.query(`SELECT * FROM danh_sach WHERE id = '${req.body.dataId1}'`, (err, cateId) => {
    //     const cate = replaceName(cateId[0].alias);
    //     connection.query(`SELECT * FROM ${cate} WHERE link = '${link}'`, (err, pro) => {
    //         res.render('./users/product', {pro : pro, cate : cateId});
    //     })
    // })
    




    // Promise.all([
    //     connection.query(`SELECT id FROM danh_sach WHERE alias = '${req.params.cate}'`),
    //     connection.query(`SELECT * FROM ${cate} WHERE link = '${link}'`)
    // ])
    // .then(([cate, pro]) => {
    //     // user intert /sdfs/213121
    //     if(!cate[0] || !pro[0]) {
    //         throw err;
    //     }else {
            
    //         res.render('./users/product', {pro : pro, cate : cate});
    //     }
    // })
    // .catch(err => {
    //     res.status(404).render('./users/error');
    // }
    // );  
   
});



router.post('/add-cart', (req, res) => {
    let idPro = req.body.productId;
    let idCate = req.body.cateId;
    let qtyPro = parseInt(req.body.productQty);

    if(qtyPro < 1 || qtyPro == '' || !qtyPro) {
        qtyPro = 1;
    }
        
    if(req.isAuthenticated()) { 
        const id = req.user.id;
        Promise.all([
            connection.query('SELECT * FROM danh_sach'),
            connection.query(`SELECT * FROM cart WHERE id_user = '${id}'`),
            connection.query(`SELECT * FROM danh_sach WHERE id = '${idCate}'`)
        ])
        .then(([cate, pro, cateId]) => {
            let cartdata = new CartData(req.session.CartData1 ? req.session.CartData1 : {});
            const cateAlias = replaceName(cateId[0].alias);
            connection.query(`SELECT * FROM ${cateAlias} WHERE id = '${idPro}'`, (err, ePro) => {
                let qtyRepo = ePro[0].so_luong;
                // Check user req.session.CartData1 frist
                if(!req.session.CartData1){
                    for(var i = 0; i < pro.length; i++ ){ 
                        let data = {
                            connection : connection, 
                            idUser : id,
                            idCate : pro[i].id_ds,
                            idPro : pro[i].id_product,
                            idSession : `${pro[i].id_ds}-${pro[i].id_product}`, 
                            qtyPro : pro[i].so_luong,
                        }
                    
                        cartdata.add(data); 
                        req.session.CartData1 = cartdata;
                    }
                    // Qty repository < user inter
                    if(qtyRepo < qtyPro){
                        res.render('./users/cartPartial', {totalCartItems: cartdata.generateArray(), cate : cate, errQty : 1, qtyRepo : qtyRepo});
                    }else{
                        // add two 
                        if(cartdata.items[`${cateId[0].id}-${ePro[0].id}`]) {
                       
                            let proAdd = cartdata.items[`${cateId[0].id}-${ePro[0].id}`];
                            let totalQtyPro = proAdd.qty + qtyPro;
                            // Qty repository < user inter
                            if(qtyRepo < totalQtyPro){
                                res.render('./users/cartPartial', {totalCartItems: cartdata.generateArray(), cate : cate, errQty : 1, qtyRepo : qtyRepo});
                            }else{

                                let dataNew = {
                                    connection : connection,
                                    idUser : id,
                                    idCate : idCate,
                                    idPro : idPro,
                                    idSession : `${idCate}-${idPro}`,  
                                    qtyPro : qtyPro,
                                }
                                
                                
                                cartdata.addNew(dataNew);
                                req.session.CartData1 = cartdata; 
                                setTimeout(() => {
                                    res.render('./users/cartPartial', {totalCartItems: cartdata.generateArray(), cate : cate, errQty : 0, qtyRepo : 0});
                                }, 50) 
                            }
                        }else{
                            let dataNew = {
                                connection : connection,
                                idUser : id,
                                idCate : idCate,
                                idPro : idPro,
                                idSession : `${idCate}-${idPro}`,  
                                qtyPro : qtyPro,
                            }
                            
                            
                            cartdata.addNew(dataNew);
                            req.session.CartData1 = cartdata; 
                            setTimeout(() => {
                                res.render('./users/cartPartial', {totalCartItems: cartdata.generateArray(), cate : cate, errQty : 0, qtyRepo : 0});
                            }, 50) 
                        }
                    }
    
                }else{
                    if(qtyRepo < qtyPro){
                        res.render('./users/cartPartial', {totalCartItems: cartdata.generateArray(), cate : cate, errQty : 1, qtyRepo : qtyRepo});
                    }else{
                        if(cartdata.items[`${cateId[0].id}-${ePro[0].id}`]) {
                       
                            let proAdd = cartdata.items[`${cateId[0].id}-${ePro[0].id}`];
                            let totalQtyPro = proAdd.qty + qtyPro;
                            // Qty repository < user inter
                            if(qtyRepo < totalQtyPro){
                                res.render('./users/cartPartial', {totalCartItems: cartdata.generateArray(), cate : cate, errQty : 1, qtyRepo : qtyRepo});
                            }else{

                                let dataNew = {
                                    connection : connection,
                                    idUser : id,
                                    idCate : idCate,
                                    idPro : idPro,
                                    idSession : `${idCate}-${idPro}`,  
                                    qtyPro : qtyPro,
                                }
                                
                                
                                cartdata.addNew(dataNew);
                                req.session.CartData1 = cartdata; 
                                setTimeout(() => {
                                    res.render('./users/cartPartial', {totalCartItems: cartdata.generateArray(), cate : cate, errQty : 0, qtyRepo : 0});
                                }, 50) 
                            }
                        }else{
                            let dataNew = {
                                connection : connection,
                                idUser : id,
                                idCate : idCate,
                                idPro : idPro,
                                idSession : `${idCate}-${idPro}`,  
                                qtyPro : qtyPro,
                            }
                            
                            
                            cartdata.addNew(dataNew);
                            req.session.CartData1 = cartdata; 
                            setTimeout(() => {
                                res.render('./users/cartPartial', {totalCartItems: cartdata.generateArray(), cate : cate, errQty : 0, qtyRepo : 0});
                            }, 50) 
                        }
                    }
                   
                }
            })
            
        })
 
    // Use Session save cart
    }else {
        (async () => {
            try{
                
                var cart = new Cart(req.session.spCart ? req.session.spCart : {});
                const cate = await connection.query(`SELECT * FROM danh_sach WHERE id = '${idCate}'`);
                const cateAlias = replaceName(cate[0].alias);
                const pro = await connection.query(`SELECT * FROM ${cateAlias} WHERE id = '${idPro}'`);



                let qtyRepo = pro[0].so_luong;
                //console.log(qtyRepo);
                
                if(qtyRepo < qtyPro){
                    console.log('vao 1');
                    
                    // errQty inter maybe = 1000 and qtyRepo alert qty in repository
                    connection.query('SELECT * FROM danh_sach', (err, cate)  => {
                        res.render('./users/cartPartial', {totalCartItems: cart.generateArray(), cate : cate, errQty : 1, qtyRepo : qtyRepo});
                        
                    })

                }else{
                    
                    if(cart.items[`${cate[0].id}-${pro[0].id}`]) {
                       
                        let proAdd = cart.items[`${cate[0].id}-${pro[0].id}`];
                        let totalQtyPro = proAdd.qty + qtyPro;
                        if(qtyRepo < totalQtyPro){
                            connection.query('SELECT * FROM danh_sach', (err, cate)  => {
                                res.render('./users/cartPartial', {totalCartItems: cart.generateArray(), cate : cate, errQty : 1, qtyRepo : qtyRepo});
                                
                            })
                        }else {
                            
                            cart.add(pro[0], `${cate[0].id}-${pro[0].id}`, qtyPro);  
                            req.session.spCart = cart;
                            connection.query('SELECT * FROM danh_sach', (err, cate)  => {
                                res.render('./users/cartPartial', {totalCartItems: cart.generateArray(), cate : cate, errQty : 0, qtyRepo : 0});
                            })
                        }
                        
                        
                    }else{
                        cart.add(pro[0], `${cate[0].id}-${pro[0].id}`, qtyPro); 
                        req.session.spCart = cart;
                        connection.query('SELECT * FROM danh_sach', (err, cate)  => {
                            res.render('./users/cartPartial', {totalCartItems: cart.generateArray(), cate : cate, errQty : 0, qtyRepo : 0});
                        })


                    }

                   
                }



               
            }catch(err) {
                res.status(404).render('./users/error'); 
            }
        })();
    }
    
    
});

router.post('/cart', (req, res) => {
    let qty = parseInt(req.body.productQty);
    let idPro = req.body.productId;
    let idCate = req.body.cateId;
    
    if(qty < 1 || qty == '' || !qty) { 
       
        qty = 1;    
    };
    connection.query(`SELECT * FROM danh_sach WHERE id = '${idCate}'`, (err, cate) => {
        let cateAlias = replaceName(cate[0].alias);
        connection.query(`SELECT * FROM ${cateAlias} WHERE id = '${idPro}'`, (err, pro) => {
            if(req.isAuthenticated()) {
                const id = req.user.id;
                
                connection.query('SELECT * FROM danh_sach', (err, cate)  => {
                    let cartdata = new CartData(req.session.CartData1 ? req.session.CartData1 : {});
                    let qtyRepo = pro[0].so_luong;
                    let dataNew = {
                        connection : connection,
                        idUser : id,
                        idCate : idCate,
                        idPro : idPro,
                        idSession : `${idCate}-${idPro}`,       
                        qtyPro : qty,
                    }
                    if(qtyRepo < qty){
                        connection.query('SELECT * FROM danh_sach', (err, cate)  => {
                            res.render('./users/cartPartial', {totalCartItems: cartdata.generateArray(), cate : cate, errQty : 1, qtyRepo : qtyRepo});
                            
                        })
                    }else{

                        cartdata.update(dataNew);
                        req.session.CartData1 = cartdata; 
                        
                        res.render('./users/cartPartial', {totalCartItems: cartdata.generateArray(), cate : cate, errQty : 0, qtyRepo : 0});
                    }
                    
                })
                
            }else{
                const cart = new Cart(req.session.spCart ? req.session.spCart : {});
                let qtyRepo = pro[0].so_luong;
                //console.log(qtyRepo);
                
                if(qtyRepo < qty){
                   
                    // errQty inter maybe = 1000 and qtyRepo alert qty in repository
                    connection.query('SELECT * FROM danh_sach', (err, cate)  => {
                        res.render('./users/cartPartial', {totalCartItems: cart.generateArray(), cate : cate, errQty : 1, qtyRepo : qtyRepo});
                        
                    })

                }else{

                    cart.update(`${idCate}-${idPro}`, qty); 
                    req.session.spCart = cart;
                    connection.query('SELECT * FROM danh_sach', (err, cate)  => {
                        res.render('./users/cartPartial', {totalCartItems: cart.generateArray(), cate : cate, errQty : 0, qtyRepo : 0});
                    })

                   
                }
            }
        })
    })
   
});

router.post('/cart/delete', (req, res) => {
    let idPro = req.body.productId;
    let idCate = req.body.cateId;
    if(req.isAuthenticated()) {
        const id = req.user.id;
        connection.query('SELECT * FROM danh_sach', (err, cate)  => {
            let cartdata = new CartData(req.session.CartData1 ? req.session.CartData1 : {});
            let dataNew = {
                connection : connection,
                idUser : id,
                idCate : idCate,
                idPro : idPro,
                idSession : `${idCate}-${idPro}`,  
            }
            cartdata.delete(dataNew);
            req.session.CartData1 = cartdata;
            res.render('./users/cartPartial', {totalCartItems: cartdata.generateArray(), cate : cate, errQty : 0, qtyRepo : 0});
        })
    }else {



        const cart = new Cart(req.session.spCart ? req.session.spCart : {});
        cart.remove(`${idCate}-${idPro}`)
        req.session.spCart = cart;
        connection.query('SELECT * FROM danh_sach', (err, cate)  => {
            res.render('./users/cartPartial', {totalCartItems: cart.generateArray(), cate : cate, errQty : 0, qtyRepo : 0});
        });
    }
});

router.get('/checkout', (req, res) => {
    if(req.isAuthenticated()) {
        let cartdata = new CartData(req.session.CartData1 ? req.session.CartData1 : {});
        connection.query('SELECT * FROM danh_sach', (err, cate)  => {
            res.render('./users/checkout', {totalCartItems: cartdata.generateArray(), cate : cate, errQty : 0, qtyRepo : 0});
        });
    }else {
        const cart = new Cart(req.session.spCart ? req.session.spCart : {});
        connection.query('SELECT * FROM danh_sach', (err, cate)  => {
            res.render('./users/checkout', {totalCartItems: cart.generateArray(), cate : cate, errQty : 0, qtyRepo : 0});
        });
    }
    
});

router.post('/checkout/delete', (req, res) => {
    let idPro = req.body.productId;
    let idCate = req.body.cateId;
    if(req.isAuthenticated()) {
        const id = req.user.id;
        connection.query('SELECT * FROM danh_sach', (err, cate)  => {
            let cartdata = new CartData(req.session.CartData1 ? req.session.CartData1 : {});
            let dataNew = {
                connection : connection,
                idUser : id,
                idCate : idCate,
                idPro : idPro,
                idSession : `${idCate}-${idPro}`,  
            }
            cartdata.delete(dataNew);
            req.session.CartData1 = cartdata;
            res.render('./users/checkoutPartial', {totalCartItems: cartdata.generateArray(), cate : cate, errQty : 0, qtyRepo : 0});
        })

    }else {
        const cart = new Cart(req.session.spCart ? req.session.spCart : {});
        cart.remove(`${idCate}-${idPro}`)
        req.session.spCart = cart;
        connection.query('SELECT * FROM danh_sach', (err, cate)  => {
            res.render('./users/checkoutPartial', {totalCartItems: cart.generateArray(), cate : cate, errQty : 0, qtyRepo : 0});
        });
    }
    
});

router.post('/checkout/update', (req, res) => { 
    
    let qty = parseInt(req.body.productQty);
    let idPro = req.body.productId;
    let idCate = req.body.cateId;
    //console.log(qty);
    
    if(qty < 1 || qty == '' || !qty) { 
        qty = 1;    
    }

    if(req.isAuthenticated()) {
        const id = req.user.id;
        
        connection.query(`SELECT * FROM danh_sach WHERE id = '${idCate}'`, (err, cate) => {
        
            let cartdata = new CartData(req.session.CartData1 ? req.session.CartData1 : {});
            let dataNew = {
                connection : connection,
                idUser : id,
                idCate : idCate,
                idPro : idPro,
                idSession : `${idCate}-${idPro}`,   
                qtyPro : qty,
            }


            let cateAlias = replaceName(cate[0].alias);
            connection.query(`SELECT * FROM ${cateAlias} WHERE id = '${idPro}'`, (err, pro) => {
                let qtyRepo = pro[0].so_luong;
                //console.log(qtyRepo);
                
                if(qtyRepo < qty){
                    // res.send(`Số lượng trong kho chỉ ${qtyRepo} còn  sản phẩm`);
                    // errQty inter maybe = 1000 and qtyRepo alert qty in repository
                    connection.query('SELECT * FROM danh_sach', (err, cate)  => {
                        res.render('./users/checkoutPartial', {totalCartItems: cartdata.generateArray(), cate : cate, errQty : 1, qtyRepo : qtyRepo});
                        
                    })

                }else{

                    cartdata.update(dataNew); 
                    req.session.CartData1 = cartdata;
                    connection.query('SELECT * FROM danh_sach', (err, cate)  => {
                        res.render('./users/checkoutPartial', {totalCartItems: cartdata.generateArray(), cate : cate, errQty : 0, qtyRepo : 0});
                    })

                    
                }
            })
                
                
                // cartdata.update(dataNew);
                // req.session.CartData1 = cartdata; 
                
                // res.render('./users/checkoutPartial', {totalCartItems: cartdata.generateArray(), cate : cate});
                
            })
        
    }else {
       
        const cart = new Cart(req.session.spCart ? req.session.spCart : {});
        connection.query(`SELECT * FROM danh_sach WHERE id = '${idCate}'`, (err, cate) => {
            let cateAlias = replaceName(cate[0].alias);
            connection.query(`SELECT * FROM ${cateAlias} WHERE id = '${idPro}'`, (err, pro) => {
                let qtyRepo = pro[0].so_luong;
                //console.log(qtyRepo);
                
                if(qtyRepo < qty){
                    // res.send(`Số lượng trong kho chỉ ${qtyRepo} còn  sản phẩm`);
                    // errQty inter maybe = 1000 and qtyRepo alert qty in repository
                    connection.query('SELECT * FROM danh_sach', (err, cate)  => {
                        res.render('./users/checkoutPartial', {totalCartItems: cart.generateArray(), cate : cate, errQty : 1, qtyRepo : qtyRepo});
                        
                    })

                }else{

                    cart.update(`${idCate}-${idPro}`, qty); 
                    req.session.spCart = cart;
                    connection.query('SELECT * FROM danh_sach', (err, cate)  => {
                        res.render('./users/checkoutPartial', {totalCartItems: cart.generateArray(), cate : cate, errQty : 0, qtyRepo : 0});
                    })

                   
                }
            })
        })

       

    }

});

router.post('/select', (req, res) => {
    const val = req.body.val
    const cateId = req.body.cateId;
    const thuonghieu = req.body.nsx;
    //console.log(req.body.val);
    if(val == 'esc') { 
        (async () => {
            let cate = await connection.query(`SELECT * FROM danh_sach WHERE id = '${cateId}'`);
            let cateAlias = replaceName(cate[0].alias);
            let pro = await connection.query(`SELECT * FROM ${cateAlias} ORDER BY gia`);
            res.render('./users/catePartial', {all : pro, cate : cate[0]});
            // if(thuonghieu != '') {
                
            //     res.render('./users/catePartial', {all : pro, cate : cate[0]});
                
            // }else{
            //     connection.query(`SELECT * FROM thuong_hieu WHERE alias = '${thuonghieu}'`, (err, nsx) => {
                    
            //         if(err) console.log(err);
            //         // ?thuonghieu = dsfsd23i
            //         if(nsx[0]){

            //             connection.query(`SELECT * FROM ${cateAlias} WHERE id_nsx = '${nsx[0].id}' ORDER BY percent DESC`, (err, pro) => {
            //                 // Maybe nothing product in nsx
            //                 const lengthPage = Math.ceil(pro.length /12);
                            
            //                 if(pro[0]){
            //                     if(req.query.pagensx) {
            //                         let page = Math.ceil(req.query.pagensx);
            //                         let checkPage = /^[0-9]+$/;
            //                         // check user inter ?page = 100000 , -2000, abcs
            //                         if(lengthPage < page || page < 1 || !checkPage.test(page) ){
            //                             console.log('vao day1');
                                        
            //                             let limit = pro.slice(0, 12);
            //                             return res.status(200).render('./users/cate', {all : limit, cate : cate[0], lengthPage : lengthPage, page : 1, thuonghieu : thuonghieu});
            //                         }
                                    
            //                         let limit = pro.slice((page * 12) -12, (page * 12) );
            //                         return res.status(200).render('./users/cate', {all : limit, cate : cate[0], lengthPage : lengthPage, page : page, thuonghieu : thuonghieu});
            //                     }
            //                     let limit = pro.slice(0 , 12); 
            //                     return res.status(200).render('./users/cate', {all : limit, cate : cate[0], lengthPage : lengthPage, page : 1, thuonghieu : thuonghieu});
            //                 }else{
            //                     res.status(404).render('./users/error');
            //                 }
            //             })
            //         }else{
            //             res.status(404).render('./users/error');
            //         }
            //     })
            //}
            
            
        })()
    }else if(val == 'desc') {
        (async () => {
            
            let cateAsync = await connection.query('SELECT * FROM danh_sach');
            let cate = await connection.query(`SELECT * FROM danh_sach WHERE id = '${cateId}'`);
            let cateAlias = replaceName(cate[0].alias);
            let pro = await connection.query(`SELECT * FROM ${cateAlias} ORDER BY gia DESC`);
            res.render('./users/catePartial', {all : pro, cate : cate[0]});
            
        })()
    }else{
        (async () => {
            
            let cateAsync = await connection.query('SELECT * FROM danh_sach');
            let cate = await connection.query(`SELECT * FROM danh_sach WHERE id = '${cateId}'`);
            let cateAlias = replaceName(cate[0].alias);
            let pro = await connection.query(`SELECT * FROM ${cateAlias} ORDER BY percent DESC`);
            res.render('./users/catePartial', {all : pro, cate : cate[0]});
            
        })()
    }

    
});
// (async () => {
//     //console.log(cateAsync);
//     let cateAsync = connection.query('SELECT * FROM danh_sach');
//     let cate = await connection.query(`SELECT * FROM danh_sach WHERE id = '3'`);
//     let cateAlias = replaceName(cate[0].alias);
//     let pro = await connection.query(`SELECT * FROM ${cateAlias} ORDER BY gia`);
//     console.log(cateAsync);
    
//     res.render('./users/catePartial', {all : pro, cate : cate[0]});
    
// })()
// (async () => {
//     //console.log(cateAsync);
    
//     let a =  connection.query(`SELECT * FROM danh_sach WHERE id = '3'`);
//     let b =  connection.query(`SELECT * FROM danh_sach WHERE id = '4'`);
//     await setTimeout(() => {
//         console.log(a);
//     },1000)
//     await setTimeout(() => {
//         console.log(b);

//     },1000)
    
    
    
    
// })()
 
router.post('/search', (req, res) => {
   

    connection.query(`SELECT link, ten, hinh_anh FROM vga WHERE ten LIKE N'%${req.body.search}%'
                    UNION
                    SELECT link, ten, hinh_anh FROM ban_phim WHERE ten LIKE N'%${req.body.search}%'
                    UNION
                    SELECT link, ten, hinh_anh FROM chuot WHERE ten LIKE N'%${req.body.search}%'
                    UNION
                    SELECT link, ten, hinh_anh FROM cpu WHERE ten LIKE N'%${req.body.search}%'
                    UNION
                    SELECT link, ten, hinh_anh FROM hdd WHERE ten LIKE N'%${req.body.search}%'
                    UNION
                    SELECT link, ten, hinh_anh FROM main WHERE ten LIKE N'%${req.body.search}%'
                    UNION
                    SELECT link, ten, hinh_anh FROM man_hinh WHERE ten LIKE N'%${req.body.search}%'
                    UNION
                    SELECT link, ten, hinh_anh FROM nguon WHERE ten LIKE N'%${req.body.search}%'
                    UNION
                    SELECT link, ten, hinh_anh FROM ram WHERE ten LIKE N'%${req.body.search}%'
                    UNION
                    SELECT link, ten, hinh_anh FROM ssd WHERE ten LIKE N'%${req.body.search}%'
                    UNION
                    SELECT link, ten, hinh_anh FROM tai_nghe WHERE ten LIKE N'%${req.body.search}%'
                    UNION
                    SELECT link, ten, hinh_anh FROM tan_nhiet WHERE ten LIKE N'%${req.body.search}%'
                    UNION
                    SELECT link, ten, hinh_anh FROM thung_may WHERE ten LIKE N'%${req.body.search}%'
    `, (err, row) => {
        let result = [];
        row.forEach(e => {
            const img = e.hinh_anh.split(',')
            //result.push(res.render('./users/search'), {ten : e.ten, link : e.link, img : e.hinh_anh})
            result.push(`
                <a href="/${e.link}.htm">${e.ten}</a>
            `)
        })
        
        res.send(result);
    })
    
    
});


router.get('/checkout/orther', (req, res) => {
    let error = {
        province : '',
        name : '',
        phone : '',
        diachi : ''
    }
    if( req.isAuthenticated() && !req.session.CartData1) {
        

        const id = req.user.id;
        Promise.all([
            connection.query(`SELECT * FROM cart WHERE id_user = '${id}'`),
            connection.query('SELECT * FROM tinh')
        ])
        .then(([pro, province]) => {
            let cartdata = new CartData(req.session.CartData1 ? req.session.CartData1 : {});
            let cart = new Cart(req.session.spCart ? req.session.spCart : {});
            let generateSs = cart.generateArray();
            for(var i = 0; i < pro.length; i++ ){ 
                let data = {
                    connection : connection, 
                    idUser : id,
                    idCate : pro[i].id_ds,
                    idPro : pro[i].id_product,
                    idSession : `${pro[i].id_ds}-${pro[i].id_product}`, 
                    qtyPro : pro[i].so_luong,
                }
            
                cartdata.add(data); 
                req.session.CartData1 = cartdata;
            };
            for(var i = 0; i < generateSs.length; i++ ){ 
                let dataNew = {
                    connection : connection,
                    idUser : id,
                    idCate : generateSs[i].item.id_ds,
                    idPro : generateSs[i].item.id,
                    idSession : `${generateSs[i].item.id_ds}-${generateSs[i].item.id}`, 
                    qtyPro : generateSs[i].qty, 
                }
            
                cartdata.addNew(dataNew);
                req.session.CartData1 = cartdata;  
            };
            setTimeout(() => {
                req.session.spCart = '';
                totalQty(req);
                totalQtyUser(req);
               
                res.render('./users/checkoutOther', {errEmail : '',tinh : province, all : cartdata.generateArray(), err : error });  
            }, 50) 
        })
    }else{
        
        
        connection.query('SELECT * FROM tinh', (err, province) => {
            let cartdata = new CartData(req.session.CartData1 ? req.session.CartData1 : {});
            res.render('./users/checkoutOther', {errEmail : req.flash('err-email'),tinh : province, all : cartdata.generateArray(), err : error});  
           
        })
        
    }
    
});
router.post('/checkout/orther', (req, res) => {
    (async () => {
        try{
            let error = {
                province : '',
                name : '',
                phone : '',
                diachi : ''
            }
            let idUser = req.user.id;
            console.log(idUser);
            
            let cartdata = new CartData(req.session.CartData1 ? req.session.CartData1 : {});
            let province = await connection.query('SELECT * FROM tinh');
            let name = req.body.name;
            let phone = req.body.phone;
            let diachi = req.body.diachi;
            let testPhone = /^[0-9]+$/;
            let testName = /^[a-zA-Z0-9À ÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐđĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀẾỂưăạảấầẩẫậắằẳẵặẹẻẽềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/;

            if(!testName.test(name) || name.length < 5 || name.length >= 50){
                error.name = 'Tên không đúng và không có ký tự đặc biệt'
                return res.render('./users/checkoutOther', {tinh : province, all : cartdata.generateArray(),  err : error}); 
            }   
            if(phone.length <= 9 || phone.length >= 12 || !testPhone.test(phone)) {
                error.phone = 'Số điện thoại phải là số';
                return res.render('./users/checkoutOther', {tinh : province, all : cartdata.generateArray(),  err : error}); 
            }
            if(diachi.length <= 9 || diachi.length >= 150) {
                error.diachi = 'Địa chỉ từ 10 đến 150 ký tự';
                return res.render('./users/checkoutOther', {tinh : province, all : cartdata.generateArray(),  err : error}); 
            }

            let checkProvince = await connection.query(`SELECT * FROM tinh WHERE matp = '${req.body.province}'`);
            let checkDictrict = await connection.query(`SELECT * FROM quan_huyen WHERE maqh = '${req.body.dictrict}' AND matp = '${req.body.province}'`);
            let checkXaphuong = await connection.query(`SELECT * FROM xa_phuong WHERE xaid = '${req.body.ward}' AND maqh = '${req.body.dictrict}'`);
            if(!checkDictrict[0] || !checkXaphuong[0]){
                error.province = 'Thông tin địa chỉ không đúng. Bạn vui lòng thử lại';
                return res.render('./users/checkoutOther', {tinh : province, all : cartdata.generateArray(),  err : error});  
             
            }
            let date = new Date();
            let total = 0; 
            cartdata.generateArray().forEach(e => {
                total += e.price;
            })
            
            
            let dateSql = `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
            connection.query(`INSERT INTO checkout(ten, phone, diachi, tinh, quan_huyen, xa_phuong, date, idUser, state, tong_tien) VALUES ('${req.body.name}', '${req.body.phone}', '${req.body.diachi}', '${checkProvince[0].ten}', '${checkDictrict[0].ten}', '${checkXaphuong[0].ten}', '${dateSql}', '${idUser}', '0', '${total}')`, (err, rows) => {
                if(err) console.log(err);
                Promise.all([
                    connection.query(`SELECT id FROM checkout WHERE idUser = '${idUser}' AND date = '${dateSql}'`),
                    connection.query(`SELECT * FROM cart WHERE id_user = '${idUser}'`)
                ])
                .then(([checkout, cart]) => {
                    cart.forEach(e => {
                        connection.query(`INSERT INTO product_checkout(madh, id_product, id_ds, so_luong, idUser, price) VALUES ('${checkout[0].id}', '${e.id_product}', '${e.id_ds}', '${e.so_luong}', '${idUser}', '${e.price}')`, (err, data) => {

                        })
                    })
                    connection.query(`DELETE FROM cart WHERE id_user = '${idUser}'`);
                    req.session.CartData1 = '';
                    return res.redirect('/');
                })
                
                
            })

        }catch(err) {
            console.log(err);
            
            res.status(404).render('./users/error'); 
        }
    })(); 
    
})

router.post('/dictrict', (req, res) => {
    let province = req.body.province;
    connection.query(`SELECT * FROM quan_huyen WHERE matp = '${province}'`, (err, rows) => {
        res.send(rows)
    })
    
    
});
router.post('/ward', (req, res) => { 
    let dictrict = req.body.dictrict;
    connection.query(`SELECT * FROM xa_phuong WHERE maqh = '${dictrict}'`, (err, rows) => {
        res.send(rows)
    })
    
    
});
router.post('/checkout/orther', passport.authenticate('local-signin', {failureRedirect:'/checkout/orther', successRedirect:'/checkout/orther'}));




module.exports = router;
