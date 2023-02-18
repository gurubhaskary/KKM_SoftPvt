const mongoose=require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId


const productSchema= new mongoose.Schema({
  userId: {type: ObjectId, ref: "UserCollection", required :true },
  Productname: {type: String, required :true, trim:true,unique:true},
  Quantity: {type: Number,required: true},
  Active: {type: String, trim:true}, 
  price: {type: Number,required: true}
},{timeStamps: true})


module.exports= mongoose.model("KKMProductManagement",productSchema)