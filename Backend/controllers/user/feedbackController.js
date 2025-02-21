const  CompletedSession  = require('../../models/CompletedSessions');

exports.submitFeedback = async (req, res) => {
  const { userTimeSlotId, feedback, services } = req.body;

  try {
    const existingFeedback = await CompletedSession.findOne({ where: { userTimeSlotId } });

    if (existingFeedback) {
      return res.status(400).json({ error: 'Feedback already submitted for this timeslot' });
    }

    const newFeedback = await CompletedSession.create({
      userTimeSlotId,
      feedback,
      services,
    });

    console.log(newFeedback)

    res.status(200).json({ message: 'Feedback submitted successfully', newFeedback });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};
