const User = require("../models/user.model");
const Event = require("../models/event.model");
const Registration = require("../models/registration.model");

exports.registerEvent = async (req, res, next) => {
  try {
    const token = req.get("Authorization").split(" ")[1];
    const userId = getUserId(token);

    const { eventId = "" } = req.params || {};

    const user = await User.findById(userId);

    const alreadyRegistered = await Registration.findOne({
      user: userId,
      event: eventId,
    });

    if (alreadyRegistered) {
      const error = new Error("User already registered for this event");
      error.status = 400;
      throw error;
    }

    const event = await Event.findById(eventId);

    if (!event) {
      const error = new Error("Cannot find event");
      error.status = 404;
      throw error;
    }

    if (event.currentParticipants >= event.capacity) {
      const error = new Error("No available slots");
      error.status = 400;
      throw error;
    }

    if (event.eventType === "paid") {
        
    }

    event.currentParticipants += 1;
    await event.save();

    const registration = new Registration({ user: userId, event: eventId });
    await registration.save();
    res.status(200).json({ message: "Registration successful", registration });
    return sendEmail(
      user.email,
      "vuminhduc1702@gmail.com",
      "Successfully Register",
      "<h1>Congratulation!</h1>"
    );
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.cancelEventRegistration = async (req, res, next) => {
  try {
    const registrationId = req.params.registrationId;
    const registration = await Registration.findById(registrationId);

    if (!registration) {
      const error = new Error("Cannot find registration");
      error.status = 400;
      throw error;
    }

    const eventId = registration.event._id;
    const event = await Event.findById(eventId);
    event.currentParticipants -= 1;
    await event.save();

    await Registration.deleteOne({ _id: registrationId });
    res
      .status(200)
      .json({ message: "Successfully cancel registration", registration });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};
