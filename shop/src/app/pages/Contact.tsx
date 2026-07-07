import { useEffect, useState } from 'react'
import { contactService } from '../services/contactService'
import { getBranches } from '../services/branchService'

export function Contact() {
  const [branches, setBranches] = useState<any[]>([])

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    branch_id: '',
    message: '',
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadBranches()
  }, [])

  const loadBranches = async () => {
    try {
      const response = await getBranches()

      console.log(
        'BRANCH RESPONSE:',
        response
      )

      setBranches(
        response.data || response || []
      )
    } catch (error) {
      console.error(
        'Lỗi lấy chi nhánh:',
        error
      )

      setBranches([])
    }
  }

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    try {
      setLoading(true)

      await contactService.send(form)

      alert('Gửi liên hệ thành công!')

      setForm({
        name: '',
        email: '',
        phone: '',
        branch_id: '',
        message: '',
      })
    } catch (error: any) {
  console.error(
    "Lỗi gửi liên hệ:",
    error
  );

  console.log(
    "STATUS:",
    error.response?.status
  );

  console.log(
    "DATA:",
    error.response?.data
  );

  console.log(
    "ERRORS:",
    error.response?.data?.errors
  );

  const errors =
    error.response?.data?.errors;

  if (errors) {
    const firstError =
      Object.values(errors)[0];

    alert(
      Array.isArray(firstError)
        ? firstError[0]
        : "Dữ liệu không hợp lệ!"
    );

    return;
  }

  alert(
    error.response?.data?.message ||
      "Gửi liên hệ thất bại!"
  );
} finally {
  setLoading(false);
}
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Liên hệ
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-lg space-y-4"
      >
        <input
          type="text"
          placeholder="Tên của bạn"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          type="tel"
          placeholder="Số điện thoại"
          value={form.phone}
          onChange={(e) =>
            setForm({
              ...form,
              phone: e.target.value,
            })
          }
          maxLength={10}
          pattern="0[0-9]{9}"
          title="Số điện thoại phải gồm 10 số và bắt đầu bằng số 0"
          className="w-full p-3 border rounded-lg"
          required
        />

        {/* CHỌN CHI NHÁNH */}
        <select
          value={form.branch_id}
          onChange={(e) =>
            setForm({
              ...form,
              branch_id: e.target.value,
            })
          }
          className="w-full p-3 border rounded-lg bg-white"
          required
        >
          <option value="">
            -- Chọn chi nhánh cần liên hệ --
          </option>

          {branches.map((branch) => (
            <option
              key={branch.id}
              value={branch.id}
            >
              {branch.name}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Nội dung"
          value={form.message}
          onChange={(e) =>
            setForm({
              ...form,
              message: e.target.value,
            })
          }
          className="w-full p-3 border rounded-lg h-32"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? 'Đang gửi...'
            : 'Gửi liên hệ'}
        </button>
      </form>
    </div>
  )
}