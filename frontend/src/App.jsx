import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useInView } from 'react-intersection-observer';
import { Calendar, Clock, MapPin, Phone, ShieldCheck, Stethoscope, Sparkles, ChevronRight, CheckCircle2, Award, Menu, X, Lock } from 'lucide-react';

// --- BULLETPROOF ANIMATION COMPONENT ---
const AnimatedSection = ({ children, className = "", delay = "" }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.05,
    rootMargin: "0px 0px -20px 0px"
  });

  return (
    <div
      ref={ref}
      className={`transform transition-all duration-1000 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${delay} ${className}`}
    >
      {children}
    </div>
  );
};

function App() {
  const [view, setView] = useState('main');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  
  // --- STAFF LOCK STATES ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const STAFF_PASSWORD = "Pakistan47#"; // This is the access code for the doctors

  const [formData, setFormData] = useState({
    patient_name: '', phone_number: '', service_type: 'Dental', doctor_name: 'Dr. Kamil', appointment_date: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://clinic-website-1-m6bf.onrender.com/book-appointment', formData);
      alert("✅ Appointment Confirmed! We look forward to seeing you.");
      setFormData({ patient_name: '', phone_number: '', service_type: 'Dental', doctor_name: 'Dr. Kamil', appointment_date: '' });
    } catch (error) {
      alert("❌ Error connecting to the server. Is the Python backend running?");
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('https://clinic-website-1-m6bf.onrender.com/appointments');
      setAppointments(response.data.appointments);
    } catch (error) {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await axios.delete(`https://clinic-website-1-m6bf.onrender.com/appointments/${id}`);
      fetchAppointments();
    } catch (error) {}
  };

  // --- LOGIN HANDLER ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === STAFF_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordInput('');
      fetchAppointments();
    } else {
      alert("❌ Access Denied: Incorrect Staff Code.");
    }
  };

  useEffect(() => {
    if (view === 'admin' && isAuthenticated) fetchAppointments();
  }, [view, isAuthenticated]);

  // --- SMART SCROLLING ROUTER ---
  const handleNavClick = (sectionId) => {
    if (view !== 'main') {
      setView('main');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false); 
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-[#f8fafc] selection:bg-blue-500 selection:text-white">
      
      {/* --- FLOATING GLASS NAVBAR --- */}
      <nav className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNavClick('home')}>
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-2.5 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck size={26} />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Khattak<span className="text-blue-600">Clinic.</span></h1>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-8 items-center">
            <button onClick={() => handleNavClick('home')} className={`font-bold text-sm uppercase tracking-wider transition hover:text-blue-600 ${view === 'main' ? 'text-gray-900' : 'text-gray-500'}`}>Home</button>
            <button onClick={() => handleNavClick('about')} className="font-bold text-sm uppercase tracking-wider text-gray-500 hover:text-blue-600 transition">About Us</button>
            <button onClick={() => handleNavClick('services')} className="font-bold text-sm uppercase tracking-wider text-gray-500 hover:text-blue-600 transition">Services</button>
            <button onClick={() => handleNavClick('contact')} className="font-bold text-sm uppercase tracking-wider text-gray-500 hover:text-blue-600 transition">Contact</button>
            
            <div className="h-6 w-px bg-gray-300"></div> {/* Divider */}
            
            <button onClick={() => setView('admin')} className={`font-bold text-sm uppercase tracking-wider transition hover:text-blue-600 flex items-center gap-2 ${view === 'admin' ? 'text-blue-600' : 'text-gray-500'}`}>
              <Lock size={14}/> Staff Login
            </button>
            <button onClick={() => handleNavClick('booking-section')} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-7 py-2.5 rounded-full font-bold hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all transform hover:-translate-y-0.5">
              Book Online <ChevronRight size={18} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 hover:text-blue-600 focus:outline-none">
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full left-0">
            <div className="flex flex-col px-6 py-4 space-y-4">
              <button onClick={() => handleNavClick('home')} className="text-left font-bold text-gray-700 hover:text-blue-600">Home</button>
              <button onClick={() => handleNavClick('about')} className="text-left font-bold text-gray-700 hover:text-blue-600">About Us</button>
              <button onClick={() => handleNavClick('services')} className="text-left font-bold text-gray-700 hover:text-blue-600">Services</button>
              <button onClick={() => handleNavClick('contact')} className="text-left font-bold text-gray-700 hover:text-blue-600">Contact</button>
              <div className="h-px bg-gray-200 w-full my-2"></div>
              <button onClick={() => { setView('admin'); setIsMobileMenuOpen(false); }} className="text-left font-bold text-blue-600">Staff Login</button>
              <button onClick={() => handleNavClick('booking-section')} className="bg-blue-600 text-white text-center py-3 rounded-xl font-bold mt-2">Book Online</button>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="pt-20"></div>

      {view === 'main' && (
        <div className="overflow-hidden" id="home">
          
          {/* 1. CINEMATIC FULL-SCREEN HERO (Scrolls naturally, uses /image.png) */}
          <div 
            className="relative min-h-[90vh] flex items-center bg-cover bg-center bg-gray-900"
            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1920&q=80)" }}
          >
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-gray-900/40"></div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-10 pb-20">
              <div className="max-w-2xl animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-bold text-sm mb-6 backdrop-blur-md">
                  <Sparkles size={16} /> Now Accepting Online Appointments
                </div>
                <h2 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight drop-shadow-lg">
                  Advanced Care. <br/> 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                    Exceptional Results.
                  </span>
                </h2>
                <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-lg font-light">
                  Expert dental and dermatology specialists located in the heart of Blue Area, Islamabad. Skip the wait and schedule directly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => handleNavClick('booking-section')} className="flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-300 transform hover:-translate-y-1">
                    Book Appointment <Calendar size={20} />
                  </button>
                  <button onClick={() => handleNavClick('about')} className="flex justify-center items-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300">
                    Discover Our Clinic
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* STATS BAR */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 py-12 relative z-20 shadow-xl">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:divide-x divide-blue-700/50">
              <div className="p-4 flex flex-col items-center">
                <ShieldCheck className="text-cyan-400 mb-3" size={32} />
                <h4 className="text-white font-bold text-xl">Certified Experts</h4>
                <p className="text-blue-200 text-sm mt-1">Led by Dr. Kamil & Dr. Rahat</p>
              </div>
              <div className="p-4 flex flex-col items-center">
                <Clock className="text-cyan-400 mb-3" size={32} />
                <h4 className="text-white font-bold text-xl">Instant Booking</h4>
                <p className="text-blue-200 text-sm mt-1">Live schedule syncing</p>
              </div>
              <div className="p-4 flex flex-col items-center">
                <Sparkles className="text-cyan-400 mb-3" size={32} />
                <h4 className="text-white font-bold text-xl">Modern Technology</h4>
                <p className="text-blue-200 text-sm mt-1">State-of-the-art procedures</p>
              </div>
            </div>
          </div>

          {/* 2. LEGIT "ABOUT US" SECTION */}
          <div id="about" className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6">
              <AnimatedSection className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-6">
                  <h3 className="text-blue-600 font-bold tracking-widest uppercase text-sm">The Khattak Clinic Legacy</h3>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">Setting a New Standard in Blue Area.</h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Located at Flat #2, 1st Floor, 96-W, Khyber Plaza, Khattak Clinic stands as a premier dual-specialty medical facility in Islamabad. Founded on the principles of clinical excellence and patient comfort, we bring together elite dentistry and advanced dermatology under one roof.
                  </p>
                  <ul className="space-y-4 pt-4">
                    <li className="flex items-start gap-3">
                      <div className="bg-blue-100 p-1 rounded-full text-blue-600 mt-1"><CheckCircle2 size={18} /></div>
                      <p className="text-gray-700 font-medium"><strong className="text-gray-900">Dr. Kamil Imran Khattak</strong> leads our state-of-the-art dental division, specializing in complex restorative and cosmetic procedures.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-blue-100 p-1 rounded-full text-blue-600 mt-1"><CheckCircle2 size={18} /></div>
                      <p className="text-gray-700 font-medium"><strong className="text-gray-900">Dr. Rahat Ullah</strong> heads the dermatology and laser center, utilizing FDA-approved technology for unparalleled skin health.</p>
                    </li>
                  </ul>
                  <div className="pt-6">
                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 w-max">
                      <Award className="text-blue-600" size={32} />
                      <div>
                        <p className="font-bold text-gray-900">Trusted by Thousands</p>
                        <p className="text-sm text-gray-500">Across Islamabad & Rawalpindi</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Modern Image Grid */}
                <div className="grid grid-cols-2 gap-4 relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-cyan-400/20 rounded-3xl transform translate-x-4 translate-y-4 -z-10"></div>
                  <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80" alt="Dental Care" className="rounded-3xl shadow-xl hover:scale-105 transition-transform duration-500 object-cover h-64 w-full" />
                  <img 
                    src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=600&q=80" 
                    alt="Clinic Interior" 
                    className="rounded-3xl shadow-xl hover:scale-105 transition-transform duration-500 object-cover h-80 w-full mt-12"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x800/eff6ff/1e3a8a?text=Clinic+Facility&font=Montserrat"; }} 
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>

          {/* 3. OUR SERVICES */}
          <div id="services" className="bg-[#fbfcfd] py-24 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6">
              <AnimatedSection className="text-center mb-16">
                <h3 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Specialized Departments</h3>
                <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto rounded-full"></div>
              </AnimatedSection>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* DENTAL CARD */}
                <AnimatedSection className="bg-white rounded-[2rem] p-8 shadow-lg border border-gray-100 hover:shadow-[0_20px_50px_rgba(37,99,235,0.15)] hover:-translate-y-2 transition-all duration-500 group grid grid-cols-1 sm:grid-cols-12 gap-8 items-center cursor-pointer">
                  <div className="sm:col-span-5 aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden shadow-inner order-last sm:order-first relative">
                    <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-colors z-10"></div>
                    <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600" alt="Dr. Kamil" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="sm:col-span-7 space-y-4">
                    <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                      <Stethoscope className="text-blue-600 group-hover:text-white transition-colors" size={32} />
                    </div>
                    <h4 className="text-3xl font-bold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">Dental Care</h4>
                    <p className="text-gray-500 font-medium">Led by <span className="text-blue-700 font-bold">Dr. Kamil Imran Khattak</span></p>
                    <p className="text-gray-600 leading-relaxed">Expert cosmetic and restorative dentistry to bring back your perfect smile with painless procedures.</p>
                  </div>
                </AnimatedSection>

                {/* DERMATOLOGY CARD */}
                <AnimatedSection delay="delay-100" className="bg-white rounded-[2rem] p-8 shadow-lg border border-gray-100 hover:shadow-[0_20px_50px_rgba(6,182,212,0.15)] hover:-translate-y-2 transition-all duration-500 group grid grid-cols-1 sm:grid-cols-12 gap-8 items-center cursor-pointer">
                  <div className="sm:col-span-5 aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden shadow-inner order-last sm:order-first relative">
                    <div className="absolute inset-0 bg-cyan-600/10 group-hover:bg-transparent transition-colors z-10"></div>
                    <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600" alt="Dr. Rahat" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="sm:col-span-7 space-y-4">
                    <div className="bg-cyan-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan-500 group-hover:text-white transition-colors duration-500">
                      <Sparkles className="text-cyan-600 group-hover:text-white transition-colors" size={32} />
                    </div>
                    <h4 className="text-3xl font-bold text-gray-900 tracking-tight group-hover:text-cyan-600 transition-colors">Dermatology</h4>
                    <p className="text-gray-500 font-medium">Led by <span className="text-cyan-700 font-bold">Dr. Rahat Ullah</span></p>
                    <p className="text-gray-600 leading-relaxed">Advanced skin diagnostics and FDA-approved cosmetic laser treatments for flawless, healthy skin.</p>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </div>

          {/* 4. PROFESSIONAL ILLUSTRATIVE REVIEWS */}
          <div className="max-w-7xl mx-auto px-6 py-24">
            <AnimatedSection className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-semibold text-sm mb-4 border border-blue-100">
                Patient Feedback
              </span>
              <h3 className="text-4xl font-extrabold text-gray-900 mb-4">Patient Experiences</h3>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">Standard examples of patient satisfaction in dental and dermatology departments.</p>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Ahmed R.", text: "The online booking was seamless. I didn't have to wait at all when I arrived. Dr. Kamil fixed my tooth pain in one session.", service: "Illustrative Dental Example" },
                { name: "Sara M.", text: "Highly recommend Dr. Rahat for laser treatments. The clinic is incredibly clean and the staff is very professional.", service: "Illustrative Dermatology Example" },
                { name: "Usman Ali", text: "Finally, a modern clinic in Islamabad! Getting an appointment without calling reception 5 times is a game changer.", service: "Illustrative Routine Checkup" }
              ].map((review, i) => (
                <AnimatedSection key={i} delay={`delay-${i * 100}`} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
                  <div className="text-yellow-400 mb-4 text-xl">★★★★★</div>
                  <p className="text-gray-600 italic mb-6">"{review.text}"</p>
                  <div className="font-bold text-gray-900">{review.name}</div>
                  <div className="text-sm text-gray-500 font-medium">{review.service}</div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          {/* 5. PREMIUM BOOKING WIDGET */}
          <div id="booking-section" className="relative py-24 bg-gray-900 overflow-hidden px-6">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
               <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px]"></div>
               <div className="absolute bottom-[0%] right-[0%] w-[50%] h-[50%] bg-cyan-500/20 rounded-full mix-blend-screen filter blur-[100px]"></div>
            </div>
            
            <AnimatedSection className="relative z-10 max-w-4xl mx-auto bg-white p-10 md:p-14 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.3)]">
                <div className="text-center mb-10">
                  <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Schedule Your Visit</h3>
                  <p className="text-gray-500 text-lg">Directly sync your appointment with our reception desk.</p>
                </div>
                
                <form onSubmit={handleBookAppointment} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Patient Name</label>
                      <input type="text" name="patient_name" required value={formData.patient_name} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white hover:border-blue-300 transition-all outline-none" placeholder="Full Name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Phone Number</label>
                      <input type="text" name="phone_number" required value={formData.phone_number} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white hover:border-blue-300 transition-all outline-none" placeholder="051-2829337" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Department</label>
                      <select name="service_type" value={formData.service_type} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 outline-none transition-all">
                        <option value="Dental">Dental Care</option>
                        <option value="Dermatology">Dermatology (Skin/Laser)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Specialist</label>
                      <select name="doctor_name" value={formData.doctor_name} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 outline-none transition-all">
                        <option value="Dr. Kamil">Dr. Kamil Imran Khattak</option>
                        <option value="Dr. Rahat Ullah">Dr. Rahat Ullah Khattak</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Date</label>
                    <input type="date" name="appointment_date" required value={formData.appointment_date} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-blue-300 outline-none transition-all" />
                  </div>

                  <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold text-xl py-5 rounded-xl hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all duration-300 transform hover:-translate-y-1 flex justify-center items-center gap-3 mt-4">
                    Confirm Appointment <ShieldCheck size={24} />
                  </button>
                </form>
            </AnimatedSection>
          </div>

          {/* 6. CONTACT SECTION */}
          <div id="contact" className="py-24 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6">
              <AnimatedSection className="text-center mb-16">
                <h3 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Get in Touch</h3>
                <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto rounded-full"></div>
              </AnimatedSection>

              <AnimatedSection className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Location Card */}
                <div className="bg-gray-50 p-8 rounded-[2rem] text-center border border-gray-100 hover:border-blue-300 transition-colors">
                  <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <MapPin className="text-blue-600" size={28} />
                  </div>
                  <h4 className="font-bold text-xl text-gray-900 mb-3">Our Location</h4>
                  <p className="text-gray-600 leading-relaxed">Flat #2, 1st Floor, 96-W<br/>Khyber Plaza, Blue Area (G-7 side)<br/>Islamabad, Pakistan</p>
                </div>
                
                {/* Contact Card */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[2rem] text-center text-white shadow-xl transform md:-translate-y-4">
                  <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Phone className="text-white" size={28} />
                  </div>
                  <h4 className="font-bold text-xl text-white mb-3">Direct Contact</h4>
                  <p className="text-blue-100 leading-relaxed text-3xl font-bold tracking-wider mb-2">051-2829337</p>
                  <p className="text-blue-200">Call us for emergencies or immediate assistance.</p>
                </div>

                {/* Hours Card */}
                <div className="bg-gray-50 p-8 rounded-[2rem] text-center border border-gray-100 hover:border-blue-300 transition-colors">
                  <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Clock className="text-blue-600" size={28} />
                  </div>
                  <h4 className="font-bold text-xl text-gray-900 mb-3">Working Hours</h4>
                  <p className="text-gray-600 leading-relaxed font-medium">Monday - Friday: 9 AM - 8 PM<br/>Saturday: 10 AM - 6 PM<br/><span className="text-red-500">Sunday: Closed</span></p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      )}

      {/* --- ADMIN DASHBOARD (SECURED) --- */}
      {view === 'admin' && (
        <div className="max-w-7xl mx-auto px-6 min-h-[80vh] pt-32 pb-12">
          {!isAuthenticated ? (
            /* LOCK SCREEN */
            <AnimatedSection className="max-w-md mx-auto bg-white p-10 rounded-[2rem] shadow-2xl border border-gray-100 text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="text-blue-600" size={40} />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Staff Authentication</h2>
              <p className="text-gray-500 mb-8">Enter the authorization code to access patient records.</p>
              <form onSubmit={handleLogin} className="space-y-4">
                <input 
                  type="password" 
                  placeholder="Enter Code" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-center text-xl tracking-[0.5em]"
                />
                <button type="submit" className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-all">Unlock Dashboard</button>
                <button onClick={() => setView('main')} className="text-sm text-gray-400 font-medium pt-2 block mx-auto">Return Home</button>
              </form>
            </AnimatedSection>
          ) : (
            <AnimatedSection>
              <div className="flex justify-between items-center mb-10 border-b border-gray-200 pb-8">
                <div>
                  <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Staff Dashboard</h2>
                  <p className="text-gray-500 mt-2 text-lg">Secure Access: Authorized Personnel Only.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200 font-bold text-sm shadow-sm">
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span> System Active
                  </div>
                  <button onClick={() => setIsAuthenticated(false)} className="bg-gray-100 text-gray-600 px-6 py-2 rounded-full font-bold hover:bg-red-50 text-sm transition-colors">Logout</button>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                      <tr>
                        <th className="p-6 font-bold">Patient Details</th>
                        <th className="p-6 font-bold">Doctor</th>
                        <th className="p-6 font-bold">Date</th>
                        <th className="p-6 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {appointments.map((appt) => (
                        <tr key={appt.id} className="hover:bg-blue-50/50 transition-colors group">
                          <td className="p-6">
                            <div className="font-bold text-gray-900 text-lg">{appt.patient_name}</div>
                            <div className="text-gray-500 text-sm mt-1 flex items-center gap-1.5"><Phone size={14} /> {appt.phone_number}</div>
                            <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold border ${appt.service_type === 'Dental' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-cyan-50 text-cyan-700 border-cyan-200'}`}>
                              {appt.service_type}
                            </span>
                          </td>
                          <td className="p-6 font-medium text-gray-700">{appt.doctor_name}</td>
                          <td className="p-6 text-gray-600 font-medium">
                            <div className="flex items-center gap-2"><Calendar size={18} className="text-gray-400"/> {appt.appointment_date}</div>
                          </td>
                          <td className="p-6 text-right">
                            <button onClick={() => handleDelete(appt.id)} className="text-red-500 hover:text-white font-bold px-5 py-2.5 rounded-lg border border-red-200 hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100 shadow-sm">
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {appointments.length === 0 && (
                  <div className="p-20 text-center text-gray-500">
                    <Calendar className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="font-bold text-gray-900 text-xl">No appointments scheduled</h3>
                    <p className="mt-2">The schedule is currently clear.</p>
                  </div>
                )}
              </div>
            </AnimatedSection>
          )}
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-6 text-white">
              <ShieldCheck className="text-blue-500" size={28} />
              <h4 className="text-2xl font-extrabold tracking-tight">Khattak<span className="text-blue-500">Clinic.</span></h4>
            </div>
            <p className="leading-relaxed">Setting a new standard for medical and dental excellence in the heart of Islamabad's Blue Area.</p>
          </div>
          <div>
            <h4 className="text-white text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3 font-medium text-gray-300">
              <li><button onClick={() => handleNavClick('home')} className="hover:text-blue-400 transition">Home</button></li>
              <li><button onClick={() => handleNavClick('about')} className="hover:text-blue-400 transition">About Us</button></li>
              <li><button onClick={() => handleNavClick('services')} className="hover:text-blue-400 transition">Services</button></li>
              <li><button onClick={() => handleNavClick('contact')} className="hover:text-blue-400 transition">Contact Us</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-lg font-bold mb-6">Contact Info</h4>
            <ul className="space-y-3 font-medium text-gray-300">
              <li className="flex items-center gap-3"><Phone className="text-blue-500" size={18} /> 051-2829337</li>
              <li className="flex items-start gap-3"><MapPin className="text-blue-500 mt-1 shrink-0" size={18} /> Flat #2, 1st Floor, 96-W,<br/>Khyber Plaza, Blue Area,<br/>Islamabad</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 text-center text-sm">
          <p>© 2026 Khattak Dermatology & Dental Clinic. Proprietary software engineered by a SZABIST CS Student.</p>
        </div>
      </footer>

    </div>
  );
}

export default App;