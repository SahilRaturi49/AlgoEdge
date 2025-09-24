import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const app = express();

dotenv.config({});

// app.use(
//   cors({
//     origin: "https://algo-edge.vercel.app",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

const allowedOrigins = process.env.FRONTEND_ORIGINS
  ? process.env.FRONTEND_ORIGINS.split(",")
  : ["http://localhost:5173"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1)
        return callback(new Error("CORS not allowed"), false);
      return callback(null, true);
    },
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
