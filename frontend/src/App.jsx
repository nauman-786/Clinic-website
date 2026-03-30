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
  
  // --- SECURITY STATES ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const STAFF_PASSWORD = "admin"; // <--- This is your access code

  const [formData, setFormData] = useState({
    patient_name: '', phone_number: '', service_type: 'Dental', doctor_name: 'Dr. Kamil', appointment_date: ''
  });

  const API_BASE = "https://clinic-website-1-m6bf.onrender.com";

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/book-appointment`, formData);
      alert("✅ Appointment Confirmed! We look forward to seeing you.");
      setFormData({ patient_name: '', phone_number: '', service_type: 'Dental', doctor_name: 'Dr. Kamil', appointment_date: '' });
    } catch (error) {
      alert("❌ Error connecting to the server. Is the Python backend running?");
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${API_BASE}/appointments`);
      setAppointments(response.data.appointments);
    } catch (error) {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await axios.delete(`${API_BASE}/appointments/${id}`);
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
      alert("❌ Access Denied: Incorrect Staff Credentials.");
    }
  };

  useEffect(() => {
    if (view === 'admin' && isAuthenticated) fetchAppointments();
  }, [view, isAuthenticated]);

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
      
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNavClick('home')}>
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-2.5 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck size={26} />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Khattak<span className="text-blue-600">Clinic.</span></h1>
          </div>
          
          <div className="hidden lg:flex space-x-8 items-center">
            <button onClick={() => handleNavClick('home')} className={`font-bold text-sm uppercase tracking-wider transition hover:text-blue-600 ${view === 'main' ? 'text-gray-900' : 'text-gray-500'}`}>Home</button>
            <button onClick={() => handleNavClick('about')} className="font-bold text-sm uppercase tracking-wider text-gray-500 hover:text-blue-600 transition">About Us</button>
            <button onClick={() => handleNavClick('services')} className="font-bold text-sm uppercase tracking-wider text-gray-500 hover:text-blue-600 transition">Services</button>
            <button onClick={() => handleNavClick('contact')} className="font-bold text-sm uppercase tracking-wider text-gray-500 hover:text-blue-600 transition">Contact</button>
            <div className="h-6 w-px bg-gray-300"></div> 
            <button onClick={() => setView('admin')} className={`font-bold text-sm uppercase tracking-wider transition hover:text-blue-600 flex items-center gap-2 ${view === 'admin' ? 'text-blue-600' : 'text-gray-500'}`}>
              <Lock size={14}/> Staff Login
            </button>
            <button onClick={() => handleNavClick('booking-section')} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-7 py-2.5 rounded-full font-bold hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all transform hover:-translate-y-0.5">
              Book Online <ChevronRight size={18} />
            </button>
          </div>

          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 hover:text-blue-600">
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full left-0">
            <div className="flex flex-col px-6 py-4 space-y-4">
              <button onClick={() => handleNavClick('home')} className="text-left font-bold text-gray-700 hover:text-blue-600">Home</button>
              <button onClick={() => handleNavClick('about')} className="text-left font-bold text-gray-700 hover:text-blue-600">About Us</button>
              <button onClick={() => { setView('admin'); setIsMobileMenuOpen(false); }} className="text-left font-bold text-blue-600">Staff Login</button>
              <button onClick={() => handleNavClick('booking-section')} className="bg-blue-600 text-white text-center py-3 rounded-xl font-bold mt-2">Book Online</button>
            </div>
          </div>
        )}
      </nav>

      <div className="pt-20"></div>

      {view === 'main' && (
        <div className="overflow-hidden" id="home">
          
          {/* HERO */}
          <div className="relative min-h-[90vh] flex items-center bg-cover bg-center bg-gray-900" style={{ backgroundImage: "url('/image.png')" }}>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-gray-900/40"></div>
            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-10 pb-20">
              <div className="max-w-2xl animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-bold text-sm mb-6 backdrop-blur-md">
                  <Sparkles size={16} /> Now Accepting Online Appointments
                </div>
                <h2 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
                  Advanced Care. <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Exceptional Results.</span>
                </h2>
                <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-lg font-light">Expert dental and dermatology specialists located in the heart of Blue Area, Islamabad.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => handleNavClick('booking-section')} className="flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all transform hover:-translate-y-1">
                    Book Appointment <Calendar size={20} />
                  </button>
                  <button onClick={() => handleNavClick('about')} className="flex justify-center items-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all">
                    Discover Our Clinic
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 py-12 relative z-20 shadow-xl">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:divide-x divide-blue-700/50 text-white">
              <div className="p-4 flex flex-col items-center">
                <ShieldCheck className="text-cyan-400 mb-3" size={32} />
                <h4 className="font-bold text-xl">Certified Experts</h4>
                <p className="text-blue-200 text-sm mt-1">Led by Dr. Kamil & Dr. Rahat</p>
              </div>
              <div className="p-4 flex flex-col items-center">
                <Clock className="text-cyan-400 mb-3" size={32} />
                <h4 className="font-bold text-xl">Instant Booking</h4>
                <p className="text-blue-200 text-sm mt-1">Live schedule syncing</p>
              </div>
              <div className="p-4 flex flex-col items-center">
                <Sparkles className="text-cyan-400 mb-3" size={32} />
                <h4 className="font-bold text-xl">Modern Technology</h4>
                <p className="text-blue-200 text-sm mt-1">State-of-the-art procedures</p>
              </div>
            </div>
          </div>

          {/* ABOUT */}
          <div id="about" className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6">
              <AnimatedSection className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-6">
                  <h3 className="text-blue-600 font-bold tracking-widest uppercase text-sm">The Khattak Clinic Legacy</h3>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">Setting a New Standard in Blue Area.</h2>
                  <p className="text-lg text-gray-600 leading-relaxed">Located at Flat #2, 1st Floor, 96-W, Khyber Plaza, Blue Area, Islamabad.</p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3"><CheckCircle2 className="text-blue-600 mt-1" size={18} /><p><strong>Dr. Kamil Imran Khattak</strong> — Advanced Dental Procedures</p></li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="text-blue-600 mt-1" size={18} /><p><strong>Dr. Rahat Ullah</strong> — Dermatology and Laser Specialist</p></li>
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4 relative">
                  <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80" alt="Dental" className="rounded-3xl shadow-xl h-64 w-full object-cover" />
                  <img src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=600&q=80" alt="Clinic" className="rounded-3xl shadow-xl h-80 w-full object-cover mt-12" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x800/eff6ff/1e3a8a?text=Clinic+Interior"; }} />
                </div>
              </AnimatedSection>
            </div>
          </div>

          {/* BOOKING */}
          <div id="booking-section" className="relative py-24 bg-gray-900 overflow-hidden px-6">
            <AnimatedSection className="relative z-10 max-w-4xl mx-auto bg-white p-10 md:p-14 rounded-[2rem] shadow-2xl">
                <div className="text-center mb-10">
                  <h3 className="text-3xl font-extrabold text-gray-900 mb-4">Schedule Your Visit</h3>
                  <p className="text-gray-500">Securely book your slot in our live dashboard.</p>
                </div>
                <form onSubmit={handleBookAppointment} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" name="patient_name" required value={formData.patient_name} onChange={handleChange} className="w-full p-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Full Name" />
                    <input type="text" name="phone_number" required value={formData.phone_number} onChange={handleChange} className="w-full p-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="051-2829337" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <select name="service_type" value={formData.service_type} onChange={handleChange} className="w-full p-4 bg-gray-50 border rounded-xl"><option value="Dental">Dental Care</option><option value="Dermatology">Dermatology</option></select>
                    <input type="date" name="appointment_date" required value={formData.appointment_date} onChange={handleChange} className="w-full p-4 bg-gray-50 border rounded-xl" />
                  </div>
                  <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold text-xl py-5 rounded-xl transition-all transform hover:-translate-y-1">Confirm Appointment</button>
                </form>
            </AnimatedSection>
          </div>
        </div>
      )}

      {/* --- SECURE ADMIN DASHBOARD --- */}
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
                <button type="submit" className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-all">Unlock</button>
                <button onClick={() => setView('main')} className="text-sm text-gray-400 font-medium pt-2 block mx-auto">Return Home</button>
              </form>
            </AnimatedSection>
          ) : (
            /* SECURE TABLE */
            <AnimatedSection>
              <div className="flex justify-between items-center mb-10 border-b pb-8">
                <div>
                  <h2 className="text-4xl font-extrabold text-gray-900">Staff Dashboard</h2>
                  <p className="text-gray-500 mt-2">Authenticated Access Only.</p>
                </div>
                <button onClick={() => setIsAuthenticated(false)} className="bg-gray-100 text-gray-600 px-6 py-2 rounded-full font-bold hover:bg-red-50 transition-colors">Logout</button>
              </div>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                    <tr><th className="p-6">Patient</th><th className="p-6">Doctor</th><th className="p-6">Date</th><th className="p-6 text-right">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y">
                    {appointments.map((appt) => (
                      <tr key={appt.id} className="hover:bg-blue-50/50 transition-colors group">
                        <td className="p-6"><div className="font-bold">{appt.patient_name}</div><div className="text-gray-500 text-sm">{appt.phone_number}</div></td>
                        <td className="p-6 font-medium">{appt.doctor_name}</td>
                        <td className="p-6 text-gray-600">{appt.appointment_date}</td>
                        <td className="p-6 text-right"><button onClick={() => handleDelete(appt.id)} className="text-red-500 font-bold opacity-0 group-hover:opacity-100 transition-all">Cancel</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {appointments.length === 0 && <div className="p-20 text-center text-gray-500 font-bold">No appointments found.</div>}
              </div>
            </AnimatedSection>
          )}
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h4 className="text-white text-2xl font-extrabold mb-6">Khattak<span className="text-blue-500">Clinic.</span></h4>
            <p>Premium medical and dental excellence in Blue Area, Islamabad.</p>
          </div>
          <div>
            <h4 className="text-white text-lg font-bold mb-6">Contact</h4>
            <p className="flex items-center gap-2"><Phone size={16}/> 051-2829337</p>
            <p className="flex items-start gap-2 mt-2"><MapPin size={16} className="mt-1"/> Khyber Plaza, Blue Area, Islamabad</p>
          </div>
          <div className="text-sm border-t md:border-t-0 pt-8 md:pt-0 border-gray-800">
            <p>© 2026 Khattak Clinic. Engineered by a SZABIST Student.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;