const Product = require("../../models/product.model.js");
const productsHelper = require("../../helpers/products.js");

//[GET] /
module.exports.index = async (req, res) => {
//code hiển thị danh sách sản phẩm nổi bật
const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active"
}).limit(6);

const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured);

//end code hiển thị danh sách sản phẩm nổi bật
    res.render("client/pages/home/index.pug", {
        pageTitle: "Trang chủ",
        productsFeatured: newProductsFeatured
    })
}