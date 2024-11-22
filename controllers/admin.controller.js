const Event = require("../models/event.model");
const Registration = require("../models/registration.model");

exports.overview = async (req, res, next) => {
  const eventId = req.params.eventId;

  try {
    const event = await Event.findById(eventId);

    const registrationCount = await Registration.countDocuments({ eventId });
    const revenue = event.price ? registrationCount * event.price : 0;

    const overview = {
      eventId,
      name: event.name,
      total: registrationCount,
      revenue,
    };
    res.status(200).json({ message: "Success", data: overview });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.topEvent = async (req, res, next) => {
  try {
    const topEvents = await Registration.aggregate([
      // group documents in Registration by eventId
      // create a data group with _id = eventId
      // count documents using $sum: 1
      { $group: { _id: "$eventId", count: { $sum: 1 } } },

      // descending sort
      { $sort: { count: -1 } },

      // top 5
      { $limit: 5 },

      // join Registration and Event on eventId
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },

      // select fields returned to users
      {
        $project: {
          eventId: "$_id",
          eventName: "$event.name",
          registrations: "$count",
        },
      },
    ]);

    res.status(200).json({ message: "Success", data: topEvents });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.userActivity = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const userActivity = await Registration.find({ userId }).populate(
      "eventId",
      "name"
    );
    res.status(200).json({ message: "Success", data: userActivity });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};
