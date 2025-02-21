const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user/userController');
const bookingController = require('../../controllers/user/bookingController');
const feedbackController = require('../../controllers/user/feedbackController');
const sessionController=require('../../controllers/user/sessionsController')
const {Authorize}=require('../../middleware/auth');

router.post('/user/signup', userController.createUserProfile);
// router.post('/user/signup', (req,res)=>{
//     console.log("user");
//     res.send("hi");
// });

router.post('/user/login', userController.loginUserProfile);
router.post('/book-slot',Authorize, bookingController.initiateBookingPayment);
router.post('/verify-payment',Authorize, bookingController.updateBookingTransactionStatus);
router.post('/user/feedback',Authorize,feedbackController.submitFeedback);
//router.put('/user/cancelslot/:id',Authorize,sessionController.cancelTimeslots);
router.put('/user/cancelslot/:id', Authorize, sessionController.cancelTimeslots);

router.get('/user/cancelledSlots',Authorize,sessionController.getCancelledTimeslots);
router.get('/user/timeslots',Authorize,bookingController.timeslots);
router.get('/user/timeslots/:employeeId',Authorize,bookingController.viewTimeslots);
router.get('/user/upcomingTimeslots',Authorize,sessionController.upcomingTimeslots);
router.get('/user/completedTimeslots',Authorize,sessionController.completedTimeslots);
router.get('/searchTimeslot',Authorize,bookingController.fetchTimeslots)

// router.get('/user/timeslots/:employeeId',(req,res)=>{
//     console.log("user");
//     res.send("hi")
// });
router.get('/user-profile',Authorize,userController.fetchUserDetails);

router.put('/user/update-profile',Authorize,userController.updateUserDetails);

module.exports = router;
