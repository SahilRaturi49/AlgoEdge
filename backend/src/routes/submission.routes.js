import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getAllSubmissions, getAllTheSubmissionsForProblem, getSubmissionForProblem } from "../controllers/submission.controllers.js";


const submissionRoutes = express.Router();


submissionRoutes.get("/get-all-submissions", authMiddleware, getAllSubmissions);
submissionRoutes.get("/get-submissions/:problemId", authMiddleware, getSubmissionForProblem);
submissionRoutes.get("/get-submissions-count/:problemId", authMiddleware, getAllTheSubmissionsForProblem);



export default submissionRoutes;

