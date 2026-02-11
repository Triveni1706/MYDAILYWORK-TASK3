import { Link } from "react-router-dom";


const Home = () => {
  return (
    <div className="home-container">
      {/* Top Navbar */}
      <nav className="home-navbar">
        <h2 className="logo">
          Project<span>Flow</span>
        </h2>
        <div className="nav-actions">
          <Link to="/login" className="nav-btn outline">Login</Link>
          <Link to="/register" className="nav-btn filled">Register</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero">
        <h1>
          Project<span>Flow</span>
        </h1>
        <p>
          Smart project management with powerful task tracking,
          deadlines, and progress insights.
        </p>

        <div className="hero-buttons">
          <Link to="/register" className="hero-btn primary">
            Get Started
          </Link>
          <button className="hero-btn secondary">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
