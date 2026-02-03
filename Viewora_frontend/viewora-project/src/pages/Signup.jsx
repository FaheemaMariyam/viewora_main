
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup, sendEmailOtp, verifyEmailOtp } from "../api/authApi";
import {
  isValidPhone,
  isValidEmail,
  isStrongPassword,
} from "../utils/validators";
import { toast } from "react-toastify";
import { ArrowRight, User, Mail, Lock, Phone, MapPin, Building2, Briefcase, FileCheck, Upload } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("client");

  // Seller / Broker extra fields
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [ownershipProof, setOwnershipProof] = useState(null);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [certificate, setCertificate] = useState(null);

  // Email Verification State
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showEmailOtpInput, setShowEmailOtpInput] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSendEmailOtp = async () => {
    const email = document.getElementsByName("email")[0].value;
    if (!isValidEmail(email)) {
      setError("Please enter a valid email first");
      return;
    }
    setError("");
    setIsSendingOtp(true);
    try {
      await sendEmailOtp(email);
      toast.success("OTP sent to your email!");
      setShowEmailOtpInput(true);
    } catch (err) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    const email = document.getElementsByName("email")[0].value;
    if (!emailOtp) {
      setError("Please enter the OTP");
      return;
    }
    setError("");
    setIsVerifyingOtp(true);
    try {
      await verifyEmailOtp(email, emailOtp);
      toast.success("Email verified successfully!");
      setIsEmailVerified(true);
      setShowEmailOtpInput(false);
    } catch (err) {
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }


  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const phone = e.target.phone.value;

    if (!isValidEmail(email)) {
      setError("Enter a valid email address");
      return;
    }

    if (!isStrongPassword(password)) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (role === "seller" || role === "broker") {
      if (!city) {
        setError("City is required");
        return;
      }
      if (!area) {
        setError("Area is required");
        return;
      }
    }

    if (role === "seller" && !ownershipProof) {
      setError("Ownership document is required");
      return;
    }

    if (role === "broker") {
      if (!licenseNumber) {
        setError("License number is required");
        return;
      }
      if (!certificate) {
        setError("Broker certificate is required");
        return;
      }
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    formData.append("phone_number", phone);

    if (role === "seller" || role === "broker") {
      formData.append("city", city);
      formData.append("area", area);
    }

    if (role === "seller") {
      formData.append("ownership_proof", ownershipProof);
    }

    if (role === "broker") {
      formData.append("license_number", licenseNumber);
      formData.append("certificate", certificate);
    }

    try {
      await signup(formData);
      toast.success("Registration successful!");
      navigate(role === "client" ? "/login" : "/pending-approval");
    } catch (err) {
      const msg = err.response?.data
        ? "Registration failed. Please check your details."
        : "Signup failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const roleConfigs = {
    client: { icon: User, label: "Client" },
    seller: { icon: Building2, label: "Seller" },
    broker: { icon: Briefcase, label: "Broker" },
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center bg-[#F8FAFC] py-16 px-4 font-sans overflow-x-hidden">
      
      {/* ================= STUDIO LIGHT BACKGROUND ================= */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[50%] h-[50%] bg-blue-100/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-[0%] left-[-10%] w-[60%] h-[60%] bg-slate-200/30 blur-[150px] rounded-full" />
        <div className="absolute top-[30%] left-[10%] w-[30%] h-[30%] bg-indigo-50/50 blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 font-display mb-2">Join Viewora</h1>
          <p className="text-[17px] text-slate-500 font-medium">Select your role and create your professional account</p>
        </div>

        {/* ================= WHITE GLASS SIGNUP CARD ================= */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-8 sm:p-12 border border-white shadow-[0_45px_100px_-20px_rgba(0,0,0,0.06)]">
          
          {/* Enhanced Role Selection */}
          <div className="flex bg-slate-100/50 p-1.5 rounded-[1.5rem] border border-slate-100 mb-10">
            {Object.entries(roleConfigs).map(([key, config]) => (
              <button
                key={key}
                type="button"
                onClick={() => setRole(key)}
                className={`
                  flex-1 py-3 px-2 rounded-[1.25rem] flex flex-col items-center gap-1.5 transition-all duration-300
                  ${role === key 
                    ? "bg-white text-slate-950 shadow-md shadow-slate-200/50 ring-1 ring-slate-100" 
                    : "text-slate-400 hover:text-slate-600"}
                `}
              >
                <config.icon size={18} className={role === key ? "text-slate-950" : "text-slate-300"} />
                <span className="text-[11px] font-bold uppercase tracking-widest leading-none">{config.label}</span>
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-8 p-4 text-[13px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-2xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[13px] font-bold text-slate-400 ml-1">Username</label>
                <div className="relative group">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-950 transition-colors" />
                  <input
                    name="username"
                    placeholder="Enter username"
                    required
                    className="w-full bg-white border border-slate-100 pl-11 pr-4 py-3.5 rounded-2xl focus:ring-4 focus:ring-slate-100 focus:border-slate-900 outline-none transition-all text-[15px] font-medium text-slate-950 placeholder:text-slate-300 shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] font-bold text-slate-400 ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-950 transition-colors" />
                  <input
                    name="phone"
                    placeholder="+91 0000 000000"
                    required
                    className="w-full bg-white border border-slate-100 pl-11 pr-4 py-3.5 rounded-2xl focus:ring-4 focus:ring-slate-100 focus:border-slate-900 outline-none transition-all text-[15px] font-medium text-slate-950 placeholder:text-slate-300 shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-[13px] font-bold text-slate-400 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-950 transition-colors" />
                  <input
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    disabled={isEmailVerified}
                    onChange={(e) => {
                      if (isEmailVerified) setIsEmailVerified(false);
                    }}
                    className={`w-full bg-white border border-slate-100 pl-11 pr-32 py-3.5 rounded-2xl focus:ring-4 focus:ring-slate-100 focus:border-slate-900 outline-none transition-all text-[15px] font-medium text-slate-950 placeholder:text-slate-300 shadow-sm ${isEmailVerified ? "opacity-75 cursor-not-allowed" : ""}`}
                  />
                  
                  {role === "broker" && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      {isEmailVerified ? (
                        <span className="px-3 py-1.5 bg-green-50 text-green-700 text-[11px] font-bold uppercase tracking-wider rounded-xl flex items-center gap-1">
                          Verified
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendEmailOtp}
                          disabled={isSendingOtp}
                          className="px-3 py-1.5 bg-slate-950 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-black disabled:opacity-50 transition-colors"
                        >
                          {isSendingOtp ? "Sending..." : "Verify"}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* OTP Input for Broker */}
                {showEmailOtpInput && !isEmailVerified && (
                   <div className="animate-in slide-in-from-top-2 duration-300 mt-2 flex gap-2">
                     <input 
                       value={emailOtp}
                       onChange={(e) => setEmailOtp(e.target.value)}
                       placeholder="Enter 6-digit OTP"
                       className="flex-1 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-semibold focus:outline-none focus:border-slate-900"
                     />
                     <button
                       type="button"
                       onClick={handleVerifyEmailOtp}
                       disabled={isVerifyingOtp}
                       className="px-4 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black disabled:opacity-50"
                     >
                       {isVerifyingOtp ? "Checking..." : "Confirm"}
                     </button>
                   </div>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-[13px] font-bold text-slate-400 ml-1">Password</label>
                <div className="relative group">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-950 transition-colors" />
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="w-full bg-white border border-slate-100 pl-11 pr-4 py-3.5 rounded-2xl focus:ring-4 focus:ring-slate-100 focus:border-slate-900 outline-none transition-all text-[15px] font-medium text-slate-950 placeholder:text-slate-300 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Premium Role Extra Fields */}
            {(role === "seller" || role === "broker") && (
              <div className="pt-8 border-t border-slate-100 space-y-6 animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-3 ml-1 mb-2">
                   <div className="w-1 h-3 bg-slate-400 rounded-full"></div>
                   <span className="text-[12px] font-bold uppercase tracking-[0.25em] text-slate-950">Professional Credentials</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white border border-slate-100 pl-11 pr-4 py-3.5 rounded-2xl focus:border-slate-900 outline-none transition-all text-[15px] font-medium text-slate-950 placeholder:text-slate-300 shadow-sm"
                    />
                  </div>
                  <div className="relative group">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      placeholder="Area"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full bg-white border border-slate-100 pl-11 pr-4 py-3.5 rounded-2xl focus:border-slate-900 outline-none transition-all text-[15px] font-medium text-slate-950 placeholder:text-slate-300 shadow-sm"
                    />
                  </div>
                </div>

                {role === "broker" && (
                  <div className="relative group">
                    <FileCheck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      placeholder="License Number"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      className="w-full bg-white border border-slate-100 pl-11 pr-4 py-3.5 rounded-2xl focus:border-slate-900 outline-none transition-all text-[15px] font-medium text-slate-950 placeholder:text-slate-300 shadow-sm"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <label className="block text-[13px] font-bold text-slate-400 ml-1">
                    {role === "seller" ? "Proof of Ownership" : "Broker Certificate"}
                  </label>
                  <div className="relative group/file">
                    <div className="w-full border-2 border-dashed border-slate-100 rounded-[1.5rem] p-6 bg-slate-50/50 group-hover/file:bg-white group-hover/file:border-slate-200 transition-all flex flex-col items-center gap-2">
                       <Upload size={20} className="text-slate-300 group-hover/file:text-slate-600 transition-colors" />
                       <span className="text-[12px] font-bold text-slate-400 group-hover/file:text-slate-950 text-center max-w-[200px] truncate">
                         {(role === "seller" ? ownershipProof?.name : certificate?.name) || "Select Document (PDF/Image)"}
                       </span>
                    </div>
                    <input
                      type="file"
                      onChange={(e) => role === "seller" ? setOwnershipProof(e.target.files[0]) : setCertificate(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-950 text-white py-4 rounded-2xl text-[17px] font-bold shadow-xl shadow-slate-200 hover:bg-black hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 group mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Register as {role.charAt(0).toUpperCase() + role.slice(1)}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-10 text-center text-[15px] font-medium text-slate-500">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-slate-950 font-bold hover:underline hover:underline-offset-4 decoration-slate-300 transition-all"
          >
            Sign In
          </button>
        </p>

        {/* Footer Info */}
        <div className="mt-12 text-center opacity-30 select-none flex items-center justify-center gap-2 text-[11px] font-medium tracking-widest text-slate-400">
           <span>Professional Identity Verified Platform</span>
        </div>
      </div>
    </div>
  );
}
