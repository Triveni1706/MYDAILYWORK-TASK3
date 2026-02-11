
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Navbar />

      {/* 🔴 THIS LINE IS REQUIRED */}
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};


const styles = {
  container: {
    padding: "20px",
    minHeight: "calc(100vh - 60px)",
    backgroundColor: "#f4f6f8",
  },
};

export default DashboardLayout;
