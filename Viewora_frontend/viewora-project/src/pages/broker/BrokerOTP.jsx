
import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../auth/AuthContext";

export default function BrokerOTP() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const verifyOtp = async () => {
    try {
      await axiosInstance.post("/api/auth/broker/verify-otp/", {
        username: state.username,
        otp,
      });

      await loginUser();
      navigate("/broker");
    } catch {
      setError("Invalid or expired OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-page px-4">
      {/* Card */}
      <div
        className="
          w-full max-w-sm
          bg-white
          border border-gray-200
          rounded-lg
          shadow-lg
          p-8
        "
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-brand-primary">
            Broker Verification
          </h2>
          <p className="text-sm text-text-muted mt-2">
            Enter the OTP sent to your email to verify your account.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="
              mb-6 text-sm text-red-600 bg-red-50
              border border-red-100 px-4 py-2
              rounded text-center
            "
          >
            {error}
          </div>
        )}

        {/* OTP Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-main mb-1">
            One-Time Password
          </label>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            className="
              w-full text-center tracking-widest text-lg
              px-4 py-3 rounded-md
              bg-white border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-brand-accent
              transition-all shadow-sm
            "
          />
        </div>

        {/* Button */}
        <button
          onClick={verifyOtp}
          className="
            w-full py-2.5 rounded-md
            bg-brand-primary text-white font-semibold
            hover:bg-brand-secondary
            transition shadow-sm
          "
        >
          Verify & Continue
        </button>

        {/* Footer */}
        <p className="mt-6 text-xs text-center text-text-muted">
          Didn’t receive the code? Check your spam folder.
        </p>
      </div>
    </div>
  );
}
