//This file defines the routes for chapter-related operations
import expres from "express";
const router = expres.Router();
// Importing chapter controller functions
import {
  uploadChapters,
  getAllChapters,
  getChapterById,
} from "../controllers/chapterController.js";
// Importing middleware for admin access control
import adminAccess from "../middlewares/adminAccess.js";

// Defining routes for chapter operations
router.get("/", getAllChapters);
router.get("/:id", getChapterById);
router.post("/", adminAccess, uploadChapters);

// Exporting the router to be used in the main server file
export default router;
