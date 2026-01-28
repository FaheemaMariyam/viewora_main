
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
    <div className="min-h-screen pt-12 pb-24 px-4 bg-[#FDFDFD] font-sans selection:bg-brand-primary/10">
      <div className="max-w-7xl mx-auto relative">
        
        {/* Header - Centered & Premium */}
        <div className="text-center mb-16 space-y-3">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-[#1A1A1A]">
            Discover Premium Assets
          </h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.3em]">
            Browse our exclusive collection of verified properties
          </p>
          <div className="w-12 h-1 bg-brand-primary mx-auto rounded-full" />
        </div>

        {/* Filters - High Z-index for select dropdowns if needed */}
        <div className="relative z-20">
          <PropertyFilters
            filters={filters}
            setFilters={setFilters}
            onApply={applyFilters}
          />
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
             <div className="w-12 h-12 border-4 border-gray-100 border-t-brand-primary rounded-full animate-spin" />
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Searching global assets...</p>
          </div>
        ) : (
          <div className="space-y-16">
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
                <div className="col-span-full py-32 text-center space-y-4">
                   <h2 className="text-xl font-black text-gray-300">No properties found matching your criteria</h2>
                   <button onClick={() => setFilters({search:"", city:"", property_type:"", min_price:"", max_price:""})} className="text-brand-primary font-bold hover:underline">Clear all filters</button>
                </div>
              )}
            </div>

            <div className="pt-12 border-t border-gray-50">
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

        {/* Background Accent */}
        <div className="fixed top-[20%] right-[5%] w-[40%] h-[40%] bg-brand-primary/5 blur-[150px] rounded-full pointer-events-none -z-10" />
      </div>
    </div>
  );
}
