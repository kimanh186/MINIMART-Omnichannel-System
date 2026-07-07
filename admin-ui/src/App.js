import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import AdminLayout from "./layouts/AdminLayout";
import AdminRoute from "./routes/AdminRoute";
import './index.css';
import CategoryCreate from "./pages/CategoryCreate";
import CategoryEdit from "./pages/CategoryEdit";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ProductCreate from "./pages/ProductCreate";
import ProductEdit from "./pages/ProductEdit";
import OrderPage from "./pages/OrderPage";
import OrderDetail from "./pages/OrderDetail";
import InventoryPage from "./pages/InventoryPage";
import InventoryCreate from "./pages/InventoryCreate";
import InventoryPrint from "./pages/InventoryPrint";
import InventoryDetail from "./pages/InventoryDetail";
import ReportPage from "./pages/ReportPage";
import ReportDetail from "./pages/ReportDetail";
import ReportPrint from "./pages/ReportPrint";
import CustomerPage from "./pages/CustomerPage";
import CustomerDetail from "./pages/CustomerDetail";
import CustomerEdit from "./pages/CustomerEdit";
import EmployeePage from "./pages/Employees/EmployeePage";
import EmployeeCreate from "./pages/Employees/EmployeeCreate";
import EmployeeEdit from "./pages/Employees/EmployeeEdit";
import PayrollPage from "./pages/Employees/PayrollPage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BranchPage from "./pages/Branches/BranchPage";
import BranchCreate from "./pages/Branches/BranchCreate";
import BranchEdit from "./pages/Branches/BranchEdit";
import ProductDetail from "./pages/ProductDetail";
import AttendancePage from "./pages/admin/AttendancePage";
import DashboardPage from "./pages/admin/DashboardPage";
import BrandPage from "./pages/brands/BrandPage";
import BrandCreate from "./pages/brands/BrandCreate";
import BrandEdit from "./pages/brands/BrandEdit";
import ContactPage from "./pages/ContactPage";
import StoreInfoPage from "./pages/StoreInfoPage";
import BannerPage from "./pages/BannerPage";
import ConversationPage from "./pages/ConversationPage";
import BannerCreate from "./pages/BannerCreate";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* ADMIN */}
        <Route
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          {/* BRANCH */}
          <Route path="/admin/branches" element={<BranchPage />} />
          <Route path="/admin/branches/create" element={<BranchCreate />} />
          <Route path="/admin/branches/:id/edit" element={<BranchEdit />} />
          {/* CATEGORY */}
          <Route path="categories" element={<CategoryPage />} />
          <Route path="categories/create" element={<CategoryCreate />} />
          <Route path="categories/:id/edit" element={<CategoryEdit />} />

          <Route path="/admin/brands" element={<BrandPage />} />
          <Route path="/admin/brands/create" element={<BrandCreate />} />
          <Route path="/admin/brands/:id/edit" element={<BrandEdit />} />

          {/* PRODUCT */}
          <Route path="products" element={<ProductPage />} />
          <Route path="products/create" element={<ProductCreate />} />
          <Route path="products/:id/edit" element={<ProductEdit />} />
          <Route
            path="/products/:id"
            element={<ProductDetail />}
          />

          {/* ORDER */}
          <Route path="orders" element={<OrderPage />} />
          <Route path="orders/:id" element={<OrderDetail />} />

          {/* INVENTORY */}
          <Route path="inventories">
            <Route index element={<InventoryPage />} />
            <Route path="create" element={<InventoryCreate />} />
            <Route path="print" element={<InventoryPrint />} />
            <Route path=":id" element={<InventoryDetail />} />
          </Route>

          <Route path="reports" element={<ReportPage />} />
          <Route path="reports/:id" element={<ReportDetail />} />
          <Route path="reports/print" element={<ReportPrint />} />

          <Route path="user" element={<CustomerPage />} />
          <Route path="user/:id" element={<CustomerDetail />} />
          <Route path="user/:id/edit" element={<CustomerEdit />} />

          <Route
            path="/admin/conversations"
            element={<ConversationPage />}
          />

          {/* CONTACT */}
          <Route
            path="/admin/contacts"
            element={<ContactPage />}
          />
          <Route
            path="/admin/store-info"
            element={<StoreInfoPage />}
          />
          <Route path="/admin/banners" element={<BannerPage />} />
          <Route path="/admin/banners/create"element={<BannerCreate />}/>
          
          

          <Route path="/admin/employees" element={<EmployeePage />} />
          <Route path="/admin/employees/create" element={<EmployeeCreate />} />
          <Route path="/admin/employees/:id/edit" element={<EmployeeEdit />} />
          <Route path="/admin/attendance" element={<AttendancePage />} />

          <Route path="/admin/payroll/:employeeId" element={<PayrollPage />} />
          <Route
            path="/admin/dashboard"
            element={<DashboardPage />}
          />


        </Route>
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

    </BrowserRouter>
  );
}

export default App;
