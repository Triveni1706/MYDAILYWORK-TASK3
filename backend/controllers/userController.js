const User = require("../models/User");

/* ======================================================
   GET ALL TEAM MEMBERS (MANAGER)
====================================================== */
exports.getMembers = async (req, res) => {
  try {
    const members = await User.find({ role: "MEMBER" })
      .select("_id name email")
      .sort({ name: 1 });

    res.json(members);
  } catch (err) {
    console.error("GET MEMBERS ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch members",
    });
  }
};
