const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");

//[GET] /admin/products
module.exports.index = async (req, res) => {
    //console.log(req.query.status);   

    const filterStatus = filterStatusHelper(req.query);

    // console.log(filterStatus);

    let find = {
        deleted: false
    };

    if (req.query.status) {
        find.status = req.query.status;
    }

    const objectSearch = searchHelper(req.query);


    if (objectSearch.keyword) {
        //Kiến thức tự học thêm về regex
        find.title = objectSearch.regex;
    }
    //req.query thì nó sẽ trả ra các query(truy vấn) trên url mà mình truyền vào

    //pagination
    const countProducts = await Product.countDocuments(find); 
    //tất cả những câu truy vấn vào database đều phải dùng await

    let objectPagination = paginationHelper({
            currentPage: 1,
            limitItems: 4
        },
        req.query,
        countProducts
    );

    // if(req.query.page){
    //     objectPagination.currentPage = parseInt(req.query.page);
    // }

    // objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;

    // const countProducts = await Product.countDocuments(find); 
    // //tất cả những câu truy vấn vào database đều phải dùng await


    // const totalPage = Math.ceil(countProducts / objectPagination.limitItems);
    // console.log(totalPage);

    // objectPagination.totalPage = totalPage;
    //end pagination

    const products = await Product.find(find)
    .sort({ position: "desc"}) //postion là trường mình muốn sắp xếp theo vị trí, desc là giảm dần, asc là tăng dần 
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
    //console.log(products)

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })
}

// Controler Change Status
//[PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    
    await Product.updateOne({_id: id}, {status: status});
    //updateOne là 1 chức năng của mongoose để update 1 bản ghi trong database, tự đọc doc của nó

    req.flash("success", "Cập nhật trạng thái sản phẩm thành công!");


    res.redirect("back"); 
}

//[PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");//split là hàm js để convert thành một mảng

    switch (type){
        case "active":
            await Product.updateMany({ _id: {$in: ids}}, {status: "active"});    
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm`);   
            break;
        case "inactive":
            await Product.updateMany({ _id: {$in: ids}}, {status: "inactive"});
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm`);   
            break;
        case "delete-all":
            await Product.updateMany({ _id: {$in: ids}}, {deleted: true, deletedAt: new Date()});
            req.flash("success", `Đã xoá thành công ${ids.length} sản phẩm`);   
            break;
        case "change-position":
            for(const item of ids){
                let [id, position] = item.split("-");
                position=parseInt(position);
                await Product.updateOne({_id: id}, {position: position});
            }
            req.flash("success", "Cập nhật vị trí thành công!");   
            break;
        default:
            break;
    }

    res.redirect("back");
};

//[DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    // await Product.deleteOne({_id: id}); //deleteOne là hàm của mongoose để xóa 1 bản ghi trong database => xoá cứng

    await Product.updateOne({ _id: id}, 
        {
            deleted: true,
            deletedAt: new Date()//new Date là hàm của js lấy ra thời gian hiện tại      
        }
    ); //updateOne là hàm của mongoose để update 1 bản ghi trong database => xoá mềm

    req.flash("success", "Xoá sản phẩm thành công!");   

    res.redirect("back");
}

//[GET] /admin/products/create tạo mới một sản phẩm
module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm",
    });
}

//[POST] /admin/products/create
module.exports.createPost = async (req, res) => {

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if(req.body.position === ""){
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    if(req.file && req.file.filename){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    const product = new Product(req.body);
    await product.save();

    res.redirect(`${systemConfig.prefixAdmin}/products`);
};
    
//[EDIT] /admin/products/edit/:id
module.exports.edit = async (req, res) => { 
    const id = req.params.id;
    const product = await Product.findOne({_id: id, deleted: false});

    console.log(product);

    res.render("admin/pages/products/edit", {
        pageTitle: "Chỉnh sửa sản phẩm",
        product: product
    })
}

//[PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if(req.file && req.file.filename){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }


    await Product.updateOne({ _id: id}, req.body);

    req.flash("success", "Cập nhật sản phẩm thành công!!!!");

    res.redirect("back");
};