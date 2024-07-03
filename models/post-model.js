import mongoose,{Schema} from "mongoose";

const postSchema = new Schema({
    userId:{type:mongoose.Types.ObjectId,required:true,ref:"User"},
    title:{type:String,required:true},
    desc:{type:String,required:true},
    image:{type:String, required:true},
    backgroundStory:{type:String, required:true},
    baby:{type:String, required:true},
    likes:[{type:mongoose.Types.ObjectId}],
    dislikes:[{type:mongoose.Types.ObjectId}]

})
const Post = mongoose.model('post',postSchema)
export default Post