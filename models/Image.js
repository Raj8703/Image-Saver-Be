const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
  filename: String,
  path: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
module.exports = mongoose.model("Image", imageSchema);
