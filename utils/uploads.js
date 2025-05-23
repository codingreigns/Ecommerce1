const path = require("path");

const handleImageUpload = async (req, res) => {
  if (!req.files) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    return res.status(400).json({ message: "Please upload an image" });
  }
  if (productImage.size > 1024 * 1024) {
    return res
      .status(400)
      .json({ message: "Please upload an image less than 1MB" });
  }
  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + productImage.name
  );
  await productImage.mv(imagePath);
  return imagePath;
};

module.exports = { handleImageUpload };
