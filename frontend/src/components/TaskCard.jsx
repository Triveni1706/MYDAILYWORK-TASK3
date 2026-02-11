import axios from "../api/axiosInstance";

const TaskCard = ({ task, isManager = false, refresh }) => {
  const isOverdue =
    task.deadline && new Date(task.deadline) < new Date() &&
    task.status !== "COMPLETED";

  const updateStatus = async (status) => {
    await axios.patch(`/tasks/${task._id}/status`, { status });
    refresh && refresh();
  };

  return (
    <div style={{ ...styles.card, borderLeft: isOverdue ? "5px solid red" : "" }}>
      <h4>{task.title}</h4>
      <p><b>Project:</b> {task.project?.project_name}</p>
      <p><b>Priority:</b> {task.priority}</p>
      <p><b>Deadline:</b> {task.deadline?.substring(0, 10)}</p>
      <p><b>Status:</b> {task.status}</p>

      {!isManager && (
        <select
          value={task.status}
          onChange={(e) => updateStatus(e.target.value)}
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      )}

      {isOverdue && <p style={{ color: "red" }}>⚠ Overdue</p>}
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ccc",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "5px",
  },
};

export default TaskCard;
