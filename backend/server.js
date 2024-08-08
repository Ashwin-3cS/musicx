import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import mongooseConnection from "./db/connectToMongoDb.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  mongooseConnection();
  console.log(`Server is running on port ${PORT}`);
});

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
