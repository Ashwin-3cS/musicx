import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";


export const signup = async (req,res) =>{
    try {
        const {userName,mail,walletAddresss} = req.body;
        

        const user = await User.findOne({userName});

        if(user){
            return res.status(400).json({error:"User already exists"})
    
        }



        const newUser = new User({
            fullName:fullName,
            userName,
            password:hashedPassword,
            gender, 
            profilePic : gender === "male"  ? boyProfile : girlProfile
        })
        if(newUser){
        
        generateTokenAndSetCookie(newUser._id,res);
        await newUser.save()

        res.status(201).json({
            _id:newUser._id,
            fullName:newUser.fullName,
            userName:newUser.userName,
            profilePic:newUser.profilePic
        })
        }else{
            res.status(400).json({error:"Invalid user data"})
        }
    } catch (error) {

        console.error(error);
        res.status(500).json({error:"internal Server error"})
        
    }
    
}



