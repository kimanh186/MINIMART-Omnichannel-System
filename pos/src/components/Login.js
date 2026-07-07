import React, { useState } from 'react';
import { authService } from '../services/authService';
import { toast } from "react-toastify";
import { Sparkles, Store } from 'lucide-react';

export function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.warning("Vui lòng nhập đầy đủ username và password");
      return;
    }

    const toastId = toast.loading("Đang đăng nhập...");

    try {
      const data = await authService.login(username, password, 'POS-01');
      localStorage.setItem(
        "employee_branch_id",
        data.employee.branch_id
      );

      localStorage.setItem(
        "employee_branch_name",
        data.employee.branch?.name || ""
      );

      localStorage.setItem('pos_token', data.token);

      toast.update(toastId, {
        render: "Đăng nhập thành công ",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });

      setTimeout(() => {
        onLogin(data.employee, data.token);
      }, 1200);

    } catch (err) {
      toast.update(toastId, {
        render: err.response?.data?.message || "Đăng nhập thất bại ❌",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-login">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-brand">
          <Sparkles className="logo-icon" />
          <span>MINIMART</span>
        </div>


        <p className="login-subtitle">
          Hệ Thống Bán Hàng POS
        </p>

        <div>
          <label>Tài khoản</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label>Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
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
