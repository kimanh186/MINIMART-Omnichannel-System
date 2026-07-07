import React, { useRef, useState, useEffect } from 'react';
import { Search, Barcode, Store, LogOut } from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { authService } from '../services/authService';
import attendanceService from '../services/attendanceService';
import { toast } from "react-toastify";

export function Header({
  searchTerm = '',
  onSearchChange = () => { },
  onBarcodeSearch = () => { },
  employee = null
}) {
  const videoRef = useRef(null);
  const codeReader = useRef(new BrowserMultiFormatReader());
  const [now, setNow] = useState(new Date());
  const [scanning, setScanning] = useState(false);
  const branchName = localStorage.getItem( "employee_branch_name");

  const handleCheckIn = async () => {
    try {
      await attendanceService.checkIn();

      toast.success(
        "Điểm danh vào ca thành công"
      );
    } catch (e) {
      toast.error(
        e.response?.data?.message
      );
    }
  };

  const handleCheckOut = async () => {
    try {
      await attendanceService.checkOut();

      toast.success(
        "Kết thúc ca làm thành công"
      );
    } catch (e) {
      toast.error(
        e.response?.data?.message
      );
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') onBarcodeSearch(searchTerm.trim());
  };

  const startCameraScan = async () => {
    setScanning(true);
    try {
      codeReader.current.decodeFromVideoDevice(
        null,
        videoRef.current,
        (result) => {
          if (result) {
            onBarcodeSearch(result.text);
            stopCameraScan();
          }
        }
      );
    } catch (error) {
      alert('Không thể mở camera!');
      setScanning(false);
    }
  };
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const container = document.querySelector('.snow-header');

    function createSnowflake() {
      const snowflake = document.createElement('div');
      snowflake.classList.add('snowflake');
      snowflake.style.left = Math.random() * container.offsetWidth + 'px';
      snowflake.style.fontSize = (8 + Math.random() * 12) + 'px';
      snowflake.style.animationDuration = (5 + Math.random() * 5) + 's, ' + (3 + Math.random() * 3) + 's';
      snowflake.style.opacity = Math.random();
      snowflake.innerText = '❄';

      container.appendChild(snowflake);

      setTimeout(() => snowflake.remove(), 10000);
    }
    const interval = setInterval(createSnowflake, 150);
    return () => clearInterval(interval);
  }, []);


  const stopCameraScan = () => {
    setScanning(false);
    codeReader.current.reset();
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('pos_token');
    const sessionId = localStorage.getItem('work_session_id');
    if (!token || !sessionId) return;

    try {
      await authService.logout(token);
    } catch (e) {
      console.error(e);
    }

    localStorage.removeItem('pos_token');
    localStorage.removeItem('work_session_id');
    window.location.reload();
  };


  useEffect(() => {
    return () => codeReader.current.reset();
  }, []);

  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="snow-header"></div>

        <div className="top-row">

          <div className="brand">
            <Store />

            <div>
              <div className="brand-sub">
                KA - Mart
              </div>

              {branchName && (
                <div className="branch-name">
                  {branchName}
                </div>
              )}
            </div>
          </div>

          {/* THÔNG TIN NHÂN VIÊN */}
          <div className="time-info">
            <div>
              <strong>Thu ngân:</strong> {employee ? employee.full_name : 'Chưa đăng nhập'}
            </div>
            <div>
              {now.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })} -{' '}
              {now.toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
            </div>
            {employee && (
              <div className="employee-actions">
                <button
                  className="btn-checkin"
                  onClick={handleCheckIn}
                >
                  Vào ca
                </button>

                <button
                  className="btn-check-out"
                  onClick={handleCheckOut}
                >
                  Kết ca
                </button>

                <button
                  className="btn-logout"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>

          {/* CAMERA */}
          <video ref={videoRef} className="header-video" autoPlay playsInline muted />
        </div>

        {/* SEARCH */}
        <div className="search-area">
          <div className="search-box">
            <Search className="icon" />
            <input
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tìm kiếm sản phẩm hoặc nhập mã vạch..."
            />
          </div>

          <button className="btn-scan" onClick={scanning ? stopCameraScan : startCameraScan}>
            <Barcode />
            {scanning ? 'Đang quét...' : 'Quét mã'}
          </button>
        </div>
      </div>
    </header>
  );
}
