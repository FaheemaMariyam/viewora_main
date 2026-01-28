import { useEffect, useState } from "react";
import { fetchAdminStats } from "../../api/authApi";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { 
  TrendingUp, 
  BarChart3, 
  Trophy, 
  Eye, 
  Heart, 
  Map, 
  Users 
} from "lucide-react";

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetchAdminStats();
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading || !stats) {
    return <AdminLayout>Computing platform metrics...</AdminLayout>;
  }

  // ✅ TOP VIEWED
  const topViewedData = stats.top_viewed.map((v) => ({
    name: v.title.substring(0, 15) + "...",
    views: v.view_count,
  }));

  // ✅ MOST INTERESTED
  const mostInterestedData = stats.most_interested.map((i) => ({
    name: i.title.substring(0, 15) + "...",
    interests: i.interest_count,
  }));

  // ✅ TOP BROKERS
  const topBrokersData = stats.top_brokers.map((b) => ({
    username: b.username,
    deals: b.deals,
  }));

  // ✅ USER STATUS COMPOSITION
  const userData = [
    { name: "Active Users", value: stats.users.active },
    { name: "Blocked Users", value: stats.users.blocked },
    {
      name: "Pending Approvals",
      value: stats.pending.sellers + stats.pending.brokers,
    },
  ];

  // ✅ PROPERTY DISTRIBUTION (DYNAMIC)
  const propertyLabels = {
    house: "Houses",
    plot: "Plots",
    flat: "Flats",
    commercial: "Commercial",
  };

  const propertyData = Object.entries(stats.properties)
    .filter(([key]) => key !== "total" && propertyLabels[key])
    .map(([key, value]) => ({
      name: propertyLabels[key],
      count: value,
    }));

  // ✅ CITY DATA
  const cityData = stats.city_stats.map((c) => ({
    city: c.city,
    listings: c.count,
  }));

  const COLORS = ["#3B82F6", "#EF4444", "#F59E0B", "#10B981", "#8B5CF6", "#EC4899"];

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in zoom-in duration-500 pb-12">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-primary/10 rounded-2xl">
            <TrendingUp className="text-brand-primary" size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              Platform Performance Insights
            </h2>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Growth & Engagement Metrics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Status Distribution */}
          <ChartCard title="User Account Status" icon={<Users className="text-blue-500" />}>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {userData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Inventory Distribution */}
          <ChartCard title="Inventory By Category" icon={<BarChart3 className="text-red-500" />}>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={propertyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip 
                     contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                     cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#3B82F6"
                    radius={[10, 10, 0, 0]}
                    barSize={45}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Top Viewed Properties */}
          <ChartCard title="Top Viewed Listings" icon={<Eye className="text-purple-500" />}>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={topViewedData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="views" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorViews)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Most Interested Properties */}
          <ChartCard title="Leaderboard: Interest Counts" icon={<Heart className="text-pink-500" />}>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mostInterestedData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                  <Tooltip />
                  <Bar dataKey="interests" fill="#EC4899" radius={[0, 10, 10, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Top Brokers */}
          <ChartCard title="Broker Performance (Closed Deals)" icon={<Trophy className="text-yellow-500" />}>
            <div className="h-80 w-full text-center">
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topBrokersData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="username" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="deals" fill="#F59E0B" radius={[10, 10, 0, 0]} barSize={50} />
                </BarChart>
               </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* City Demand */}
          <ChartCard title="Geographic Distribution" icon={<Map className="text-emerald-500" />}>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={cityData}
                  layout="vertical"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="city"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#1e293b",
                      fontWeight: "bold",
                      fontSize: 12,
                    }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="listings"
                    fill="#10B981"
                    radius={[0, 10, 10, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>
    </AdminLayout>
  );
}

function ChartCard({ title, icon, children }) {
  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500">
      <div className="flex items-center gap-2 mb-8">
        <div className="p-2 bg-gray-50 rounded-lg">
          {icon}
        </div>
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}
