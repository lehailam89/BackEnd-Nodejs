module.exports.index = async (req, res) => {
    res.render("client/pages/products/index.pug", {
        pageTitle: "Danh sách sản phẩm"
    })
}