const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect("mongodb://127.0.0.1:27017/assetdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Schema
const assetSchema = new mongoose.Schema({
  userId: String,
  assetname: String,      
  model: String,
  serialNumber: String,
  quantity: Number,
  departmentHead: String,
  approvalHead: String,
  assignedby: String,
  email: String,
  acceptance: String,
  date: Date,
});
// Model
const Asset = mongoose.model("Asset", assetSchema);
//  Create asset
app.post("/api/assets", async (req, res) => {
  try {
    const assetData = { ...req.body, quantity: parseInt(req.body.quantity) };
    const asset = new Asset(assetData);
    await asset.save();
    res.status(201).json(asset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//  Get all assets
app.get("/api/assets", async (req, res) => {
  try {
    const assets = await Asset.find();
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  Delete asset by ID
app.delete("/api/assets/:id", async (req, res) => {
  try {
    await Asset.findByIdAndDelete(req.params.id);
    res.json({ message: "Asset deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});