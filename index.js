const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

const corsOptions = {
  origin: "https://imagesaver.netlify.app", // Your frontend domain
  credentials: true,
};
app.use(cors(corsOptions));

mongoose.connect(process.env.MONGO_URI, {}).then(() => {
  try {
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
