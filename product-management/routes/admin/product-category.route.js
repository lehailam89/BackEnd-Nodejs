const express = require("express");
const multer = require('multer');
const router = express.Router();

const upload = multer();

const controller = require("../../controllers/admin/product-category.controller.js");

const uploadCloud = require("../../middlewares/uploadCloud.middleware.js");

router.get("/", controller.index);

router.get("/create", controller.create)

router.post(
    "/create",
    upload.single("thumbnail"),
    uploadCloud.upload,
    controller.createPost
)
module.exports = router;    