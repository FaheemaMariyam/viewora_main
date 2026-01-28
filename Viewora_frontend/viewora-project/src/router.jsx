
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Home from "./pages/home";
import ProtectedRoute from "./auth/ProtectedRoute";
import PendingApproval from "./pages/pendingApproval";
import PropertyList from "./pages/properties/PropertyList";
import PropertyDetail from "./pages/properties/PropertyDetails";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import BrokerDashboard from "./pages/broker/BrokerDashboard";
import RoleBasedRoute from "./auth/RoleBasedRoute";
import Chats from "./pages/chat/Chats";
import SellerDashboard from "./pages/seller/SellerDashboard";
import AddProperty from "./pages/seller/AddProperty";
import SellerPropertyDetails from "./pages/seller/SellerPropertyDetails";
import EditProperty from "./pages/seller/EditProperty";
import Notifications from "./pages/Notifications";
import BrokerOTP from "./pages/broker/BrokerOTP";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminOTP from "./pages/admin/AdminOtp";
import AdminRoute from "./auth/AdminRoute";
import AIChatPage from "./pages/ai/AIChatPage";
import AdminSellerRequests from "./pages/admin/AdminSellerRequests";
import AdminBrokerRequests from "./pages/admin/AdminBrokerRequests";
const Router = () => (
  <Routes>
    <Route path="/" element={<Home />} />

    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />

    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />

    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />

    <Route
      path="/change-password"
      element={
        <ProtectedRoute>
          <ChangePassword />
        </ProtectedRoute>
      }
    />

    <Route path="/pending-approval" element={<PendingApproval />} />
    <Route path="/properties" element={<PropertyList />} />
    <Route path="/properties/:id" element={<PropertyDetail />} />
    <Route
      path="/ai-advisor"
      element={
        <RoleBasedRoute role="client">
          <AIChatPage />
        </RoleBasedRoute>
      }
    />
  <Route
  path="/broker"
  element={
    <RoleBasedRoute role="broker">
      <BrokerDashboard />
    </RoleBasedRoute>
  }
/>
<Route
  path="/chats"
  element={
    <ProtectedRoute>
      <Chats />
    </ProtectedRoute>
  }
/>
<Route
  path="/seller"
  element={
    <RoleBasedRoute role="seller">
      <SellerDashboard />
    </RoleBasedRoute>
  }
/>
<Route
  path="/seller/add-property"
  element={
    <RoleBasedRoute role="seller">
      <AddProperty />
    </RoleBasedRoute>
  }
/>
<Route
  path="/seller/properties/:id"
  element={
    <RoleBasedRoute role="seller">
      <SellerPropertyDetails />
    </RoleBasedRoute>
  }
/>
<Route
  path="/seller/edit-property/:id"
  element={
    <RoleBasedRoute role="seller">
      <EditProperty />
    </RoleBasedRoute>
  }
/>
<Route
  path="/notifications"
  element={
    <ProtectedRoute>
      <Notifications />
    </ProtectedRoute>
  }
/>
<Route path="/broker-otp" element={<BrokerOTP />} />
<Route path="/admin/otp" element={<AdminOTP />} />

<Route
  path="/admin/dashboard"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>
<Route
  path="/admin/properties"
  element={
    <AdminRoute>
      <AdminProperties />
    </AdminRoute>
  }
/>
<Route
  path="/admin/analytics"
  element={
    <AdminRoute>
      <AdminAnalytics />
    </AdminRoute>
  }
/>
<Route
  path="/admin/requests/sellers"
  element={
    <AdminRoute>
      <AdminSellerRequests />
    </AdminRoute>
  }
/>

<Route
  path="/admin/requests/brokers"
  element={
    <AdminRoute>
      <AdminBrokerRequests />
    </AdminRoute>
  }
/>

  </Routes>
);

export default Router;
