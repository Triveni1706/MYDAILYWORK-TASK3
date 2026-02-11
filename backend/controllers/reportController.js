const Team = require("../models/Team");
const Project = require("../models/Project");
const Task = require("../models/Task");

exports.getTeamProgress = async (req, res) => {
  try {
    const managerId = req.user.id;

    // 1️⃣ Get all teams of manager
    const teams = await Team.find({ manager_id: managerId });

    const result = [];

    for (const team of teams) {
      // 2️⃣ Get projects under team
      const projects = await Project.find({
        team_id: team._id,
      }).select("_id");

      const projectIds = projects.map(p => p._id);

      // 3️⃣ Get tasks under those projects
      const tasks = await Task.find({
        project_id: { $in: projectIds },
      });

      const completed = tasks.filter(
        t => t.status === "Completed"
      ).length;

      result.push({
        teamId: team._id,
        teamName: team.team_name,
        totalTasks: tasks.length,
        completed,
        pending: tasks.length - completed,
      });
    }

    res.json(result);
  } catch (err) {
    console.error("TEAM PROGRESS ERROR:", err);
    res.status(500).json({
      message: "Failed to load team progress",
    });
  }
};
