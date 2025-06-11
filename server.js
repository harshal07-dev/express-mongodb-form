const { log } = require("console");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const colors = require("colors");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;

// setup static folder
app.use(express.static(path.join(__dirname, "public")));

// connect database
mongoose.connect("mongodb://127.0.0.1:27017/formData");
const db = mongoose.connection;
db.once("open", () => {
  console.log("MongoDB connected successfully".green.bold);
});

// schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchema);
// route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/submit", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({
      username,
      password,
    });
    await user.save();
    console.log(user);
    res.send("Form submission success");
  } catch (err) {
    console.log("Error saving user");
    res.status(500).send("Error saving user");
  }
});

app.listen(PORT, () =>
  console.log(`Listening on the ${PORT}`.underline.cyan.bold)
);
