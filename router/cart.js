const express = require('express');
const router = express.Router();
const connection = require('../config/connection.js');

function replaceName(ds) {
    ds = ds.replace(/-/, '_');
    return ds;
}

router.get('/danh-sach', (req, res) => {
    Promise.all([
        connection.query('SELECT * FROM danh_sach'), 
        connection.query('SELECT * FROM checkout')
    ])
    .then(([cate, checkout]) => {

        res.render('./admin/cart/danh-sach', {cate : cate, checkout : checkout});

    })
    
});
router.get('/:id', (req, res) => {
    let id = req.params.id;
    Promise.all([
        connection.query('SELECT * FROM danh_sach'),
        connection.query(`SELECT * FROM checkout WHERE id = '${id}'`),
        connection.query(`SELECT * FROM product_checkout WHERE madh = '${id}'`)
    ])
    .then(([cate, checkout, proCheckout]) => {
        let ten = [];
        proCheckout.forEach(e => {
            connection.query(`SELECT * FROM danh_sach WHERE id = '${e.id_ds}'`, (err, alias) => {
                const cateAlias = replaceName(alias[0].alias);
                connection.query(`SELECT ten, link FROM ${cateAlias} WHERE id = '${e.id_product}'`, (err, pro) => {
                    ten.push(pro[0]);
                })

            })
        })
        
        setTimeout(() => {
            
            
            res.render('./admin/cart/chitiet', { cate : cate, checkout : checkout[0], proCheckout : proCheckout, ten :ten });

        }, 50)
    })
    
});

router.get('/giao-hang/:id', (req, res) => {
    let id = req.params.id; 
    connection.query(`UPDATE checkout SET state = '1' WHERE id = '${id}'`, (err, rows) => {
        res.redirect('/admin/cart/danh-sach')
    })

    
    
});
router.get('/thanh-toan/:id', (req, res) => {
    let id = req.params.id; 
    
    connection.query(`UPDATE checkout SET state = '2' WHERE id = '${id}'`, (err, rows) => {
        res.redirect('/admin/cart/danh-sach')
    })
    
});


module.exports = router;