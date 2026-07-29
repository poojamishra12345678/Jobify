import Student from "../models/student.js";
import jwt from 'jsonwebtoken'
export const verifyToken=(req,res,next)=>{
   try{
       let token=req.headers.authorization
       if(!token){
        return res.status(401).json({
            success:false,
            message:"Token not provided"
        })
       }

       let authToken=token.split(' ')[1];

       let decodeToken=jwt.verify(authToken,"this is a secret key");
       req.user=decodeToken;
       next()
   }catch(error){
    return res.status(500).json({
        success:false,
        message:error.message
    })
   }
}