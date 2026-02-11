const Project = require("../models/Project");

/* ======================================================
   CREATE PROJECT (MANAGER)
====================================================== */
exports.createProject = async (req, res) => {
  try {
    const { projectName, description, teamId } = req.body;

    // Validation
    if (!projectName || !teamId) {
      return res.status(400).json({
        message: "Project name and team are required",
      });
    }

    // Prevent duplicate project names per manager
    const existing = await Project.findOne({
      project_name: projectName.trim(),
      manager_id: req.user.id,
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "Project name already exists" });
    }

    const project = await Project.create({
      project_name: projectName.trim(),
      description,
      team_id: teamId,
      manager_id: req.user.id,
    });

    res.status(201).json(project);
  } catch (err) {
    console.error("CREATE PROJECT ERROR:", err);
    res.status(500).json({ message: "Project creation failed" });
  }
};

/* ======================================================
   GET PROJECTS FOR LOGGED-IN MANAGER
====================================================== */
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      manager_id: req.user.id,
    }).populate("team_id", "team_name");

    res.json(projects);
  } catch (err) {
    console.error("GET PROJECTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

/* ======================================================
   GET PROJECTS BY TEAM (MANAGER)
====================================================== */
exports.getProjectsByTeam = async (req, res) => {
  try {
    const projects = await Project.find({
      team_id: req.params.teamId,
      manager_id: req.user.id,
    });

    res.json(projects);
  } catch (err) {
    console.error("GET PROJECTS BY TEAM ERROR:", err);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};
