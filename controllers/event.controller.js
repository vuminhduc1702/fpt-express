const Event = require("../models/event.model");
const User = require("../models/user.model");
const Registration = require("../models/registration.model");
const getUserId = require("../utils/getUserId.util");
const event = require("../models/event.model");
const sendEmail = require("../utils/sendEmail.util");

exports.getEvents = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const skip = (page - 1) * limit;
    const events = await Event.find().skip(skip).limit(limit);

    const total = await Event.countDocuments();

    res.status(200).json({
      page,
      limit,
      total,
      data: events,
    });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.createEvent = (req, res, next) => {
  const event = new Event({ ...req.body });
  event
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Event created successfully",
        event: result,
      });
    })
    .catch((err) => {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    });
};

exports.getEvent = (req, res, next) => {
  const eventId = req.params.eventId;
  Event.findById(eventId)
    .then((event) => {
      if (!event) {
        const error = new Error("Could not find event");
        error.status = 404;
        throw error;
      }
      res.status(200).json({
        message: "Event found",
        event: event,
      });
    })
    .catch((err) => {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    });
};

exports.updateEvent = (req, res, next) => {
  const eventId = req.params.eventId;
  Event.findById(eventId)
    .then((event) => {
      if (!event) {
        const error = new Error("Could not find event");
        error.status = 404;
        throw error;
      }
      event.name = req.body.name;
      event.description = req.body.description;
      event.time = req.body.time;
      event.location = req.body.location;
      event.capacity = req.body.capacity;

      return event.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Event updated", event: result });
    })
    .catch((err) => {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    });
};

exports.deleteEvent = (req, res, next) => {
  const eventId = req.params.eventId;
  Event.findById(eventId)
    .then((event) => {
      return Event.findByIdAndDelete(event);
    })
    .then((result) => {
      res.status(200).json({ message: "Event deleted" });
    })
    .catch((err) => {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    });
};
