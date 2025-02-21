const EmployeeTimeslot=require('../../models/EmployeeTimeslot');
const sequelize=require("../../config/database");
const { where } = require('sequelize');


exports.getTimeslot = async (req,res)=>{
  
    const { id:employeeId }=req.user;
    
    try{
        const timeslots=await EmployeeTimeslot.findAll({where:{employeeId}});
        res.json(timeslots);

    }
    catch(err){
        console.log(err.message);
    }
}

exports.createTimeslots=async (req,res)=>{
    const{id:employeeId}=req.user;
    console.log(employeeId)
    const {date,startTime,endTime} = req.body;
    console.log(req.body);

    if ( !date || !startTime || !endTime) {
        return res.status(400).json({ error: 'All fields are required' });
      }
    const transaction=await sequelize.transaction();
    try{
        const newTimeslot=await EmployeeTimeslot.create({
            employeeId,
            date,
            startTime,
            endTime,
            reserved:false,
            
        },{transaction})
        await transaction.commit();
        res.json(newTimeslot);
    }
    catch(error){
        await transaction.rollback();
        console.log(error.message);
    }
    
}

exports.deleteTimeslot=async (req,res)=>{
    const { id:employeeId }=req.user;
    const { timeslotId } = req.params;
    const transaction=await sequelize.transaction();
    try{
        const timeslot=await EmployeeTimeslot.findOne({where:{ id: timeslotId, employeeId },})

        if(timeslot){
            await timeslot.destroy({transaction});
            await transaction.commit();
            res.json({message:"timeslot deleted"})
        }
        else{
            await transaction.rollback();
            res.status(404).json({error:"timeslot not found"});
        }
    }
    catch(err){
        await transaction.rollback();
        console.log(err.message)
    }

}