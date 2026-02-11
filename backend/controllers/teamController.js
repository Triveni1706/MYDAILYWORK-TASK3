const Team = require("../models/Team");

// CREATE TEAM
exports.createTeam = async (req, res) => {
  try {
    const team = await Team.create({
      team_name: req.body.teamName,
      manager_id: req.user.id,
    });
    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ message: "Team creation failed" });
  }
};

exports.getTeams = async (req, res) => {
  try {

    const teams = await Team.find({ manager_id: req.user.id });

    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch teams" });
  }
};
