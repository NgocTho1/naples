module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    function replaceName(ds) {
        ds = ds.replace(/-/, '_');
        return ds;
    }
    this.addNew = function(data) {

        data.connection.query(`SELECT * FROM danh_sach WHERE id = '${data.idCate}'`, (err, cate) => {
            
            const cateAlias = replaceName(cate[0].alias);
            data.connection.query(`SELECT * FROM ${cateAlias} WHERE id = '${data.idPro}'`, (err, pro) => {
              
                var storedItem = this.items[data.idSession]; 
                if(!storedItem){
                    
                    storedItem = this.items[data.idSession] = {item: pro[0], qty: 0, price: 0};
                    
                    setImmediate(() => {

                        data.connection.query(`INSERT INTO cart(id_user, id_product, id_ds, so_luong, price) VALUES (${data.idUser}, ${data.idPro}, ${data.idCate}, ${data.qtyPro}, ${storedItem.price})`, (err, rows) => {
                            if(err) console.log(err);
                        
                            console.log('vao into'); 
                        
                        })
                    })
                }
                
                
                storedItem.qty = storedItem.qty + data.qtyPro;
                if(storedItem.item.giam_gia != 0) {
                    storedItem.price = storedItem.item.giam_gia * storedItem.qty; 
                }else {
                    storedItem.price = storedItem.item.gia * storedItem.qty;
                }   
                
                setTimeout(() => {
                    
                    data.connection.query(`UPDATE cart SET price = '${storedItem.price}', so_luong = '${storedItem.qty}' WHERE id_user = '${data.idUser}' AND id_product = '${data.idPro}' AND id_ds = '${data.idCate}'`, (err, rows) => {
                        if(err) console.log(err);
                        
                        console.log('vao update');
                        
                    })
                })

            });
           
            
        })

    }
    this.add = function(data) {
       

        data.connection.query(`SELECT * FROM danh_sach WHERE id = '${data.idCate}'`, (err, cate) => {
            
            const cateAlias = replaceName(cate[0].alias);
            data.connection.query(`SELECT * FROM ${cateAlias} WHERE id = '${data.idPro}'`, (err, pro) => {
              
                var storedItem = this.items[data.idSession]; 
                if(!storedItem){
                    storedItem = this.items[data.idSession] = {item: pro[0], qty: 0, price: 0};
                   
                    
                   
                };
                
                storedItem.qty = storedItem.qty + data.qtyPro;
                if(storedItem.item.giam_gia != 0) {
                    storedItem.price = storedItem.item.giam_gia * storedItem.qty;
                }else {
                    storedItem.price = storedItem.item.gia * storedItem.qty;
                }   
                
                
            })
        });
       
        
    }
    this.update = function(data) {
        var storedItem = this.items[data.idSession]; 
        storedItem.qty = data.qtyPro;
        if(storedItem.item.giam_gia != 0) {
            storedItem.price = storedItem.item.giam_gia * storedItem.qty;
        }else {
            storedItem.price = storedItem.item.gia * storedItem.qty;
        }   
        
        data.connection.query(`UPDATE cart SET price = '${storedItem.price}', so_luong = '${storedItem.qty}' WHERE id_user = '${data.idUser}' AND id_product = '${data.idPro}' AND id_ds = '${data.idCate}'`, (err, rows) => {
        })
    }
    this.delete = function(data) {
        delete this.items[data.idSession];
        data.connection.query(`DELETE FROM cart WHERE id_user = '${data.idUser}' AND id_product = '${data.idPro}' AND id_ds = '${data.idCate}'`, (err, rows) => {
        })
    }

    this.generateArray = function() {
        var arr = [];
        for(var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    }


}