const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    team_name: {
      type: String,
      required: true,
      trim: true,
    },

    manager_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
