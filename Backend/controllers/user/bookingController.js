const Razorpay = require('razorpay');
const  UserTimeSlot=require('../../models/UserTimeslot');
const  EmployeeTimeslot=require('../../models/EmployeeTimeslot');
const { Sequelize } = require('sequelize');
const  sequelize=require('../../config/database');
const services = require('../../config/services');
const EmailService = require('../../config/nodEmail');
const Order=require('../../models/Order');
const EmployeeProfile = require('../../models/EmployeeProfile');
const PaymentService = require('../../config/razorpay');
const{Op}=require('sequelize');


exports.timeslots=async (req,res)=>{
 

  
  try{
    const timeslots=await EmployeeProfile.findAll({
    
      
       attributes:["id","name","services"],
        
      
       include: [
        {
          model: EmployeeTimeslot,
          attributes: ["id","date", "startTime", "endTime", "reserved"],
        },
      ],

    })
    if(!timeslots){
      return res.status(404).json({message:"timeslot not found"});
    }
   
     res.json(timeslots);
  }
  catch(err){
    console.log(err);
  }

}

exports.viewTimeslots=async(req,res)=>{
  // const {timeslotId}=req.params;
  const{employeeId}=req.params;
 
  try{
    const timeslots=await EmployeeProfile.findAll({
      where:{id:employeeId},
       include:[
       { model:EmployeeTimeslot,
       attributes:["date","startTime","endTime","employeeId","reserved"],
       }
       ],

      
    })
    if(!timeslots.length){
       return res.status(404).json({message:"no timeslots found for this employee"});
    }
    
    res.status(200).json(timeslots);
  }
  catch(err){
    console.log(err);
  }
}





// Razorpay instance
const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.initiateBookingPayment = async (req, res) => {
  const { id } = req.user; // Logged-in user
  const { employeeId, service, date, startTime, endTime,userEmail } = req.body;

  if (!services.includes(service)) {
    return res.status(400).json({ error: 'Invalid service selected' });
  }

  const transaction = await sequelize.transaction();

  try {
    // Check for existing bookings
    const existingBooking = await UserTimeSlot.findOne({
      where: { customerId: id, date, startTime, endTime, reserved: true },
      transaction,
    });

    if (existingBooking) {
      await transaction.rollback();
      return res.status(400).json({ error: 'You already have a booking at this time' });
    }

    // Create a new user time slot
    const userTimeSlot = await UserTimeSlot.create(
      { customerId: id, date, startTime, endTime, services: service, reserved: true },
      { transaction }
    );

    // Check employee availability
    const employeeTimeslot = await EmployeeTimeslot.findOne({
      where: { employeeId, date, startTime, endTime },
      transaction,
    });

    if (!employeeTimeslot) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Employee timeslot not available' });
    }

    employeeTimeslot.reserved = true;
    await employeeTimeslot.save({ transaction });

    // Create Razorpay order
    const amount = 200 * 100; // Amount in paise (adjust as required)
    const receipt = `${id}_${Date.now()}`;
    const order = await PaymentService.createOrder(amount, "INR", receipt);

    const orderInfo = {
      name: "salon",
      description: "Payment",
      image: "",
    };

   

    // Save order detai
    await Order.create(
      { orderId: order.id, userId: id, status: 'PENDING' ,paymentId: null,},
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      order,
      orderInfo,
      key_id: process.env.RAZORPAY_KEY_ID,
      message: 'Booking initiated. Complete payment to confirm.',
      userTimeSlot,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error initiating booking payment:', error.message);
    res.status(500).json({ error: 'Failed to initiate booking payment' });
  }
};



   

   
    
   


exports.updateBookingTransactionStatus = async (req, res) => {
  const { id, email: userEmail } = req.user;
  const { paymentid, orderid, status } = req.body;

  try {
    const order = await Order.findOne({ where: { orderid } });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (status === 'FAILED') {
      await order.update({ status: 'FAILED' });
      return res.status(200).json({ success: false, message: 'Payment failed.' });
    }

    if (status === 'SUCCESS') {
      const userTimeSlot = await UserTimeSlot.findOne({ where: { customerId: id } });
      await Promise.all([
        order.update({ paymentid, status: 'SUCCESS' }),
        userTimeSlot.update({ reserved: true }),
      ]);

      const emailSubject = 'Slot Booked';
      const emailHtml = `
        <p>Hi,</p>
        <p>Your slot for ${userTimeSlot.services} on ${userTimeSlot.date} 
        from ${userTimeSlot.startTime} to ${userTimeSlot.endTime} has been successfully booked.</p>
        <p>Thank you for choosing our salon!</p>`;

      try {
        await EmailService.sendEmail(userEmail, emailSubject, emailHtml);
      } catch (error) {
        console.error('Error sending email:', error.message);
      }
  
      return res.status(200).json({
        success: true,
        message: 'Payment successful. Booking confirmed.',
      });
    }

    return res.status(400).json({ error: 'Invalid transaction status' });
  } catch (error) {
    console.error('Error updating transaction status:', error.message);
    res.status(500).json({ error: 'Failed to update transaction status' });
  }
};

   
exports.fetchTimeslots=async(req,res)=>{
  const {query}=req.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }
  try{
    const employees=await EmployeeProfile.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { services: { [Op.like]: `%${query}%` } }
        ]
      }
    })
    console.log(employees)
    res.json(employees)
  }
  catch(err){
    console.log(err);
  }
}

 

  

    

    

    


