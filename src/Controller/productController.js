const productModel = require("../model/productModel")
const { valid } = require("../Validator/validate")
const userModel = require("../model/userModel");


const createProduct = async function (req, res) {
    try {
        let data = req.body;
        data.userId = req.loggedInUser;
        let userDetails = await userModel.findById(req.loggedInUser);
    
        if (!userDetails) {
            return res.status(400).send({ status: false, msg: " User does not Exist." });
        }
        let findProductname = await productModel.findOne({ Productname: data.Productname })
            if (findProductname) return res.status(409).send({ status: false, message: "Productname already exist" })

        let newproduct = await productModel.create(data)
        res.status(201).send({ status: true, msg: "success", data: newproduct })
    }
    catch (error) {
        res.status(500).send({ status: false, error: error.message });
    }
}

const getAllProduct = async function (req, res) {
    try {
        const queryParams = req.query
        if (queryParams.userId && !queryParams.userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({ status: false, message: "Incorrect userId" })
        }
        let findProduct = await productModel.find()

        findProduct.sort(function (a, b) {
            return a.Productname.localeCompare(b.Productname)
        })
        if (!findProduct && findProduct.length == 0) {
            return res.status(404).send({ status: false, message: "Product not found" })
        }
        return res.status(200).send({ status: true, message: "Product list", data: findProduct })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const getProductById = async function (req, res) {
    try {
        let productIdEntered = req.params.productId
        //===================== Checking the input value is Valid or Invalid =====================//
        if (!(productIdEntered)) return res.status(400).send({ status: false, message: "Enter a product id" });

        let fullproductDetails = await productModel.findById(productIdEntered );
        //===================== Checking Book Exsistance =====================//
        if (!fullproductDetails) return res.status(404).send({ status: false, message: 'product Not Found' })
        //===================== Getting Reviews of Book =====================//
        

        return res.status(200).send({ status: true, message: 'product list', data: fullproductDetails })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}

const updateProductbyId = async function (req, res) {
    try {
        let productId = req.params.productId;

        let { Productname} = req.body
        //=====================Checking the validation=====================//
        if (!valid(productId)) return res.status(400).send({ status: false, message: "product Id is Invalid !!!!" })
        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "please enter data in body" });

        //===================== Checking Book Exsistance =====================//
        let productData = await productModel.findOne({ _id: productId})
        if (!productData) return res.status(404).send({ status: false, message: "No product Found using productId" })

        //=====================Validation of Productname=====================//
        if (Productname) {
            if (!valid(Productname)) return res.status(400).send({ status: false, message: "invalid Productname details" });
            let findProductname = await productModel.findOne({ Productname: Productname })
            if (findProductname) return res.status(409).send({ status: false, message: "Productname already exist" })

        }

        //=====================Updating Bookd=====================//
        let updatedProduct = await productModel.findByIdAndUpdate(productId, req.body, { new: true })
        return res.status(200).send({ status: true, data: updatedProduct })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

const deletebyId = async function(req, res) {
    try {
        const productId = req.params.productId
        if (!productId) return res.status(400).send({
            status: false,
            message: "Enter a productId"
        })
        let product = await productModel.findById({_id:productId})
        if (!product) {
            return res.status(404).send({ status: false, message: "NO such product exist" })
        };
        
        if (req.loggedInUser != product.userId) {
            return res.status(403).send({ status: false, message: "Not Authorised" })
        }
        // let deletproduct=await productModel.findOneAndUpdate({ _id: productId },{new: true})
        let deletproduct=await productModel.deleteOne({ _id: productId });
        return res.status(200).send({ status: true, message: "product deleted successfully", data: deletproduct})
    } catch (error) {
        return res.status(500).send({ message: error.message })

    }
}


 // ======================================
module.exports.createProduct = createProduct
module.exports.getAllProduct = getAllProduct
module.exports.getProductById = getProductById
module.exports.updateProductbyId = updateProductbyId
module.exports.deletebyId = deletebyId
// module.exports={createBooks,getAllBook,getBooksByPathParam, updateBookbyId,deletebyId};
