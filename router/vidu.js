// function chuyentien(e) {
//     let vitri = e.split('');
//     let result = '';
//     let index = Math.ceil((vitri.length)/3);
//     if(index == 2) {
//         let add = vitri.length - 3;
//         vitri.splice(add, 0 , '.');
//         vitri.forEach(e => {
//             result += e;
//         });
//         return result;
//     }
//     if(index == 3) {
//         let add = vitri.length - 3;
//         vitri.splice(add, 0 , '.');
        
//         let add1= vitri.length - 7;
//         vitri.splice(add1, 0 , '.');
//         vitri.forEach(e => {
//             result += e;
//         });
//         return result;
        
//     }
//     if(index == 4) {
//         let add = vitri.length - 3;
//         vitri.splice(add, 0 , '.');
        
//         let add1 = vitri.length - 7;
//         vitri.splice(add1, 0 , '.');

//         let add2 = vitri.length - 11;
//         vitri.splice(add2, 0 , '.');
//         vitri.forEach(e => {
//             result += e;
//         });
//         return result;
        
//     }
    
    
    
// }
function chuyentien() {
    this.input = function(e){

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

let io = new chuyentien();
console.log(io.input('100000'));





