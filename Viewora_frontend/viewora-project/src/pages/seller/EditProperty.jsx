import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";
import {
  updateProperty,
  getVideoPresignedUrl,
  attachVideoToProperty,
} from "../../api/sellerApi";
import {
  ChevronsRight,
  CheckCircle2,
  Image as ImageIcon,
  MapPin,
  Home,
  FileText,
  UploadCloud,
  X
} from "lucide-react";

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [videoFile, setVideoFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  
  // WIZARD STATE
  const [currentStep, setCurrentStep] = useState(1);
  const STEPS = [
    { number: 1, title: "Basic Info", icon: Home },
    { number: 2, title: "Location", icon: MapPin },
    { number: 3, title: "Details", icon: FileText },
    { number: 4, title: "Media", icon: ImageIcon },
  ];

  /* ---------- FETCH PROPERTY ---------- */
  useEffect(() => {
    axiosInstance
      .get(`/api/properties/seller/property/${id}/`)
      .then((res) => {
        setForm(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load property");
        navigate("/seller");
      });
  }, [id, navigate]);

  /* ---------- HANDLERS ---------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    setSaving(true);
    const formData = new FormData();

    const FIELDS = [
      "title", "description", "property_type", "price", "price_negotiable",
      "area_size", "area_unit", "property_age_years", "construction_year",
      "last_renovated_year", "ownership_count", "reason_for_selling",
      "city", "locality", "address", "latitude", "longitude",
      "bedrooms", "bathrooms", "parking_available", "furnishing_status",
      "facing", "status", "is_active",
    ];

    FIELDS.forEach((key) => {
      let value = form[key];
      // Convert boolean true/false to "true"/"false" string for FormData if needed, 
      // though typically Django handles standard boolean values well.
      // Filter out null/undefined to avoid sending "null" string.
      if (value !== null && value !== undefined) {
          formData.append(key, value);
      }
    });

    newImages.forEach((img) => formData.append("images", img));

    try {
      await updateProperty(id, formData);
      if (videoFile) await uploadVideo();
      navigate(`/seller/properties/${id}`);
    } catch (err) {
      console.error(err.response?.data);
      alert("Update failed! Please check valid data.");
    } finally {
      setSaving(false);
    }
  };

  const uploadVideo = async () => {
      // ... same video logic ...
      const presignRes = await getVideoPresignedUrl(id, {
        file_name: videoFile.name,
        content_type: videoFile.type,
      });
      const { upload_url, key, video_url } = presignRes.data;
      await axios.put(upload_url, videoFile, { headers: { "Content-Type": videoFile.type } });
      await attachVideoToProperty(id, { key, video_url });
  }


  if (loading) return <div className="p-10 text-center">Loading Data...</div>;

  /* ---------- RENDER HELPERS ---------- */
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800">Edit Property</h1>
            <p className="text-gray-500 mt-1">Update listings details • Step {currentStep} of 4</p>
        </div>

        {/* PROGRESS BAR */}
        <div className="flex justify-between items-center mb-8 px-10 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded"></div>
            <div className="absolute top-1/2 left-0 h-1 bg-brand-primary -z-10 rounded transition-all duration-500" style={{ width: `${((currentStep - 1) / 3) * 100}%` }}></div>
            
            {STEPS.map((step) => {
                const isActive = step.number <= currentStep;
                const isCurrent = step.number === currentStep;
                return (
                    <div key={step.number} className="flex flex-col items-center gap-2 bg-gray-50 px-2">
                        <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all
                            ${isActive ? "bg-brand-primary text-white" : "bg-gray-200 text-gray-500"}
                            ${isCurrent ? "ring-4 ring-brand-primary/20 scale-110" : ""}
                        `}>
                            {isActive ? <step.icon size={18} /> : step.number}
                        </div>
                        <span className={`text-xs font-medium ${isActive ? "text-brand-primary" : "text-gray-400"}`}>
                            {step.title}
                        </span>
                    </div>
                )
            })}
        </div>
        
        {/* FORM CONTAINER */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8 min-h-[400px]">
                
                {/* STEP 1: BASIC INFO */}
                {currentStep === 1 && (
                    <div className="space-y-6 animate-fadeIn">
                        <Grid>
                            <Input label="Property Title" name="title" value={form.title} onChange={handleChange} />
                            <Select label="Property Type" name="property_type" value={form.property_type} onChange={handleChange}>
                                <option value="house">House</option>
                                <option value="flat">Flat</option>
                                <option value="plot">Plot</option>
                                <option value="commercial">Commercial</option>
                            </Select>
                        </Grid>
                        <Textarea label="Description" name="description" value={form.description} onChange={handleChange} rows={5} />
                        <Grid>
                             <Select label="Status" name="status" value={form.status} onChange={handleChange}>
                                <option value="published">Published</option>
                                <option value="sold">Sold</option>
                                <option value="archived">Archived</option>
                            </Select>
                            <div className="flex items-center h-full pt-6">
                                <Toggle label="List as Active" name="is_active" checked={form.is_active} onChange={handleChange} />
                            </div>
                        </Grid>
                    </div>
                )}

                 {/* STEP 2: LOCATION */}
                 {currentStep === 2 && (
                    <div className="space-y-6 animate-fadeIn">
                         <Grid>
                            <Input label="City" name="city" value={form.city} onChange={handleChange} />
                            <Input label="Locality" name="locality" value={form.locality} onChange={handleChange} />
                        </Grid>
                        <Textarea label="Full Address" name="address" value={form.address} onChange={handleChange} />
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                                <MapPin size={16}/> Coordinates
                            </h4>
                            <Grid>
                                <Input label="Latitude" name="latitude" value={form.latitude} onChange={handleChange} placeholder="e.g. 10.015" />
                                <Input label="Longitude" name="longitude" value={form.longitude} onChange={handleChange} placeholder="e.g. 76.342" />
                            </Grid>
                        </div>
                    </div>
                )}

                {/* STEP 3: DETAILS */}
                {currentStep === 3 && (
                    <div className="space-y-8 animate-fadeIn">
                        {/* Price & Area */}
                        <div className="space-y-4">
                            <h3 className="section-title">Pricing & Dimensions</h3>
                            <Grid>
                                <Input type="number" label="Price (₹)" name="price" value={form.price} onChange={handleChange} />
                                <div className="pt-8">
                                    <Toggle label="Price Negotiable" name="price_negotiable" checked={form.price_negotiable} onChange={handleChange} />
                                </div>
                                <Input type="number" label="Area Size" name="area_size" value={form.area_size} onChange={handleChange} />
                                <Select label="Unit" name="area_unit" value={form.area_unit} onChange={handleChange}>
                                    <option value="sqft">Sq. Ft</option>
                                    <option value="cent">Cent</option>
                                </Select>
                            </Grid>
                        </div>

                        {/* Features */}
                         <div className="space-y-4">
                            <h3 className="section-title">Features</h3>
                            <Grid>
                                <Input type="number" label="Bedrooms" name="bedrooms" value={form.bedrooms} onChange={handleChange} />
                                <Input type="number" label="Bathrooms" name="bathrooms" value={form.bathrooms} onChange={handleChange} />
                                <Input label="Facing" name="facing" value={form.facing} onChange={handleChange} placeholder="e.g. North-East" />
                                <div className="pt-8">
                                    <Toggle label="Parking Available" name="parking_available" checked={form.parking_available} onChange={handleChange} />
                                </div>
                                <Input label="Furnishing" name="furnishing_status" value={form.furnishing_status} onChange={handleChange} />
                            </Grid>
                        </div>

                         {/* Meta Data */}
                         <div className="space-y-4">
                            <h3 className="section-title">Property History</h3>
                             <Grid>
                                <Input type="number" label="Age (Years)" name="property_age_years" value={form.property_age_years} onChange={handleChange} />
                                <Input type="number" label="Construction Year" name="construction_year" value={form.construction_year} onChange={handleChange} />
                                <Input type="number" label="Last Renovated" name="last_renovated_year" value={form.last_renovated_year} onChange={handleChange} />
                                <Input type="number" label="Ownership Count" name="ownership_count" value={form.ownership_count} onChange={handleChange} />
                                <Input label="Reason for Selling" name="reason_for_selling" value={form.reason_for_selling} onChange={handleChange} />
                            </Grid>
                         </div>
                    </div>
                )}

                {/* STEP 4: MEDIA */}
                {currentStep === 4 && (
                    <div className="space-y-8 animate-fadeIn">
                        
                        {/* Existing Images */}
                        <div>
                             <h3 className="section-title mb-4">Current Images</h3>
                             <div className="grid grid-cols-4 gap-4">
                                {form.images.map(img => (
                                    <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border">
                                        <img src={img.image} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                             </div>
                        </div>

                        {/* Upload New */}
                        <div className="p-8 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 text-center hover:bg-gray-100 transition-colors">
                            <input type="file" multiple accept="image/*" onChange={(e) => setNewImages([...e.target.files])} className="hidden" id="img-upload" />
                            <label htmlFor="img-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                <UploadCloud size={40} className="text-brand-primary" />
                                <span className="text-gray-600 font-medium">Click to upload new images</span>
                                <span className="text-xs text-gray-400">JPG, PNG supported</span>
                            </label>
                            {newImages.length > 0 && <p className="mt-4 text-emerald-600 font-bold">{newImages.length} files selected</p>}
                        </div>

                         {/* Video */}
                         <div>
                            <h3 className="section-title mb-4">Property Video</h3>
                             <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
                            {videoFile && <p className="mt-2 text-sm text-gray-500">Selected: {videoFile.name}</p>}
                         </div>

                    </div>
                )}

            </div>

            {/* FOOTER */}
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between">
                <button 
                    onClick={prevStep} 
                    disabled={currentStep === 1}
                    className="px-6 py-3 rounded-xl text-gray-600 font-medium hover:bg-gray-200 disabled:opacity-50 transition"
                >
                    Back
                </button>

                {currentStep < 4 ? (
                     <button 
                        onClick={nextStep}
                        className="px-8 py-3 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-secondary shadow-lg flex items-center gap-2"
                     >
                        Next <ChevronsRight size={18} />
                     </button>
                ) : (
                    <button 
                        onClick={handleSubmit} 
                        disabled={saving}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-bold hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                    >
                        {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <CheckCircle2 size={18} />}
                        Save Changes
                    </button>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}

// --- UI COMPONENTS ---

function Grid({ children }) { return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div> }

function Input({ label, ...props }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">{label}</label>
            <input {...props} className="px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all w-full" />
        </div>
    )
}

function Textarea({ label, ...props }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">{label}</label>
            <textarea {...props} className="px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all w-full" />
        </div>
    )
}

function Select({ label, children, ...props }) {
    return (
         <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">{label}</label>
            <select {...props} className="px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all w-full bg-white">
                {children}
            </select>
        </div>
    )
}

function Toggle({ label, checked, onChange, name }) {
    return (
        <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${checked ? "bg-brand-primary" : "bg-gray-300"}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${checked ? "translate-x-6" : "translate-x-0"}`}></div>
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-brand-primary transition-colors">{label}</span>
            <input type="checkbox" name={name} checked={checked} onChange={onChange} className="hidden" />
        </label>
    )
}
