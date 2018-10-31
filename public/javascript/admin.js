$(document).ready(function() {
    $('.side-menu>ul>li>a').click(function() {
        const findFas = $(this).closest('li');
        if(findFas.find('.fas.fa-chevron-down.rotate')[0]) {
            findFas.find('.fas.fa-chevron-down.rotate').removeClass('rotate');
        }else{
            findFas.find('.fas.fa-chevron-down').addClass('rotate');
        }
    })

    $(document).on('change', '#select', function() {
        let cate = $('#select option:selected').val();
      
        $.ajax({
            url: '/admin/product/them',
            method: 'POST',
            data: { 
                cate : cate,
              
            }
        })
        .done(function(msg) {
            $('#add').html('');
            $('#add').html(msg);
        })

    })
})