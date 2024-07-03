import User from "../models/user-model.js";
import bcrypt from "bcryptjs"
import JWT from 'jsonwebtoken'
import dotenv from 'dotenv'
import {OAuth2Client} from 'google-auth-library'
dotenv.config()

// export const register = async(req,res)=>{
//     console.log(req.body);
//     res.send(req.body)
// }


export const register = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);
  let userExist;

  try {
    userExist = await User.findOne({ email: email });
  } catch {
    return res.status(404).json({ message: "Internal server error" });
  }
  if (userExist) {
    return res.status(404).json({ message: "User already Exists" });
  }
  const hashPassword = await bcrypt.hash(password, 12);
  console.log(hashPassword);

  const newUser = new User({
    username:username,
    email:email,
    password: hashPassword,
    google:false,
    verified:true
  
  });
  console.log(newUser);

  try {
    await newUser.save();
    return res.status(201).json({ message: "user saved successfully" ,user:newUser});
  } catch {
    return res.status(404).json({ message: "Internal server error" });
  }
};



export const login =async(req,res)=>{
    const{email,password}=req.body
    let userExist;
    try{
      userExist = await User.findOne({email:email})
      console.log(userExist)
    }catch{
        return res.status(404).json({ message: "Internal server error" });

    }
    if(!userExist){
        return res.status(500).json({message:"invalid Email"})
    }
    const validPassword = await bcrypt.compare(password,userExist.password)
    if(validPassword){
       const token = JWT.sign({userId:userExist._id},process.env.JWT_SECRET,{expiresIn:"1d"})

        return res.status(200).json({message:"login successfull",user:userExist,token,expiresIn:Date.now()+60*24*1000*60})

    }else{
        return res.status(500).json({message:"invalid password"})


    }
    
}

export const googleAuth = async(req, res) => {
  const data = req.body.credential
  const client=new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.CLIENT_URL)
 
  let userData
  try{
    const ticket = await client.verifyIdToken({
      idToken: data,
      audience:process.env.GOOGLE_CLIENT_ID
    })
    console.log(ticket)
    const payload = ticket.getPayload()
    console.log(payload)
    
   
    
    if (payload.iss !== 'https://accounts.google.com' || payload.aud !== process.env.GOOGLE_CLIENT_ID) {
            throw new Error('Invalid Google ID token');
        }

       userData = payload
       console.log(userData)
      
     
  }catch(err){
    return res.status(500).json({message:"Error verifying google ID", error : err.message});
  }
  if(!userData){
    return res.status(500).json({message:"Something Went Wrong!!!"})
  }
  const { name, email} = userData;
  try{
  
    const user = await User.findOne({ email: email, password: process.env.GOOGLE_USER_PASSWORD, google:true});

    if(user){
      const token = JWT.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"1d"})
        user.password = ""
      return res.json({user,token,expiresIn:Date.now()+60*24*1000*60})
    }

    const newUser = new User({
      username: name,
      email: email,
      password: process.env.GOOGLE_USER_PASSWORD,
      google:true,
      verified:true,
    })

    await newUser.save()
    newUser.password = ""
    const token = JWT.sign({userId:newUser._id},process.env.JWT_SECRET,{expiresIn:"1d"})


    return res.json({message:"User saved successfully",user:newUser,token,expiresIn:Date.now()+60*24*1000*60})



  }catch(err){
    return res.status(500).json({message:"Internal Server Error"},err)
  }
}
