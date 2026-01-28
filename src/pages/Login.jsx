import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login({ onClose }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      alert("Email & Password required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // ✅ IMPORTANT: save FULL user (including role)
      login(data.user);

      // ✅ Close modal
      if (onClose) onClose();

      // ✅ ROLE BASED REDIRECT
      if (data.user.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/account", { replace: true });
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <div className="auth-image" />

        <div className="auth-form">
          <div className="tabs">
            <button
              className={tab === "login" ? "active" : ""}
              onClick={() => setTab("login")}
            >
              Login
            </button>
            <button
              className={tab === "signup" ? "active" : ""}
              onClick={() => setTab("signup")}
            >
              Sign Up
            </button>
          </div>

          {tab === "login" && (
            <>
              <input
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />

              <div className="remember">
                <label className="remember-left">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <span className="forgot">Forgot Password?</span>
              </div>

              <button className="primary-btn" onClick={handleLogin}>
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
