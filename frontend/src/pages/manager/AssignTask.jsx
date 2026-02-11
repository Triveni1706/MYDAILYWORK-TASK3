import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { useLocation } from "react-router-dom";

const AssignTask = () => {
  const location = useLocation();

  // 🔗 DATA COMING FROM CREATE PROJECT
  const preProjectId = location.state?.projectId || "";
  const preProjectName = location.state?.projectName || "";

  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: "",
    priority: "Medium",
    deadline: "",
  });

  /* ======================================================
     LOAD PROJECTS & MEMBERS
  ====================================================== */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectsRes, membersRes] = await Promise.all([
          axios.get("/projects", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get("/users/members", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        setProjects(projectsRes.data || []);
        setMembers(membersRes.data || []);
      } catch (err) {
        console.error("LOAD DATA ERROR:", err);
      }
    };

    loadData();
  }, []);

  /* ======================================================
     🔥 IMPORTANT FIX: AUTO-SELECT PROJECT AFTER NAVIGATION
  ====================================================== */
  useEffect(() => {
    if (preProjectId) {
      setForm((prev) => ({
        ...prev,
        projectId: preProjectId,
      }));
    }
  }, [preProjectId]);

  /* ======================================================
     SUBMIT TASK
  ====================================================== */
  const submit = async () => {
    if (!form.title || !form.projectId || !form.assignedTo) {
      setMsg("❌ Title, Project and Member are required");
      return;
    }

    try {
      await axios.post(
        "/tasks",
        {
          title: form.title,
          description: form.description,
          project_id: form.projectId,
          assigned_to: form.assignedTo,
          priority: form.priority,
          deadline: form.deadline,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMsg("✅ Task assigned successfully");

      setForm({
        title: "",
        description: "",
        projectId: preProjectId || "",
        assignedTo: "",
        priority: "Medium",
        deadline: "",
      });
    } catch (err) {
      console.error("ASSIGN TASK ERROR:", err);
      setMsg("❌ Failed to assign task");
    }
  };

  /* ======================================================
     UI
  ====================================================== */
  return (
    <div className="assign-task-page">
      <div className="assign-task-card">
        <h2>Assign Task</h2>

        {preProjectName && (
          <p style={{ color: "#aaa", marginBottom: "10px" }}>
            🔗 Project: <b>{preProjectName}</b>
          </p>
        )}

        <input
          placeholder="Task Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <textarea
          placeholder="Task Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        {/* PROJECT */}
        <select
          value={form.projectId}
          disabled={!!preProjectId}
          onChange={(e) =>
            setForm({ ...form, projectId: e.target.value })
          }
        >
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.project_name}
            </option>
          ))}
        </select>

        {/* MEMBER */}
        <select
          value={form.assignedTo}
          onChange={(e) =>
            setForm({ ...form, assignedTo: e.target.value })
          }
        >
          <option value="">Assign to Member</option>
          {members.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>

        {/* PRIORITY */}
        <select
          value={form.priority}
          onChange={(e) =>
            setForm({ ...form, priority: e.target.value })
          }
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        {/* DEADLINE */}
        <input
          type="date"
          value={form.deadline}
          onChange={(e) =>
            setForm({ ...form, deadline: e.target.value })
          }
        />


        {/* ✅ FILE UPLOAD FIELD */}
        <label className="upload-label">
          📎 Attach File (optional)
          <input
            type="file"
            onChange={e => setFile(e.target.files[0])}
          />
        </label>


        <button onClick={submit}>Assign Task</button>

        {msg && <p>{msg}</p>}
      </div>
    </div>
  );
};

export default AssignTask;
