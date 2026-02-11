const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const {
  createProject,
  getProjects,
  getProjectsByTeam,
} = require("../controllers/projectController");

/* ======================================================
   PROJECT ROUTES (MANAGER)
====================================================== */

// Create project
router.post("/", auth, createProject);

// Get all projects for logged-in manager
router.get("/", auth, getProjects);

// Get projects by team
router.get("/team/:teamId", auth, getProjectsByTeam);

module.exports = router;
