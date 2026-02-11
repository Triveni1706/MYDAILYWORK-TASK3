import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { NavLink } from "react-router-dom";

const ProjectsList = () => {
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [openTeam, setOpenTeam] = useState(null);
  const [openProject, setOpenProject] = useState(null);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      const [teamsRes, projectsRes, tasksRes] =
        await Promise.all([
          axios.get("/teams", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get("/projects", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get("/tasks/manager", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

      setTeams(teamsRes.data || []);
      setProjects(projectsRes.data || []);
      setTasks(tasksRes.data || []);
    };

    loadData();
  }, []);

  const getProjectsByTeam = (teamId) =>
    projects.filter(p => p.team_id?._id === teamId);

  const getTasksByProject = (projectId) =>
    tasks.filter(t => t.project_id?._id === projectId);

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
    fontSize:"16px",
  },
};

  return (
    <div className="tp-dashboard">
      {/* ===== SIDEBAR ===== */}
      <aside className="tp-sidebar">
        <h3>Manager</h3>
        <ul>
            
          <li style={styles.links}>
            <NavLink to="/manager/reports" style={styles.link}> Track Progress</NavLink>
          </li>
          <li>
            <NavLink to="/manager/projects" style={styles.link}> Projects</NavLink>
          </li>

          <li>
            <NavLink to="/manager/tasks" style={styles.link}> Tasks</NavLink>
          </li>

          <li>
            <NavLink to="/manager/teams" style={styles.link}>Teams</NavLink>
          </li>

          
        </ul>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="tp-main">
        <h2 className="tp-title">Projects</h2>

        {teams.map(team => {
          const teamOpen = openTeam === team._id;

          return (
            <div key={team._id} className="accordion-wrapper">
              {/* TEAM */}
              <div
                className="accordion-row"
                onClick={() => {
                  setOpenTeam(teamOpen ? null : team._id);
                  setOpenProject(null);
                }}
              >
                <span>{team.team_name}</span>
                <span>{teamOpen ? "▼" : "▶"}</span>
              </div>

              {/* PROJECTS */}
              {teamOpen &&
                getProjectsByTeam(team._id).map(project => {
                  const projectOpen =
                    openProject === project._id;

                  return (
                    <div key={project._id}>
                      <div
                        className="accordion-subrow"
                        onClick={() =>
                          setOpenProject(
                            projectOpen ? null : project._id
                          )
                        }
                      >
                        <span>{project.project_name}</span>
                        <span>{projectOpen ? "▼" : "▶"}</span>
                      </div>

                      {/* TASKS */}
                      {projectOpen &&
                        getTasksByProject(project._id).map(task => (
                          <div
                            key={task._id}
                            className="accordion-task"
                          >
                            <span>{task.title}</span>
                            <span
                              className={`status ${
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
                        ))}
                    </div>
                  );
                })}
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default ProjectsList;
