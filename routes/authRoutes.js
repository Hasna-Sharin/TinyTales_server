import express from 'express';
import {googleAuth, register} from '../controllers/authControllers.js';
import { login } from '../controllers/authControllers.js';

const router=express.Router()

router.post("/register",register)
router.post("/login",login)
router.post("/google-auth",googleAuth)

export default router;