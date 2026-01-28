
import { useEffect, useState } from "react";
import { fetchPendingBrokers, approveRejectUser } from "../../api/authApi";
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
  MapPin,
  Award
} from "lucide-react";

export default function AdminBrokerRequests() {
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBrokers = async () => {
    try {
      setLoading(true);
      const res = await fetchPendingBrokers();
      setBrokers(res.data);
    } catch {
      toast.error("Failed to load broker requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrokers();
  }, []);

  const handleAction = async (userId, action) => {
    try {
      await approveRejectUser(userId, action);
      toast.success(`Broker ${action}ed successfully`);
      loadBrokers();
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <AdminLayout title="Broker Signup Requests">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <th className="px-6 py-4">Broker details</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Broker Credentials</th>
              <th className="px-6 py-4 text-right">Approval Actions</th>
            </tr>
          </thead>
          <tbody>
            {brokers.map((b) => (
              <tr key={b.user_id} className="hover:bg-gray-50/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                      {b.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{b.username}</p>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <Mail size={10} />
                        {b.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <Phone size={14} className="text-gray-300" />
                    {b.phone_number}
                  </div>
                </td>
                <td className="px-6 py-4">
                   <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-sm text-gray-900 font-bold capitalize">
                      <MapPin size={14} className="text-brand-primary/60" />
                      {b.city}
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider ml-[20px]">
                      {b.area}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-gray-100 w-fit px-2 py-1 rounded">
                      <Award size={12} className="text-brand-primary" />
                      ID: {b.license_number}
                    </div>
                    {b.certificate ? (
                      <a
                        href={b.certificate}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors w-fit"
                      >
                        <FileText size={14} />
                        Certificate
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-xs text-gray-300 italic">No certificate</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleAction(b.user_id, "approve")}
                      className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all group"
                      title="Approve Broker"
                    >
                      <CheckCircle2 size={18} />
                    </button>
                    <button
                      onClick={() => handleAction(b.user_id, "reject")}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all group"
                      title="Reject Broker"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && brokers.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            No pending broker requests
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
