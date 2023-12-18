import {Router} from 'express';
import User from '../models/User.js';
import bcrypt from "bcrypt";
import { generateJsonWebToken } from './../services/token.js';
const router=Router();

router.get('/register', (req, res) => {  

    if(req.cookies.token){
        res.redirect('/')
    }
    res.render('register',{
        title: 'Register',
        isRegister: true,
        registerError: req.flash("registerError")
    })
})

// registering users
router.post("/register", async (req, res) => {
      
    const hashedPassword=await bcrypt.hash(req.body.password,10)
    const userData={
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.email,
        password: hashedPassword
    }
    const email=req.body.email
    const existUser = await User.findOne({email});


    if(!userData.firstName || !userData.lastName||!userData.email||!userData.password){
        req.flash('registerError', 'All fields are required')
		res.redirect('/register')
		return
    }
    if(existUser){
        req.flash('registerError', 'this user was already registereted')
		res.redirect('/register')
		return
    }

        const user =await User.create(userData)
        const token= generateJsonWebToken(user._id)
  
     res.cookie("token", token,{httpOnly: true,secure: true})
     res.redirect('/')
})

router.get('/login', (req, res) => {  
    if(res.locals.token){
        res.redirect('/')
    }

    res.render('login',{
        title: 'Login',
        isLogin: true,
        loginError: req.flash('loginError'),

    })
})
router.post('/login', async (req, res) => {
	const {email, password} = req.body

	if (!email || !password) {
		req.flash('loginError', 'All fields is required')
		res.redirect('/login')
		return
	}

	const existUser = await User.findOne({email})
	if (!existUser) {
		req.flash('loginError', 'User not found')
		res.redirect('/login')
		return
	}

	const isPassEqual = await bcrypt.compare(password, existUser.password)
	if (!isPassEqual) {
		req.flash('loginError', 'Password wrong')
		res.redirect('/login')
		return
	}
    const token= generateJsonWebToken(existUser._id)
  
    res.cookie("token", token,{httpOnly: true,secure: true})
    res.redirect('/')	
})
router.get('/logout', (req, res) => {
    res.clearCookie('token')
    res.redirect('/')
})
export default router