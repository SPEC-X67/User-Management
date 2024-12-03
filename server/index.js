import express from "express";
import cors from 'cors';
import connectToMongo from "./config/db.js";
import adminRoutes from './routes/adminRoute.js'
import userRoutes from './routes/userRoute.js'
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;

connectToMongo();

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Routes
app.get("/", (req, res) => {
    res.send("Working");
});

app.use("/api/auth", userRoutes)
app.use("/api/admin", adminRoutes)

app.listen(PORT, () => {
    console.log(`Api is running on http://localhost:${PORT}`)
})