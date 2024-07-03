import Post from "../models/post-model.js";

export const createPost = async (req, res) => {
  const { userId, title, desc, baby, backgroundStory, image } = req.body;
  const newPost = new Post({
    userId,
    title,
    desc,
    baby,
    backgroundStory,
    image,

    // or
    // model=values from frontend
    // userId:userId,
    // title:title,
    // desc:desc,
    // movie:movie,
    // content:content,
    // image:image
  });
  console.log(newPost);
  try {
    await newPost.save();
    return res.status(200).json({ message: "Post created Successgully" });
  } catch {
    return res.status(505).json({ message: "Internal server Error" });
  }
};

/////////////////////////////////////////////////////////////

// 
export const editPost = async (req, res) => {
  const { postId, title, baby, backgroundStory, desc, image, userId } = req.body;

  console.log(req.body);

  try {
    const post = await Post.findOneAndUpdate(
      { _id: postId},
      {
        title,
        baby,
        backgroundStory,
        desc,
        image,
      },
      { new: true } // This option returns the updated document
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found or not authorized" });
    }

    return res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const deletePost = async (req, res) => {
  const postId = req.params.postId;
  console.log(postId);
  const{userId} = req.body
  try {
    await Post.findOneAndDelete({_id:postId,userId:userId});
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(200).json({ message: "deleted succefully" });
};

export const getPost = async (req, res) => {
  try {
    const allPosts = await Post.find().populate("userId");
    return res.status(200).json({ Posts: allPosts });
  } catch {
    return res.status(500).json({ message: "coudn't find posts" });
  }
};
export const logedUserPost = async (req, res) => {
  const logedUserId = req.params.userId;
  let post;
  try {
    post = await Post.find({ userId: logedUserId });
    console.log(post);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err });
  }
  return res.status(200).json({ posts: post });
};

export const likePost = async (req, res) => {
  const { userId, postId } = req.body;
  try {
    let post = await Post.findById(postId);
    if (post.likes.includes(userId)) {
      post=await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } },{new:true});
      return res.status(200).json({likes:post.likes,dislikes:post.dislikes});
    } else {
      if(post.dislikes.includes(userId)){
        post=await Post.findByIdAndUpdate(postId, { $pull: { dislikes: userId } },{new:true});
 
      }
      post=await Post.findByIdAndUpdate(postId, { $push: { likes: userId } },{new:true});
      

      return res.status(200).json({likes:post.likes,dislikes:post.dislikes});
      
    }
  } catch {
    return res.status(400).json({ message: "Internal Server error" });
  }
};
export const dislikepost = async (req, res) => {
  const { userId, postId } = req.body;
  try {
    let post = await Post.findById(postId);
    if (post.dislikes.includes(userId)) {
     post = await Post.findByIdAndUpdate(postId, { $pull: { dislikes: userId} });
      return res.status(200).json({dislikes:post.dislikes,likes:post.likes});
    } else {
      if(post.likes.includes(userId)){
        post=await Post.findByIdAndUpdate(postId,{$pull:{likes:userId}},{new:true})
      }
      post = await Post.findByIdAndUpdate(postId,{$push:{dislikes:userId}},{new:true})
      return res.status(200).json({dislikes:post.dislikes,likes:post.likes});
    }
  } catch {
    return res.status(400).json({ message: "Internal Server error" });
  }
};

export const getPosts = async(req,res)=>{
  const postId = req.params.postId;
  let posts
  try{
    posts = await Post.findById(postId)
    console.log(posts);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err });
  }
  return res.status(200).json({post:posts});
};




  


