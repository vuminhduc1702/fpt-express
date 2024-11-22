require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const authRoute = require("./routes/auth.route");
const eventRoute = require("./routes/event.route");
const checkoutRoute = require("./routes/checkout.route");
const registerRoute = require("./routes/registration.route");
const adminRoute = require("./routes/admin.route");
const authMiddleware = require("./middlewares/verifyToken.middleware");
const swaggerDocs = require("./utils/swagger");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(authMiddleware);

app.use("/event", eventRoute);
app.use("/auth", authRoute);
app.use("/register", registerRoute);
app.use("/admin", adminRoute);
app.use("/checkout", checkoutRoute);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.status;
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(process.env.MONGO_DB_URI)
  .then((result) => {
    console.log("DB connected");
    app.listen(8000);
    swaggerDocs(app, 8000);
  })
  .catch((err) => console.log(err));
