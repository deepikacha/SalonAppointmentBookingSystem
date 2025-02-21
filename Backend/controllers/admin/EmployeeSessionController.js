const EmployeeTimeslots = require('../../models/EmployeeTimeslot');
const userTimeslots=require('../../models/UserTimeslot');
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
        const timeslots = await EmployeeTimeslots.findAll({
            where: {
                employeeId: id,
                date: { [Op.gte]: dateOnly },
                reserved: true,
            },
        });
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
        // Extract hours, minutes, and seconds in UTC
        // Extract hours, minutes, and seconds in local time
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        // Format the time string
        const currentTime = `${hours}:${minutes}:${seconds}`;

        const year = now.getFullYear();
        const month = now.getMonth();
        const day = now.getDate();

        const timeslots = await EmployeeTimeslots.findAll({
            where: {
                employeeId: id,
                reserved: true
            }

        })
        
        const completedSlot = timeslots.filter((slot) => {
console.log(compareTimeStrings(slot.dataValues.endTime, slot.dataValues.date))
            return compareTimeStrings(slot.dataValues.endTime, slot.dataValues.date)

        }
        );
        console.log(completedSlot)
        res.json(completedSlot);

    }
    catch (err) {
        console.log(err);
    }

}

exports.cancelTimeslots = async (req, res) => {
    const { id } = req.params;

    try {
        const cancelSlot = await EmployeeTimeslots.findByPk(id);
        if (!cancelSlot) {
            return res.status(404).json({ message: 'Timeslot not found' });
        }

        cancelSlot.reserved = false;
        await cancelSlot.save();

        const cancelUserSlot = await userTimeslots.findOne({
            where: {
                date: cancelSlot.date,
                startTime: cancelSlot.startTime,
                endTime: cancelSlot.endTime
            }
        });
        if (!cancelUserSlot) {
            return res.status(404).json({ message: 'Timeslot not found' });
        }

        cancelUserSlot.reserved = false;
        await cancelUserSlot.save();

        res.status(200).json({ message: 'Timeslot cancelled successfully', timeslot: cancelSlot ,userTimeslot: cancelUserSlot
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error while cancelling timeslot' });
    }
};


exports.getCancelledTimeslots = async (req, res) => {
    try {
        const cancelledSlot = await EmployeeTimeslots.findAll({ where: { reserved: false }, order: [['date', 'ASC']] })

        res.json(cancelledSlot);
    }
    catch (err) {
        console.log(err);
    }
}


function compareTimeStrings(dbTime, dbDate) {

    // "2025-01-22T00:00:00.000Z"

    const now = new Date();

    // Extract the current date
    const year = String(now.getFullYear()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    // Create a new Date object for the date only
    const dateOnly = `${year}-${month}-${day}` // No -1 adjustment needed here

    // Extract current time as a string
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const currentTime = `${hours}:${minutes}:${seconds}`;

    // Convert the time strings into Date objects for easy comparison
    const [h1, m1, s1] = currentTime.split(':').map(Number);
    const [h2, m2, s2] = dbTime.split(':').map(Number);

    const date1 = dateOnly.split('T')[0]
    const date2 = dbDate.toLocaleDateString('en-CA').split('T')[0]

    const dateInt1 = +date1.split('-').join('')
    const dateInt2 = +date2.split('-').join('')


    // Convert to seconds for comparison
    const totalSeconds1 = h1 * 3600 + m1 * 60 + s1;
    const totalSeconds2 = h2 * 3600 + m2 * 60 + s2;
    console.log(date1, date2)
    console.log(totalSeconds1, totalSeconds2)


    if ( dateInt1 >= dateInt2 && totalSeconds1 >= totalSeconds2 ) {
        return true; // time1 is earlier
    } else {
        return false;  // time1 is later
    }
}