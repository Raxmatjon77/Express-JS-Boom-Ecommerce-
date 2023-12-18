// import necessary libraries from package.json
import  express  from "express";
import mongoose from "mongoose";
import {create } from 'express-handlebars';
import * as dotenv from "dotenv";
import flash from "connect-flash";
import session from "express-session";
import cookieParser from "cookie-parser";
//import routes
import AuthRoutes from "./routes/auth.js";
import ProductRoutes from "./routes/products.js";
// import middleware from "middleware
import userMiddleware from "./middleware/user.js"
import varMiddleware from "./middleware/var.js"
// helpers
import hbsHelpers from "./util/index.js";

const app = express();
dotenv.config()

const hbs=create({
    defaultLayout: 'main',
    extname:'hbs',
    helpers:hbsHelpers  
})
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(express.json());
app.use(flash());
app.use(cookieParser())
app.use(varMiddleware)
app.use(session({secret:"lider",resave:false,saveUninitialized:false}))
app.use(userMiddleware)

const startApp=()=>{
    try {
        mongoose.set("strictQuery", false);
       mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true 
},()=>console.log('connected to mongo'))
    } catch (error) {
        console.log(error.message);
    }
}

startApp();
app.use(AuthRoutes);
app.use(ProductRoutes)

const PORT=process.env.PORT ||4100;
app.listen(PORT,()=>{console.log(`server is running on port ${PORT}`);})
//mongodb+srv://raxmatjon:<password>@cluster0.kv9wrin.mongodb.net/?retryWrites=true&w=majority