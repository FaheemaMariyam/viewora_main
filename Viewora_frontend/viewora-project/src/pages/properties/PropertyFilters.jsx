
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
    <div className="bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-2 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
        
        {/* Search */}
        <div className="md:col-span-4 relative group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
          <input
            placeholder="Search neighborhood or project"
            className="w-full bg-gray-50/50 border-none pl-12 pr-4 py-3.5 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none placeholder:text-gray-300"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        {/* City */}
        <div className="md:col-span-2 relative group border-l border-gray-100 md:pl-2">
          <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
          <input
            placeholder="City"
            className="w-full bg-transparent border-none pl-12 pr-4 py-3.5 rounded-xl text-sm font-medium focus:ring-0 outline-none placeholder:text-gray-300"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          />
        </div>

        {/* Property Type */}
        <div className="md:col-span-2 relative group border-l border-gray-100 md:pl-2">
          <Home size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
          <select
            className="w-full bg-transparent border-none pl-12 pr-4 py-3.5 rounded-xl text-sm font-medium focus:ring-0 outline-none appearance-none cursor-pointer"
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
        <div className="md:col-span-3 flex items-center border-l border-gray-100 md:pl-2 gap-1">
          <div className="relative flex-1 group">
            <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-primary transition-colors" />
            <input
              type="number"
              placeholder="Min"
              className="w-full bg-transparent border-none pl-11 pr-2 py-3.5 rounded-xl text-sm font-medium focus:ring-0 outline-none placeholder:text-gray-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={filters.min_price}
              onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
            />
          </div>
          <span className="text-gray-200">|</span>
          <div className="relative flex-1 group">
            <input
              type="number"
              placeholder="Max"
              className="w-full bg-transparent border-none px-4 py-3.5 rounded-xl text-sm font-medium focus:ring-0 outline-none placeholder:text-gray-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={filters.max_price}
              onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="md:col-span-1 flex items-center justify-end pr-2 gap-2">
           {hasFilters && (
             <button
               onClick={clearFilters}
               className="p-3 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
               title="Clear Filters"
             >
               <X size={18} />
             </button>
           )}
           <button
             onClick={onApply}
             className="bg-[#1A1A1A] text-white p-3 rounded-xl hover:bg-black hover:shadow-lg transition-all active:scale-95 shadow-black/5"
           >
             <Search size={18} />
           </button>
        </div>
      </div>
    </div>
  );
}
