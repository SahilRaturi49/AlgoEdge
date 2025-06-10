import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";



const app = express();
dotenv.config();

app.use(express.json());

const PORT = process.env.PORT || 8000;



app.get("/", (req, res) => {
    res.send("Hello welcome to AlgoEdge");
})


// routes
app.use("/api/v1/auth", authRoutes);

app.listen(PORT, ()=> {
    console.log(`Server is running on port: ${PORT}`);
    
})