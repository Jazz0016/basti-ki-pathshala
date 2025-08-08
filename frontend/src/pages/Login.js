
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [role, setRole] = useState("user"); // 'user' or 'admin'
  const [form, setForm] = useState({ id: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (role === "user") {
        const res = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: form.id, password: form.password }),
        });

        const data = await res.json();
        if (!res.ok) {
  setError(data.message || "Login failed");
  return;
}

// Save user info to localStorage
localStorage.setItem("user", JSON.stringify({ name: data.name || form.id }));

// navigate to dashboard
navigate("/dashboard");
}else {
        // Admin login placeholder
        if (form.id === "admin" && form.password === "admin123") {
          alert("Admin login successful");
          navigate("/admin");
        } else {
          setError("Invalid admin credentials");
        }
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="role-toggle">
          <button
            type="button"
            className={role === "user" ? "active" : ""}
            onClick={() => setRole("user")}
          >
            User Login
          </button>
          <button
            type="button"
            className={role === "admin" ? "active" : ""}
            onClick={() => setRole("admin")}
          >
            Admin Login
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>{role === "user" ? "User ID" : "Admin ID"}</label>
          <input
            type="text"
            name="id"
            value={form.id}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" className="login-btn">
            Login
          </button>

          {role === "user" && (
            <p className="register-link">
              Not a user? <a href="/register">Register</a>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
