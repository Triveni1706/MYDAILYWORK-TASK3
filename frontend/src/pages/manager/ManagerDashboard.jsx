import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axiosInstance";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completed: 0,
    pending: 0,
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("/tasks/manager", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const tasks = res.data || [];

        const completed = tasks.filter(
          (t) => t.status?.toLowerCase() === "completed"
        ).length;

        const pending = tasks.length - completed;

        setStats({
          totalTasks: tasks.length,
          completed,
          pending,
        });
      } catch (err) {
        console.error("DASHBOARD ERROR:", err);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="dashboard">
      <h1>Manager Dashboard</h1>
      <p>Manage teams, projects, and tasks</p>

      {/* STATS */}
      <div className="stats-grid">
        <div
          className="stat-card gold"
          onClick={() => navigate("/manager/tasks")}
        >
          <h2>{stats.totalTasks}</h2>
          <p>Total Tasks</p>
        </div>

        <div
          className="stat-card"
          onClick={() => navigate("/manager/tasks?status=completed")}
        >
          <h2>{stats.completed}</h2>
          <p>Completed</p>
        </div>

        <div
          className="stat-card"
          onClick={() => navigate("/manager/tasks?status=pending")}
        >
          <h2>{stats.pending}</h2>
          <p>Pending</p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="card-grid">
        <div
          className="dashboard-card"
          onClick={() => navigate("/manager/create-team")}
        >
          <h3>Create Team</h3>
          <p>Create and manage your teams</p>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/manager/create-project")}
        >
          <h3>Create Project</h3>
          <p>Add projects under teams</p>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/manager/assign-task")}
        >
          <h3>Assign Tasks</h3>
          <p>Assign work to team members</p>
        </div>

      
        <div
          className="dashboard-card"
          onClick={() => navigate("/manager/reports")}
        >
          <h3>Track Progress</h3>
          <p>Monitor submissions and deadlines</p>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
