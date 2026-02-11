import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axiosInstance";
import { AuthContext } from "../auth/AuthContext";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      // ✅ FIX: use form.email & form.password
      const res = await axios.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      login(res.data);

      if (res.data.user.role === "MANAGER") {
        navigate("/manager");
      } else {
        navigate("/member");
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p>Login to continue to ProjectFlow</p>

        <form onSubmit={submit}>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

          <button className="login-btn" type="submit">
            Login
          </button>
        </form>

        <div className="login-footer">
          Don’t have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
