const UserProfile=require('../../models/UserProfile');
const bcrypt=require('bcryptjs');
const {generateToken}=require('../../util/jwt');

exports.fetchUserDetails=async(req,res)=>{
    try{
        
        const {id:userId}=req.user;
       
        const userProfile=await UserProfile.findByPk(userId);
      
       
        if(!userProfile){
            return res.status(404).json({message:"employee not found"});
        }
         res.status(200).json(userProfile);

    }
    catch(err){
        console.log(err);
    }
}

exports.updateUserDetails=async(req,res)=>{
    try{
        const {id:userId}=req.user;
        const{name,email,age}=req.body;
       
        console.log(req.body);
        const userProfile=await UserProfile.findByPk(userId);
        if(!userId){
           return res.status(404).json({message:"employee not found"})
        }
        if(name) userProfile.name=name;
        if(age)userProfile.age=age;
        if(email) userProfile.email=email;
        await userProfile.save();
        res.status(200).json({message:"employee details updated successfully"})

    }
    catch(err){
        console.log(err);
    }
}
    

exports.createUserProfile=async(req,res)=>{
    try{
    const { name,age,email,password}=req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserProfile=await UserProfile.create({name,age,email,password: hashedPassword})
    res.status(201).json({userProfile:newUserProfile});
    }
    catch(err){
    res.status(404).json({err:err.message});
    }

}


exports.loginUserProfile=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user = await UserProfile.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found. Please sign up." });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Incorrect password" });
        }
        const token = generateToken(user.id);
         res.status(200).json({ userProfile: user, token });
        
    }
    catch(err){
        res.status(400).json({ error: err.message });
    }
}

