import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";





const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8000;



app.get("/", (req, res) => {
    res.send("Hello welcome to AlgoEdge");
})


// routes
import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import executionRoute from "./routes/executeCode.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execute-code", executionRoute)
app.use("/api/v1/submission", submissionRoutes)

app.listen(PORT, ()=> {
    console.log(`Server is running on port: ${PORT}`);
    
})