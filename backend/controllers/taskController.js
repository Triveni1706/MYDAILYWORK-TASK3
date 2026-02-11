const Task = require("../models/Task");

/* ======================================================
   CREATE TASK (MANAGER + FILE UPLOAD)
====================================================== */
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      project_id,
      projectId,
      assigned_to,
      assignedTo,
      deadline,
      priority,
    } = req.body;

    // ✅ Validation
    if (!title || !(project_id || projectId) || !(assigned_to || assignedTo)) {
      return res.status(400).json({
        message: "Title, project and assigned member are required",
      });
    }

    // 🔐 Manager only
    if (req.user.role !== "MANAGER") {
      return res.status(403).json({
        message: "Only manager can create tasks",
      });
    }

    // 📎 Manager attachment (optional)
    const attachments = req.file
      ? [
          {
            fileName: req.file.originalname,
            fileUrl: `/uploads/${req.file.filename}`,
            uploadedAt: new Date(),
          },
        ]
      : [];

    const task = await Task.create({
      title,
      description,
      project_id: project_id || projectId,
      assigned_to: assigned_to || assignedTo,
      manager_id: req.user.id,
      deadline,
      priority: priority || "Medium",
      status: "To Do",
      attachments, // ✅ FILE STORED HERE
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    res.status(500).json({ message: "Task creation failed" });
  }
};

/* ======================================================
   GET TASKS FOR LOGGED-IN MEMBER
====================================================== */
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      assigned_to: req.user.id,
    })
      .populate("project_id", "project_name")
      .populate("manager_id", "name email");

    res.set({
      "Cache-Control": "no-store",
      Pragma: "no-cache",
      Expires: "0",
    });

    res.json(tasks);
  } catch (err) {
    console.error("GET MY TASKS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

/* ======================================================
   UPDATE TASK STATUS (To Do / In Progress ONLY)
====================================================== */
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // ❌ Block invalid status
    if (!["To Do", "In Progress"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status update",
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("project_id", "project_name");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    console.error("UPDATE TASK STATUS ERROR:", err);
    res.status(500).json({ message: "Failed to update task status" });
  }
};

/* ======================================================
   COMPLETE TASK (MEMBER SUBMISSION + LOCK)
====================================================== */
exports.completeTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId).populate(
      "project_id",
      "project_name"
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 🔐 Only assigned member
    if (task.assigned_to.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 🔒 Prevent resubmission
    if (task.submissionFile) {
      return res.status(400).json({
        message: "Task already submitted and locked",
      });
    }

    // 📂 File required
    if (!req.file) {
      return res.status(400).json({ message: "File required" });
    }

    task.submissionFile = req.file.filename;
    task.status = "Completed";
    task.completedAt = new Date();

    await task.save();

    res.json(task);
  } catch (err) {
    console.error("COMPLETE TASK ERROR:", err);
    res.status(500).json({ message: "Task completion failed" });
  }
};

/* ======================================================
   GET TASKS FOR MANAGER (WITH TEAM + PROJECT)
====================================================== */
exports.getTasksForManager = async (req, res) => {
  try {
    // 🔐 Manager only
    if (req.user.role !== "MANAGER") {
      return res.status(403).json({
        message: "Only manager can view these tasks",
      });
    }

    const tasks = await Task.find({
      manager_id: req.user.id,
    })
      .populate({
        path: "project_id",
        select: "project_name team_id",
        populate: {
          path: "team_id",
          select: "team_name",
        },
      })
      .populate("assigned_to", "name email");

    res.json(tasks);
  } catch (err) {
    console.error("GET TASKS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};
