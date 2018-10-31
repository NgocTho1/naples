module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    
   
    this.add = function(item, id, soluong) {       
        
        var storedItem = this.items[id]; 
        if(!storedItem){
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        };
       
        storedItem.qty += soluong;      
        
        if(storedItem.item.giam_gia != 0) {
            storedItem.price = storedItem.item.giam_gia * storedItem.qty;
        }else {
            storedItem.price = storedItem.item.gia * storedItem.qty;
        }                   
      
    };
    this.update=function(id , soluong) { 
        var storedItem = this.items[id];
        
        storedItem.qty = soluong;
        if(storedItem.item.giam_gia != 0) {
            storedItem.price = storedItem.item.giam_gia * storedItem.qty;
        }else {
            storedItem.price = storedItem.item.gia * storedItem.qty;
        }          
       
    }
    this.remove = function(id) {
        
        delete this.items[id];
    }
    
    this.generateArray=function() {
        var arr = [];
        for(var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    }
}