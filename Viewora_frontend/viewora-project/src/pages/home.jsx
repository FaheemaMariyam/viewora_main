
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Star, ArrowRight, ShieldCheck, MessageCircle, TrendingUp, 
  Instagram, Twitter, Facebook, Linkedin 
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  
  const heroImages = [
    "/images/home4.png",
    "/images/home5.png", 
    "/images/home6.png"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-[#1A1A1A]">
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
         {/* Image Carousel */}
         {heroImages.map((img, index) => (
            <div 
               key={index}
               className={`absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-[2000ms] ease-in-out transform ${
                  index === currentImage ? "opacity-100 scale-105" : "opacity-0 scale-100"
               }`}
               style={{ backgroundImage: `url('${img}')` }}
            />
         ))}
         
         {/* Premium Overlay Gradient (Lighter for cleaner look) */}
         <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#020617]/90 via-transparent to-[#020617]/30" />
         
         {/* Navbar Integrated Shade */}
         <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />

         {/* Content */}
         <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center space-y-8 pt-24">
            
            <div className="space-y-4 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
               <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter leading-none drop-shadow-2xl">
                  Luxury <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Living</span>
               </h1>
               <p className="text-xl md:text-2xl text-gray-200 font-light tracking-wide max-w-xl mx-auto drop-shadow-lg opacity-90">
                  Find your place in the world's most exclusive properties.
               </p>
            </div>

            {/* Minimalist Spacing (No Button) */}
            <div className="pt-8" />

            {/* Carousel Indicators - Minimalist Dots */}
            <div className="absolute bottom-12 flex gap-4">
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`h-1.5 rounded-full transition-all duration-700 backdrop-blur-sm ${
                    idx === currentImage 
                      ? "w-12 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                      : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>

         </div>
      </div>


      {/* --- WHY CHOOSE US (Minimalist Compact) --- */}
      <section className="bg-white py-16 relative overflow-hidden">
         <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
               <h2 className="text-2xl font-bold tracking-tight text-slate-900">Why Viewora?</h2>
               <p className="text-slate-500 font-light text-base">Premium services designed for the modern estate experience.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
               <FeatureCard 
                  icon={ShieldCheck} 
                  title="Verified Listings" 
                  desc="Authenticity guaranteed. Every home verified by our team."
               />
               <FeatureCard 
                  icon={MessageCircle} 
                  title="Direct Connect" 
                  desc="Speak directly with owners. Zero middleman fees."
               />
               <FeatureCard 
                  icon={TrendingUp} 
                  title="Market Data" 
                  desc="Real-time pricing insights to help you decide."
               />
            </div>
         </div>
      </section>

      {/* --- TESTIMONIALS (Neutral Compact) --- */}
      <section className="py-20 bg-slate-50 relative">
          <div className="max-w-6xl mx-auto px-6 relative z-10">
             <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">Trusted by Residents</h2>
                <div className="flex items-center justify-center gap-1 text-slate-900">
                    {[1,2,3,4,5].map(i => <Star key={i} fill="currentColor" size={14} className="text-black" />)}
                    <span className="text-slate-500 font-medium text-sm ml-3 tracking-wide">4.9/5 from 2,300+ reviews</span>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TestimonialCard 
                   name="Sarah Johnson"
                   role="Home Buyer"
                   text="Viewora made finding my dream apartment incredibly easy. The virtual tours are a game changer!"
                   image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
                />
                <TestimonialCard 
                   name="Michael Chen"
                   role="Property Investor"
                   text="The verified listings gave me confidence to invest from another city. Highly recommended platform."
                   image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
                />
                <TestimonialCard 
                   name="Emily Davis"
                   role="Tenant"
                   text="I love how easy it is to chat with landlords directly. Currently loving my new studio in downtown!"
                   image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150"
                />
             </div>
          </div>
      </section>

      {/* --- FOOTER (Dark Restoration) --- */}
      <footer className="bg-black text-white pt-16 pb-8 border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
             <div className="space-y-6">
                 <div className="text-2xl font-bold tracking-tight">Viewora.</div>
                 <p className="text-gray-400 text-sm leading-relaxed">
                    Premium real estate platform designed for the modern era. Secure, fast, and transparent.
                 </p>
                 <div className="flex gap-4">
                    <SocialIcon icon={Instagram} />
                    <SocialIcon icon={Twitter} />
                    <SocialIcon icon={Facebook} />
                    <SocialIcon icon={Linkedin} />
                 </div>
             </div>
             
             <FooterColumn title="Company" links={['About Us', 'Careers', 'Press', 'Contact']} />
             <FooterColumn title="Resources" links={['Blog', 'Guides', 'Help Center', 'Privacy']} />
             <FooterColumn title="Legal" links={['Terms', 'Conditions', 'Cookies', 'Licenses']} />
          </div>
          
          <div className="max-w-6xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-500 uppercase tracking-widest">
             <span>© 2026 Viewora Real Estate.</span>
             <span className="hidden md:block">All rights reserved.</span>
          </div>
      </footer>

    </div>
  );
}

/* --- HELPER COMPONENTS --- */

function MetricItem({ value, label }) {
   return (
      <div className="text-center sm:text-left">
         <div className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-1">{value}</div>
         <div className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</div>
      </div>
   );
}

function FeatureCard({ icon: Icon, title, desc }) {
   return (
      <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl hover:bg-slate-50 transition-colors duration-300">
         <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-900 border border-indigo-100">
            <Icon size={20} />
         </div>
         <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
         </div>
      </div>
   );
}

function TestimonialCard({ name, role, text, image }) {
   return (
      <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100">
         <div className="text-slate-900 mb-6">
            <MessageCircle size={24} />
         </div>
         <p className="text-slate-600 font-light text-lg leading-relaxed mb-8">"{text}"</p>
         <div className="flex items-center gap-4">
            <img src={image} alt={name} className="w-10 h-10 rounded-full object-cover grayscale opacity-80" />
            <div>
               <div className="font-bold text-sm text-slate-900">{name}</div>
               <div className="text-xs font-medium text-slate-400 uppercase tracking-widest">{role}</div>
            </div>
         </div>
      </div>
   );
}



function FooterColumn({ title, links }) {
   return (
      <div className="space-y-6">
         <h4 className="font-bold text-white tracking-wide text-sm">{title}</h4>
         <ul className="space-y-3">
            {links.map(link => (
               <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">{link}</a>
               </li>
            ))}
         </ul>
      </div>
   );
}

function SocialIcon({ icon: Icon }) {
   return (
      <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all duration-300">
         <Icon size={18} />
      </a>
   );
}
