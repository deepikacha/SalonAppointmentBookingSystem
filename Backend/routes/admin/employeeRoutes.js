const express = require('express');
const router = express.Router();
const employeeController = require('../../controllers/admin/EmployeeTimeslotController');
const sessionController = require('../../controllers/admin/EmployeeSessionController');
const responseController=require('../../controllers/admin/responseController');
const {Authorize}=require('../../middleware/EmployeeAuth')

router.get('/fetch-timeslots',Authorize,employeeController.getTimeslot);
router.get('/employee/upcomingTimeslots',Authorize,sessionController.upcomingTimeslots);
router.get('/employee/completedTimeslots',Authorize,sessionController.completedTimeslots);
router.get('/employee/getCancelledSlots',Authorize,sessionController.getCancelledTimeslots);
// router.get('/timeslots/:employeeId', (req,res)=>{
//     console.log("router");
//     res.send("hi");
// });
router.post('/timeslots',Authorize,employeeController.createTimeslots);
router.post('/employee/response',Authorize,responseController.submitResponse);
router.put('/employee/cancelSlot/:id',Authorize,sessionController.cancelTimeslots);
// router.post('/timeslots',(req,res)=>{
//     console.log("router");
//     res.send("hi")
// })
router.delete('/delete-timeslots/:timeslotId',Authorize,employeeController.deleteTimeslot);


module.exports= router;