const CompletedSession  = require('../../models/CompletedSessions');


const UserTimeSlot = require('../../models/UserTimeslot');

exports.submitResponse = async (req, res) => {
  const { employeeTimeSlotId, startTime, endTime, date, review } = req.body;

  try {
    console.log({  startTime, endTime, date, review });

    // Find the UserTimeSlot that matches the given date, startTime, and endTime
    const userTimeSlot = await UserTimeSlot.findOne({
      where: {
        date,       // Match the date
        startTime,  // Match the start time
        endTime,    // Match the end time
      },
    });

    if (!userTimeSlot) {
      return res.status(404).json({ error: 'No matching user time slot found for the provided details' });
    }

    // Use the found `userTimeSlotId` to query the CompletedSession table
    const feedbackEntry = await CompletedSession.findOne({
      where: { userTimeSlotId: userTimeSlot.id },
    });

    if (!feedbackEntry) {
      return res.status(404).json({ error: 'Feedback not found for this session' });
    }

    if (feedbackEntry.review) {
      return res.status(400).json({ error: 'Employee has already responded to this feedback' });
    }

    // Save the review
    feedbackEntry.employeeResponse = review;
    await feedbackEntry.save();

    res.status(200).json({ message: 'Response submitted successfully', feedbackEntry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit response' });
  }
};
