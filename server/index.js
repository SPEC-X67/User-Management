import express from "express";
import cors from 'cors';
import connectToMongo from "./config/db.js";
import adminRoutes from './routes/adminRoute.js'

const app = express();
const PORT = process.env.PORT || 5000;

connectToMongo();

app.use(cors());
app.use(express.json());
app.use('/public', express.static('public'));

// Routes

app.use("/api/admin", adminRoutes)

app.listen(PORT, () => {
    console.log(`Api is running on http://localhost:${PORT}`)
})