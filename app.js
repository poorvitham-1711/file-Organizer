const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const fileRoutes = require("./routes/fileRoutes");
const uploadPath = require("./config/uploadPath");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadPath));

app.get("/", (req, res) => {
  res.send("File Organizer API is running...");
});

app.use("/api/files", fileRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
