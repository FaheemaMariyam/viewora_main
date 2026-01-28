import { useEffect, useState } from "react";
import { fetchAdminProperties, togglePropertyStatus } from "../../api/authApi";
import AdminLayout from "../../components/admin/AdminLayout";
import { toast } from "react-toastify";
import useDebounce from "../../hooks/useDebounce";
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  Search, 
  Eye, 
  EyeOff, 
  LayoutGrid, 
  User 
} from "lucide-react";

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [loading, setLoading] = useState(true);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminProperties({ search: debouncedSearch });
      setProperties(res.data);
    } catch (err) {
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [debouncedSearch]);

  const handleToggleStatus = async (prop) => {
    try {
      await togglePropertyStatus(prop.id);
      toast.success(`Listing status updated`);
      loadProperties();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-primary/10 rounded-xl">
              <Building2 className="text-brand-primary" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Inventory Management</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Active Listings Control</p>
            </div>
          </div>
          <div className="relative group w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-all" size={18} />
            <input 
              type="text"
              placeholder="Search by title, city or seller..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm shadow-sm focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/20 transition-all outline-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Seller</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-gray-50 overflow-hidden border border-gray-100 flex-shrink-0 relative group/img">
                          {p.cover_image ? (
                            <img src={p.cover_image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                              <Building2 className="text-gray-200" size={24} />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900 line-clamp-1">{p.title}</span>
                          <span className="text-[10px] text-brand-primary font-black uppercase tracking-tight flex items-center gap-1">
                            <LayoutGrid size={10} />
                            {p.property_type}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 font-bold italic">
                        <User size={14} className="text-gray-400" />
                        {p.seller_username}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                        <MapPin size={12} className="text-gray-400" />
                        {p.locality}, {p.city}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-gray-900 text-sm">
                      <div className="flex items-center gap-0.5">
                        <IndianRupee size={12} className="text-gray-400" />
                        {p.price.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {p.is_active ? (
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-green-600 bg-green-50 px-2 py-1 rounded-md w-fit">
                          <Eye size={12} />
                          Live
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-red-500 bg-red-50 px-2 py-1 rounded-md w-fit">
                          <EyeOff size={12} />
                          Blocked
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleToggleStatus(p)}
                        className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border-2 transition-all shadow-sm ${
                          p.is_active 
                          ? 'border-red-50 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600'
                          : 'border-green-50 text-green-600 hover:bg-green-600 hover:text-white hover:border-green-600'
                        }`}
                      >
                        {p.is_active ? 'Block Listing' : 'Make Active'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {properties.length === 0 && !loading && (
              <div className="p-12 text-center text-gray-400 italic">No listings found.</div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
