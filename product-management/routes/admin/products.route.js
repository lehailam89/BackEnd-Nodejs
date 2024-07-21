const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/product.controller");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus)
//cú pháp : để truyền router động
router.patch("/change-multi", controller.changeMulti)

router

module.exports = router;
