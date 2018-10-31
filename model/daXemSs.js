module.exports = function daxem(e) {
    this.items = e.items || {};
    
   
    this.add = function(item, id) {       
        delete this.items[id];
        var storedItem = this.items[id]; 
        
        if(!storedItem){
            storedItem = this.items[id] = {item: item};
        };
        
        
      
    };
    
    
    this.generateArray=function() {
        var arr = [];
        for(var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    }
}