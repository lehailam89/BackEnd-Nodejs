const ProductCategory  = require("../../models/product-category.model");

const systemConfig = require("../../config/system.js");

//[GET] /admin/products-category
module.exports.index = async (req, res) => {
    res.render("admin/pages/products-category/index", {
        pageTitle: "Danh mục sản phẩm"
    });
}

//[GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/products-category/create.pug", {
        pageTitle: "Thêm danh mục sản phẩm"
    });
}

//[POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {

    console.log(req.body);

    res.send("ok");
    // if (!req.body.position) {
    //     const countRecords = await ProductCategory.countDocuments();
    //     req.body.position = countRecords + 1;
    // } else {
    //     req.body.position = parseInt(req.body.position);
    // }

    // const produtCategory = new ProductCategory(req.body);
    // await produtCategory.save()

    // res.redirect(`${systemConfig.prefixAdmin}/products-category`)
}
