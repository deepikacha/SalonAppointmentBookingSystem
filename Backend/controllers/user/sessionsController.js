const userTimeslots = require('../../models/UserTimeslot');
const EmployeeTimeslots=require('../../models/EmployeeTimeslot');
const { Op } = require('sequelize')

exports.upcomingTimeslots = async (req, res) => {
    const { id } = req.user;
    try {
        const now = new Date();

        // Extract the current date
        const year = now.getFullYear();
        const month = now.getMonth();
        const day = now.getDate();

        // Create a new Date object for the date only
        const dateOnly = new Date(year, month, day); // No -1 adjustment needed here

        // Fetch timeslots from the database
        const timeslots = await userTimeslots.findAll({
            where: {
                customerId: id,
                date: { [Op.gte]: dateOnly },
                reserved: true,
            },
        });
        console.log(timeslots)
        // Filter timeslots based on the endTime comparison
        const upcomingSlots = timeslots.filter((slot) => {
            
            return !compareTimeStrings(slot.dataValues.endTime, slot.dataValues.date)

        }
        );
      
        res.json(upcomingSlots);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while fetching upcoming timeslots' });
    }
};

exports.completedTimeslots = async (req, res) => {
    const { id } = req.user;
    try {
        const now = new Date();
        
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        const currentTime = `${hours}:${minutes}:${seconds}`;

        const year = now.getFullYear();
        const month = now.getMonth();
        const day = now.getDate();

        const timeslots = await userTimeslots.findAll({
            where: {
                customerId: id,
                reserved: true
            }

        })
        const completedSlot = timeslots.filter((slot) => {
            return compareTimeStrings(slot.dataValues.endTime, slot.dataValues.date)

        }
        );
       
        res.json(completedSlot);

    }
    catch (err) {
        console.log(err);
    }

}

exports.cancelTimeslots = async (req, res) => {
    const { id } = req.params;

    try {
        const cancelSlot = await userTimeslots.findByPk(id);
        if (!cancelSlot) {
            return res.status(404).json({ message: 'Timeslot not found' });
        }

        cancelSlot.reserved = false;
        await cancelSlot.save();

        const cancelEmployeeSlot = await EmployeeTimeslots.findOne({
            where: {
                date: cancelSlot.date,
                startTime: cancelSlot.startTime,
                endTime: cancelSlot.endTime
            }
        });
        if (!cancelEmployeeSlot) {
            return res.status(404).json({ message: 'Timeslot not found' });
        }

        cancelEmployeeSlot.reserved = false;
        await cancelEmployeeSlot.save();


        

        res.status(200).json({ message: 'Timeslot cancelled successfully', timeslot: cancelSlot ,employeeTimeslot: cancelEmployeeSlot,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error while cancelling timeslot' });
    }
};


exports.getCancelledTimeslots = async (req, res) => {
    try {
        const cancelledSlot = await userTimeslots.findAll({ where: { reserved: false }, order: [['date', 'ASC']] })

        res.json(cancelledSlot);
    }
    catch (err) {
        console.log(err);
    }
}


function compareTimeStrings(dbTime, dbDate) {


    const now = new Date();

   
    const year = String(now.getFullYear()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');


    const dateOnly = `${year}-${month}-${day}` 

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const currentTime = `${hours}:${minutes}:${seconds}`;


    const [h1, m1, s1] = currentTime.split(':').map(Number);
    const [h2, m2, s2] = dbTime.split(':').map(Number);

    const date1 = dateOnly.split('T')[0]
    const date2 = dbDate.toLocaleDateString('en-CA').split('T')[0]

    const dateInt1 = +date1.split('-').join('')
    const dateInt2 = +date2.split('-').join('')
  
    

   
    const totalSeconds1 = h1 * 3600 + m1 * 60 + s1;
    const totalSeconds2 = h2 * 3600 + m2 * 60 + s2;
    
  console.log(dateInt1,dateInt2);
  console.log(totalSeconds1,totalSeconds2)


    if (  dateInt1 >= dateInt2 && totalSeconds1 >= totalSeconds2) {
        return true; 
    } else {
        return false; 
    }
}