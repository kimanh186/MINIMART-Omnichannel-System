import {
    useEffect,
    useState,
} from "react";

import {
    getProfile,
    uploadAvatar,
    uploadCover,
    logout,
    changePassword,
    updateProfile,
} from "../services/authService";

import {
    getAddresses,
    deleteAddress,
    createAddress,
    updateAddress,
} from "../services/addresses";

import {
    useNavigate,
    Link,
} from "react-router-dom";

export default function UserPage() {
    const navigate = useNavigate();

    const [tab, setTab] =
        useState("profile");

    const [showAddressForm, setShowAddressForm] =
        useState(false);

    const [user, setUser] =
        useState<any>(() => {
            const savedUser =
                localStorage.getItem("user");

            if (!savedUser) {
                return null;
            }

            try {
                return JSON.parse(savedUser);
            } catch {
                return null;
            }
        });

    const [loading, setLoading] =
        useState(
            !localStorage.getItem("user")
        );

    const [addresses, setAddresses] =
        useState<any[]>([]);

    const [editName, setEditName] =
        useState("");

    const [editPhone, setEditPhone] =
        useState("");

    const [editEmail, setEditEmail] =
        useState("");

    const [editAddress, setEditAddress] =
        useState("");

    const [oldPassword, setOldPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [addressForm, setAddressForm] =
        useState({
            id: null as number | null,
            full_name: "",
            phone: "",
            email: "",
            address: "",
            ward: "",
            district: "",
            city: "",
            is_default: false,
        });

    // =========================
    // LOAD USER
    // =========================

    const loadUser = async () => {
        try {
            const token =
                localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            const data =
                await getProfile(token);

            setUser(data);

            localStorage.setItem(
                "user",
                JSON.stringify(data)
            );

        } catch (error) {
            console.error(
                "Lỗi lấy thông tin user:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // LOAD ADDRESS
    // =========================

    const loadAddresses = async () => {
        try {
            const token =
                localStorage.getItem("token");

            if (!token) return;

            const data =
                await getAddresses(token);

            setAddresses(data);

        } catch (error) {
            console.error(
                "Lỗi lấy địa chỉ:",
                error
            );
        }
    };

    // =========================
    // EFFECT
    // =========================

    useEffect(() => {
        loadUser();
    }, []);

    useEffect(() => {
        if (!user) return;

        setEditName(user.name || "");
        setEditPhone(user.phone || "");
        setEditEmail(user.email || "");
        setEditAddress(user.address || "");

    }, [user]);

    useEffect(() => {
        if (tab === "address") {
            loadAddresses();
        }
    }, [tab]);

    // =========================
    // AVATAR
    // =========================

    const handleAvatarChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        try {
            const file =
                e.target.files?.[0];

            if (!file) return;

            const token =
                localStorage.getItem("token");

            if (!token) return;

            await uploadAvatar(
                token,
                file
            );

            await loadUser();

        } catch (error) {
            console.error(
                "Lỗi upload avatar:",
                error
            );
        }
    };

    // =========================
    // COVER
    // =========================

    const handleCoverChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        try {
            const file =
                e.target.files?.[0];

            if (!file) return;

            const token =
                localStorage.getItem("token");

            if (!token) return;

            await uploadCover(
                token,
                file
            );

            await loadUser();

        } catch (error) {
            console.error(
                "Lỗi upload ảnh bìa:",
                error
            );
        }
    };

    // =========================
    // UPDATE PROFILE
    // =========================

    const handleUpdateProfile = async () => {
        try {
            const token =
                localStorage.getItem("token");

            if (!token) return;

            await updateProfile(token, {
                name: editName,
                phone: editPhone,
                email: editEmail,
                address: editAddress,
            });

            alert(
                "Cập nhật thành công"
            );

            await loadUser();

        } catch (err: any) {
            alert(
                err.response?.data?.message ||
                "Cập nhật thất bại"
            );
        }
    };

    // =========================
    // CHANGE PASSWORD
    // =========================

    const handleChangePassword =
        async () => {
            try {
                const token =
                    localStorage.getItem(
                        "token"
                    );

                if (!token) return;

                await changePassword(
                    token,
                    oldPassword,
                    newPassword
                );

                alert(
                    "Đổi mật khẩu thành công"
                );

                setOldPassword("");
                setNewPassword("");

                setTab("profile");

            } catch (err: any) {
                alert(
                    err.response?.data?.message ||
                    "Đổi mật khẩu thất bại"
                );
            }
        };

    // =========================
    // SAVE ADDRESS
    // =========================

    const handleSaveAddress = async () => {
        try {
            const token =
                localStorage.getItem("token");

            if (!token) return;

            if (addressForm.id) {
                await updateAddress(
                    token,
                    addressForm.id,
                    addressForm
                );
            } else {
                await createAddress(
                    token,
                    addressForm
                );
            }

            setShowAddressForm(false);

            await loadAddresses();

        } catch (error) {
            console.error(
                "Lỗi lưu địa chỉ:",
                error
            );
        }
    };

    // =========================
    // DELETE ADDRESS
    // =========================

    const handleDelete = async (
        id: number
    ) => {
        try {
            const token =
                localStorage.getItem("token");

            if (!token) return;

            const confirmDelete =
                window.confirm(
                    "Bạn có chắc muốn xóa địa chỉ?"
                );

            if (!confirmDelete) return;

            await deleteAddress(
                token,
                id
            );

            await loadAddresses();

        } catch (error) {
            console.error(
                "Lỗi xóa địa chỉ:",
                error
            );
        }
    };

    // =========================
    // LOGOUT
    // =========================

    const handleLogout = async () => {
        try {
            const token =
                localStorage.getItem("token");

            if (token) {
                await logout(token);
            }

        } catch (error) {
            console.error(
                "Lỗi logout:",
                error
            );

        } finally {
            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            navigate("/login");
        }
    };

    // =========================
    // LOADING
    // =========================

    if (loading && !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">
                    Đang tải thông tin...
                </p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-4">
                        Bạn chưa đăng nhập
                    </h2>

                    <button
                        onClick={() =>
                            navigate("/login")
                        }
                        className="bg-sky-100 text-sky-700 px-6 py-3 rounded-xl"
                    >
                        Đăng nhập
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-10">
            <div className="max-w-6xl mx-auto px-4">

                {/* COVER */}

                <div className="relative h-52">
                    <img
                        src={
                            user.cover_image
                                ? `http://127.0.0.1:8000${user.cover_image}`
                                : "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
                        }
                        alt="Ảnh bìa"
                        className="w-full h-full object-cover rounded-2xl"
                    />

                    <label className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-xl cursor-pointer">
                        Đổi ảnh bìa

                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={
                                handleCoverChange
                            }
                        />
                    </label>

                    {/* AVATAR */}

                    <div className="absolute -bottom-12 left-8">
                        <div className="relative">

                            {user.avatar ? (
                                <img
                                    src={`http://127.0.0.1:8000${user.avatar}`}
                                    alt="Avatar"
                                    className="w-32 h-32 rounded-full border-4 border-white object-cover"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-white text-blue-950 flex items-center justify-center text-5xl font-bold border-4 border-white shadow">
                                    {user.name
                                        ?.charAt(0)
                                        ?.toUpperCase()}
                                </div>
                            )}

                            <label className="absolute bottom-0 right-0 bg-sky-100 p-2 rounded-full cursor-pointer shadow">
                                📷

                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={
                                        handleAvatarChange
                                    }
                                />
                            </label>

                        </div>
                    </div>
                </div>

                {/* CONTENT */}

                <div className="grid grid-cols-12 gap-6 p-8 mt-12">

                    {/* SIDEBAR */}

                    <div className="col-span-3">
                        <div className="bg-white border rounded-2xl p-4 shadow-sm">

                            <button
                                onClick={() =>
                                    setTab("profile")
                                }
                                className={`
                                    w-full text-left p-3 rounded-xl mb-2 border transition
                                    ${
                                        tab === "profile"
                                            ? "bg-sky-100 border-sky-700 text-sky-700"
                                            : "bg-white border-transparent text-black hover:bg-sky-100"
                                    }
                                `}
                            >
                                Hồ sơ cá nhân
                            </button>

                            <button
                                onClick={() =>
                                    setTab("password")
                                }
                                className={`
                                    w-full text-left p-3 rounded-xl mb-2 border transition
                                    ${
                                        tab === "password"
                                            ? "bg-sky-100 border-sky-700 text-sky-700"
                                            : "bg-white border-transparent text-black hover:bg-sky-100"
                                    }
                                `}
                            >
                                Đổi mật khẩu
                            </button>

                            <button
                                onClick={() =>
                                    setTab("address")
                                }
                                className={`
                                    w-full text-left p-3 rounded-xl mb-2 border transition
                                    ${
                                        tab === "address"
                                            ? "bg-sky-100 border-sky-700 text-sky-700"
                                            : "bg-white border-transparent text-black hover:bg-sky-100"
                                    }
                                `}
                            >
                                Địa chỉ giao hàng
                            </button>

                            <button
                                onClick={() =>
                                    navigate("/orders")
                                }
                                className="w-full text-left p-3 rounded-xl hover:bg-sky-100 mb-2"
                            >
                                Đơn hàng của tôi
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full text-left p-3 rounded-xl hover:bg-sky-100 mb-2"
                            >
                                Đăng xuất
                            </button>

                        </div>
                    </div>

                    {/* MAIN */}

                    <div className="col-span-9">

                        {/* PROFILE */}

                        {tab === "profile" && (
                            <div className="bg-white border shadow-sm rounded-2xl p-8">
                                <h2 className="font-bold text-xl mb-5">
                                    Thông tin cá nhân
                                </h2>

                                <div className="grid grid-cols-2 gap-5">

                                    <div>
                                        <p className="text-gray-500 text-sm">
                                            Họ tên
                                        </p>

                                        <input
                                            value={editName}
                                            onChange={(e) =>
                                                setEditName(
                                                    e.target.value
                                                )
                                            }
                                            className="w-full border rounded-xl p-3 mt-1"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-sm">
                                            Số điện thoại
                                        </p>

                                        <input
                                            value={editPhone}
                                            onChange={(e) =>
                                                setEditPhone(
                                                    e.target.value
                                                )
                                            }
                                            className="w-full border rounded-xl p-3 mt-1"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-sm">
                                            Email
                                        </p>

                                        <input
                                            value={editEmail}
                                            onChange={(e) =>
                                                setEditEmail(
                                                    e.target.value
                                                )
                                            }
                                            className="w-full border rounded-xl p-3 mt-1"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <p className="text-gray-500 text-sm">
                                            Địa chỉ
                                        </p>

                                        <input
                                            value={editAddress}
                                            onChange={(e) =>
                                                setEditAddress(
                                                    e.target.value
                                                )
                                            }
                                            className="w-full border rounded-xl p-3 mt-1"
                                        />
                                    </div>

                                    <div className="col-span-2 mt-2">
                                        <button
                                            onClick={
                                                handleUpdateProfile
                                            }
                                            className="bg-sky-100 text-sky-700 hover:bg-sky-200 px-6 py-3 rounded-xl transition hover:text-black"
                                        >
                                            Lưu thay đổi
                                        </button>
                                    </div>

                                </div>
                            </div>
                        )}

                        {/* ADDRESS */}

                        {tab === "address" && (
                            <div className="bg-white rounded-2xl p-6 shadow border">

                                <div className="flex justify-between items-center mb-5">
                                    <h2 className="text-xl font-bold">
                                        Địa chỉ của tôi
                                    </h2>

                                    <button
                                        onClick={() => {
                                            setAddressForm({
                                                id: null,
                                                full_name: "",
                                                phone: "",
                                                email: "",
                                                address: "",
                                                ward: "",
                                                district: "",
                                                city: "",
                                                is_default: false,
                                            });

                                            setShowAddressForm(
                                                true
                                            );
                                        }}
                                        className="border border-sky-500 text-sky-600 px-4 py-2 rounded-xl hover:bg-sky-50"
                                    >
                                        + Thêm địa chỉ
                                    </button>
                                </div>

                                {addresses.length === 0 ? (
                                    <p className="text-gray-500">
                                        Chưa có địa chỉ giao hàng.
                                    </p>
                                ) : (
                                    addresses.map((item) => (
                                        <div
                                            key={item.id}
                                            className="border rounded-xl p-4 mb-4"
                                        >
                                            <div className="flex justify-between gap-4">

                                                <div>
                                                    <p className="font-semibold">
                                                        {item.full_name}
                                                    </p>

                                                    <p>
                                                        {item.phone}
                                                    </p>

                                                    <p>
                                                        {item.address},{" "}
                                                        {item.ward},{" "}
                                                        {item.district},{" "}
                                                        {item.city}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-3">

                                                    {item.is_default && (
                                                        <span className="bg-red-100 border border-red-300 text-red-600 px-2 py-1 rounded text-xs">
                                                            Mặc định
                                                        </span>
                                                    )}

                                                    <button
                                                        onClick={() => {
                                                            setAddressForm({
                                                                id: item.id,
                                                                full_name: item.full_name,
                                                                phone: item.phone,
                                                                email: item.email || "",
                                                                address: item.address,
                                                                ward: item.ward,
                                                                district: item.district,
                                                                city: item.city,
                                                                is_default: Boolean(
                                                                    item.is_default
                                                                ),
                                                            });

                                                            setShowAddressForm(
                                                                true
                                                            );
                                                        }}
                                                        className="text-sky-600 hover:underline"
                                                    >
                                                        Sửa
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id
                                                            )
                                                        }
                                                        className="text-red-500 hover:underline"
                                                    >
                                                        Xóa
                                                    </button>

                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* PASSWORD */}

                        {tab === "password" && (
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h2 className="font-bold text-xl mb-6">
                                    Đổi mật khẩu
                                </h2>

                                <div className="space-y-4 max-w-md">

                                    <input
                                        type="password"
                                        placeholder="Mật khẩu cũ"
                                        value={oldPassword}
                                        onChange={(e) =>
                                            setOldPassword(
                                                e.target.value
                                            )
                                        }
                                        className="w-full border rounded-xl p-3"
                                    />

                                    <div className="flex justify-end">
                                        <Link
                                            to="/forgotPassword"
                                            className="text-sm text-sky-600 hover:underline"
                                        >
                                            Quên mật khẩu?
                                        </Link>
                                    </div>

                                    <input
                                        type="password"
                                        placeholder="Mật khẩu mới"
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(
                                                e.target.value
                                            )
                                        }
                                        className="w-full border rounded-xl p-3"
                                    />

                                    <button
                                        onClick={
                                            handleChangePassword
                                        }
                                        className="bg-sky-100 text-sky-700 hover:bg-sky-200 px-6 py-3 rounded-xl transition hover:text-black"
                                    >
                                        Đổi mật khẩu
                                    </button>

                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* ADDRESS MODAL */}

            {showAddressForm && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999]">

                    <div className="bg-white w-[500px] max-w-[90%] rounded-2xl p-6">

                        <h2 className="font-bold text-xl mb-5">
                            {addressForm.id
                                ? "Cập nhật địa chỉ"
                                : "Thêm địa chỉ giao hàng"}
                        </h2>

                        <div className="space-y-3">

                            <input
                                placeholder="Họ tên"
                                value={
                                    addressForm.full_name
                                }
                                onChange={(e) =>
                                    setAddressForm({
                                        ...addressForm,
                                        full_name:
                                            e.target.value,
                                    })
                                }
                                className="w-full border rounded-xl p-3"
                            />

                            <input
                                placeholder="Số điện thoại"
                                value={
                                    addressForm.phone
                                }
                                onChange={(e) =>
                                    setAddressForm({
                                        ...addressForm,
                                        phone:
                                            e.target.value,
                                    })
                                }
                                className="w-full border rounded-xl p-3"
                            />

                            <input
                                placeholder="Địa chỉ"
                                value={
                                    addressForm.address
                                }
                                onChange={(e) =>
                                    setAddressForm({
                                        ...addressForm,
                                        address:
                                            e.target.value,
                                    })
                                }
                                className="w-full border rounded-xl p-3"
                            />

                            <input
                                placeholder="Phường/Xã"
                                value={
                                    addressForm.ward
                                }
                                onChange={(e) =>
                                    setAddressForm({
                                        ...addressForm,
                                        ward:
                                            e.target.value,
                                    })
                                }
                                className="w-full border rounded-xl p-3"
                            />

                            <input
                                placeholder="Quận/Huyện"
                                value={
                                    addressForm.district
                                }
                                onChange={(e) =>
                                    setAddressForm({
                                        ...addressForm,
                                        district:
                                            e.target.value,
                                    })
                                }
                                className="w-full border rounded-xl p-3"
                            />

                            <input
                                placeholder="Tỉnh/Thành phố"
                                value={
                                    addressForm.city
                                }
                                onChange={(e) =>
                                    setAddressForm({
                                        ...addressForm,
                                        city:
                                            e.target.value,
                                    })
                                }
                                className="w-full border rounded-xl p-3"
                            />

                            <label className="flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    checked={
                                        addressForm.is_default
                                    }
                                    onChange={(e) =>
                                        setAddressForm({
                                            ...addressForm,
                                            is_default:
                                                e.target.checked,
                                        })
                                    }
                                />

                                Đặt làm địa chỉ mặc định
                            </label>

                            <div className="flex justify-end gap-3 pt-4">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowAddressForm(
                                            false
                                        )
                                    }
                                    className="border px-4 py-2 rounded-xl"
                                >
                                    Hủy
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleSaveAddress
                                    }
                                    className="bg-sky-100 text-sky-700 px-5 py-2 rounded-xl"
                                >
                                    Lưu
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}