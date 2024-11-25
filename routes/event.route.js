const express = require("express");
const { authorize } = require("../middlewares/authorization.middleware");

const eventController = require("../controllers/event.controller");

const router = express.Router();

router.get("/event", authorize("view-event"), eventController.getEvents);

router.post("/event", authorize("create-event"), eventController.createEvent);

router.get(
  "/event/:eventId",
  authorize("view-event"),
  eventController.getEvent
);

router.put(
  "/event/:eventId",
  authorize("update-event"),
  eventController.updateEvent
);

router.delete(
  "/event/:eventId",
  authorize("delete-event"),
  eventController.deleteEvent
);

module.exports = router;
