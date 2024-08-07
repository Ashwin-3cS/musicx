import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js"
import mongooseConnection from "./db/connectToMongoDb.js";



dotenv.config(); 

const app = express();

app.use(express.json()); 

const PORT = process.env.PORT || 3000;

app.use("/api/auth",authRoutes);

app.listen(PORT, () => {
    mongooseConnection();
    console.log(`Server is running on port ${PORT}`);
});
