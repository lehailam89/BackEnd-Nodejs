const Product = require("../../models/product.model");

//[GET] /admin/products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        deleted: false
    }).sort({ position: "desc"});

    
    
    console.log(products);

    res.render("client/pages/products/index.pug", {
        pageTitle: "Danh sách sản phẩm",
        products: products
    })
}