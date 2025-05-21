const express = require("express");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const Image = require("../models/Image");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads"),
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.userId = decoded.id;
    next();
  });
};

router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  const image = new Image({
    filename: req.file.filename,
    path: req.file.path,
    userId: req.userId,
  });
  await image.save();
  res.status(201).json(image);
});

router.get("/", authMiddleware, async (req, res) => {
  const images = await Image.find({ userId: req.userId });
  res.json(images);
});

const fs = require("fs");
const path = require("path");

// DELETE route with file removal
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const image = await Image.findOne({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!image) {
      return res
        .status(404)
        .json({ message: "Image not found or unauthorized" });
    }

    // Delete the image file from the filesystem
    fs.unlink(path.join(__dirname, "..", image.path), async (err) => {
      if (err) {
        console.error("File deletion error:", err);
        return res.status(500).json({ message: "Failed to delete image file" });
      }

      // Delete the document from the database
      await Image.deleteOne({ _id: req.params.id });
      res.json({ message: "Deleted" });
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
