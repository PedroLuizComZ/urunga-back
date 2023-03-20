const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const { errors } = require("celebrate");
const stores = require("./routes/store");
const users = require("./routes/user");
const checkin = require("./routes/checkin");

const port = process.env.PORT || 8080;
const db = process.env.MONGO_URI;

mongoose.connect(db);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.use("/store", stores);
app.use("/user", users);
app.use("/checkin", checkin);

app.get("/", function (req, res) {
  console.log("app starting on port: " + port);
  res.send("App Online");
});

app.use(errors());

app.listen(port, function () {
  console.log("App listening on port: " + port);
});
