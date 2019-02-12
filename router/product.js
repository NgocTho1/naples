const express = require('express');
const router = express.Router();
const multer = require('multer')
const connection = require('../config/connection.js');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/upload');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

const upload = multer({storage : storage});

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



router.get('/:cate/:pro', (req, res) => {
    const cate = req.params.cate;
  
    const cateAlias = replaceName(cate);
    Promise.all([
        connection.query('SELECT * FROM danh_sach'),
        connection.query('SELECT * FROM thuong_hieu ORDER BY ten_nsx'),
        connection.query(`SELECT * FROM ${cateAlias} WHERE id = '${req.params.pro}'`)
   
    ])
    .then(([cate , thuonghieu, pro]) => {
       
        res.render(`./admin/product/update/${req.params.cate}`, {cate : cate, thuonghieu : thuonghieu, pro : pro[0]} ); 
        
    })
});

router.post('/:cate/:pro', upload.any('file'), (req, res) => {
    const cate = req.params.cate;
    let body = req.body;
    const id = req.params.pro;
    const cateAlias = replaceName(cate);
    // Save hinh_anh = './upload/img1, ./upload/img2' use split(,) show 
    let fileName = '';
    req.files.forEach(file => {
        fileName += './upload/' + file.filename + ',';
    } )
    // Delete , in fileName finally
    fileName = fileName.replace(/,$/, '');

    let percent = 0;
    if(req.body.saleOff && req.body.saleOff != 0) {
        percent = Math.round( ((req.body.price - req.body.saleOff) * 100) / req.body.price);
    }
    
    if(cate == 'thung-may') {
        connection.query(`
            UPDATE ${cateAlias} SET ten = '${body.name}', hinh_anh = '${fileName}', gia = '${body.price}', 
            giam_gia = '${body.saleOff}', so_luong = '${body.quality}', bao_hanh = '${body.baohanh}', 
            mau_sac = '${body.mausac}', cong_ket_noi = '${body.congketnoi}', ho_tro_main = '${body.hotromain}',
            link = '${bodauTiengViet(req.body.name)}', id_nsx = '${body.nsx}', percent = '${percent}' WHERE id = '${id}'`,
            (err, rows) => {
                req.flash('success_msg', 'Đã Sửa Thành Công');
                res.redirect(`/admin/product/${cate}/${id}`)
        })
    }
    if(cate == 'vga') {
        connection.query(`
            UPDATE ${cateAlias} SET ten = '${body.name}', hinh_anh = '${fileName}', gia = '${body.price}', 
            giam_gia = '${body.saleOff}', so_luong = '${body.quality}', bao_hanh = '${body.baohanh}', 
            bo_nho = '${body.bonho}', cong_giao_tiep = '${body.conggiaotiep}', kich_thuoc = '${body.kichthuoc}',
            nguon = '${body.nguon}', do_phan_giai = '${body.dophangiai}', xung_boost = '${body.xungboots}', xung_co_ban = '${body.xungcoban}',
            link = '${bodauTiengViet(req.body.name)}', id_nsx = '${body.nsx}', percent = '${percent}' WHERE id = '${id}'`,
            (err, rows) => {
                if(err) console.log(err);
                
                req.flash('success_msg', 'Đã Sửa Thành Công');
                res.redirect(`/admin/product/${cate}/${id}`)
        })
    }
    if(cate == 'tan-nhiet') {
        connection.query(`
            UPDATE ${cateAlias} SET ten = '${body.name}', hinh_anh = '${fileName}', gia = '${body.price}', 
            giam_gia = '${body.saleOff}', so_luong = '${body.quality}', bao_hanh = '${body.baohanh}', 
            toc_do = '${body.bonho}', do_on = '${body.doon}', kich_thuoc = '${body.kichthuoc}', toc_do = '${body.tocdo}',
            loai_tan = '${body.loaitan}',link = '${bodauTiengViet(req.body.name)}', id_nsx = '${body.nsx}', percent = '${percent}' WHERE id = '${id}'`,
            (err, rows) => {
                if(err) console.log(err);
                
                req.flash('success_msg', 'Đã Sửa Thành Công'); 
                res.redirect(`/admin/product/${cate}/${id}`)
        })
    }
    if(cate == 'tai-nghe') {
        connection.query(`
            UPDATE ${cateAlias} SET ten = '${body.name}', hinh_anh = '${fileName}', gia = '${body.price}', 
            giam_gia = '${body.saleOff}', so_luong = '${body.quality}', bao_hanh = '${body.baohanh}', 
            mau_sac = '${body.mausac}', ket_noi = '${body.ketnoi}', microphone = '${body.microphone}',
            link = '${bodauTiengViet(req.body.name)}', id_nsx = '${body.nsx}', percent = '${percent}' WHERE id = '${id}'`,
            (err, rows) => {
                if(err) console.log(err);
                
                req.flash('success_msg', 'Đã Sửa Thành Công');
                res.redirect(`/admin/product/${cate}/${id}`) 
        })
    }
    if(cate == 'ssd') {
        connection.query(`UPDATE ${cateAlias} SET ten = '${body.name}', hinh_anh = '${fileName}', gia = '${body.price}', 
            giam_gia = '${body.saleOff}', so_luong = '${body.quality}', bao_hanh = '${body.baohanh}', 
            dung_luong = '${body.dungluong}', kich_thuoc = '${body.kichthuoc}', chuan_ket_noi = '${body.chuanketnoi}',
            toc_ghi = '${body.tocghi}', toc_doc = '${body.tocdoc}',
            link = '${bodauTiengViet(req.body.name)}', id_nsx = '${body.nsx}', percent = '${percent}' WHERE id = '${id}'`,
            (err, rows) => {
                if(err) console.log(err);
                
                req.flash('success_msg', 'Đã Sửa Thành Công');
                res.redirect(`/admin/product/${cate}/${id}`) 
        })
    }
    if(cate == 'ram') {
        connection.query(`
            UPDATE ${cateAlias} SET ten = '${body.name}', hinh_anh = '${fileName}', gia = '${body.price}', 
            giam_gia = '${body.saleOff}', dung_luong = '${body.dungluong}', so_luong = '${body.quality}', bao_hanh = '${body.baohanh}', 
            kieu_ram = '${body.kieuram}', bus_ram = '${body.busram}', tan_nhiet = '${body.tannhiet}',
            link = '${bodauTiengViet(req.body.name)}', id_nsx = '${body.nsx}', percent = '${percent}' WHERE id = '${id}'`,
            (err, rows) => {
                if(err) console.log(err);
                
                req.flash('success_msg', 'Đã Sửa Thành Công');
                res.redirect(`/admin/product/${cate}/${id}`) 
        })
    }
    if(cate == 'nguon') {
        connection.query(`
            UPDATE ${cateAlias} SET ten = '${body.name}', hinh_anh = '${fileName}', gia = '${body.price}', 
            giam_gia = '${body.saleOff}', so_luong = '${body.quality}', bao_hanh = '${body.baohanh}', 
            cong_suat = '${body.congsuat}', loai = '${body.loai}', dau_cap_dien = '${body.daucapdien}', TCCL = '${body.tccl}',
            link = '${bodauTiengViet(req.body.name)}', id_nsx = '${body.nsx}', percent = '${percent}' WHERE id = '${id}'`,
            (err, rows) => {
                if(err) console.log(err);
                
                req.flash('success_msg', 'Đã Sửa Thành Công');
                res.redirect(`/admin/product/${cate}/${id}`) 
        })
    }
    if(cate == 'man-hinh') {
        console.log(fileName);
        
        connection.query(`
            UPDATE ${cateAlias} SET ten = '${body.name}', hinh_anh = '${fileName}', gia = '${body.price}', 
            giam_gia = '${body.saleOff}', so_luong = '${body.quality}', bao_hanh = '${body.baohanh}', 
            mau_sac = '${body.mausac}', do_tuong_phan = '${body.dotuongphan}', kich_thuoc = '${body.kichthuoc}', 
            do_sang = '${body.dosang}', do_phan_giai = '${body.dophangiai}', cong_ket_noi = '${body.congketnoi}', 
            phan_hoi = '${body.phanhoi}', tan_so_quet = '${body.tansoquet}', ty_le = '${body.tyle}',
            goc_nhin = '${body.gocnhin}', tam_nen = '${body.tamnen}', cong_nghe = '${body.congnghe}',
            link = '${bodauTiengViet(req.body.name)}', id_nsx = '${body.nsx}', percent = '${percent}' WHERE id = '${id}'`,
            (err, rows) => {
                if(err) console.log(err);
                
                req.flash('success_msg', 'Đã Sửa Thành Công');
                res.redirect(`/admin/product/${cate}/${id}`)  
        })
    }
    if(cate == 'main') {
        connection.query(`
            UPDATE ${cateAlias} SET ten = '${body.name}', hinh_anh = '${fileName}', gia = '${body.price}', 
            giam_gia = '${body.saleOff}', so_luong = '${body.quality}', bao_hanh = '${body.baohanh}', 
            loai = '${body.loai}', socket = '${body.socket}', so_khe_ram = '${body.sokheram}', 
            dung_luong_toi_da = '${body.dungluongtoida}', loai_ram = '${body.loairam}', so_cong_dvi = '${body.socongdvi}', 
            so_cong_hdmi = '${body.soconghdmi}', audio = '${body.audio}', chipset = '${body.chipset}',
            link = '${bodauTiengViet(req.body.name)}', id_nsx = '${body.nsx}', percent = '${percent}' WHERE id = '${id}'`,
            (err, rows) => {
                if(err) console.log(err);
                
                req.flash('success_msg', 'Đã Sửa Thành Công');
                res.redirect(`/admin/product/${cate}/${id}`)  
        })
    }
    if(cate == 'hdd') {
        connection.query(`
            UPDATE ${cateAlias} SET ten = '${body.name}', hinh_anh = '${fileName}', gia = '${body.price}', 
            giam_gia = '${body.saleOff}', so_luong = '${body.quality}', bao_hanh = '${body.baohanh}', 
            dung_luong = '${body.dungluong}', kich_thuoc = '${body.kichthuoc}', chuan_cam = '${body.chuancam}',
            toc_ghi = '${body.tocghi}', toc_doc = '${body.tocdoc}', toc_do_quay = '${body.tocdoquay}',
            link = '${bodauTiengViet(req.body.name)}', id_nsx = '${body.nsx}', percent = '${percent}' WHERE id = '${id}'`,
            (err, rows) => {
                if(err) console.log(err);
                
                req.flash('success_msg', 'Đã Sửa Thành Công');
                res.redirect(`/admin/product/${cate}/${id}`) 
        })
    }
    if(cate == 'cpu') {
        connection.query(`
            UPDATE ${cateAlias} SET ten = '${body.name}', hinh_anh = '${fileName}', gia = '${body.price}', 
            giam_gia = '${body.saleOff}', so_luong = '${body.quality}', bao_hanh = '${body.baohanh}', 
            socket = '${body.socket}', dong = '${body.dong}', so_nhan = '${body.sonhan}',
            luong_cpu = '${body.luongcpu}', bo_nho = '${body.bonho}', do_hoa_tich_hop = '${body.dohoatichhop}',
            dien_tieu_thu = '${body.dientieuthu}', xung_co_ban = '${body.xungcoban}', xung_toi_da = '${body.xungtoida}',
            link = '${bodauTiengViet(req.body.name)}', id_nsx = '${body.nsx}', percent = '${percent}' WHERE id = '${id}'`,
            (err, rows) => {
                if(err) console.log(err);
                
                req.flash('success_msg', 'Đã Sửa Thành Công');
                res.redirect(`/admin/product/${cate}/${id}`) 
        })
    }
    if(cate == 'chuot') {
        connection.query(`
            UPDATE ${cateAlias} SET ten = '${body.name}', hinh_anh = '${fileName}', gia = '${body.price}', 
            giam_gia = '${body.saleOff}', so_luong = '${body.quality}', bao_hanh = '${body.baohanh}', 
            mau_sac = '${body.mausac}', ket_noi = '${body.ketnoi}', loai_ket_noi = '${body.loaiketnoi}',
            dpi = '${body.dpi}', den_led = '${body.denled}',
            link = '${bodauTiengViet(req.body.name)}', id_nsx = '${body.nsx}', percent = '${percent}' WHERE id = '${id}'`,
            (err, rows) => {
                if(err) console.log(err);
                
                req.flash('success_msg', 'Đã Sửa Thành Công');
                res.redirect(`/admin/product/${cate}/${id}`) 
        })
    }
    if(cate == 'ban-phim') {
        connection.query(`
            UPDATE ${cateAlias} SET ten = '${body.name}', hinh_anh = '${fileName}', gia = '${body.price}', 
            giam_gia = '${body.saleOff}', so_luong = '${body.quality}', bao_hanh = '${body.baohanh}', 
            mau_sac = '${body.mausac}', ket_noi = '${body.ketnoi}', loai_ban_phim = '${body.loaibanphim}',
            link = '${bodauTiengViet(req.body.name)}', id_nsx = '${body.nsx}', percent = '${percent}' WHERE id = '${id}'`,
            (err, rows) => {
                if(err) console.log(err);
                
                req.flash('success_msg', 'Đã Sửa Thành Công');
                res.redirect(`/admin/product/${cate}/${id}`) 
        })
    }
});

router.get('/them', (req, res) => { 
   
    Promise.all([
        connection.query('SELECT * FROM danh_sach'),
        connection.query('SELECT * FROM thuong_hieu ORDER BY ten_nsx'),
    ])
    .then(([cate, thuonghieu]) => {
        res.render('./admin/product/add/them.ejs', {cate : cate, thuonghieu : thuonghieu}); 
    })
});

router.post('/add', upload.any('file'), (req, res) => {
    let body = req.body;
    // Save hinh_anh = './upload/img1, ./upload/img2' use split(,) show 
    console.log(body.idds);
    
    let fileName = '';
    req.files.forEach(file => {
        fileName += './upload/' + file.filename + ',';
    } )
    // Delete , in fileName finally
    fileName = fileName.replace(/,$/, '');

    let percent = 0;
    if(req.body.saleOff && req.body.saleOff != 0) {
        percent = Math.round( ((req.body.price - req.body.saleOff) * 100) / req.body.price);
    }
    if(body.idds == 'thung-may') {
       
        connection.query(`INSERT INTO thung_may(ten, id_nsx, kich_thuoc, mau_sac, ho_tro_main, cong_ket_noi, bao_hanh, gia, giam_gia, percent, so_luong, id_ds, hinh_anh, link)
        VALUES ('${body.name}', '${body.nsx}', '${body.kichthuoc}', '${body.mausac}', '${body.hotromain}', '${body.congketnoi}', '${body.baohanh}', '${body.price}', '${body.saleOff}', '${percent}', '${body.quality}', '5', '${fileName}', '${bodauTiengViet(req.body.name)}')`, (err, rows) => {
            if(err) console.log(err);
            req.flash('success_msg', 'Đã Thêm Thành Công');
            res.redirect('/admin/product/them');  
        })
    }
    if(body.idds == 'vga') { 
       
        connection.query(`INSERT INTO vga(id_nsx, ten, bao_hanh, gia, giam_gia, percent, so_luong, bo_nho, cong_giao_tiep, kich_thuoc, nguon, do_phan_giai, xung_boost, xung_co_ban, id_ds, hinh_anh, link)
        VALUES ('${body.nsx}', '${body.name}', '${body.baohanh}', '${body.price}', '${body.saleOff}', '${percent}', '${body.quality}', '${body.bonho}', '${body.conggiaotiep}', '${body.kichthuoc}', '${body.nguon}', '${body.dophangiai}', '${body.xungboots}', '${body.xungcoban}', '1', '${fileName}', '${bodauTiengViet(req.body.name)}')`, (err, rows) => {
            if(err) console.log(err);
            req.flash('success_msg', 'Đã Thêm Thành Công');
            res.redirect('/admin/product/them');  
        })
    }
    if(body.idds == 'tan-nhiet') {
        connection.query(`INSERT INTO tan_nhiet(ten, id_nsx, kich_thuoc, toc_do, do_on, den_led, loai_tan, gia, giam_gia, percent, so_luong, bao_hanh, id_ds, hinh_anh, link) 
        VALUES ('${body.name}', '${body.nsx}', '${body.kichthuoc}', '${body.tocdo}', '${body.doon}', '${body.denled}', '${body.loaitan}', '${body.price}', '${body.saleOff}', '${percent}', '${body.quality}', '${body.baohanh}', '6', '${fileName}', '${bodauTiengViet(req.body.name)}')`, (err, rows) => {
            if(err) console.log(err);
            req.flash('success_msg', 'Đã Thêm Thành Công');
            res.redirect('/admin/product/them');  
        })
    }
    if(body.idds == 'tai-nghe') {
        connection.query(`INSERT INTO tai_nghe(ten, id_nsx, mau_sac, ket_noi, microphone, bao_hanh, gia, giam_gia, percent, so_luong, id_ds, hinh_anh, link) 
        VALUES ('${body.name}', '${body.nsx}', '${body.mausac}', '${body.ketnoi}', '${body.microphone}', '${body.baohanh}', '${body.price}', '${body.saleOff}', '${percent}', '${body.quality}', '12', '${fileName}', '${bodauTiengViet(req.body.name)}')`, (err, rows) => {
            if(err) console.log(err);
            req.flash('success_msg', 'Đã Thêm Thành Công');
            res.redirect('/admin/product/them');  
        })
    }
    if(body.idds == 'ssd') {
        connection.query(`INSERT INTO ssd(ten, id_nsx, dung_luong, kich_thuoc, chuan_ket_noi, toc_ghi, toc_doc, gia, giam_gia, percent, so_luong, bao_hanh, id_ds, hinh_anh, link) 
        VALUES ('${body.name}', '${body.nsx}', '${body.dungluong}', '${body.kichthuoc}', '${body.chuanketnoi}', '${body.tocghi}', '${body.tocdoc}', '${body.price}', '${body.saleOff}', '${percent}', '${body.quality}', '${body.baohanh}', '13' ,'${fileName}', '${bodauTiengViet(req.body.name)}')`, (err, rows) => {
            if(err) console.log(err);
            req.flash('success_msg', 'Đã Thêm Thành Công');
            res.redirect('/admin/product/them');  
        })
    }
    if(body.idds == 'ram') {
        
        connection.query(`INSERT INTO ram(ten, id_nsx, dung_luong, kieu_ram, bus_ram, bao_hanh, tan_nhiet, gia, giam_gia, percent, so_luong, id_ds, hinh_anh, link) 
        VALUES ('${body.name}', '${body.nsx}', '${body.dungluong}', '${body.kieuram}', '${body.busram}', '${body.baohanh}', '${body.tannhiet}', '${body.price}', '${body.saleOff}', '${percent}', '${body.quality}', '4' ,'${fileName}', '${bodauTiengViet(req.body.name)}')`, (err, rows) => {
            if(err) console.log(err);
            req.flash('success_msg', 'Đã Thêm Thành Công');
            res.redirect('/admin/product/them');  
        })
    }
    if(body.idds == 'nguon') {
        connection.query(`INSERT INTO nguon(ten, id_nsx, cong_suat, loai, dau_cap_dien, TCCL, bao_hanh, gia, giam_gia, percent, so_luong, id_ds, hinh_anh, link) 
        VALUES ('${body.name}', '${body.nsx}', '${body.congsuat}', '${body.loai}', '${body.daucapdien}', '${body.tccl}', '${body.baohanh}', '${body.price}', '${body.saleOff}', '${percent}', '${body.quality}', '7' ,'${fileName}', '${bodauTiengViet(req.body.name)}')`, (err, rows) => {
            if(err) console.log(err);
            req.flash('success_msg', 'Đã Thêm Thành Công');
            res.redirect('/admin/product/them');  
        })
    }
    if(body.idds == 'man-hinh') {
        console.log(fileName);
        
        connection.query(`INSERT INTO man_hinh(ten, id_nsx, mau_sac, do_tuong_phan, bao_hanh, kich_thuoc, do_sang, do_phan_giai, cong_ket_noi, phan_hoi, tan_so_quet, ty_le, goc_nhin, gia, giam_gia, percent, so_luong, tam_nen, id_ds, hinh_anh, link, cong_nghe) 
        VALUES ('${body.name}', '${body.nsx}', '${body.mausac}', '${body.dotuongphan}', '${body.baohanh}', '${body.kichthuoc}', '${body.dosang}', '${body.dophangiai}', '${body.congketnoi}', '${body.phanhoi}', '${body.tansoquet}',  '${body.tyle}', '${body.gocnhin}', '${body.price}',  '${body.saleOff}', '${percent}', '${body.quality}',  '${body.tamnen}','8' ,'${fileName}', '${bodauTiengViet(req.body.name)}', '${body.congnghe}')`, (err, rows) => {
            if(err) console.log(err);
            req.flash('success_msg', 'Đã Thêm Thành Công');
            res.redirect('/admin/product/them');  
        })
    }
    if(body.idds == 'main') {
        connection.query(`INSERT INTO main(ten, id_nsx, loai, socket, so_khe_ram, dung_luong_toi_da, loai_ram, so_cong_dvi, so_cong_hdmi, audio, bao_hanh, gia, giam_gia, percent, so_luong, chipset, id_ds, hinh_anh, link) 
        VALUES ('${body.name}', '${body.nsx}', '${body.loai}', '${body.socket}', '${body.sokheram}', '${body.dungluongtoida}', '${body.loairam}', '${body.socongdvi}', '${body.soconghdmi}', '${body.audio}', '${body.baohanh}', '${body.price}', '${body.saleOff}', '${percent}',  '${body.quality}',  '${body.chipset}', '2' ,'${fileName}', '${bodauTiengViet(req.body.name)}')`, (err, rows) => {
            if(err) console.log(err);
            req.flash('success_msg', 'Đã Thêm Thành Công');
            res.redirect('/admin/product/them');  
        })
    }
    if(body.idds == 'hdd') {
        connection.query(`INSERT INTO hdd(ten, id_nsx, dung_luong, chuan_cam, toc_doc, toc_ghi, kich_thuoc, toc_do_quay, bao_hanh, gia, giam_gia, percent, so_luong, id_ds, hinh_anh, link) 
        VALUES ('${body.name}', '${body.nsx}', '${body.dungluong}', '${body.chuancam}', '${body.tocdoc}', '${body.tocghi}', '${body.kichthuoc}', '${body.tocdoquay}', '${body.baohanh}', '${body.price}', '${body.saleOff}', '${percent}', '${body.quality}', '10' ,'${fileName}', '${bodauTiengViet(req.body.name)}')`, (err, rows) => {
            if(err) console.log(err);
            req.flash('success_msg', 'Đã Thêm Thành Công');
            res.redirect('/admin/product/them');  
        })
    }
    if(body.idds == 'cpu') {
        connection.query(`INSERT INTO cpu(ten, id_nsx, socket, dong, so_nhan, luong_cpu, bo_nho, do_hoa_tich_hop, dien_tieu_thu, xung_co_ban, xung_toi_da, bao_hanh, gia, giam_gia, percent, so_luong, id_ds, hinh_anh, link) 
        VALUES ('${body.name}', '${body.nsx}', '${body.socket}', '${body.dong}', '${body.sonhan}', '${body.luongcpu}', '${body.bonho}', '${body.dohoatichhop}', '${body.dientieuthu}', '${body.xungcoban}', '${body.xungtoida}', '${body.baohanh}', '${body.price}', '${body.saleOff}', '${percent}', '${body.quality}', '3' ,'${fileName}', '${bodauTiengViet(req.body.name)}')`, (err, rows) => {
            if(err) console.log(err);
            req.flash('success_msg', 'Đã Thêm Thành Công');
            res.redirect('/admin/product/them');  
        })
    }
    if(body.idds == 'chuot') {
        connection.query(`INSERT INTO chuot(ten, id_nsx, mau_sac, ket_noi, loai_ket_noi, dpi, den_led, gia, giam_gia, bao_hanh, percent, so_luong, id_ds, hinh_anh, link) 
        VALUES ('${body.name}', '${body.nsx}', '${body.mausac}', '${body.ketnoi}', '${body.loaiketnoi}', '${body.dpi}', '${body.denled}', '${body.price}', '${body.saleOff}', '${body.baohanh}', '${percent}', '${body.quality}', '11' ,'${fileName}', '${bodauTiengViet(req.body.name)}')`, (err, rows) => {
            if(err) console.log(err);
            req.flash('success_msg', 'Đã Thêm Thành Công');
            res.redirect('/admin/product/them');  
        })
    }
    if(body.idds == 'ban-phim') {
        connection.query(`INSERT INTO ban_phim(ten, id_nsx, mau_sac, ket_noi, loai_ban_phim, gia, giam_gia, percent, so_luong, bao_hanh, id_ds, hinh_anh, link) 
        VALUES ('${body.name}', '${body.nsx}', '${body.mausac}', '${body.ketnoi}', '${body.loaibanphim}', '${body.price}', '${body.saleOff}', '${percent}', '${body.quality}', '${body.baohanh}', '9' ,'${fileName}', '${bodauTiengViet(req.body.name)}')`, (err, rows) => {
            if(err) console.log(err);
            req.flash('success_msg', 'Đã Thêm Thành Công');
            res.redirect('/admin/product/them');  
        })
    }

});

router.get('/xoa/:cate/:id', (req, res) => {
    const cateAlias = replaceName(req.params.cate);
    const id = req.params.id
    connection.query(`DELETE FROM ${cateAlias} WHERE id = '${id}'`, (err, rows) => {
        if(err) console.log(err);
        res.redirect(`/admin/${req.params.cate}`);
    })

});
router.post('/them', (req, res) => {  
    const cateAlias = req.body.cate
    Promise.all([
        connection.query('SELECT * FROM danh_sach'),
        connection.query('SELECT * FROM thuong_hieu ORDER BY ten_nsx'),
    ])
    .then(([cate, thuonghieu]) => {
        res.render(`./admin/product/add/${cateAlias}`, {cate : cate, thuonghieu : thuonghieu, cateAlias : cateAlias}); 
    })
});

module.exports = router