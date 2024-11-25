const express = require("express");

const router = express.Router();

router.use(eventRoute);
router.use(authRoute);
router.use(registerRoute);
router.use(adminRoute);
router.use(checkoutRoute);

module.exports = router;
