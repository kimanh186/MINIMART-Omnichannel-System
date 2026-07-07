import React from "react"

export default function ForgotPasswordPage() {
    const [step, setStep] = React.useState(1)
    const [email, setEmail] = React.useState('')
    const [otp, setOtp] = React.useState('')
    const [newPassword, setNewPassword] = React.useState('')
    const [confirmPassword, setConfirmPassword] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState('')
    const [success, setSuccess] = React.useState('')

    const handleSendOtp  = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (!email) {
            setError('Vui lòng nhập email')
            return
        }

        try {
            setLoading(true)

            const response = await fetch('http://127.0.0.1:8000/api/customer/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

if (!response.ok) {
    throw new Error(
        data.message || "Có lỗi xảy ra"
    )
}

            setSuccess('Mã xác nhận đã được gửi đến email của bạn')
            setStep(2)
        } catch (err: any) {
            setError(err.message || 'Không thể gửi mã xác nhận')
        } finally {
            setLoading(false)
        }
    }

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (!otp) {
            setError('Vui lòng nhập mã OTP')
            return
        }

        if (!newPassword) {
            setError('Vui lòng nhập mật khẩu mới')
            return
        }

        if (newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự')
            return
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu nhập lại không khớp')
            return
        }

        try {
            setLoading(true)

            const response = await fetch('http://127.0.0.1:8000/api/customer/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    otp,
                     password: newPassword,
                }),
            })

            const data = await response.json()

if (!response.ok) {
    throw new Error(
        data.message || "Có lỗi xảy ra"
    )
}
            setSuccess('Đổi mật khẩu thành công. Đang chuyển đến trang đăng nhập...')

            setTimeout(() => {
                window.location.href = '/login'
            }, 2000)
        } catch (err: any) {
            setError(err.message || 'Không thể đổi mật khẩu')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Quên mật khẩu
                    </h1>
                    <p className="text-slate-500 text-sm">
                        {step === 1
                            ? 'Nhập email đã đăng ký để nhận mã xác nhận'
                            : 'Nhập mã OTP và mật khẩu mới'}
                    </p>
                </div>

                {error && (
                    <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                        {success}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@gmail.com"
                                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-2xl bg-blue-600 py-3 text-white font-semibold transition hover:bg-blue-700 disabled:opacity-60"
                        >
                            {loading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                disabled
                                className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Mã OTP
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Nhập 6 số"
                                maxLength={6}
                                className="w-full rounded-2xl border border-slate-300 px-4 py-3 tracking-[0.4em] text-center text-lg outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Mật khẩu mới
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Nhập mật khẩu mới"
                                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Nhập lại mật khẩu
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu mới"
                                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-2xl bg-blue-600 py-3 text-white font-semibold transition hover:bg-blue-700 disabled:opacity-60"
                        >
                            {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setStep(1)
                                setOtp('')
                                setNewPassword('')
                                setConfirmPassword('')
                                setError('')
                                setSuccess('')
                            }}
                            className="w-full text-sm text-slate-500 hover:text-slate-700"
                        >
                            Quay lại nhập email
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
