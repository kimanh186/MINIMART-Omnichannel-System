import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api/adminAuth";
import { ShieldCheck, Sparkles } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await adminLogin(username, password);
      navigate("/categories");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Sai username hoặc mật khẩu"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-login">
      <form
        onSubmit={handleSubmit}
        className="login-form"
      >
        <div className="login-brand">
          <Sparkles className="logo-icon" />
          <span>MINIMART</span>
        </div>

        <p className="login-subtitle">
          Hệ Thống Quản Trị
        </p>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        <div>
          <label>Tài khoản</label>
          <input
            type="text"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            disabled={loading}
            placeholder="Nhập username"
          />
        </div>

        <div>
          <label>Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            disabled={loading}
            placeholder="Nhập mật khẩu"
          />
        </div>

        <button
          type="submit"
          className="btn-login"
          disabled={loading}
        >
          {loading
            ? "Đang đăng nhập..."
            : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}

export default Login;