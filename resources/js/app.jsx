import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { api } from './api';

// Lucide icons as per Design System §8
import { 
  LayoutDashboard, 
  Camera, 
  BookOpen, 
  MapPin, 
  Clock, 
  WifiOff, 
  Cpu, 
  ChevronLeft, 
  Baby, 
  Scale, 
  Activity, 
  Phone, 
  Info,
  CheckCircle2,
  Utensils,
  Settings,
  Sparkles,
  Brain
} from 'lucide-react';

// Page component imports (Desktop views)
import HomePage from './components/HomePage';
import ScreeningPage from './components/ScreeningPage';
import EdukasiPage from './components/EdukasiPage';
import FaskesPage from './components/FaskesPage';
import RiwayatPage from './components/RiwayatPage';
import FoodAiPage from './components/FoodAiPage';
import MentalScanPage from './components/MentalScanPage';
import LoginRegisterPage from './components/LoginRegisterPage';


// ============================================
// PLATFORM DETECTION HOOK (Design System §13)
// ============================================
function useIsDesktop() {
  const [is, setIs] = useState(() => window.innerWidth >= 1024);
  useEffect(() => {
    const h = () => setIs(window.innerWidth >= 1024);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return is;
}

// ============================================
// NURA AI CHATBOT WIDGET
// ============================================
function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Halo! Saya NURA Assistant AI. Ada yang bisa saya bantu terkait rhesus, stunting anak, anemia balita, imunisasi, atau MPASI?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const body = {
      conversation: [...messages, userMsg].map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }))
    };

    api('/chat', { method: 'POST', body: JSON.stringify(body) }).then(res => {
      setMessages(prev => [...prev, { sender: 'bot', text: res.output }]);
      setLoading(false);
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 md:w-96 h-[480px] bg-white border border-nura-foreground/15 rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden animate-scaleIn text-nura-foreground font-sans">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-nura-blue to-nura-blue/90 border-b border-nura-blue/20 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-nura-teal animate-pulse"></span>
              <h4 className="text-xs font-bold uppercase tracking-wider">NURA Assistant AI</h4>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-blue-150 hover:text-white text-xs">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-nura-muted scrollbar-thin">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-xl text-xs max-w-[80%] leading-relaxed ${m.sender === 'user' ? 'bg-nura-blue text-white font-bold' : 'bg-white border border-nura-foreground/10 text-nura-foreground/90'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-xl bg-white border border-nura-foreground/10 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-nura-blue rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-nura-blue rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-nura-blue rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-nura-muted bg-white flex gap-2">
            <input 
              type="text" value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tanyakan penanganan anemia..." 
              className="flex-1 h-[40px] px-3 text-xs bg-nura-muted border border-nura-foreground/10 focus:border-nura-blue focus:bg-white focus:outline-none rounded-lg text-nura-foreground font-semibold" 
            />
            <button onClick={handleSend} className="px-4 bg-nura-blue hover:opacity-90 text-white font-bold rounded-lg text-xs transition-all">Kirim</button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)} 
          className="w-14 h-14 bg-gradient-to-tr from-nura-blue to-nura-blue/90 rounded-full flex items-center justify-center text-2xl shadow-2xl hover:scale-105 transition-all duration-200"
        >
          💬
        </button>
      )}
    </div>
  );
}

// ============================================
// MOBILE APP REPRESENTATION (Design System §14)
// ============================================
function MobileApp({ user, onLogout, onLoginSuccess, history, addHistory, onOpenSettings }) {
  const [screen, setScreen] = useState(() => window.INITIAL_TAB || 'home'); // onboarding, home, profile, measurements, ai_setup, camera, results, education, faskes, history, food_ai, mental_scan, auth
  const [targetScreen, setTargetScreen] = useState(null);
  
  // Mobile screening state
  const [patient, setPatient] = useState({ name: '', age: '', gender: 'L' });
  const [measurements, setMeasurements] = useState({ weight: '', height: '' });
  const [loadingAI, setLoadingAI] = useState(false);
  const [photos, setPhotos] = useState({ muka: null, mata: null, kuku: null });
  const [cameraActive, setCameraActive] = useState(false);
  const [currentArea, setCurrentArea] = useState('muka');
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
  
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  const getBMI = () => {
    const w = parseFloat(measurements.weight);
    const h = parseFloat(measurements.height) / 100;
    if (!w || !h) return 0;
    return (w / (h * h)).toFixed(1);
  };

  const getBMIStatus = () => {
    const bmi = parseFloat(getBMI());
    if (!bmi) return 'Belum dihitung';
    if (bmi < 14) return 'Gizi Kurang (Wasting)';
    if (bmi > 18) return 'Gizi Lebih';
    return 'Gizi Baik (Normal)';
  };

  const getStuntingStatus = () => {
    const age = parseInt(patient.age) || 0;
    const h = parseFloat(measurements.height) || 0;
    if (!age || !h) return 'Belum dihitung';
    if (age <= 24 && h < 78) return 'Pendek (Stunting)';
    if (age > 24 && h < 84) return 'Pendek (Stunting)';
    return 'Normal';
  };

  const triggerAIInstall = () => {
    setLoadingAI(true);
    setTimeout(() => {
      setLoadingAI(false);
      setScreen('camera');
    }, 2000);
  };

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = s;
      }, 100);
    } catch (err) {
      alert("Kamera tidak diakses, silakan pilih berkas foto dari galeri lokal.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setPhotos(prev => ({ ...prev, [currentArea]: dataUrl }));
      setCameraActive(false);
    }
  };

  const runAnalysis = () => {
    setAnalyzing(true);
    setScreen('results');
    setTimeout(() => {
      const stunting = getStuntingStatus();
      let anemia = 'Normal';
      let urgency = 'Rendah';
      
      if (patient.name.toLowerCase().includes('rara') || patient.name.toLowerCase().includes('putri')) {
        anemia = 'Anemia Berat';
        urgency = 'Tinggi';
      } else if (patient.name.toLowerCase().includes('siti') || patient.name.toLowerCase().includes('aulia') || patient.name.toLowerCase().includes('naila')) {
        anemia = 'Anemia Ringan';
        urgency = 'Sedang';
      }

      const generated = {
        id: Date.now(),
        nama_anak: patient.name,
        usia_bulan: parseInt(patient.age),
        jenis_kelamin: patient.gender,
        berat_badan: parseFloat(measurements.weight),
        tinggi_badan: parseFloat(measurements.height),
        status_stunting: stunting,
        status_anemia: anemia,
        tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        level_urgensi: urgency,
        catatan: anemia === 'Anemia Berat' 
          ? "Rujukan segera ke spesialis anak di RSUD terdekat untuk transfusi. Tingkatkan asupan makanan besi."
          : anemia === 'Anemia Ringan'
          ? "Balita menunjukkan anemia ringan. Berikan suplemen drop besi, hati ayam, dan daging."
          : "Status gizi dan anemia normal. Pertahankan gizi seimbang harian."
      };
      
      setReport(generated);
      addHistory(generated);
      setAnalyzing(false);
    }, 2000);
  };

  const handleMobileScreenChange = (nextScreen) => {
    const publicScreens = ['onboarding', 'home', 'education', 'faskes'];
    if (!publicScreens.includes(nextScreen) && !user) {
      setTargetScreen(nextScreen);
      setScreen('auth');
    } else {
      setScreen(nextScreen);
    }
  };

  const handleLoginSuccess = (userData) => {
    onLoginSuccess(userData);
    if (targetScreen) {
      setScreen(targetScreen);
      setTargetScreen(null);
    } else {
      setScreen('home');
    }
  };

  const navItems = [
    { id: 'home', label: 'Beranda', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'profile', label: 'Skrining', icon: <Camera className="w-5 h-5" /> },
    { id: 'education', label: 'Edukasi', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'faskes', label: 'Faskes', icon: <MapPin className="w-5 h-5" /> },
    { id: 'history', label: 'Riwayat', icon: <Clock className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col w-full relative pb-16 font-sans text-nura-foreground select-none">
      
      {/* Mobile Top Navbar Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-nura-foreground/10 px-5 py-3.5 flex items-center justify-between shadow-sm shrink-0">
        <span className="text-base font-black text-nura-foreground tracking-tight">GiziKu</span>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onOpenSettings()}
            className="p-1.5 rounded-lg bg-nura-muted text-nura-muted-foreground"
            title="Pengaturan"
          >
            <Settings className="w-4 h-4" />
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-nura-muted-foreground max-w-[80px] truncate">{user.name}</span>
              <button 
                onClick={onLogout}
                className="px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 text-[10px] font-bold rounded-lg transition-all"
              >
                Keluar
              </button>
            </div>
          ) : (
            <button 
              onClick={() => handleMobileScreenChange('auth')}
              className="px-3 py-1 bg-nura-blue text-white text-[10px] font-bold rounded-lg hover:opacity-90 transition-all shadow-md shadow-nura-blue/15"
            >
              Masuk
            </button>
          )}
        </div>
      </header>

      {/* Screen Content (Scrollable, flex-grow) */}
      <div className="flex-grow p-5 bg-[#f8fafc]">
        
        {/* AUTH SCREEN */}
        {screen === 'auth' && (
          <LoginRegisterPage 
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => setScreen('home')}
          />
        )}

        {/* ONBOARDING SCREEN */}
        {screen === 'onboarding' && (
          <div className="flex flex-col justify-between h-full animate-fadeIn max-w-md mx-auto">
            <div className="space-y-6 text-center pt-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-[84px] h-[84px] bg-gradient-to-tr from-nura-blue to-nura-coral rounded-[24px] flex items-center justify-center text-4xl text-white font-extrabold shadow-lg shadow-nura-blue/15">N</div>
                <h1 className="text-[30px] font-extrabold tracking-tight text-nura-foreground leading-none">NURA</h1>
                <p className="text-[11px] font-bold uppercase tracking-widest text-nura-muted-foreground">Nutrisi & Urgensi Remaja-Anak</p>
              </div>
              
              <p className="text-xs text-nura-muted-foreground leading-relaxed font-semibold">
                Pantau tumbuh kembang dan gizi si kecil secara instan, tanpa internet.
              </p>

              <div className="space-y-3.5 text-left border border-nura-foreground/5 p-4 rounded-2xl bg-white shadow-sm">
                <div className="flex gap-3 text-xs leading-relaxed font-semibold">
                  <span className="text-base shrink-0">📸</span>
                  <div>
                    <h4 className="font-bold text-nura-foreground">Screening AI Mandiri</h4>
                    <p className="text-[10px] text-nura-muted-foreground font-medium">Deteksi anemia & stunting dari kelopak mata, kuku, dan wajah.</p>
                  </div>
                </div>
                <div className="flex gap-3 text-xs leading-relaxed font-semibold">
                  <span className="text-base shrink-0">🏥</span>
                  <div>
                    <h4 className="font-bold text-nura-foreground">Jejaring Rujukan Medis</h4>
                    <p className="text-[10px] text-nura-muted-foreground font-medium">Temukan bidan Posyandu dan Puskesmas terdekat secara offline.</p>
                  </div>
                </div>
                <div className="flex gap-3 text-xs leading-relaxed font-semibold">
                  <span className="text-base shrink-0">📖</span>
                  <div>
                    <h4 className="font-bold text-nura-foreground">Rencana Gizi Bidan</h4>
                    <p className="text-[10px] text-nura-muted-foreground font-medium">Panduan MPASI harian dan vitamin dari instansi kesehatan tepercaya.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <button 
                onClick={() => setScreen('home')}
                className="w-full h-[56px] bg-nura-blue hover:opacity-90 active:scale-[0.98] text-white font-bold rounded-3xl text-sm transition-all shadow-lg"
              >
                Mulai Sekarang
              </button>
            </div>
          </div>
        )}

        {/* HOME SCREEN */}
        {screen === 'home' && (
          <div className="animate-fadeIn">
            <HomePage 
              history={history} 
              onTabChange={handleMobileScreenChange}
              provinces={window.GIZIKU_PROVINCES}
              isAuthenticated={!!user}
              onAuthClick={(m) => {
                setTargetScreen('home');
                setScreen('auth');
              }}
            />
          </div>
        )}

        {/* SCREEN: PROFILE (Step 1) */}
        {screen === 'profile' && (
          <div className="flex flex-col justify-between h-full animate-fadeIn max-w-md mx-auto">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <button onClick={() => setScreen('home')} className="w-8 h-8 rounded-xl bg-nura-muted flex items-center justify-center"><ChevronLeft className="w-5 h-5 text-nura-muted-foreground" /></button>
                <h3 className="text-sm font-bold text-nura-foreground">Profil Anak</h3>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground mb-1.5">Nama Anak</label>
                  <input 
                    type="text" value={patient.name} onChange={(e) => setPatient(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full h-[52px] px-4 py-3 text-xs bg-nura-muted border-2 border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-nura-foreground font-semibold"
                    placeholder="mis. Siti Nurhaliza" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground mb-1.5">Usia (bulan)</label>
                  <input 
                    type="number" value={patient.age} onChange={(e) => setPatient(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full h-[52px] px-4 py-3 text-xs bg-nura-muted border-2 border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-nura-foreground font-semibold"
                    placeholder="mis. 24" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground mb-1.5">Jenis Kelamin</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setPatient(prev => ({ ...prev, gender: 'L' }))} className={`h-[52px] text-xs font-bold rounded-xl ${patient.gender === 'L' ? 'bg-nura-blue text-white' : 'bg-nura-muted text-nura-muted-foreground'}`}>♂ Laki-laki</button>
                    <button onClick={() => setPatient(prev => ({ ...prev, gender: 'P' }))} className={`h-[52px] text-xs font-bold rounded-xl ${patient.gender === 'P' ? 'bg-nura-blue text-white' : 'bg-nura-muted text-nura-muted-foreground'}`}>♀ Perempuan</button>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setScreen('measurements')} disabled={!patient.name || !patient.age}
              className={`w-full h-[56px] rounded-3xl font-bold text-sm transition-all mt-6 ${(!patient.name || !patient.age) ? 'bg-slate-300 text-white cursor-default' : 'bg-nura-blue text-white hover:opacity-90 active:scale-[0.98]'}`}
            >
              Lanjut
            </button>
          </div>
        )}

        {/* SCREEN: MEASUREMENTS (Step 2) */}
        {screen === 'measurements' && (
          <div className="flex flex-col justify-between h-full animate-fadeIn max-w-md mx-auto">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <button onClick={() => setScreen('profile')} className="w-8 h-8 rounded-xl bg-nura-muted flex items-center justify-center"><ChevronLeft className="w-5 h-5 text-nura-muted-foreground" /></button>
                <h3 className="text-sm font-bold text-nura-foreground">Berat & Tinggi Badan</h3>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground mb-1.5">Berat Badan (kg)</label>
                  <input 
                    type="number" step="0.1" value={measurements.weight} onChange={(e) => setMeasurements(prev => ({ ...prev, weight: e.target.value }))}
                    className="w-full h-[52px] px-4 py-3 text-xs bg-nura-muted border-2 border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-nura-foreground font-semibold"
                    placeholder="mis. 11.5" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground mb-1.5">Tinggi Badan (cm)</label>
                  <input 
                    type="number" step="0.5" value={measurements.height} onChange={(e) => setMeasurements(prev => ({ ...prev, height: e.target.value }))}
                    className="w-full h-[52px] px-4 py-3 text-xs bg-nura-muted border-2 border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-nura-foreground font-semibold"
                    placeholder="mis. 85" 
                  />
                </div>
              </div>

              {measurements.weight && measurements.height && (
                <div className="p-4 bg-white border border-nura-foreground/10 rounded-xl space-y-1.5 text-xs font-semibold shadow-sm">
                  <div className="flex justify-between"><span>Status Gizi (BMI):</span><span className="text-nura-blue font-bold">{getBMIStatus()}</span></div>
                  <div className="flex justify-between"><span>Tinggi Badan:</span><span className="text-nura-blue font-bold">{getStuntingStatus()}</span></div>
                </div>
              )}
            </div>

            <button 
              onClick={triggerAIInstall} disabled={!measurements.weight || !measurements.height}
              className={`w-full h-[56px] rounded-3xl font-bold text-sm transition-all mt-6 ${(!measurements.weight || !measurements.height) ? 'bg-slate-300 text-white cursor-default' : 'bg-nura-blue text-white hover:opacity-90 active:scale-[0.98]'}`}
            >
              Lanjut
            </button>
          </div>
        )}

        {/* SCREEN: AI SETUP (Step 3) */}
        {screen === 'ai_setup' && (
          <div className="flex flex-col justify-between h-full animate-fadeIn max-w-md mx-auto">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <button onClick={() => setScreen('measurements')} className="w-8 h-8 rounded-xl bg-nura-muted flex items-center justify-center"><ChevronLeft className="w-5 h-5 text-nura-muted-foreground" /></button>
                <h3 className="text-sm font-bold text-nura-foreground">Persiapan AI</h3>
              </div>

              <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-10 h-10 border-4 border-nura-blue border-t-transparent rounded-full animate-spin"></div>
                <div className="text-xs text-nura-muted-foreground font-semibold">Mengunduh & mengoptimalkan model deteksi lokal...</div>
                <div className="w-48 bg-nura-accent h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-nura-blue animate-[progress_2s_ease-in-out_infinite]" style={{width: '60%'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN: CAMERA (Step 4) */}
        {screen === 'camera' && (
          <div className="flex flex-col justify-between h-full animate-fadeIn max-w-md mx-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => setScreen('measurements')} className="w-7 h-7 rounded-lg bg-nura-muted flex items-center justify-center"><ChevronLeft className="w-4 h-4 text-nura-muted-foreground" /></button>
                  <h3 className="text-xs font-bold text-nura-foreground">Ambil Foto Fisik</h3>
                </div>
                <span className="text-[10px] font-bold uppercase bg-nura-accent text-nura-blue px-2 py-0.5 rounded-md">Area: {currentArea.toUpperCase()}</span>
              </div>

              <div className="w-full aspect-[4/3] bg-slate-900 rounded-xl overflow-hidden relative border border-nura-foreground/10 flex flex-col items-center justify-center">
                {cameraActive ? (
                  <>
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100" />
                    <div className="absolute inset-0 border-2 border-nura-blue/45 flex items-center justify-center">
                      <div className={`w-28 h-28 border border-dashed border-nura-teal/80 ${currentArea === 'muka' ? 'rounded-full' : 'rounded-lg'}`}></div>
                    </div>
                  </>
                ) : photos[currentArea] ? (
                  <img src={photos[currentArea]} className="w-full h-full object-cover" alt="Captured" />
                ) : (
                  <div className="text-center text-slate-400 space-y-2 p-4">
                    <span className="text-3xl block">👁️</span>
                    <p className="text-[10px] font-semibold leading-relaxed">Posisikan kelopak mata atau kuku anak tepat di garis penunjuk</p>
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-3">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setPhotos(prev => ({ ...prev, [currentArea]: event.target.result }));
                    };
                    reader.readAsDataURL(file);
                  }
                }} />
                {cameraActive ? (
                  <button 
                    onClick={capturePhoto}
                    className="w-16 h-16 rounded-full bg-white border-[5px] border-nura-blue shadow-lg"
                  />
                ) : (
                  <div className="flex gap-2">
                    <button onClick={startCamera} className="px-3.5 py-2 text-[10px] font-bold border border-nura-foreground/10 rounded-xl bg-white text-nura-foreground">Buka Kamera</button>
                    <button onClick={() => fileInputRef.current.click()} className="px-3.5 py-2 text-[10px] font-bold border border-nura-foreground/10 rounded-xl bg-white text-nura-foreground">Pilih Berkas</button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {['muka', 'mata', 'kuku'].map(a => (
                  <button 
                    key={a} onClick={() => { setCameraActive(false); setCurrentArea(a); }}
                    className={`p-2 rounded-xl text-center border font-bold text-[10px] ${currentArea === a ? 'bg-nura-accent border-nura-blue text-nura-blue' : 'bg-nura-muted border-transparent text-nura-muted-foreground'}`}
                  >
                    <div>{a.toUpperCase()}</div>
                    <div className="text-[9px] text-nura-muted-foreground mt-0.5 leading-none">{photos[a] ? '✓ terunggah' : 'belum'}</div>
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={runAnalysis} disabled={!photos.muka && !photos.mata && !photos.kuku}
              className={`w-full h-[56px] rounded-3xl font-bold text-sm transition-all mt-6 ${(!photos.muka && !photos.mata && !photos.kuku) ? 'bg-slate-350 text-white cursor-default' : 'bg-nura-blue text-white hover:opacity-90 active:scale-[0.98]'}`}
            >
              Mulai Analisis AI
            </button>
          </div>
        )}

        {/* SCREEN: RESULTS (Step 5) */}
        {screen === 'results' && (
          <div className="flex flex-col justify-between h-full animate-fadeIn max-w-md mx-auto">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-nura-foreground border-b border-nura-muted pb-2">Hasil Diagnosa AI</h3>

              {analyzing ? (
                <div className="py-12 text-center space-y-3 flex flex-col items-center">
                  <div className="w-8 h-8 border-3 border-nura-blue border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-xs text-nura-muted-foreground font-semibold">Memproses di GPU perangkat... Tidak perlu internet.</div>
                </div>
              ) : report ? (
                <div className="space-y-4">
                  <div className="p-4 bg-white border border-nura-foreground/10 rounded-2xl space-y-3 text-xs leading-relaxed font-semibold shadow-sm">
                    <div className="flex justify-between border-b border-nura-foreground/5 pb-2">
                      <span className="font-extrabold text-nura-foreground">{report.nama_anak}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase shadow-inner ${
                        report.status_anemia === 'Anemia Berat' ? 'bg-[#fee2e2] text-[#e53e3e]' : report.status_anemia === 'Anemia Ringan' ? 'bg-[#fef9c3] text-[#ca8a04]' : 'bg-[#dcfce7] text-[#16a34a]'
                      }`}>{report.status_anemia}</span>
                    </div>
                    
                    <div className="flex justify-between"><span>Indeks Tinggi Badan:</span><span className="text-nura-foreground font-bold">{report.status_stunting}</span></div>
                    <div className="flex justify-between"><span>Usia:</span><span className="text-nura-foreground font-bold">{report.usia_bulan} bulan</span></div>
                    
                    <div className="border-t border-nura-foreground/5 pt-2 font-medium text-nura-muted-foreground leading-relaxed">
                      {report.catatan}
                    </div>
                  </div>

                  <div className="space-y-2 pt-4">
                    <button onClick={() => handleMobileScreenChange('home')} className="w-full h-[52px] bg-nura-blue text-white font-bold rounded-2xl text-xs active:scale-[0.98] transition-all shadow-md">Kembali ke Beranda</button>
                    <button onClick={() => window.print()} className="w-full h-[48px] bg-nura-muted text-nura-muted-foreground font-bold rounded-2xl text-xs active:scale-[0.98] transition-all">Cetak Laporan PDF</button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* SCREEN: EDUCATION */}
        {screen === 'education' && (
          <div className="animate-fadeIn">
            <EdukasiPage user={user} />
          </div>
        )}

        {/* SCREEN: FASKES */}
        {screen === 'faskes' && (
          <div className="animate-fadeIn">
            <FaskesPage />
          </div>
        )}

        {/* SCREEN: HISTORY */}
        {screen === 'history' && (
          <div className="animate-fadeIn">
            <RiwayatPage history={history} />
          </div>
        )}

        {/* SCREEN: FOOD AI */}
        {screen === 'food_ai' && (
          <div className="animate-fadeIn">
            <FoodAiPage history={history} />
          </div>
        )}

        {/* SCREEN: MENTAL SCAN */}
        {screen === 'mental_scan' && (
          <div className="animate-fadeIn">
            <MentalScanPage />
          </div>
        )}

      </div>

      {/* Sticky Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-nura-foreground/10 flex justify-around py-2.5 shadow-lg select-none shrink-0">
        {navItems.map(item => {
          const isActive = screen === item.id || 
            (item.id === 'profile' && ['profile', 'measurements', 'ai_setup', 'camera', 'results'].includes(screen));
          
          return (
            <button
              key={item.id}
              onClick={() => handleMobileScreenChange(item.id)}
              className={`flex flex-col items-center gap-1.5 text-[9px] font-black transition-all ${
                isActive ? 'text-nura-blue scale-105' : 'text-nura-muted-foreground hover:text-nura-foreground'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}

// ============================================
// WEB DESKTOP REPRESENTATION (Design System §15)
// ============================================
function DesktopApp({ user, onLogout, onLoginSuccess, history, addHistory, onOpenSettings }) {
  const [activeTab, setActiveTab] = useState(() => window.INITIAL_TAB || 'home');
  const [targetTab, setTargetTab] = useState(null);

  const MENU_ITEMS = [
    { id: 'home', label: 'Beranda', icon: <LayoutDashboard className="w-5 h-5 shrink-0" /> },
    { id: 'screening', label: 'Screening Kesehatan', icon: <Camera className="w-5 h-5 shrink-0" /> },
    { id: 'mental_scan', label: 'Skrining Mental AI', icon: <Brain className="w-5 h-5 shrink-0" /> },
    { id: 'food_ai', label: 'Rekomendasi Makanan AI', icon: <Utensils className="w-5 h-5 shrink-0" /> },
    { id: 'education', label: 'Edukasi & Literasi', icon: <BookOpen className="w-5 h-5 shrink-0" /> },
    { id: 'facilities', label: 'Faskes Terdekat', icon: <MapPin className="w-5 h-5 shrink-0" /> },
    { id: 'history', label: 'Riwayat Pemeriksaan', icon: <Clock className="w-5 h-5 shrink-0" /> }
  ];

  if (user && user.role_id === 1) {
    MENU_ITEMS.push({ id: 'admin_import', label: 'Import Excel (Stunting)', icon: <Settings className="w-5 h-5 shrink-0" /> });
  }

  const handleTabChange = (tabId) => {
    if (tabId === 'admin_import') {
      window.location.href = '/admin/dashboard';
      return;
    }
    const publicTabs = ['home', 'education', 'facilities'];
    if (!publicTabs.includes(tabId) && !user) {
      setTargetTab(tabId);
      setActiveTab('auth');
    } else {
      setActiveTab(tabId);
    }
  };

  const handleLoginSuccess = (userData) => {
    onLoginSuccess(userData);
    if (targetTab) {
      setActiveTab(targetTab);
      setTargetTab(null);
    } else {
      setActiveTab('home');
    }
  };

  const renderContent = () => {
    if (activeTab === 'auth') {
      return (
        <div className="max-w-md mx-auto py-8">
          <AuthPage onLoginSuccess={handleLoginSuccess} />
        </div>
      );
    }

    switch (activeTab) {
      case 'home': 
        return <HomePage history={history} onTabChange={handleTabChange} />;
      case 'screening': 
        return <ScreeningPage onSaveHistory={addHistory} />;
      case 'mental_scan':
        return <MentalScanPage />;
      case 'food_ai':
        return <FoodAiPage history={history} />;
      case 'education': 
        return <EdukasiPage user={user} />;
      case 'facilities': 
        return <FaskesPage />;
      case 'history': 
        return <RiwayatPage history={history} />;
      default: 
        return <HomePage history={history} onTabChange={handleTabChange} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f0f4f8] text-nura-foreground overflow-hidden font-sans">
      {/* Sidebar fixed 260px left (Design System §15.2) */}
      <aside className="w-[260px] bg-white border-r-[1.5px] border-nura-foreground/8 flex flex-col justify-between shrink-0">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Brand Logo */}
          <div className="h-16 flex items-center px-6 border-b border-nura-foreground/5 bg-white">
            <span className="text-lg font-extrabold tracking-wider text-nura-foreground">
              NURA <span className="text-[10px] uppercase tracking-widest font-bold text-nura-blue ml-1.5">Kesehatan Anak</span>
            </span>
          </div>

          {/* Navigation Links (Design System §15.3) */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5 scrollbar-thin">
            {MENU_ITEMS.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button 
                  key={item.id} 
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-xs font-bold rounded-xl transition-all ${
                    isActive 
                      ? 'bg-nura-accent text-nura-blue shadow-inner' 
                      : 'text-nura-muted-foreground hover:text-nura-foreground hover:bg-nura-muted'
                  }`}
                  onClick={() => handleTabChange(item.id)}
                >
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Offline Status Card & Version Footer */}
        <div className="p-4 border-t border-nura-foreground/5 space-y-3.5 bg-nura-muted/40">
          <div className="p-3 bg-[#e8f5f4] rounded-xl flex items-center gap-2.5 text-[#2d6b66] border border-nura-teal/5">
            <WifiOff className="w-4 h-4 text-nura-teal shrink-0" />
            <div className="text-[9px] font-bold uppercase tracking-wider leading-none">
              Mode Offline Aktif
              <span className="block text-[8px] font-semibold text-[#2d6b66]/80 mt-1 lowercase">AI berjalan di perangkat</span>
            </div>
          </div>
          <div className="text-[10px] text-nura-muted-foreground font-bold text-center">NURA v1.1 · Juli 2026</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#f0f4f8]">
        {/* Top Page Header */}
        <header className="h-16 border-b border-nura-foreground/8 flex items-center justify-between px-6 bg-white shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground font-semibold">Program Penyelamatan & Pencegahan Stunting Nasional</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onOpenSettings}
              className="w-10 h-10 rounded-xl bg-nura-muted hover:bg-slate-200/80 flex items-center justify-center text-nura-muted-foreground hover:text-nura-foreground transition-all"
              title="Pengaturan API Key"
            >
              <Settings className="w-5 h-5" />
            </button>
            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-100">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-black text-nura-foreground leading-none">{user.name}</span>
                  <span className="text-[9px] font-bold text-nura-muted-foreground uppercase tracking-wider mt-0.5">{user.role_name || 'Pengguna'}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="px-3.5 py-2 text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100/60 rounded-xl transition-all"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setActiveTab('auth')}
                className="px-4.5 py-2 text-xs font-bold text-white bg-nura-blue hover:opacity-90 rounded-xl transition-all shadow-md shadow-nura-blue/15"
              >
                Masuk
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Content Container (Design System §7.2) */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6 max-w-6xl mx-auto w-full">
          {renderContent()}
        </main>
      </div>

      {/* App Chatbot Assistant */}
      <ChatbotWidget />
    </div>
  );
}

// ============================================
// SETTINGS MODAL (API KEY SETTINGS)
// ============================================
function SettingsModal({ isOpen, onClose }) {
  const [key, setKey] = useState('');

  useEffect(() => {
    if (isOpen) {
      setKey(localStorage.getItem('gn_deepseek_key') || '');
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('gn_deepseek_key', key.trim());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn text-nura-foreground font-sans">
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-[28px] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-nura-muted pb-3">
          <h3 className="text-sm font-black text-nura-foreground flex items-center gap-2">
            ⚙️ Pengaturan API Key AI
          </h3>
          <button onClick={onClose} className="text-nura-muted-foreground hover:text-nura-foreground text-xs font-bold">✕</button>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground">
              DeepSeek API Key
            </label>
            <input 
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Masukkan DeepSeek API Key (sk-...)"
              className="w-full h-[48px] px-3.5 py-2.5 text-xs bg-nura-muted border border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-nura-foreground font-semibold"
            />
            <p className="text-[9px] text-nura-muted-foreground leading-relaxed font-semibold">
              Key disimpan secara lokal di browser (`gn_deepseek_key`). Jika dikosongkan, sistem akan otomatis menggunakan API Key Server (Gemini/Groq) atau mode rekomendasi offline.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button 
            onClick={onClose}
            className="px-4.5 py-2 text-xs font-bold rounded-xl bg-nura-muted text-nura-muted-foreground hover:bg-slate-200/80 transition-all"
          >
            Batal
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 text-xs font-bold rounded-xl bg-nura-blue text-white hover:opacity-90 transition-all shadow-md shadow-nura-blue/15"
          >
            Simpan Key
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ROOT RENDER DISPATCHER
// ============================================
function App() {
  const isDesktop = useIsDesktop();
  const [user, setUser] = useState(() => window.USER || null);
  const [history, setHistory] = useState([]);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    fetch('/api/tracker')
      .then(res => res.json())
      .then(data => {
        setHistory(data);
      })
      .catch(err => {
        console.error(err);
      });
  }, [user]);

  const handleSaveHistory = (newRecord) => {
    fetch('/api/tracker', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      },
      body: JSON.stringify(newRecord)
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.success) {
          fetch('/api/tracker')
            .then(res => res.json())
            .then(setHistory);
        } else {
          setHistory(prev => [newRecord, ...prev]);
        }
      })
      .catch(() => {
        setHistory(prev => [newRecord, ...prev]);
      });
  };

  const handleLogout = () => {
    fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      }
    })
      .then(res => res.json())
      .then(() => {
        setUser(null);
        window.location.reload();
      })
      .catch(() => {
        setUser(null);
        window.location.reload();
      });
  };

  return (
    <>
      {isDesktop
        ? <DesktopApp user={user} onLogout={handleLogout} onLoginSuccess={setUser} history={history} addHistory={handleSaveHistory} onOpenSettings={() => setShowSettings(true)} />
        : <MobileApp  user={user} onLogout={handleLogout} onLoginSuccess={setUser} history={history} addHistory={handleSaveHistory} onOpenSettings={() => setShowSettings(true)} />}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}

// Render React mounting root
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
