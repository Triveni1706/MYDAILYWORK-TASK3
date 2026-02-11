import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";

const MemberDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [openDesc, setOpenDesc] = useState(null);


  /* ===============================
     LOAD TASKS
  ================================ */
  const fetchTasks = async () => {
    try {
      const res = await axios.get("/tasks/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTasks(res.data || []);
    } catch (err) {
      console.error("Failed to load tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  /* ===============================
     UPDATE STATUS (To Do / In Progress)
  ================================ */
  const updateStatus = async (taskId, status) => {
    try {
      console.log("Updating status for task:", taskId);

      await axios.put(
        `/tasks/${taskId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // ✅ IMPORTANT: reload tasks so IDs stay in sync
      await fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed");
    }
  };

  /* ===============================
     COMPLETE TASK (UPLOAD + LOCK)
  ================================ */
  const completeTask = async (taskId, file) => {
    if (!file) return;

    const task = tasks.find(t => t._id === taskId);
    if (!task) {
      alert("Task not found in UI");
      return;
    }

    if (task.submissionFile) {
      alert("Task already submitted");
      return;
    }

    console.log("Submitting task:", taskId);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.put(
        `/tasks/complete/${taskId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // ✅ Replace only updated task safely
      setTasks(prev =>
        prev.map(t =>
          t._id === taskId ? { ...res.data } : t
        )
      );

      alert("✅ Task submitted successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    }
  };

  /* ===============================
     UI
  ================================ */
  return (
    <div className="member-page">
      <h2>My Assigned Tasks</h2>

      {tasks.length === 0 && <p>No tasks assigned yet</p>}

      {tasks.map(task => {
        const isLocked = Boolean(task.submissionFile);

        return (
          <div className="task-card" key={task._id}>
            <div className="main-part">
            <h3>{task.title}</h3>
            <p>
              <b>Project:</b>{" "}
              {task.project_id?.project_name || "—"}
            </p>

            <p><b>Priority:</b> {task.priority}</p>
            <p>
              <b>Deadline:</b>{" "}
              {task.deadline?.slice(0, 10) || "—"}
            </p>

    


            {/* STATUS */}
            <label>Status</label>
            <select
              value={task.status}
              disabled={isLocked}
              onChange={e =>
                updateStatus(task._id, e.target.value)
              }
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
            </select>

            {/* FILE UPLOAD */}
            {task.status === "In Progress" && !isLocked && (
              <div style={{ marginTop: "10px" }}>
                <input
                  type="file"
                  accept=".pdf,.zip,.doc,.docx"
                  onChange={e =>
                    completeTask(
                      task._id,
                      e.target.files[0]
                    )
                  }
                />
              </div>
            )}

            {/* LOCKED */}
            {isLocked && (
              <p style={{ color: "#05c96a", fontWeight: "bold" }}>
                ✅ Submitted & Locked
                <br />
                (No further changes allowed)
              </p>
            )}
          </div>
          <div className="description-part">
            <button
                className="desc-toggle"
                onClick={() =>
                  setOpenDesc(openDesc === task._id ? null : task._id)
                }
              >
                📄 View Description
              </button>

              {openDesc === task._id && (
                <div className="task-description">
                  {task.description || "No description provided"}
                </div>
              )}

            </div>
          </div>
          
        );
      })}
    </div>
  );
};

export default MemberDashboard;
