import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      <h3>Task & Project Management System</h3>

      {user && (
        <div style={styles.links}>
          {user.role === "MANAGER" && (
            <>
              <Link to="/manager" style={styles.link}>Dashboard</Link>
              <Link to="/manager/create-team" style={styles.link}>Create Team</Link>
              <Link to="/manager/create-project" style={styles.link}>Create Project</Link>
              <Link to="/manager/assign-task" style={styles.link}>Assign Task</Link>
            </>
          )}

          {user.role === "MEMBER" && (
            <Link to="/member" style={styles.link}>My Tasks</Link>
          )}

          <button style={styles.logout} onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    padding: "20px 30px",
    display: "flex",
    justifyContent: "space-between",
    background: "#222",
    color: "#c09215",
    fontSize:"20px",
  },
  links: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  link: {
    textDecoration: "none",
    color: "#c09215",
    fontWeight: "500",
    fontSize:"16px",
  },
  logout: {
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius:"10px",
    background:"#c09215",
    border:"2px solid #c09215"

  },
};

export default Navbar;
