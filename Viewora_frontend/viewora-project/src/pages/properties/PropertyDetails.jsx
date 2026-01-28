
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPropertyDetail, createInterest } from "../../api/propertyApi";
import ChatBox from "../../components/ChatBox";
import { AuthContext } from "../../auth/AuthContext";
import { 
  MapPin, Bed, Bath, Move, Car, Info, Calendar, 
  History, UserCircle, ShieldCheck, MessageCircle, 
  Heart, Share2, IndianRupee, ArrowLeft, PlayCircle,
  CheckCircle2
} from "lucide-react";
import { toast } from "react-toastify";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [property, setProperty] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interestLoading, setInterestLoading] = useState(false);

  useEffect(() => {
    fetchPropertyDetail(id).then((res) => {
      setProperty(res.data);
      if (res.data.images?.length) {
        setActiveImage(res.data.images[0].image);
      }
      setLoading(false);
    }).catch(() => {
      toast.error("Property not found");
      setLoading(false);
    });
  }, [id]);

  const handleInterest = async () => {
    setInterestLoading(true);
    try {
      await createInterest(id);
      const res = await fetchPropertyDetail(id);
      setProperty(res.data);
      toast.success("Interest submitted! You can now chat with the broker/seller.");
    } catch (err) {
      toast.error("Failed to submit interest. Please try again.");
    } finally {
      setInterestLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-gray-100 border-t-brand-primary rounded-full animate-spin" />
    </div>
  );
  
  if (!property) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
      <h2 className="text-2xl font-black text-[#1A1A1A]">Property Not Found</h2>
      <button onClick={() => navigate("/properties")} className="text-brand-primary font-bold hover:underline underline-offset-4">
        Back to listings
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-[#1A1A1A]">
      
      {/* Top Header / Navigation */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/properties")} className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-500 hover:text-[#1A1A1A] transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-rose-500 transition-all border border-transparent hover:border-gray-100"><Heart size={20} /></button>
            <button className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-brand-primary transition-all border border-transparent hover:border-gray-100"><Share2 size={20} /></button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Gallery Section */}
            <div className="space-y-4">
               <div className="aspect-[16/9] bg-gray-100 rounded-[2.5rem] overflow-hidden group relative shadow-2xl shadow-black/5 border border-gray-100">
                 {activeImage ? (
                   <img src={activeImage} alt={property.title} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-300">No Image Available</div>
                 )}
               </div>
               
               <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                 {property.images?.map((img) => (
                   <button
                     key={img.id}
                     onClick={() => setActiveImage(img.image)}
                     className={`w-32 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-4 transition-all ${
                       activeImage === img.image ? "border-brand-primary scale-95" : "border-transparent opacity-60 hover:opacity-100"
                     }`}
                   >
                     <img src={img.image} className="w-full h-full object-cover" />
                   </button>
                 ))}
               </div>
            </div>

            {/* Video Section (If available) */}
            {property.video_url && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <PlayCircle size={24} className="text-brand-primary" />
                  <h2 className="text-xl font-black tracking-tight">Virtual Tour</h2>
                </div>
                <div className="aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5 ring-1 ring-gray-100">
                  <video src={property.video_url} controls className="w-full h-full" />
                </div>
              </div>
            )}

            {/* Title & Description */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="inline-block px-3 py-1.5 rounded-xl bg-brand-primary/5 text-brand-primary text-[10px] font-black uppercase tracking-widest border border-brand-primary/10">
                  {property.property_type} • {property.status}
                </div>
                <h1 className="text-4xl font-black tracking-tighter leading-tight">{property.title}</h1>
                <div className="flex items-center gap-2 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                   <MapPin size={14} className="text-brand-primary" />
                   {property.address}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50">
                 <h2 className="text-lg font-black tracking-tight mb-4">About this property</h2>
                 <p className="text-gray-500 leading-relaxed font-medium">
                   {property.description}
                 </p>
              </div>
            </div>

            {/* Specification Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-gray-50">
               <SpecItem icon={Bed} label="Bedrooms" value={property.bedrooms ?? "N/A"} />
               <SpecItem icon={Bath} label="Bathrooms" value={property.bathrooms ?? "N/A"} />
               <SpecItem icon={Move} label="Area size" value={`${property.area_size} ${property.area_unit}`} />
               <SpecItem icon={Car} label="Parking" value={property.parking_available ? "Available" : "No"} />
               <SpecItem icon={Info} label="Furnishing" value={property.furnishing_status ?? "N/A"} />
               <SpecItem icon={Calendar} label="Built year" value={property.construction_year ?? "N/A"} />
               <SpecItem icon={History} label="Ownership" value={`${property.ownership_count} Owners`} />
               <SpecItem icon={CheckCircle2} label="Verified" value="Yes" />
            </div>

            {/* Detailed Info Grid */}
            <div className="space-y-6 pt-12">
               <h2 className="text-lg font-black tracking-tight">Location Details</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailCard label="City" value={property.city} />
                  <DetailCard label="Locality" value={property.locality} />
                  <DetailCard label="Latitude" value={property.latitude ?? "N/A"} />
                  <DetailCard label="Longitude" value={property.longitude ?? "N/A"} />
               </div>
            </div>

            {/* Chat Section */}
            {property.is_interested && property.active_interest_id && user && (
              <div className="space-y-6 pt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="flex items-center gap-3">
                   <div className="p-3 bg-brand-primary/5 text-brand-primary rounded-2xl border border-brand-primary/10">
                      <MessageCircle size={24} />
                   </div>
                   <div>
                      <h2 className="text-xl font-black tracking-tight">Communication Portal</h2>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Connected with the broker</p>
                   </div>
                </div>
                <div className="rounded-[2.5rem] bg-white border border-gray-100 overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
                  <ChatBox interestId={property.active_interest_id} />
                </div>
              </div>
            )}

          </div>

          {/* Interaction Sidebar (Right) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              
              {/* Main Pricing Card */}
              <div className="bg-[#1A1A1A] text-white rounded-[2.5rem] p-8 shadow-2xl shadow-black/10 border border-white/5 relative overflow-hidden group">
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-10 -mt-10" />

                <div className="relative z-10 space-y-8">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Total Valuation</span>
                    <div className="flex items-center gap-1">
                       <IndianRupee size={32} className="text-brand-primary" />
                       <span className="text-5xl font-black tracking-tighter">{Number(property.price).toLocaleString()}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                      {property.price_negotiable ? "✓ Negotiable" : "• Fixed Price"}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {user?.role === "client" && (
                      !property.is_interested ? (
                        <button 
                          onClick={handleInterest}
                          disabled={interestLoading}
                          className="w-full bg-brand-primary text-white py-5 rounded-[1.25rem] font-black tracking-tighter text-lg shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group/btn"
                        >
                          {interestLoading ? (
                             <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              I'm Interested
                              <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 py-5 rounded-[1.25rem] font-black text-center text-sm uppercase tracking-widest">
                          ✓ Already Shared Interest
                        </div>
                      )
                    )}
                    
                    <div className="flex items-center justify-center gap-2 text-gray-500 py-2">
                       <ShieldCheck size={14} />
                       <span className="text-[9px] font-black uppercase tracking-widest">Viewora Verified Asset</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Poster Profile Peek */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-gray-50 shadow-[0_20px_40px_rgba(0,0,0,0.02)] space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-50 text-gray-300 rounded-2xl flex items-center justify-center border border-gray-100">
                       <UserCircle size={32} />
                    </div>
                    <div>
                       <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Listing Provided By</h3>
                       <p className="font-black text-[#1A1A1A]">Official Representative</p>
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                    <p className="text-[10px] font-medium text-gray-400 leading-relaxed italic">
                      "Professional verified broker with deep expertise in {property.locality} real estate market."
                    </p>
                 </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

/* ---------- CUSTOM UI COMPONENTS ---------- */

function SpecItem({ icon: Icon, label, value }) {
  return (
    <div className="bg-white border border-gray-50 rounded-[1.5rem] p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
       <div className="w-10 h-10 bg-gray-50 text-[#1A1A1A] rounded-xl flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors">
          <Icon size={20} />
       </div>
       <div className="space-y-0.5">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{label}</p>
          <p className="text-sm font-black text-[#1A1A1A] tracking-tight">{value}</p>
       </div>
    </div>
  );
}

function DetailCard({ label, value }) {
  return (
    <div className="bg-[#F9FAFB] border border-gray-50 rounded-2xl px-6 py-4 flex justify-between items-center group hover:bg-white hover:border-gray-100 transition-all">
       <span className="text-xs font-black uppercase tracking-widest text-gray-400">{label}</span>
       <span className="text-sm font-black text-[#1A1A1A] tracking-tight">{value}</span>
    </div>
  );
}

function ArrowRight(props) {
  return <ChevronRight {...props} />;
}

function ChevronRight({ size, className }) {
   return (
     <svg 
       width={size} 
       height={size} 
       viewBox="0 0 24 24" 
       fill="none" 
       stroke="currentColor" 
       strokeWidth="3" 
       strokeLinecap="round" 
       strokeLinejoin="round" 
       className={className}
     >
       <path d="m9 18 6-6-6-6"/>
     </svg>
   );
}
