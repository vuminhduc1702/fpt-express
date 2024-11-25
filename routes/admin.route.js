const express = require("express");
const { authorize } = require("../middlewares/authorization.middleware");

const adminController = require("../controllers/admin.controller");

const router = express.Router();

router.get(
  "/admin/analytics/overview/:eventId",
  authorize("analytic"),
  adminController.overview
);

router.get(
  "/admin/analytics/top-events",
  authorize("analytic"),
  adminController.topEvent
);

router.get(
  "/admin/analytics/user-activity/:userId",
  authorize("analytic"),
  adminController.userActivity
);

module.exports = router;
