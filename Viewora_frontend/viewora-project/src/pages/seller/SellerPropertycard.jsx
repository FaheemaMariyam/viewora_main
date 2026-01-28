
import { useNavigate } from "react-router-dom";

export default function SellerPropertyCard({ property, onToggle }) {
  const navigate = useNavigate();

  const imageUrl = property.cover_image;

  return (
    <div
      className={`
        group relative rounded-2xl overflow-hidden cursor-pointer
        bg-white/95 backdrop-blur-xl
        border border-slate-200
        shadow-sm hover:shadow-2xl hover:-translate-y-1
        transition-all duration-300
        ${!property.is_active && "opacity-60 border-dashed"}
      `}
      onClick={() => navigate(`/seller/properties/${property.id}`)}
    >
      {/* Image */}
      {imageUrl && (
        <div className="relative h-52 overflow-hidden">
          <img
            src={imageUrl}
            alt={property.title}
            className="
              h-full w-full object-cover
              group-hover:scale-105 transition-transform duration-500
            "
          />

          {/* Status badge */}
          <span
            className={`
              absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full
              ${
                property.is_active
                  ? "bg-emerald-600/90 text-white"
                  : "bg-slate-700/90 text-white"
              }
            `}
          >
            {property.is_active ? "Active" : "Archived"}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-5 space-y-2">
        <h3 className="text-lg font-semibold text-slate-800 truncate">
          {property.title}
        </h3>

        <p className="text-sm text-slate-500">
          {property.city} • {property.locality}
        </p>

        <p className="text-xl font-bold text-indigo-700 mt-2">
          ₹ {Number(property.price).toLocaleString()}
        </p>

        <div className="flex items-center justify-between mt-5">
          <span className="text-xs uppercase tracking-wide text-slate-500">
            {property.status}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(property.id);
            }}
            className={`
              px-4 py-1.5 rounded-lg text-sm font-medium
              transition-colors
              ${
                property.is_active
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
              }
            `}
          >
            {property.is_active ? "Archive" : "Unarchive"}
          </button>
        </div>
      </div>
    </div>
  );
}
