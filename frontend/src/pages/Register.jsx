import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "MEMBER",
  });

  const navigate = useNavigate();

  const submit = async (e) => {
  e.preventDefault();

  try {
    console.log("Registering user:", form);

    const res = await axios.post("/auth/register", form);

    console.log("Register response:", res.data);

    alert("✅ Registration successful! Please login now.");

    navigate("/login");
  } catch (err) {
    console.error("Register error:", err);
    alert(
      err.response?.data?.message ||
      "❌ Registration failed. Check console."
    );
  }
};


  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Create Account</h2>
        <p>Join ProjectFlow and manage work smarter</p>

        <form onSubmit={submit}>
          <input
            type="text"
            placeholder="Full Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <select
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="MEMBER">Team Member</option>
            <option value="MANAGER">Manager</option>
          </select>

          <button className="register-btn" type="submit">
            Register
          </button>
        </form>

        <div className="register-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
