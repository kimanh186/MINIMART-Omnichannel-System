import {
  Store,
  Gem,
  ShieldCheck,
  Truck,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  getStoreInfo,
} from "../services/storeInfoService";

import {
  getBranches,
} from "../services/branchService";

export function About() {
  const [storeInfo, setStoreInfo] =
    useState<any>(null);

  const [branches, setBranches] =
    useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const info =
        await getStoreInfo();

      const branchData =
        await getBranches();

      setStoreInfo(info);

      setBranches(
        Array.isArray(branchData)
          ? branchData
          : branchData.data || []
      );
    } catch (error) {
      console.error(
        "Lỗi tải trang giới thiệu:",
        error
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Về chúng tôi
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
        <p className="text-gray-700">
          <b>
            {storeInfo?.store_name ||
              "MINIMART"}
          </b>{" "}

          {storeInfo?.description ||
            "Thông tin cửa hàng đang được cập nhật."}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="p-5 border rounded-xl bg-white shadow-sm">
          <Gem className="text-blue-600 mb-3" />

          <h3 className="font-semibold">
            Sản phẩm chất lượng
          </h3>
        </div>

        <div className="p-5 border rounded-xl bg-white shadow-sm">
          <Truck className="text-blue-600 mb-3" />

          <h3 className="font-semibold">
            Giao hàng nhanh
          </h3>
        </div>

        <div className="p-5 border rounded-xl bg-white shadow-sm">
          <ShieldCheck className="text-blue-600 mb-3" />

          <h3 className="font-semibold">
            Uy tín & bảo mật
          </h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Hệ thống chi nhánh
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="border rounded-xl p-4 hover:shadow-md transition"
            >
              <Store className="text-blue-600 mb-2" />

              <h3 className="font-semibold">
                {branch.name}
              </h3>

              <p className="text-gray-600 text-sm mt-2">
                {branch.address}
              </p>

              <p className="text-gray-500 text-sm">
                Hotline:{" "}
                {branch.phone ||
                  "Đang cập nhật"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">
          Vị trí cửa hàng
        </h2>

        <iframe
          src="https://www.google.com/maps?q=10.7769,106.7009&z=15&output=embed"
          width="100%"
          height="400"
          style={{ border: 0 }}
          loading="lazy"
        />

        <a
          href="https://www.google.com/maps?q=10.7769,106.7009"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline mt-3 inline-block"
        >
          Xem trên Google Maps
        </a>
      </div>
    </div>
  );
}