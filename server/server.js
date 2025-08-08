// server.js
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";

// MongoDB connection
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "pathshalaDB";
let usersCollection;

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    const db = client.db(dbName);
    usersCollection = db.collection("users");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
}
connectDB();

// Express setup
const app = express();
app.use(cors());
app.use(express.json());

// Registration endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { userId, name, password } = req.body;

    if (!userId || !name || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await usersCollection.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ message: "User ID already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await usersCollection.insertOne({
      userId,
      name,
      password: hashedPassword,
      createdAt: new Date(),
    });

    res.json({ message: "Registration successful" });
  } catch (error) {
    console.error("❌ Error during registration:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await usersCollection.findOne({ userId });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      user: { userId: user.userId, name: user.name },
    });
  } catch (error) {
    console.error("❌ Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get list of all users (Admin only)
app.get("/api/admin/users", async (req, res) => {
  try {
    const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray(); 
    res.json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


