import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";

const CreateProject = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Team info coming from Create Team page
  const preTeamId = location.state?.teamId || "";
  const preTeamName = location.state?.teamName || "";

  const [teams, setTeams] = useState([]);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    projectName: "",
    description: "",
    teamId: preTeamId,
  });

  /* =========================
     LOAD TEAMS
  ========================= */
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get("/teams", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTeams(res.data);
      } catch (err) {
        console.error("Failed to load teams", err);
      }
    };

    fetchTeams();
  }, []);

  /* =========================
     CREATE PROJECT
  ========================= */
  const submit = async () => {
    if (!form.projectName || !form.teamId) {
      setMsg("❌ Project name and team are required");
      return;
    }

    try {
      const res = await axios.post(
        "/projects",
        {
          projectName: form.projectName,
          description: form.description,
          teamId: form.teamId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMsg("✅ Project created successfully");

      // 🔥 REDIRECT TO ASSIGN TASK WITH PROJECT INFO
      setTimeout(() => {
        navigate("/manager/Assign-Task", {
          state: {
            projectId: res.data._id,
            projectName: res.data.project_name,
          },
        });
      }, 1200);

      setForm({
        projectName: "",
        description: "",
        teamId: preTeamId || "",
      });
    } catch (err) {
      console.error("Create project error:", err.response?.data);
      setMsg(
        err.response?.data?.message ||
          "❌ Authorization failed or manager not detected"
      );
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="create-project-page">
      <div className="create-project-card">
        <h2>Create Project</h2>
        <p>Create a new project under a selected team</p>

        <input
          type="text"
          placeholder="Project Name"
          value={form.projectName}
          onChange={(e) =>
            setForm({ ...form, projectName: e.target.value })
          }
        />

        <textarea
          placeholder="Project Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <select
          value={form.teamId}
          disabled={!!preTeamId}
          onChange={(e) =>
            setForm({ ...form, teamId: e.target.value })
          }
        >
          <option value="">Select Team</option>
          {teams.map((t) => (
            <option key={t._id} value={t._id}>
              {t.team_name}
            </option>
          ))}
        </select>

        <button onClick={submit}>Create Project</button>

        {/* SHOW LINKED TEAM */}
        {preTeamName && (
          <p style={{ color: "#aaa", marginTop: "10px" }}>
            🔗 Team: <b>{preTeamName}</b>
          </p>
        )}

        {/* MESSAGE */}
        {msg && <div className="create-project-msg">{msg}</div>}
      </div>
    </div>
  );
};

export default CreateProject;
