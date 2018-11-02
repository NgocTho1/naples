$(document).ready(function (){


   
    function data(group) {
        return  {
            productId: group.find('.cart-update').attr('data-id'),
            cateId : group.find('.cart-update').attr('data-cate'),
            val : group.find('.cart-update').val()
        };
    }
    

    $('#product .update').blur(function() {
        var val = $(this).val();
        if (val < 1) {
            $(this).val(1);
        }
    })

    $(document).on('click', '.minus', function() {
        const val =  $('.update').val();
        if (val > 1) {
            $('.update').val(parseInt(val) - 1);
        };
    });
    $(document).on('click', '.plus', function() {
        const val =  $('.update').val();
        $('.update').val(parseInt(val) + 1);
    });


    $('.add-to-cart').click(function() {
        if(parseInt($('#product .update').val()) < 1) {
            $('#product .update').val(1);
        }
        
        
        $.ajax({
            url: '/add-cart',
            method: 'POST',
            data: {
                productId : $('#productId').val(),
                cateId : $('#cateId').val(),
                productQty : $('#product .update').val()
            }
        })
        .done(function(msg) {
            $('#product .modal-body').html(msg);
            const totalQty = $('#totalQty').val();
            $('#cartNumber').text(totalQty)
        })
    })

    $(document).on('click', '#product .cart-minus', function() {
        const group = $(this).closest('.add');
        let dataNew = data(group);
      
        if (dataNew.val > 1) {
            $('.cart-update').val(parseInt(dataNew.val) - 1);
        };
        $.ajax({
            url: '/cart',
            method: 'POST',
            data: {
                productId : dataNew.productId,
                cateId : dataNew.cateId,
                productQty : parseInt(dataNew.val) -1
            }
        })
        .done(function(msg) {
            $('#product .modal-body').html(msg);
            const totalQty = $('#totalQty').val();
            $('#cartNumber').text(totalQty)
        })
    });
    $(document).on('click', '#product .cart-plus', function() {
        const group = $(this).closest('.add');
        let dataNew = data(group);
        
        $.ajax({
            url: '/cart',
            method: 'POST',
            data: {
                productId : dataNew.productId,
                cateId : dataNew.cateId,
                productQty : parseInt(dataNew.val) +1
            }
        })
        .done(function(msg) {
            $('#product .modal-body').html(msg);
            const totalQty = $('#totalQty').val();
            $('#cartNumber').text(totalQty)
        })
    });

    $(document).on('blur', '#product .cart-update', function() {
        const group = $(this).closest('.add');
        const dataNew = data(group);
       
        $.ajax({
            url: '/cart',
            method: 'POST',
            data: { 
                productId : dataNew.productId,
                cateId  : dataNew.cateId,
                productQty : parseInt(dataNew.val)
            }
        })
        .done(function(msg) {
            $('#product .modal-body').html(msg);
            const totalQty = $('#totalQty').val();
            $('#cartNumber').text(totalQty)
            
        })
        
    })

    $(document).on('click', '#product span.deleteCart', function() {
        const group = $(this).closest('.cart-content');
        const dataNew = data(group);
       
        $(document).on('click', '.accept', function() {
            $.ajax({
                url: '/cart/delete',
                method: 'POST',
                data: {
                    productId : dataNew.productId, 
                    cateId : dataNew.cateId,
                }
            })
            .done(function(msg) {
                $('#product .modal-body').html(msg);
                const totalQty = $('#totalQty').val();
                $('.class-close').click();
                $('#cartNumber').text(totalQty)
            })
        })
       
    })
    $(document).on('click', '.checkout span.deleteCart', function() {
        const group = $(this).closest('.cart-content');
        let dataNew = data(group);
     
        $(document).on('click', '.accept', function() {
            $.ajax({
                url: '/checkout/delete',
                method: 'POST',
                data: {
                    productId : dataNew.productId,
                    cateId : dataNew.cateId,
                }
            })
            .done(function(msg) {
                $('.checkout').html(msg);
                $('.close').click();
                const totalQty = $('#totalQty').val();
               
                $('#cartNumber').text(totalQty)
            })
        })
       
    })
    $(document).on('click', '.checkout .cart-minus', function() {
        const group = $(this).closest('.add');
        let dataNew = data(group);
        if (dataNew.val > 1) {
         
            $.ajax({
                url: '/checkout/update',
                method: 'POST',
                data: {
                    productId : dataNew.productId,
                    cateId : dataNew.cateId,
                    productQty : parseInt(dataNew.val) -1
                }
            })
            .done(function(msg) {
               
                $('.checkout').html(msg);
                const totalQty = $('#totalQty').val();
                $('#cartNumber').text(totalQty);
              
            })
        };
    });
    $(document).on('click', '.checkout .cart-plus', function() {
        const group = $(this).closest('.add');
        let dataNew = data(group);
      
        $.ajax({
            url: '/checkout/update',
            method: 'POST',
            data: {
                productId : dataNew.productId,
                cateId : dataNew.cateId,
                productQty : parseInt(dataNew.val) +1
            }
        })
        .done(function(msg) {
            
            $('.checkout').html(msg);
            const totalQty = $('#totalQty').val();
            $('#cartNumber').text(totalQty)
            
        })
    });

    $(document).on('blur', '.checkout .cart-update', function() {
        const group = $(this).closest('.add');
        let dataNew = data(group);
        $.ajax({
            url: '/checkout/update',
            method: 'POST',
            data: { 
                productId : dataNew.productId,
                cateId  : dataNew.cateId,
                productQty : parseInt(dataNew.val)
            }
        })
        .done(function(msg) {
           
            $('.checkout').html(msg);
            const totalQty = $('#totalQty').val();
            $('#cartNumber').text(totalQty)
            
        })
        
    })
    
    $(document).on('change', '#select', function() {
        let val = $('#select option:selected').val();
        let cateId = $('#select').attr('data-cate');
        let nsx = $('#select').attr('data-nsx');
        
        $.ajax({
            url: '/select',
            method: 'POST',
            data: { 
                val : val,
                cateId : cateId,
                nsx : nsx
            }
        })
        .done(function(msg) {
            
            $('#content .row').html(msg);
        })

    })
    
    
    $('.search-input').keyup(function() {
        var val = $(this).val();
        
        if (val != '') {
            $.post('/search', {
                search: val
            }, function(data) {
                    
                $('.suggest').html('');
                $('.suggest').append(data);
                 
            })
        }else {
            $('.suggest').html('')
        }
        
    })

    function daxem() {
        const productId = $('#productId').val();
        const cateId = $('#cateId').val();
        if(productId != undefined && cateId != undefined){
           
            $.ajax({
                url: '/user/updateDX', 
                method: 'POST', 
                data: { 
                    productId : productId, 
                    cateId : cateId
                }
            })
            .done(function(msg) {
                
                
            })
        }
        
    }
    daxem();
    
    $('#province').change(function() {
        let province = $('#province').val();
        $.ajax({
            url: '/dictrict', 
            method: 'POST', 
            data: { 
                province : province, 
                
            }
        })
        .done(function(data) {
            $('#dictrict').html('<option value="">Chọn Quận/Huyện</option>');
            $('#ward').html('<option value="">Chọn Xã</option>');
            data.forEach(e => {
                $('#dictrict').append(`<option value="${e.maqh}"> ${e.ten} </option>`)
            })
                
        })
        
    })

    $('#dictrict').change(function() {
        let dictrict = $('#dictrict').val();
        $.ajax({
            url: '/ward', 
            method: 'POST', 
            data: { 
                dictrict : dictrict, 
                
            }
        })
        .done(function(data) {
            $('#ward').html('<option value="">Chọn Xã</option>');
            data.forEach(e => {
                $('#ward').append(`<option value="${e.xaid}">${e.ten}</option>`)
            })
                
        })
        
    })
    // $(document).on('submit', '#checkout .cart-checkout', function() {
        
        
    //     $('.form-group #name').blur(function() {
    //         let name = $(this).val();
    //         alert('click')
            
    //     })
    // })
    $('#checkout .submit').submit(function() {
        let name = $('.form-group #name').val();
        let phone = $('.form-group #phone').val();
        let diachi = $('.form-group #diachi').val();
        
        let ru = /^[a-zA-Z0-9À ÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐđĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀẾỂưăạảấầẩẫậắằẳẵặẹẻẽềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/;
        let testPhone = /^[0-9]+$/;
        if(name.length < 5 || name.length >= 50 || !ru.test(name)){
            return false
        }
        if(phone.length <= 9 || phone.length >= 12 || !testPhone.test(phone)){
            return false
        }
        if(diachi.length <= 9 || diachi.length >= 150) {
            return false
        }
        return true;
        
    })
    $('#signup .submit').submit(function() {
        let name = $('.form-group #name').val();
        let email = $('.form-group #email').val();
        let pw = $('.form-group #password').val();
        
        let ru = /^[a-zA-Z0-9À ÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐđĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀẾỂưăạảấầẩẫậắằẳẵặẹẻẽềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/;
        let testEmail = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/igm;
        if(name.length < 5 || name.length >= 50 || !ru.test(name)){
            return false
        }
        if(!testEmail.test(email)){
            return false
        }
        if(pw.length < 5 || pw.length > 20) {
            return false
        }
        return true;
        
    })

    $('.form-group #email').blur(function() {
        var email = $('#email').val();
        var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/igm;
        if (re.test(email)) {
            $('.err-email').hide()
        } else {
            $('.err-email').show();
            $('.err-email').text('Email không đúng định dạng');
        }
    });
    $('.form-group #password').blur(function() {
        var pw = $('#password').val();
        
        if (pw.length < 5 || pw.length > 20) {
            $('.err-pw').show();
            $('.err-pw').text('Mật khẩu từ 6 đến 20 kí tự');
        } else {
            $('.err-pw').hide()
        }
    })


    $('.form-group #name').blur(function() { 
        let name = $(this).val();
        
        let ru = /^[a-zA-Z0-9À ÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐđĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀẾỂưăạảấầẩẫậắằẳẵặẹẻẽềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/;
        if(ru.test(name)) {
            $('.err-name').hide();
            $('.err-special').hide();
        }
        if(name.length < 5 || name.length >= 50){   
            $('.err-special').hide();
            $('.err-name').show();
            $('.err-name').text('Tên từ 5 đến 50 ký tự')
        let name = $(this).val();
        }else if (!ru.test(name)) {
          
            $('.err-name').hide()
            $('.err-special').show();
            $('.err-special').text('Không có ký tự đặc biệt')
        }
    })
    $('.form-group #phone').blur(function() {
        let phone = $(this).val();
        let testPhone = /^[0-9]+$/;
        if(testPhone.test(phone)){
            $('.err-phone').hide();
            $('.err-number').hide();
        }
        if(phone.length < 9 || phone.length >= 12) {
            $('.err-phone').hide();
            $('.err-number').show();
            $('.err-number').text('Số điện thoại từ 9 - 11 chữ số');
        }else if(!testPhone.test(phone)){
            $('.err-number').hide();
            $('.err-phone').show();
            $('.err-phone').text('Số điện thoại phải là số'); 
        }

    })
    $('.form-group #diachi').blur(function() {
        let diachi = $(this).val();
        if(diachi.length <= 9 || diachi.length >= 150) {
            $('.err-diachi').show();
            $('.err-diachi').text('Địa chỉ từ 10 đến 150 ký tự'); 
        }else{
            $('.err-diachi').hide();
        }
    })

    // Zoom img product
    $('.product-main-image .zoomcontainer').eq(0).addClass('active1')
    $('.product-other-image img').click(function(event) {
        var index1 = $(this).index();
        $('.product-main-image .img-zoom-lens').remove();
        $('.product-main-image .active1').removeClass('active1');
        $(".product-main-image img").eq(index1).addClass('active1');
        imageZoom("active1", "myresult")
    });


    $('.carousel.slide').carousel({
        interval: 10000000000000,
        pause: "false"
    });  
    $('#recommend .state').eq(0).addClass('active');
    // show qtyRepon
    
    
})

