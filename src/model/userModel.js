const mongoose=require("mongoose")


const userSchema= new mongoose.Schema({
    name: {type: String, required :true, trim:true},
    username: {
        type: String, required: true, trim: true, lowercase: true, unique: true,
    }, 
    password: {type: String, required: true, trim: true,
        match:[/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()]).{8,15}$/, "Please Enter valid Password"],
        minlength:8,
        maxLength:15
    }
},{timeStamps: true})

module.exports= mongoose.model("KKMUserCollection",userSchema)