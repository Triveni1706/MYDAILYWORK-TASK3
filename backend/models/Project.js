const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    project_name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    team_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    manager_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Composite unique index (manager + project)
projectSchema.index(
  { project_name: 1, manager_id: 1 },
  { unique: true }
);

module.exports = mongoose.model("Project", projectSchema);
