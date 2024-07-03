import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import helmet from "helmet"
import morgan from "morgan"

//routes
import userRoutes from './routes/userRoutes.js'
import authRoutes from  './routes/authRoutes.js'


const app = express()
dotenv.config()

app.use(helmet());
app.use(cors({origin:true}));

app.use(morgan("dev"))



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));
//custom routes
app.use('/auth',authRoutes)
app.use('/user',userRoutes)

//mongodb connection and app listening
mongoose.connect(process.env.MONGO_URL).then(()=>{
    app.listen(process.env.APP_PORT || 5000, ()=>{
            console.log("db connected");
    })
}).catch((err)=>{
    console.log("error",err);
})
