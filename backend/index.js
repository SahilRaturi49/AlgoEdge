import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const app = express();

dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

app.use(
  cors({
    origin: "https://algo-edge.vercel.app",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Hello welcome to AlgoEdge");
});

// routes
import authRoutes from "./src/routes/auth.routes.js";
import problemRoutes from "./src/routes/problem.routes.js";
import executionRoute from "./src/routes/executeCode.routes.js";
import submissionRoutes from "./src/routes/submission.routes.js";
import playlistRoutes from "./src/routes/playlist.routes.js";
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execute-code", executionRoute);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playlistRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
