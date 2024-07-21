const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

//[GET] /admin/products
module.exports.index = async (req, res) => {
    //console.log(req.query.status);   

    const filterStatus = filterStatusHelper(req.query);

    console.log(filterStatus);

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

    const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);
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

    res.redirect("back"); 
}

//[PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");//split là hàm js để convert thành một mảng

    switch (type){
        case "active":
            await Product.updateMany({ _id: {$in: ids}}, {status: "active"});    
            break;
        case "inactive":
            await Product.updateMany({ _id: {$in: ids}}, {status: "inactive"});
            break;
        default:
            break;
    }

    res.redirect("back");
};