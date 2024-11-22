const express = require("express");
const { authorize } = require("../middlewares/authorization.middleware");

const adminController = require("../controllers/admin.controller");

const router = express.Router();

router.get(
  "/analytics/overview/:eventId",
  authorize("analytic"),
  adminController.overview
);

router.get(
  "/analytics/top-events",
  authorize("analytic"),
  adminController.topEvent
);

router.get(
  "/analytics/user-activity/:userId",
  authorize("analytic"),
  adminController.userActivity
);

module.exports = router;
