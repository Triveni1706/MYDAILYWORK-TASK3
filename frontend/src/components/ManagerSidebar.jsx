import { NavLink } from "react-router-dom";

const ManagerSidebar = () => {
  const style = ({ isActive }) => ({
    color: isActive ? "#34ffd2" : "#d4af37",
    textDecoration: "none",
    padding: "10px 0",
    display: "block",
  });

  return (
    <aside className="tp-sidebar">
      <h3>Manager</h3>
      <NavLink to="/manager/reports" style={style}>Track Progress</NavLink>
      <NavLink to="/manager/teams" style={style}>Teams</NavLink>
      <NavLink to="/manager/projects" style={style}>Projects</NavLink>
      <NavLink to="/manager/tasks" style={style}>Tasks</NavLink>
    </aside>
  );
};

export default ManagerSidebar;
