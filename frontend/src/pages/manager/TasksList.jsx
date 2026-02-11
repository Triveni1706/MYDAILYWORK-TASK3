import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { NavLink } from "react-router-dom";

const TasksList = () => {
  const [groupedTasks, setGroupedTasks] = useState({});

  /* ================= FETCH TASKS ================= */
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("/tasks/manager", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const tasks = res.data || [];

        /* ✅ GROUP BY TEAM → PROJECT → TASKS */
        const grouped = {};

        tasks.forEach(task => {
          const teamId =
            task.project_id?.team_id?._id || "no-team";
          const teamName =
            task.project_id?.team_id?.team_name || "No Team";

          const projectId =
            task.project_id?._id || "no-project";
          const projectName =
            task.project_id?.project_name || "No Project";

          if (!grouped[teamId]) {
            grouped[teamId] = {
              teamName,
              projects: {},
            };
          }

          if (!grouped[teamId].projects[projectId]) {
            grouped[teamId].projects[projectId] = {
              projectName,
              tasks: [],
            };
          }

          grouped[teamId].projects[projectId].tasks.push(task);
        });

        setGroupedTasks(grouped);
      } catch (err) {
        console.error("TASK LOAD ERROR:", err);
      }
    };

    fetchTasks();
  }, []);

  /* ================= DEADLINE HELPERS ================= */
  const deadlineClass = (deadline, status) => {
    if (!deadline) return "no-deadline";

    if (status === "Completed") return "completed-deadline";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const d = new Date(deadline);
    d.setHours(0, 0, 0, 0);

    if (d < today) return "overdue";
    if (d.getTime() === today.getTime()) return "today";
    return "upcoming";
  };

  const styles = {
    links: {
      display: "flex",
      gap: "15px",
      alignItems: "center",
    },
    link: {
      textDecoration: "none",
      color: "#b0aa9b",
      fontWeight: "500",
      fontSize: "16px",
    },
  };

  return (
    <div className="tp-dashboard">
      {/* ===== SIDEBAR ===== */}
      <aside className="tp-sidebar">
        <h3>Manager</h3>
        <ul>
          <li style={styles.links}>
            <NavLink to="/manager/reports" style={styles.link}>
              Track Progress
            </NavLink>
          </li>
          <li>
            <NavLink to="/manager/projects" style={styles.link}>
              Projects
            </NavLink>
          </li>
          <li>
            <NavLink to="/manager/tasks" style={styles.link}>
              Tasks
            </NavLink>
          </li>
          <li>
            <NavLink to="/manager/teams" style={styles.link}>
              Teams
            </NavLink>
          </li>
        </ul>
      </aside>

      {/* ===== MAIN ===== */}
      <main className="tp-main">
        <h2 className="tp-title">Assigned Tasks</h2>

        {Object.keys(groupedTasks).length === 0 ? (
          <p className="empty">No tasks assigned yet</p>
        ) : (
          Object.entries(groupedTasks).map(([teamId, team]) => (
            <div key={teamId} className="team-section">
              {/* TEAM HEADER */}
              <h2 className="team-title">
                👥 {team.teamName}
              </h2>

              {Object.entries(team.projects).map(
                ([projectId, project]) => (
                  <div
                    key={projectId}
                    className="project-task-card"
                  >
                    {/* PROJECT HEADER */}
                    <div className="project-task-header">
                      📁 {project.projectName}
                    </div>

                    {/* TASKS */}
                    {project.tasks.map(task => (
                      <div
                        key={task._id}
                        className="task-row-creative"
                      >
                        <div className="task-title">
                          {task.title}
                        </div>

                        <div className="task-meta">
                          <span className="assignee">
                            👤 {task.assigned_to?.name || "—"}
                          </span>

                          {/* DEADLINE */}
                          <span
                            className={`deadline-pill ${deadlineClass(
                              task.deadline,
                              task.status
                            )}`}
                          >
                            ⏰{" "}
                            {task.status === "Completed"
                              ? "Completed"
                              : task.deadline
                              ? new Date(
                                  task.deadline
                                ).toLocaleDateString()
                              : "No deadline"}

                            {task.status === "In Progress" &&
                              task.deadline &&
                              new Date(task.deadline) <
                                new Date() && (
                                <span className="late-warning">
                                  ⚠️ Time over – task not submitted
                                </span>
                              )}
                          </span>

                          {/* STATUS */}
                          <span
                            className={`status-pill ${
                              task.status === "Completed"
                                ? "completed"
                                : task.status === "In Progress"
                                ? "progress"
                                : "pending"
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default TasksList;
