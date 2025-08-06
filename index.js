const express = require("express");
const axios = require("axios");
const sharp = require("sharp");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("✅ 4K Remini-style API is running.");
});

app.get("/remini", async (req, res) => {
  const inputUrl = req.query.input;

  if (!inputUrl) {
    return res.status(400).json({ error: "Image URL is required in ?input=" });
  }

  try {
    const imageResponse = await axios.get(inputUrl, { responseType: "arraybuffer" });
    const inputBuffer = Buffer.from(imageResponse.data);

    const enhanced = await sharp(inputBuffer)
      .resize(2048) // Resize to 4K-style width
      .jpeg({ quality: 90 })
      .toBuffer();

    res.set("Content-Type", "image/jpeg");
    res.send(enhanced);
  } catch (err) {
    res.status(500).json({ error: "Failed to process image", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API ready at http://localhost:${PORT}`);
});
