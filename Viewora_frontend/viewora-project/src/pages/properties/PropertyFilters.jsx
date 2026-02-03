
import { Search, MapPin, Home, IndianRupee, X } from "lucide-react";

export default function PropertyFilters({
  filters,
  setFilters,
  onApply,
}) {
  const clearFilters = () => {
    setFilters({
      search: "",
      city: "",
      property_type: "",
      min_price: "",
      max_price: "",
    });
  };

  const hasFilters = Object.values(filters).some(v => v !== "");

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white p-3 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        
        {/* Search */}
        <div className="md:col-span-4 relative group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-950 transition-colors" />
          <input
            placeholder="Search neighborhood or project"
            className="w-full bg-white border border-slate-100 pl-12 pr-4 py-3.5 rounded-2xl text-[15px] font-medium text-slate-950 focus:ring-4 focus:ring-slate-100/50 focus:border-slate-950 transition-all outline-none placeholder:text-slate-300 shadow-sm"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        {/* City */}
        <div className="md:col-span-2 relative group md:border-l border-slate-100 md:pl-3">
          <MapPin size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-950 transition-colors" />
          <input
            placeholder="City"
            className="w-full bg-transparent border-none pl-14 pr-4 py-3.5 rounded-xl text-[15px] font-medium text-slate-950 focus:ring-0 outline-none placeholder:text-slate-300"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          />
        </div>

        {/* Property Type */}
        <div className="md:col-span-2 relative group md:border-l border-slate-100 md:pl-3">
          <Home size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-950 transition-colors" />
          <select
            className="w-full bg-transparent border-none pl-14 pr-4 py-3.5 rounded-xl text-[15px] font-medium text-slate-950 focus:ring-0 outline-none appearance-none cursor-pointer"
            value={filters.property_type}
            onChange={(e) => setFilters({ ...filters, property_type: e.target.value })}
          >
            <option value="">Any Type</option>
            <option value="plot">Plot</option>
            <option value="house">House</option>
            <option value="flat">Flat</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="md:col-span-3 flex items-center md:border-l border-slate-100 md:pl-3 gap-1">
          <div className="relative flex-1 group">
            <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-950 transition-colors" />
            <input
              type="number"
              placeholder="Min"
              className="w-full bg-transparent border-none pl-11 pr-2 py-3.5 rounded-xl text-[15px] font-medium text-slate-950 focus:ring-0 outline-none placeholder:text-slate-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={filters.min_price}
              onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
            />
          </div>
          <span className="text-slate-200">|</span>
          <div className="relative flex-1 group">
            <input
              type="number"
              placeholder="Max"
              className="w-full bg-transparent border-none px-4 py-3.5 rounded-xl text-[15px] font-medium text-slate-950 focus:ring-0 outline-none placeholder:text-slate-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={filters.max_price}
              onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="md:col-span-1 flex items-center justify-end pr-1 gap-2">
           {hasFilters && (
             <button
               onClick={clearFilters}
               className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
               title="Clear Filters"
             >
               <X size={20} />
             </button>
           )}
           <button
             onClick={onApply}
             className="bg-slate-950 text-white p-3.5 rounded-2xl hover:bg-black hover:shadow-xl hover:shadow-slate-200 transition-all active:scale-95 flex items-center justify-center"
           >
             <Search size={20} />
           </button>
        </div>
      </div>
    </div>
  );
}
