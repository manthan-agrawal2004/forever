import validator from "validator";
import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//ROUTE FOR USER LOGIN
const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"USER DOESN'T EXIST"})
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(isMatch){
            const token=createToken(user._id);
            res.json({success:true,token})
        }
        else{
            res.json({success:false,message:"INVALID CREDENTIALS"})
        }
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message })
        
    }

}

//Route for user Register
const registerUser=async(req,res)=>{
    try {
        const {name,email,password}=req.body;
        //Checking user already exist or not
        const exists= await userModel.findOne({email});
        if(exists){
            return res.json({success:false, message:"USER ALREADY EXISTS"})
        }
        //Validating email format and strong password
        if (!validator.isEmail(email)) {
            return res.json({success:false, message:"PLEASE ENTER A VALID EMAIL"})
        }
        if(password.length<8){
            return res.json({success:false, message:"PLEASE ENTER STRONG PASSWORD"})
        }
        //Hashing user password
        const salt=await bcrypt.genSalt(8);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser=new userModel({
            name,email,
            password:hashedPassword
        })
        const user=await newUser.save()
        const token=createToken(user._id)
        res.json({success:true,token})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message })
        
    }
      
}

//Route for admin Login
const adminLogin=async(req,res)=>{
    try {
        const {email,password}=req.body
        if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
            const token=jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true,token})
        }
        else{
            res.json({success:false,message:"INVALID CREDENTIALS"})
        }

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message })
    }
}

export {loginUser,registerUser,adminLogin}
