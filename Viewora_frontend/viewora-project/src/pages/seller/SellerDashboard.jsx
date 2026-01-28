import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProperties, toggleArchiveProperty } from "../../api/sellerApi";
import SellerPropertyCard from "./SellerPropertycard";
import {
  User,
  Plus,
  Search,
  LayoutGrid,
  TrendingUp,
  Eye,
  Home,
  Bell,
  Filter
} from "lucide-react";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadMyProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [search, statusFilter, properties]);

  const loadMyProperties = async () => {
    try {
      const res = await getMyProperties();
      setProperties(res.data);
      setFilteredProperties(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    let temp = [...properties];

    if (search) {
      const lowerSearch = search.toLowerCase();
      temp = temp.filter(
        (p) =>
          p.title.toLowerCase().includes(lowerSearch) ||
          p.city.toLowerCase().includes(lowerSearch)
      );
    }

    if (statusFilter !== "all") {
      temp = temp.filter((p) => p.status === statusFilter);
    }

    setFilteredProperties(temp);
  };

  const handleToggleArchive = async (id) => {
    try {
      const res = await toggleArchiveProperty(id);

      setProperties((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                is_active: res.data.is_active,
                status: res.data.status,
              }
            : p
        )
      );
    } catch {
      alert("Failed to update status");
    }
  };

  const enableNotifications = async () => {
    const permission = await Notification.requestPermission();
    console.log("Permission:", permission);
  };

  // --- STATS ---
  const totalProperties = properties.length;
  const activeListings = properties.filter((p) => p.is_active).length;
  const totalViews = properties.reduce(
    (acc, curr) => acc + (curr.view_count || 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Dashboard
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Welcome back. Here's what's happening with your listings.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
               onClick={enableNotifications}
               className="p-3 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-indigo-600 hover:shadow-md transition-all relative"
            >
               <Bell size={20} />
               <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              onClick={() => navigate("/seller/add-property")}
              className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold shadow-lg hover:bg-indigo-700 hover:shadow-indigo-200/50 transition-all flex items-center gap-2"
            >
              <Plus size={20} />
              Create Listing
            </button>
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={Home}
            label="Total Properties"
            value={totalProperties}
            color="bg-blue-50 text-blue-600"
          />
          <StatCard
            icon={TrendingUp}
            label="Active Listings"
            value={activeListings}
            color="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            icon={Eye}
            label="Total Views"
            value={totalViews}
            color="bg-amber-50 text-amber-600"
          />
        </div>

        {/* --- FILTERS & SEARCH --- */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
           <div className="relative flex-grow max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search properties..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all shadow-sm"
              />
           </div>
           
           <div className="flex items-center gap-2 overflow-x-auto">
              <span className="p-2 text-slate-400">
                 <Filter size={20} />
              </span>
              {["all", "published", "archived", "sold"].map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`
                       px-5 py-2.5 rounded-full text-sm font-medium capitalize transition-all border
                       ${statusFilter === status 
                         ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                         : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}
                    `}
                  >
                    {status}
                  </button>
              ))}
           </div>
        </div>

        {/* --- LISTING GRID --- */}
        {filteredProperties.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search size={32} />
             </div>
             <h3 className="text-xl font-bold text-slate-800">No properties found</h3>
             <p className="text-slate-500 mt-2">Adjust your search or filters to see results.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <SellerPropertyCard
                key={property.id}
                property={property}
                onToggle={handleToggleArchive}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 transition-transform hover:-translate-y-1 cursor-default">
       <div className={`p-4 rounded-xl ${color}`}>
          <Icon size={28} />
       </div>
       <div>
          <p className="text-slate-500 text-sm font-medium">{label}</p>
          <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
       </div>
    </div>
  );
}
