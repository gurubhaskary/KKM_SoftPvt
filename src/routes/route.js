//=====================Importing Module and Packages=====================//
const express = require('express');
const router = express.Router();


const UserController = require("../Controller/userController");
const productController = require("../Controller/productController")
// const {createUser,login} = require("../Controller/userController");
// const {createBooks,getAllBook,getBooksByPathParam, updateBookbyId,deletebyId} = require("../Controller/bookController");
const {authentication,authorisation} = require("../middleware/auth")


router.post("/register", UserController.createUser);
router.post("/login", UserController.login);
router.post("/product", authentication,productController.createProduct);
router.get("/product", productController.getAllProduct);
router.get("/product/:productId", productController.getProductById);
router.put("/product/:productId",authentication,authorisation,productController.updateProductbyId);
router.delete("/product/:productId",authentication,authorisation, productController.deletebyId);


//=====================Module Export=====================//
module.exports = router;   