const express = require("express");
const { authorize } = require("../middlewares/authorization.middleware");

const registrationController = require("../controllers/registration.controller");

const router = express.Router();

router.post(
  "/register/:eventId",
  authorize("register-event"),
  registrationController.registerEvent
);

router.delete(
  "/register/cancel/:registrationId",
  registrationController.cancelEventRegistration
);

module.exports = router;
