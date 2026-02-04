import { createProperty } from "../../api/sellerApi";
import { compressImages } from "../../utils/imageUtils";

export default function AddProperty() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    property_type: "house",
    price: "",
    price_negotiable: true,
    area_size: "",
    area_unit: "sqft",
    city: "",
    locality: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    parking_available: false,
    furnishing_status: "",
    facing: "",
    property_age_years: "",
    ownership_count: 1,
    reason_for_selling: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));

    // Compress images before upload
    const compressedImages = await compressImages(images);
    compressedImages.forEach((img) => formData.append("images", img));

    try {
      await createProperty(formData);
      navigate("/seller");
    } catch {
      alert("Failed to create property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-page py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-brand-primary tracking-tight">
            Add New Property
          </h1>
          <p className="text-text-muted mt-2">
            Provide accurate details to attract genuine buyers
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div>
              <h2 className="text-lg font-bold text-brand-primary mb-4 pb-2 border-b border-gray-100">
                Property Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Title</label>
                  <input
                    name="title"
                    placeholder="e.g. Luxury 3BHK Villa"
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Property Type</label>
                  <select
                    name="property_type"
                    onChange={handleChange}
                    className="input"
                    value={form.property_type}
                  >
                    <option value="house">House</option>
                    <option value="flat">Flat</option>
                    <option value="plot">Plot</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="label">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="e.g. 8500000"
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Area Size</label>
                  <input
                    name="area_size"
                    placeholder="e.g. 1800"
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">City</label>
                  <input
                    name="city"
                    placeholder="e.g. Bangalore"
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Locality</label>
                  <input
                    name="locality"
                    placeholder="e.g. Whitefield"
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="label">Description</label>
              <textarea
                name="description"
                rows="4"
                placeholder="Describe the property highlights, amenities, and surroundings..."
                onChange={handleChange}
                className="input resize-none"
              />
            </div>

            {/* Address */}
            <div>
              <label className="label">Full Address</label>
              <textarea
                name="address"
                rows="3"
                placeholder="Enter complete address"
                onChange={handleChange}
                className="input resize-none"
              />
            </div>

            {/* Images */}
            <div>
              <label className="label">Property Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-brand-accent hover:bg-blue-50 transition cursor-pointer relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center">
                  <span className="text-4xl text-gray-400 mb-2">📷</span>
                  <p className="font-medium text-brand-primary">Click to upload images</p>
                  <p className="text-sm text-text-muted mt-1">
                    Upload high-quality images (JPEG, PNG)
                  </p>
                  {images.length > 0 && (
                     <p className="mt-2 text-sm text-green-600 font-semibold">{images.length} files selected</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6 flex justify-end">
              <button
                disabled={loading}
                className="
                  bg-brand-primary text-white font-bold px-8 py-3 rounded-md
                  hover:bg-brand-secondary
                  shadow-sm disabled:opacity-60 disabled:cursor-not-allowed
                  transition-all
                "
              >
                {loading ? "Processing & Uploading..." : "Create Property"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Tailwind helpers */}
      <style>
        {`
          .label {
            @apply block text-sm font-semibold text-text-main mb-1.5;
          }
          .input {
            @apply w-full rounded-md border border-gray-300 px-4 py-2.5
            focus:outline-none focus:ring-2 focus:ring-brand-accent
            focus:border-transparent bg-white text-sm text-text-main placeholder-gray-400 transition-shadow;
          }
        `}
      </style>
    </div>
  );
}
