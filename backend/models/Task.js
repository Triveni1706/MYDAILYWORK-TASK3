const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


    manager_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    deadline: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["To Do", "In Progress", "Completed"],
      default: "To Do",
    },

    submissionFile: {
      type: String,
      default: null,
  },

  attachments:
  {
    fileName: String,
    fileUrl: String,
    uploadedAt: { type: Date, default: Date.now }
  }
},
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
