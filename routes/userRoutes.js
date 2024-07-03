import express from 'express';
import { checkAuth } from '../middlewares/checkAuth.js';


const router=express.Router()
import { createPost,editPost,deletePost,getPost,logedUserPost,likePost,dislikepost,getPosts } from '../controllers/userControllers.js';
router.use(checkAuth)

router.post('/create-post',createPost)
router.patch('/edit-post',editPost)
router.delete('/delete-post/:postId',deletePost)
router.get('/get-posts',getPost)
router.get('/get-post/:postId',getPosts)
router.get('/logedUser-posts/:userId',logedUserPost)
router.post("/like-post",likePost)
router.post("/dislike-post",dislikepost)
                                        




export default router