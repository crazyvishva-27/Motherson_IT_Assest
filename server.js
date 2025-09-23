const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// ✅ Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/assetdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Schema
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

const Asset = mongoose.model("Asset", assetSchema);

// ✅ Create Asset
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

// ✅ Read All Assets
app.get("/api/assets", async (req, res) => {
  try {
    const assets = await Asset.find();
    res.json(assets);   // 🔥 Missing line fixed
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update Asset by ID
app.put("/api/assets/:id", async (req, res) => {
  try {
    const updatedData = { ...req.body, quantity: parseInt(req.body.quantity) };

    const updatedAsset = await Asset.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true } // return updated document
    );

    if (!updatedAsset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    res.json(updatedAsset);
  } catch (err) {
    res.status(400).json({ error: "Update failed: " + err.message });
  }
});

// ✅ Delete Asset
app.delete("/api/assets/:id", async (req, res) => {
  try {
    const result = await Asset.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({ message: "Asset not found" });
    }

    res.json({ message: "Asset deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});