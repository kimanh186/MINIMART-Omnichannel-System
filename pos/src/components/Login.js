import React, { useState } from 'react';
import { authService } from '../services/authService';
import { toast } from "react-toastify";
import { Sparkles } from 'lucide-react';

export function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    if (!username.trim() || !password) {
      setError(
        "Vui lòng nhập đầy đủ tài khoản và mật khẩu"
      );
      return;
    }

    setLoading(true);

    try {
      const data = await authService.login(
        username.trim(),
        password,
        'POS-01'
      );

      localStorage.setItem(
        "employee_branch_id",
        String(data.employee?.branch_id || "")
      );

      localStorage.setItem(
        "employee_branch_name",
        data.employee?.branch?.name || ""
      );

      localStorage.setItem(
        "pos_token",
        data.token
      );

      toast.success("Đăng nhập thành công");

      onLogin(data.employee, data.token);

    } catch (err) {
      console.log(
        "LOGIN RESPONSE:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
        "Sai tài khoản hoặc mật khẩu"
      );

    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (!loading) {
        e.currentTarget.form?.requestSubmit();
      }
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
          Hệ Thống Bán Hàng POS
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
            onKeyDown={handleKeyDown}
            disabled={loading}
            autoFocus
            autoComplete="username"
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
            onKeyDown={handleKeyDown}
            disabled={loading}
            autoComplete="current-password"
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