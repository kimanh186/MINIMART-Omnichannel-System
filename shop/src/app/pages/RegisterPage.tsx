import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/authService'
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function RegisterPage() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault()

    setLoading(true)

    setError('')

    try {

      await register(
        form.name,
        form.phone,
        form.email,
        form.password
      )

      navigate('/login')

    } catch (err: any) {

      setError(
        err.response?.data?.message ||
        'Đăng ký thất bại'
      )

    } finally {

      setLoading(false)

    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-gray-900">
            Tạo tài khoản
          </h1>

          <p className="text-gray-500 mt-2">
            Đăng ký để mua hàng và tích điểm
          </p>

        </div>

        {error && (
          <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Họ và tên"
            required
            className="input"
          />

          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Số điện thoại"
            required
            className="input"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="input"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Mật khẩu"
            required
            className="input"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-60"
          >
            {loading
              ? 'Đang tạo tài khoản...'
              : 'Đăng ký'}
          </button>
          <div className="mt-4 flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const res = await axios.post(
                    "http://127.0.0.1:8000/api/customer/google",
                    {
                      token: credentialResponse.credential,
                    }
                  );

                  localStorage.setItem(
                    "token",
                    res.data.token
                  );

                  localStorage.setItem(
                    "user",
                    JSON.stringify(res.data.user)
                  );

                  navigate("/");
                } catch (err) {
                  console.log(err);
                }
              }}
              onError={() => {
                alert("Đăng ký Google thất bại");
              }}
            />
          </div>

        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Bạn đã có tài khoản?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Đăng nhập
          </Link>
        </p>

      </div>

      <style>
        {`
          .input {
            width: 100%;
            border: 1px solid #d1d5db;
            padding: 12px 16px;
            border-radius: 16px;
            outline: none;
          }

          .input:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px #bfdbfe;
          }
        `}
      </style>


    </div>
  )
}