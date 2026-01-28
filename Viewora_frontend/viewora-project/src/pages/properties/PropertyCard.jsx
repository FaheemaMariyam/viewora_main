
import { MapPin, Bed, Bath, Move, Eye, Users, ChevronRight, CheckCircle2 } from "lucide-react";

export default function PropertyCard({ property, onView }) {
  const imageUrl = property.cover_image;

  return (
    <div
      onClick={onView}
      className="group relative bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col h-full"
    >
      {/* IMAGE SECTION */}
      <div className="relative h-64 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-200">
            <Home size={48} />
          </div>
        )}
        
        {/* Type Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl bg-white/90 backdrop-blur-md text-[#1A1A1A] shadow-sm border border-white/20">
            {property.property_type}
          </span>
        </div>

        {/* Interested Badge Overlay */}
        {property.is_interested && (
          <div className="absolute top-4 right-4">
            <div className="bg-emerald-500 text-white p-1.5 rounded-full shadow-lg ring-4 ring-emerald-500/20">
              <CheckCircle2 size={16} />
            </div>
          </div>
        )}

        {/* Price Tag Overlay */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-[#1A1A1A]/80 backdrop-blur-md text-white px-4 py-2 rounded-2xl border border-white/10 shadow-xl">
            <span className="text-lg font-black tracking-tighter">
              ₹{Number(property.price).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-black text-[#1A1A1A] tracking-tight truncate mb-2 group-hover:text-brand-primary transition-colors">
          {property.title}
        </h3>

        <div className="flex items-center text-gray-400 gap-1.5 mb-6">
          <MapPin size={14} className="text-brand-primary" />
          <span className="text-xs font-bold truncate uppercase tracking-wider">
            {property.locality}, {property.city}
          </span>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-gray-50">
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[#1A1A1A]">
              <Bed size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">
              {property.bedrooms ?? 0} Beds
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 border-x border-gray-50 px-2">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[#1A1A1A]">
              <Bath size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">
              {property.bathrooms ?? 0} Baths
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[#1A1A1A]">
              <Move size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">
              {property.area_size} {property.area_unit}
            </span>
          </div>
        </div>

        {/* Statistics & Call to Action */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-gray-300">
              <Eye size={12} />
              <span>{property.view_count}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-gray-300">
              <Users size={12} />
              <span>{property.interest_count}</span>
            </div>
          </div>
          
          <div className="text-[#1A1A1A] group/btn flex items-center gap-1 text-xs font-black uppercase tracking-widest transition-all">
            See Details
            <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
