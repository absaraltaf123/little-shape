// backendindex.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON request bodies

// Data storage
const dataFilePath = path.join(__dirname, "data.json");

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify([]));
}
app.use(express.static("public"));
// Routes
app.get("/api/data", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
    res.json(data);
  } catch (error) {
    console.error("Error reading data:", error);
    res.status(500).json({ error: "Failed to retrieve data" });
  }
});

app.post("/api/data", (req, res) => {
  try {
    const newEntry = req.body;
    newEntry.id = Date.now(); // Add a unique ID
    newEntry.timestamp = new Date().toISOString(); // Add timestamp

    const data = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
    data.push(newEntry);

    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

    res.status(201).json(newEntry);
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ error: "Failed to save data" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
