const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const productsHelper = require("../../helpers/products.js");

//[GET] /admin/products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        deleted: false
    }).sort({ position: "desc"});

    const newProducts = productsHelper.priceNewProducts(products);

    res.render("client/pages/products/index.pug", {
        pageTitle: "Danh sách sản phẩm",
        products: newProducts
    })
}

//[GET] /admin/products/:slugCategory
module.exports.category = async (req, res) => {
    const slugCategory = req.params.slugCategory;

    const category = await ProductCategory.findOne({
        slug: slugCategory,
        deleted: false,
        status: "active"
    });

    const getSubCategory = async (parentId) => {
        const subs = await ProductCategory.find({
            parent_id: parentId,
            status: "active",
            deleted: false,
        });

        let allSub = [...subs];

        for (const sub of subs) {
            const childs = await getSubCategory(sub.id);
            allSub = allSub.concat(childs);
        }

        return allSub;
    } 
    
    const listSubCategory = await getSubCategory(category.id);

    const listSubCategoryId = listSubCategory.map(item => item.id);

    console.log(listSubCategoryId);

    const products = await Product.find({
        product_category_id: { $in: [category.id, ...listSubCategoryId] },
        status: "active",
        deleted: false
    }).sort({ position: "desc"});

    const newProducts = productsHelper.priceNewProducts(products);

    res.render("client/pages/products/index.pug", {
        pageTitle: category.title,
        products: newProducts
    })
}


//[GET] /admin/products/detail/:slug
module.exports.detail = async (req, res) => {
    try{
        const slug = req.params.slug;
        const product = await Product.findOne({
            slug: slug, 
            deleted: false, 
            status: "active"
        });

        await 

        res.render("client/pages/products/detail", {
            pageTitle: "Chi tiết sản phẩm",
            product: product
        })
    } catch(error) {
        if(!product){
            req.flash("error", "Không tồn tại sản phẩm có slug này!");
            res.redirect("/products");
        }
    }
}
