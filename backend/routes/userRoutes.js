const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { getMembers } = require("../controllers/userController");

/* ======================================================
   USER ROUTES
====================================================== */

// Manager → get all members
router.get("/members", auth, getMembers);

module.exports = router;
