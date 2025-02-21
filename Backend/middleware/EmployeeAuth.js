const EmployeeProfile=require('../models/EmployeeProfile')
const{verifyToken}=require('../util/jwt')
exports.Authorize = async (req, res,next) => {
 
   // console.log("start")
    try{
 const token= req.headers.authorization;   


 if(!token){
    return res.status(401).json({message:"Authorization token is missing"})
 }
 const data=verifyToken(token);
 if(!data){
    return res.status(401).json({message:"invalid or expired token"})
 }
 
 const user=await EmployeeProfile.findByPk(data.userId);


 if(!user){
    return res.status(404).json({message:"User not found"})
 }

 req.user=user;

//  console.log("end")
console.log(`Authorized user: ${JSON.stringify(req.user)}`);
 next();

    }
    catch(error){
      console.log(error.message)
   return res.status(500).json({message:"Internal Server Error"})
    }

}

// Define checkPremium middleware

 // Export the middleware if needed

