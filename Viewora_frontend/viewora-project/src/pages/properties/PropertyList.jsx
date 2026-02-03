
import { useEffect, useState } from "react";
import { fetchProperties } from "../../api/propertyApi";
import PropertyCard from "./PropertyCard";
import PropertyFilters from "./PropertyFilters";
import Pagination from "../../components/Pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";

export default function PropertyList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [properties, setProperties] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    city: searchParams.get("city") || "",
    property_type: searchParams.get("property_type") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
  });

  const debouncedSearch = useDebounce(filters.search, 500);
  const page = Number(searchParams.get("page") || 1);

  const load = async (override = {}) => {
    setLoading(true);

    const params = {
      ...filters,
      ...override,
      search: debouncedSearch,
      page,
      ordering: searchParams.get("ordering") || "-created_at",
    };

    Object.keys(params).forEach(
      (k) => params[k] === "" && delete params[k]
    );

    const res = await fetchProperties(params);
    setProperties(res.data.results);
    setCount(res.data.count);
    setLoading(false);
  };

 
useEffect(() => {
  //  Do nothing if search is empty
  if (!debouncedSearch) return;

  setSearchParams((prev) => {
    const next = Object.fromEntries(prev);
    next.search = debouncedSearch;
    next.page = 1;
    return next;
  });
}, [debouncedSearch]);


  /*  LOAD ON PARAM CHANGE */
  useEffect(() => {
    load();
  }, [searchParams]);

  const applyFilters = () => {
    setSearchParams({
      ...filters,
      search: debouncedSearch,
      page: 1,
    });
  };

  return (
    <div className="min-h-screen relative pt-12 pb-24 px-4 bg-[#F8FAFC] font-sans selection:bg-slate-200 overflow-x-hidden">
      
      {/* ================= STUDIO LIGHT BACKGROUND ================= */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[50%] h-[50%] bg-blue-100/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-10%] w-[60%] h-[60%] bg-slate-200/20 blur-[150px] rounded-full" />
        <div className="absolute top-[30%] left-[10%] w-[30%] h-[30%] bg-indigo-50/40 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header - Centered & Premium */}
        <div className="text-center mb-16 space-y-3 animate-in fade-in slide-in-from-top-4 duration-1000">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-950 font-display">
            Discover Premium Assets
          </h1>
          <p className="text-[17px] text-slate-500 font-medium">
            Browse our exclusive collection of verified properties
          </p>
          <div className="w-12 h-1 bg-slate-950/10 mx-auto rounded-full mt-6" />
        </div>

        {/* Filters - High Z-index for select dropdowns */}
        <div className="relative z-30 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <PropertyFilters
            filters={filters}
            setFilters={setFilters}
            onApply={applyFilters}
          />
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6 animate-in fade-in duration-500">
             <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-950 rounded-full animate-spin" />
             <p className="text-[13px] font-bold uppercase tracking-widest text-slate-400">Searching global assets...</p>
          </div>
        ) : (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.length > 0 ? (
                properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onView={() =>
                      navigate(`/properties/${property.id}`)
                    }
                  />
                ))
              ) : (
                <div className="col-span-full py-32 text-center space-y-6 bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white">
                   <h2 className="text-xl font-bold text-slate-400">No properties found matching your criteria</h2>
                   <button 
                     onClick={() => setFilters({search:"", city:"", property_type:"", min_price:"", max_price:""})} 
                     className="text-slate-950 font-bold hover:underline underline-offset-4 decoration-2"
                   >
                     Clear all filters
                   </button>
                </div>
              )}
            </div>

            <div className="pt-12 border-t border-slate-100">
              <Pagination
                page={page}
                total={count}
                onPage={(p) =>
                  setSearchParams({ ...filters, page: p })
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
