const jwt = require("jsonwebtoken")
const userModel = require("../model/userModel")
const { valid, regForName, regForPassword, isValidRequestBody } = require("../Validator/validate")




const createUser = async function (req, res) {
    try {
        const data = req.body
        const { name, username, password } = data

        //===================== Checking the input value is Valid or Invalid =====================//
        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Body is empty, please provied data" });
        }


        //=====================Validation of Name=====================//

        if (!name) return res.status(400).send({ status: false, message: "Name is required" })
        if (!(valid(name))) return res.status(400).send({ status: false, msg: "Enter Valid Name" })
        if (!regForName(name)) return res.status(400).send({ status: false, msg: "Enter Valid Name in Alphabets" })

        //=====================Validation of Email=====================//
        if (!username) return res.status(400).send({ status: false, message: "username is required" })

        //=====================Checking the Duplication of Email=====================//
        let duplicateUsername = await userModel.findOne({ username: username });
        if (duplicateUsername) return res.status(400).send({ status: false, message: "username already exists!" });


        //=====================Validation of Password=====================//
        if (!password) return res.status(400).send({ status: false, message: "Password is required" })
        if (!(valid(password))) return res.status(400).send({ status: false, msg: "Provide a valid Password" })
        if (!regForPassword(password)) return res.status(400).send({ status: false, msg: "Please Enter Password With atleast one UpperCase,LowerCase,Number and special characters" })

        //=====================User Data Creation=====================//
        const newUser = await userModel.create(data)
        return res.status(201).send({ status: true, message: 'Success', newUser })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



const login = async function (req, res) {
    try {
        let username = req.body.username
        let password = req.body.password
        let data = req.body

        //=====================Checking the validation=====================//
        if (!isValidRequestBody(data)) return res.status(400).send({ status: false, msg: "username and Password Required !" })

        //=====================Validation of EmailID=====================//
        if (!username) return res.status(400).send({ status: false, msg: "username is required" })
        
        //=====================Validation of Password=====================//
        if (!password) return res.status(400).send({ status: false, msg: "password is required" })
        if (!regForPassword(password)) return res.status(400).send({ status: false, msg: "Please Enter Password With atleast one UpperCase,LowerCase,Number and special characters" })

        //===================== Checking User exsistance using Email and password=====================//
        const user = await userModel.findOne({ username: username, password: password })
        if (!user) return res.status(401).send({ status: false, msg: "Email or Password Invalid Please try again !!" })

        //===================== Creating Token Using JWT =====================//
        const token = jwt.sign({
            userId: user._id.toString(),
            batch: "plutonium",
        }, "this is a private key", { expiresIn: '1d' })

        //===================== Decode Token Using JWT =====================//
        const decode = jwt.verify(token, "this is a private key")

        
        res.setHeader("x-api-key", token)
        console.log(decode)
        console.log(decode.exp)
        console.log(decode.iat)
        let expdate = new Date(parseInt(decode.exp) * 1000)
        let iatdate = new Date(parseInt(decode.iat) * 1000)
        console.log(expdate)
        console.log(iatdate)
        res.status(200).send({ status: true, message: 'Success', data: token,expdate:expdate, iatdate:iatdate})
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports.createUser = createUser
module.exports.login = login
// module.exports= {createUser, login};