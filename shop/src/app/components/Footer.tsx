import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* About */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Về MINIMART
            </h3>

            <p className="text-sm leading-relaxed">
              MINIMART là cửa hàng tiện lợi cung cấp đa dạng sản phẩm thiết yếu hằng ngày như thực phẩm, đồ uống, bánh kẹo và hàng tiêu dùng, mang đến trải nghiệm mua sắm nhanh chóng, tiện lợi và hiện đại.
            </p>

            <div className="flex gap-3 mt-4">
              <a
                href="#"
                className="hover:text-blue-400 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>

              <a
                href="#"
                className="hover:text-blue-400 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>

              <a
                href="#"
                className="hover:text-pink-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Liên kết nhanh
            </h3>

            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  Giới thiệu
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  Sản phẩm
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  Khuyến mãi
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  Tin tức
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Hỗ trợ khách hàng
            </h3>

            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  Chính sách đổi trả
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  Chính sách giao hàng
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  Hướng dẫn mua hàng
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  Phương thức thanh toán
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  Câu hỏi thường gặp
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Liên hệ
            </h3>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />

                <span>
                  123 Đường Lê Lợi, Quận 1, TP.HCM
                </span>
              </li>

              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0" />

                <span>1900 1234</span>
              </li>

              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />

                <span>support@MINIMART.vn</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>
            &copy; 2026 MINIMART. Bản quyền thuộc về
            MINIMART Việt Nam.
          </p>
        </div>
      </div>
    </footer>
  );
}