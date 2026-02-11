const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  getTeamProgress,
} = require("../controllers/reportController");

router.get("/team-progress", auth, getTeamProgress);

module.exports = router;
