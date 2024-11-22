const express = require("express");
const { authorize } = require("../middlewares/authorization.middleware");

const eventController = require("../controllers/event.controller");

const router = express.Router();

router.get("/", authorize("view-event"), eventController.getEvents);

router.post("/", authorize("create-event"), eventController.createEvent);

router.get("/:eventId", authorize("view-event"), eventController.getEvent);

router.put("/:eventId", authorize("update-event"), eventController.updateEvent);

router.delete(
  "/:eventId",
  authorize("delete-event"),
  eventController.deleteEvent
);

module.exports = router;
