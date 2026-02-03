
import { MapPin, Bed, Bath, Move, Eye, Users, ChevronRight, CheckCircle2 } from "lucide-react";

export default function PropertyCard({ property, onView }) {
  const imageUrl = property.cover_image;

  return (
    <div
      onClick={onView}
      className="group relative bg-white/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-white shadow-[0_15px_60px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_45px_100px_-20px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-700 cursor-pointer flex flex-col h-full"
    >
      {/* IMAGE SECTION */}
      <div className="relative h-64 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200">
            <div className="w-16 h-16 rounded-full border-2 border-slate-100 flex items-center justify-center">
               <Bed size={32} />
            </div>
          </div>
        )}
        
        {/* Type Badge - Glass */}
        <div className="absolute top-5 left-5">
          <span className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-2xl bg-white/60 backdrop-blur-2xl text-slate-950 border border-white shadow-xl">
            {property.property_type}
          </span>
        </div>

        {/* Interested Badge Overlay */}
        {property.is_interested && (
          <div className="absolute top-5 right-5 scale-110">
            <div className="bg-white text-emerald-500 p-2 rounded-full shadow-2xl border border-emerald-50 shadow-emerald-500/10">
              <CheckCircle2 size={18} />
            </div>
          </div>
        )}

        {/* Price Tag Overlay - Glass */}
        <div className="absolute bottom-5 left-5">
          <div className="bg-slate-950/80 backdrop-blur-xl text-white px-5 py-2.5 rounded-[1.25rem] border border-white/10 shadow-2xl">
            <span className="text-xl font-bold tracking-tight">
              ₹{Number(property.price).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-[22px] font-bold text-slate-950 tracking-tight leading-tight mb-2 group-hover:text-slate-800 transition-colors">
          {property.title}
        </h3>

        <div className="flex items-center text-slate-400 gap-1.5 mb-8">
          <MapPin size={14} className="text-slate-300" />
          <span className="text-[13px] font-medium truncate">
            {property.locality}, {property.city}
          </span>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-3 gap-2 mb-8 py-6 border-y border-slate-100/50">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 rounded-full bg-slate-50/50 flex items-center justify-center text-slate-950 shadow-sm border border-white">
              <Bed size={16} />
            </div>
            <span className="text-[11px] font-bold text-slate-950">
              {property.bedrooms ?? 0} Beds
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5 border-x border-slate-100/50">
            <div className="w-10 h-10 rounded-full bg-slate-50/50 flex items-center justify-center text-slate-950 shadow-sm border border-white">
              <Bath size={16} />
            </div>
            <span className="text-[11px] font-bold text-slate-950">
              {property.bathrooms ?? 0} Baths
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 rounded-full bg-slate-50/50 flex items-center justify-center text-slate-950 shadow-sm border border-white">
              <Move size={16} />
            </div>
            <span className="text-[11px] font-bold text-slate-950">
              {property.area_size} {property.area_unit}
            </span>
          </div>
        </div>

        {/* Statistics & Call to Action */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-300">
              <Eye size={14} />
              <span>{property.view_count}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-300">
              <Users size={14} />
              <span>{property.interest_count}</span>
            </div>
          </div>
          
          <div className="text-slate-950 group/btn flex items-center gap-1.5 text-[14px] font-bold tracking-tight transition-all">
            See Details
            <div className="w-7 h-7 rounded-full bg-slate-950 text-white flex items-center justify-center transition-transform group-hover/btn:translate-x-1">
               <ChevronRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
