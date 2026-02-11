import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import ManagerSidebar from "../../components/ManagerSidebar";

const TeamsList = () => {
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      const [teamsRes, tasksRes] = await Promise.all([
        axios.get("/teams"),
        axios.get("/tasks/manager"),
      ]);

      setTeams(teamsRes.data || []);
      setTasks(tasksRes.data || []);
    };

    fetchData();
  }, []);

  /* ================= CALCULATIONS ================= */
  const getTeamStats = teamId => {
    const teamTasks = tasks.filter(
      t => t.project_id?.team_id?._id === teamId
    );

    return {
      total: teamTasks.length,
      completed: teamTasks.filter(t => t.status === "Completed").length,
    };
  };

  /* ================= UI ================= */
  return (
    <div className="tp-dashboard">
      <ManagerSidebar />

      <main className="tp-main">
        <h2 className="tp-title">Teams</h2>

        {teams.length === 0 && <p>No teams created yet</p>}

        <div className="teams-grid">
          {teams.map(team => {
            const stats = getTeamStats(team._id);

            return (
              <div
                key={team._id}
                className="team-card"
                onClick={() =>
                  navigate("/manager/reports", {
                    state: { teamName: team.team_name },
                  })
                }
              >
                <h3>{team.team_name}</h3>

                <p>Total Tasks: <b>{stats.total}</b></p>
                <p>Completed: <b>{stats.completed}</b></p>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width:
                        stats.total === 0
                          ? "0%"
                          : `${(stats.completed / stats.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default TeamsList;
