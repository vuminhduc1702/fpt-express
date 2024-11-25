require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routers = require("./routes/routes.js");

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

mongoose
  .connect(process.env.MONGO_DB_URI)
  .then((result) => {
    console.log("DB connected");
  })
  .catch((err) => console.log(err));

app.use(authMiddleware);

app.use("/api/v1", routers);

app.use((req, res, next) => {
  res.status(404).send({
    name: "Event",
    error: "API not found",
    status: "error",
  });
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.status;
  const message = error.message;
  res.status(status).json({ message: message });
});

app.listen(8000, () => {
  console.log("Server running at http://localhost:8000");
});
swaggerDocs(app, 8000);
