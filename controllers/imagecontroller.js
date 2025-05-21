const Image = require("../models/Image");

// Upload Image
exports.uploadImage = async (req, res) => {
  try {
    const image = new Image({
      filename: req.file.filename,
      path: req.file.path,
      user: req.user._id,
    });
    await image.save();
    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ message: "Image upload failed" });
  }
};

// Get User Images
exports.getUserImages = async (req, res) => {
  try {
    const images = await Image.find({ user: req.user._id });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: "Fetching images failed" });
  }
};

// Delete Image
exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });
    if (image.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }
    await image.remove();
    res.json({ message: "Image removed" });
  } catch (error) {
    res.status(500).json({ message: "Deleting image failed" });
  }
};
