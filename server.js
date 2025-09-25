const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());


mongoose.connect("mongodb://localhost:27017/assetdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Error:", err));


const assetSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  assetname: String,
  model: String,
  serialNumber: { type: String, unique: true },
  quantity: Number,
  email: { type: String, required: true },
  departmentHead: String,
  approvalHead: String,
  date: String,
  acceptance: String,
  assignedby: String,
});

const Asset = mongoose.model("Asset", assetSchema);


app.post("/api/assets", async (req, res) => {
  try {
    const { userId, email, serialNumber } = req.body;

    const existingSerial = await Asset.findOne({ serialNumber });
    if (existingSerial) {
      return res.status(400).json({ message: "Serial number already exists!" });
    }

  
    const existingUser = await Asset.findOne({ userId });
    if (existingUser && existingUser.email !== email) {
      return res.status(400).json({ message: "Each User ID can only use one Email ID!" });
    }

    const asset = new Asset(req.body);
    await asset.save();
    res.status(201).json(asset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.get("/api/assets", async (req, res) => {
  try {
    const assets = await Asset.find();
    res.json(assets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.put("/api/assets/:id", async (req, res) => {
  try {
    const { userId, email, serialNumber } = req.body;

    
    const existingSerial = await Asset.findOne({ serialNumber, _id: { $ne: req.params.id } });
    if (existingSerial) {
      return res.status(400).json({ message: "Serial number already exists!" });
    }

  
    const existingUser = await Asset.findOne({ userId, _id: { $ne: req.params.id } });
    if (existingUser && existingUser.email !== email) {
      return res.status(400).json({ message: "Each User ID can only use one Email ID!" });
    }

    const updated = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Asset not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/api/assets/:id", async (req, res) => {
  try {
    const deleted = await Asset.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Asset not found" });

    res.json({ message: "Asset deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://127.0.0.1:${PORT}`);
});