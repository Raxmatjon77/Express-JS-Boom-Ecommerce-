import jwt from "jsonwebtoken";
const generateJsonWebToken =userId=>{
    const accessToken = jwt.sign({userId},process.env.JWT_SECRET_KEY,{expiresIn:'30d'})
    return accessToken
   
}

export {generateJsonWebToken}