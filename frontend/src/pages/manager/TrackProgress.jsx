import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import { NavLink } from "react-router-dom";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

const TrackProgress = () => {
  const [tasks, setTasks] = useState([]);

  /* ================= FETCH TASKS ================= */
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("/tasks/manager", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTasks(res.data || []);
      } catch (err) {
        console.error("TRACK ERROR:", err);
      }
    };

    fetchTasks();
  }, []);

  if (!tasks.length) {
    return <p className="empty">No analytics available</p>;
  }

  /* ================= SUMMARY ================= */
  const completed = tasks.filter(t => t.status === "Completed").length;
  const pending = tasks.length - completed;
  const percent = Math.round((completed / tasks.length) * 100);

  /* ================= DONUT ================= */
  const donutData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [completed, pending],
        backgroundColor: ["#34ffd2", "#d4af37"],
        borderWidth: 0,
        cutout: "75%",
      },
    ],
  };

  const donutOptions = {
    plugins: {
      legend: { display: false },
    },
  };

  /* ================= BAR ================= */
  const projectMap = {};
  tasks.forEach(t => {
    const name = t.project_id?.project_name || "Unknown";
    projectMap[name] = (projectMap[name] || 0) + 1;
  });

  const barData = {
    labels: Object.keys(projectMap),
    datasets: [
      {
        data: Object.values(projectMap),
        backgroundColor: "#d4af37",
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        ticks: { color: "#aaa", stepSize: 1 },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
  };

  /* ================= WEEKLY PROGRESS ================= */
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString("en-US", { weekday: "short" });
  });

  const weeklyCount = {};
  last7Days.forEach(day => (weeklyCount[day] = 0));

  tasks.forEach(task => {
    if (task.status === "Completed") {
      const day = new Date(
        task.updatedAt || task.createdAt
      ).toLocaleDateString("en-US", { weekday: "short" });

      if (weeklyCount[day] !== undefined) {
        weeklyCount[day]++;
      }
    }
  });

  const lineData = {
    labels: last7Days,
    datasets: [
      {
        data: last7Days.map(day => weeklyCount[day]),
        borderColor: "#34ffd2",
        backgroundColor: "rgba(52,255,210,0.15)",
        tension: 0.4,
        fill: true,
        pointRadius: 5,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, precision: 0 },
      },
    },
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
    fontSize:"16px",
  },
};

  /* ================= UI ================= */
  return (
    <div className="tp-dashboard">
      {/* SIDEBAR */}
      <aside className="tp-sidebar">
        <h3>Reports</h3>

        <ul>
          <li style={styles.links} >
            <NavLink to="/manager/reports"  style={styles.link}> Track Progress</NavLink>
          </li>
          <li>
            <NavLink to="/manager/projects"  style={styles.link}> Projects</NavLink>
          </li>
          <li>
            <NavLink to="/manager/tasks"  style={styles.link}> Tasks</NavLink>
          </li>
          <li>
            <NavLink to="/manager/teams" style={styles.link}>Teams</NavLink>
          </li>
        </ul>
      </aside>

      {/* MAIN */}
      <main className="tp-main">
        <h2 className="tp-title">Track Progress</h2>

        {/* SUMMARY */}
        <div className="tp-row">
          <div className="tp-box">
            Total Tasks <b>{tasks.length}</b>
          </div>
          <div className="tp-box green">
            Completed <b>{completed}</b>
          </div>
          <div className="tp-box gold">
            Pending <b>{pending}</b>
          </div>
        </div>

        {/* CHARTS */}
        <div className="tp-row">
          <div className="tp-box chart">
            <h4>Task Completion</h4>
            <div className="donut-wrap">
              <Doughnut data={donutData} options={donutOptions} />
              <div className="donut-center">
                <span>{percent}%</span>
                <small>Completed</small>
              </div>
            </div>
          </div>

          <div className="tp-box chart">
            <h4>Tasks by Project</h4>
            <Bar data={barData} options={barOptions} />
          </div>

          <div className="tp-box chart">
            <h4>Weekly Progress</h4>
            <div style={{ height: "220px" }}>
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>
        </div>

        {/* RECENT TASKS */}
        <div className="tp-row">
          <div className="tp-box wide">
            <h4>Recent Tasks</h4>
            {tasks.slice(0, 4).map(t => (
              <div key={t._id} className="task-row">
                <span>{t.title}</span>
                <span className="done">{t.status}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrackProgress;
