import mongoose,{Schema} from "mongoose";

const userSchema= new Schema({
    username:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true,minlength:6},
    google:{type:Boolean, required:true},
    verified:{type:Boolean, required:true}
})

const User=mongoose.model('User',userSchema)

export default User;