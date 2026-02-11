const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const {
  createTeam,
  getTeams,
} = require("../controllers/teamController");

/* ======================================================
   TEAM ROUTES (MANAGER)
====================================================== */

// Create a new team (manager only)
router.post("/", auth, createTeam);

// Get teams created by logged-in manager
router.get("/", auth, getTeams);

module.exports = router;
