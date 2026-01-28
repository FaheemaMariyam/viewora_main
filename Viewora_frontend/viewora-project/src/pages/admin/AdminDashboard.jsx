import { useEffect, useState } from "react";
import { fetchAdminUsers, toggleUserStatus, fetchAdminStats } from "../../api/authApi";
import AdminLayout from "../../components/admin/AdminLayout";
import { toast } from "react-toastify";
import useDebounce from "../../hooks/useDebounce";
import { 
  Users, 
  CheckCircle, 
  Ban, 
  UserPlus, 
  Briefcase, 
  Search, 
  MoreVertical, 
  ShieldCheck, 
  ShieldAlert 
} from "lucide-react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [loading, setLoading] = useState(true);

  // ─────────────────────────────
  // Load users (approved only)
  // ─────────────────────────────
  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminUsers({ search: debouncedSearch });
      setUsers(res.data);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────
  // Load dashboard stats
  // ─────────────────────────────
  const loadStats = async () => {
    try {
      const res = await fetchAdminStats();
      setStats(res.data);
    } catch {
      toast.error("Failed to load dashboard stats");
    }
  };

  // ✅ Hooks must be inside component
  useEffect(() => {
    loadUsers();
  }, [debouncedSearch]);

  useEffect(() => {
    loadStats();
  }, []);

  const handleToggleStatus = async (user) => {
    try {
      const res = await toggleUserStatus(user.id);
      toast.success(
        `${user.username} is now ${
          res.data.is_active ? "Active" : "Blocked"
        }`
      );
      loadUsers();
      loadStats();
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
          <StatCard
            title="Total Users"
            value={stats?.users?.total ?? 0}
            icon={<Users size={24} />}
            color="blue"
          />
          <StatCard
            title="Active"
            value={stats?.users?.active ?? 0}
            icon={<CheckCircle size={24} />}
            color="green"
          />
          <StatCard
            title="Blocked"
            value={stats?.users?.blocked ?? 0}
            icon={<Ban size={24} />}
            color="red"
          />
          <StatCard
            title="Pending Sellers"
            value={stats?.pending?.sellers ?? 0}
            icon={<UserPlus size={24} />}
            color="orange"
          />
          <StatCard
            title="Pending Brokers"
            value={stats?.pending?.brokers ?? 0}
            icon={<Briefcase size={24} />}
            color="purple"
          />
        </div>

        {/* User Directory */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="text-brand-primary" size={20} />
              User Directory
            </h3>

            <div className="relative group w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search by name, email or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-primary/20 focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{u.username}</span>
                        <span className="text-xs text-gray-400">{u.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tight ${
                        u.role === 'admin' ? 'bg-indigo-50 text-indigo-600' :
                        u.role === 'broker' ? 'bg-purple-50 text-purple-600' :
                        'bg-orange-50 text-orange-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {u.is_active ? (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Active
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-red-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            Blocked
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg border transition-all ${
                          u.is_active 
                          ? 'border-red-100 text-red-600 hover:bg-red-50' 
                          : 'border-green-100 text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {u.is_active ? "Block User" : "Unblock"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!loading && users.length === 0 && (
              <div className="p-12 text-center text-gray-400">
                No users found
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border flex items-center space-x-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${colors[color]}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase">
          {title}
        </p>
        <p className="text-2xl font-black">{value}</p>
      </div>
    </div>
  );
}
