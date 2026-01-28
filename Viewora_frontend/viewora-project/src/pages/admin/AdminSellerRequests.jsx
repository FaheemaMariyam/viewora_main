import { useEffect, useState } from "react";
import { fetchPendingSellers, approveRejectUser } from "../../api/authApi";
import AdminLayout from "../../components/admin/AdminLayout";
import { toast } from "react-toastify";
import { 
  UserCheck, 
  FileText, 
  Phone, 
  Mail, 
  ExternalLink, 
  CheckCircle2, 
  XCircle,
  MapPin
} from "lucide-react";

export default function AdminSellerRequests() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSellers = async () => {
    try {
      setLoading(true);
      const res = await fetchPendingSellers();
      setSellers(res.data);
    } catch {
      toast.error("Failed to load seller requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSellers();
  }, []);

  const handleAction = async (userId, action) => {
    try {
      await approveRejectUser(userId, action);
      toast.success(`Seller ${action}ed successfully`);
      loadSellers();
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <AdminLayout title="Seller Signup Requests">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Seller Details</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Contact</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Location</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Verification Artifact</th>
              <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Approval Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((s) => (
              <tr key={s.user_id} className="hover:bg-gray-50/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                      {s.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{s.username}</p>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <Mail size={10} />
                        {s.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <Phone size={14} className="text-gray-300" />
                      {s.phone_number}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-sm text-gray-900 font-bold capitalize">
                      <MapPin size={14} className="text-brand-primary/60" />
                      {s.city}
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider ml-[20px]">
                      {s.area}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {s.ownership_proof ? (
                    <a
                      href={s.ownership_proof}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                    >
                      <FileText size={14} />
                      View Proof
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-xs text-gray-300 italic">No document provided</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleAction(s.user_id, "approve")}
                      className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all group"
                      title="Approve Seller"
                    >
                      <CheckCircle2 size={18} />
                    </button>
                    <button
                      onClick={() => handleAction(s.user_id, "reject")}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all group"
                      title="Reject Seller"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && sellers.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            No pending seller requests
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
