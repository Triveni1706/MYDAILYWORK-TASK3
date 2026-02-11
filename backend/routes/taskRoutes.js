const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const Task = require("../models/Task");

const {
  createTask,
  getMyTasks,
  updateTaskStatus,
  completeTask,
  getTasksForManager,
} = require("../controllers/taskController");

/* ======================================================
   MEMBER ROUTES
====================================================== */

// 🔹 Get tasks assigned to logged-in member
router.get("/my", auth, getMyTasks);

// 🔹 Member completes task (submission file upload)
router.put(
  "/complete/:id",
  auth,
  upload.single("file"),
  completeTask
);

// 🔹 Member updates task status
router.put("/:id", auth, updateTaskStatus);

/* ======================================================
   MANAGER ROUTES
====================================================== */

// 🔹 Create task (manager only)
router.post("/", auth, async (req, res, next) => {
  if (req.user.role !== "MANAGER") {
    return res.status(403).json({ message: "Manager access only" });
  }
  next();
}, createTask);

// 🔹 Get all tasks created by manager
router.get("/manager", auth, async (req, res, next) => {
  if (req.user.role !== "MANAGER") {
    return res.status(403).json({ message: "Manager access only" });
  }
  next();
}, getTasksForManager);

// 🔹 Manager uploads attachment to task
router.post(
  "/:id/upload",
  auth,
  upload.single("file"),
  async (req, res) => {
    try {
      // 🔐 Manager only
      if (req.user.role !== "MANAGER") {
        return res
          .status(403)
          .json({ message: "Only manager can upload files" });
      }

      const task = await Task.findById(req.params.id);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      // 🔐 Ensure manager owns the task
      if (task.manager_id.toString() !== req.user.id) {
        return res.status(403).json({
          message: "You are not allowed to upload to this task",
        });
      }

      task.attachments = task.attachments || [];

      task.attachments.push({
        fileName: req.file.originalname,
        fileUrl: `/uploads/${req.file.filename}`,
        uploadedAt: new Date(),
      });

      await task.save();
      res.json(task);
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      res.status(500).json({ message: "File upload failed" });
    }
  }
);

module.exports = router;
