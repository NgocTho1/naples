module.exports = function daxem(e) {
    this.items = e.items || {};
    function replaceName(ds) {
        ds = ds.replace(/-/, '_');
        return ds;
    }
   
    this.addNew = function(data, id) {       
        //delete this.items[id];
        
        data.connection.query(`SELECT * FROM danh_sach WHERE id = '${data.idCate}'`, (err, cate) => {
            const cateAlias = replaceName(cate[0].alias);
            data.connection.query(`SELECT * FROM ${cateAlias} WHERE id = '${data.idPro}'`, (err, pro) => {
                delete this.items[id];
                data.connection.query(`DELETE FROM da_xem WHERE id_user = '${data.idUser}' AND id_product = '${data.idPro}' AND id_ds = '${data.idCate}'`,(err, row) => {
                    
                })
                var storedItem = this.items[id]; 
                if(!storedItem){
                    storedItem = this.items[id] = {item: pro[0], qty: 0, price: 0};
                    // data.connection.query(`SELECT * FROM da_xem WHERE id_user = '${data.idUser}' AND id_product = '${data.idPro}' AND id_ds = '${data.idCate}'`, (err, rows) => {
                        
                    //     if(rows[0] == undefined) {
                    //         console.log('vao day 1');
                            
                    data.connection.query(`INSERT INTO da_xem(id_user, id_product, id_ds) VALUES (${data.idUser}, ${data.idPro}, ${data.idCate})`, (err, rows) => {
                        if(err) console.log(err);
                        
                    })
                        //}
                        
                    //})
                }
            })
        })
        
    };

    this.add = function(data, id) {   
        
        data.connection.query(`SELECT * FROM danh_sach WHERE id = '${data.idCate}'`, (err, cate) => {
            const cateAlias = replaceName(cate[0].alias);
            data.connection.query(`SELECT * FROM ${cateAlias} WHERE id = '${data.idPro}'`, (err, pro) => {
                var storedItem = this.items[id]; 
                if(!storedItem){
                    storedItem = this.items[id] = {item: pro[0], qty: 0, price: 0};
                   
                }
            })
        })
    }

    
    
    this.generateArray=function() {
        var arr = [];
        for(var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    }
}