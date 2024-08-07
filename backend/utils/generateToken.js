import jwt from "jsonwebtoken";


const generateTokenAndSetCookie = (userId,res)=>{
    // console.log("JWT Secret:", process.env.JWT_SECRET); 
    // console.log("Environment Variables:", process.env);

    const token =  jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:'15d'
    })

    res.cookie("jwt",token,{
        maxAge: 15 * 24 * 60 * 60 * 1000, //milli seconds
        httpOnly:true ,  // prevent xss attacks 
        sameSite:"strict", //csrf attacks prevention
        secure :  process.env.NODE_ENV !== "development"
    });
};

export default generateTokenAndSetCookie;