
import { useNavigate } from "react-router-dom";
import { 
  Star, ShieldCheck, MessageCircle, TrendingUp, 
  ArrowRight, Instagram, Twitter, Facebook, Linkedin
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();


  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-[#1A1A1A]">
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-[90vh] min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900">
         {/* Decorative Elements */}
         <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-slate-700/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-gray-700/20 rounded-full blur-3xl" />
         </div>

         {/* Content */}
         <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-10">
            
            <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-bold uppercase tracking-widest">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  #1 Real Estate Platform
               </div>
               <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.1]">
                  Discover a place <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                     you'll love to live
                  </span>
               </h1>
               <p className="text-xl text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed">
                  The most complete real estate destination for buyers, sellers, and renters. 
                  Connect with verified owners directly.
               </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150">
               <button 
                  onClick={() => navigate('/login')}
                  className="px-10 py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl"
               >
                  Get Started
               </button>
               <button 
                  onClick={() => navigate('/signup')}
                  className="px-10 py-4 bg-indigo-500 border border-indigo-400 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-400 transition-colors"
               >
                  Sign Up Free
               </button>
            </div>

            {/* Metrics Strip */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 pt-8 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
                <MetricItem value="10k+" label="Active Listings" />
                <MetricItem value="2k+" label="Properties Sold" />
                <MetricItem value="500+" label="Expert Agents" />
            </div>

         </div>
      </div>


      {/* --- WHY CHOOSE US --- */}
      <section className="bg-[#111] text-white py-32 rounded-t-[4rem] relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full -mr-20 -mt-20 pointer-events-none" />
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
               <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Why Choose Viewora?</h2>
               <p className="text-gray-400 text-lg">Experience the future of real estate management with our premium tools and services.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
               <FeatureCard 
                  icon={ShieldCheck} 
                  title="Verified Listings" 
                  desc="Every home is verified by our team to ensure authenticity and legal compliance."
               />
               <FeatureCard 
                  icon={MessageCircle} 
                  title="Direct Communication" 
                  desc="Connect directly with property owners and certified brokers without middlemen."
               />
               <FeatureCard 
                  icon={TrendingUp} 
                  title="Market Insights" 
                  desc="Get real-time data on property trends and pricing to make informed decisions."
               />
            </div>
         </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="py-32 bg-indigo-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-[#1A1A1A] tracking-tighter mb-4">Trusted by Residents</h2>
                <div className="flex items-center justify-center gap-1 text-yellow-400">
                    {[1,2,3,4,5].map(i => <Star key={i} fill="currentColor" size={20} />)}
                    <span className="text-[#1A1A1A] font-bold text-sm ml-2">(4.9/5 from 2,300+ reviews)</span>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

      {/* --- FOOTER --- */}
      <footer className="bg-[#1A1A1A] text-white pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 border-b border-white/10 pb-16">
             <div className="space-y-6">
                 <div className="text-2xl font-black tracking-tighter">Viewora.</div>
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
          <div className="text-center text-gray-500 text-xs font-bold uppercase tracking-widest">
             © 2026 Viewora Real Estate. All rights reserved.
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
      <div className="space-y-6 group">
         <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-500">
            <Icon size={32} />
         </div>
         <div className="space-y-3">
            <h3 className="text-xl font-bold tracking-tight">{title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
         </div>
      </div>
   );
}

function TestimonialCard({ name, role, text, image }) {
   return (
      <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-indigo-100/50 border border-indigo-50 hover:-translate-y-2 transition-transform duration-500">
         <div className="text-indigo-600 mb-6">
            <MessageCircle size={32} />
         </div>
         <p className="text-[#1A1A1A] font-medium text-lg leading-relaxed mb-8">"{text}"</p>
         <div className="flex items-center gap-4">
            <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover" />
            <div>
               <div className="font-black text-sm text-[#1A1A1A]">{name}</div>
               <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">{role}</div>
            </div>
         </div>
      </div>
   );
}

function FooterColumn({ title, links }) {
   return (
      <div className="space-y-6">
         <h4 className="font-bold text-white tracking-wide">{title}</h4>
         <ul className="space-y-4">
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
      <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-indigo-600 transition-colors">
         <Icon size={18} />
      </a>
   );
}
