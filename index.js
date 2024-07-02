const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv").config();
const sectorRoute = require("./routes/Routes");
const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.URL)
  .then(() => {
    console.log("connected to the database");
  })
  .catch((err) => {
    console.log("failed to connect");
  });

app.get("/", (req, res) => {
  res.status(200).json({
    message: "welcome to my api",
  });
});
app.use("/all", sectorRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
