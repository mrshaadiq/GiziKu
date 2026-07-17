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
  CheckCircle2
} from 'lucide-react';

// Page component imports (Desktop views)
import HomePage from './components/HomePage';
import ScreeningPage from './components/ScreeningPage';
import EdukasiPage from './components/EdukasiPage';
import FaskesPage from './components/FaskesPage';
import RiwayatPage from './components/RiwayatPage';

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
function MobileApp({ history, addHistory }) {
  const [screen, setScreen] = useState('onboarding'); // onboarding, home, profile, measurements, ai_setup, camera, results, education, faskes, history
  
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

  // Nav dots (9 dots indicator for Mobile stack demo - Design System §6.14)
  const navDotsList = ['onboarding', 'home', 'profile', 'measurements', 'ai_setup', 'camera', 'results', 'education', 'faskes', 'history'];

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-4">
      {/* Smartphone mockup frame (Design System §5 / §7.1) */}
      <div className="w-[390px] h-[800px] bg-white rounded-[40px] border-[12px] border-slate-900 shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* Status Bar Mobile Simulation (Design System §14.3) */}
        <div className="bg-white px-5 pt-3 pb-1.5 flex justify-between items-center text-xs shrink-0 select-none border-b border-nura-muted">
          <span className="font-bold font-mono text-nura-foreground">9:41</span>
          
          <div className="flex items-center gap-1.5 text-[#00a49a] font-bold">
            <WifiOff className="w-3.5 h-3.5" />
            <span className="text-[10px] tracking-wide">Offline</span>
          </div>
        </div>

        {/* Screen Content (Scrollable, flex-1) */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-between p-5 bg-white text-nura-foreground">
          
          {/* ONBOARDING SCREEN */}
          {screen === 'onboarding' && (
            <div className="flex flex-col justify-between h-full animate-fadeIn">
              <div className="space-y-6 text-center pt-6">
                {/* Logo & Tagline */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-[84px] h-[84px] bg-gradient-to-tr from-nura-blue to-nura-coral rounded-[24px] flex items-center justify-center text-4xl text-white font-extrabold shadow-lg shadow-nura-blue/15">N</div>
                  <h1 className="text-[30px] font-extrabold tracking-tight text-nura-foreground leading-none">NURA</h1>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-nura-muted-foreground">Nutrisi & Urgensi Remaja-Anak</p>
                </div>
                
                <p className="text-xs text-nura-muted-foreground max-w-xs mx-auto leading-relaxed font-semibold">
                  Pantau tumbuh kembang dan gizi si kecil secara instan, tanpa internet.
                </p>

                {/* Feature Highlights */}
                <div className="space-y-3.5 text-left border border-nura-foreground/5 p-4 rounded-2xl bg-nura-muted">
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

              {/* Action Buttons & Onboarding footer */}
              <div className="space-y-4 pt-6">
                <button 
                  onClick={() => setScreen('home')}
                  className="w-full h-[56px] bg-nura-blue hover:opacity-90 active:scale-[0.98] text-white font-bold rounded-3xl text-sm transition-all shadow-lg shadow-nura-blue/15"
                >
                  Mulai Sekarang
                </button>
                <div className="text-[10px] text-nura-muted-foreground text-center font-bold">
                  Gratis · Tanpa Pendaftaran · Data Tersimpan Lokal
                </div>
              </div>
            </div>
          )}

          {/* HOME SCREEN (Dashboard Mobile - Design System §14.7) */}
          {screen === 'home' && (
            <div className="space-y-5 animate-fadeIn flex flex-col justify-between h-full">
              <div className="space-y-4">
                {/* Greeting Card Gradient */}
                <div 
                  className="p-5 rounded-3xl text-white space-y-4 flex flex-col justify-between relative overflow-hidden shadow-lg shadow-nura-blue/15"
                  style={{ background: 'linear-gradient(135deg, #1b5be8 0%, #0f3fa3 100%)' }}
                >
                  <div>
                    <span className="text-[10px] font-bold text-blue-200 uppercase font-mono">Jumat, 17 Juli 2026</span>
                    <h3 className="text-lg font-extrabold tracking-tight mt-1">Halo, Orang Tua! 👋</h3>
                  </div>

                  <div className="flex gap-2 items-center">
                    <span className="px-2.5 py-1 rounded-full bg-white/20 text-[9px] font-bold">👶 {history.length} Pemeriksaan</span>
                    <span className="px-2.5 py-1 rounded-full bg-white/20 text-[9px] font-bold">⚠️ Offline</span>
                  </div>
                </div>

                {/* Primary Action Button Shutter Gradient */}
                <div 
                  onClick={() => setScreen('profile')}
                  className="p-4 rounded-2xl text-white cursor-pointer active:scale-[0.98] transition-all flex items-center justify-between"
                  style={{ background: 'linear-gradient(135deg, #1b5be8 0%, #00a49a 100%)' }}
                >
                  <div className="space-y-1.5 max-w-[80%]">
                    <h4 className="text-sm font-extrabold flex items-center gap-1.5">
                      <Camera className="w-4 h-4" /> Screening Kesehatan Anak
                    </h4>
                    <p className="text-[9px] text-blue-50 font-semibold leading-relaxed">Deteksi AI Offline · Ambil foto wajah, kuku, mata</p>
                  </div>
                  <span className="text-sm font-extrabold text-white/50">➔</span>
                </div>

                {/* Secondary Cards Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    onClick={() => setScreen('education')}
                    className="p-4 bg-white border border-nura-foreground/10 rounded-2xl cursor-pointer active:scale-[0.98] transition-all flex flex-col justify-between"
                  >
                    <span className="text-xl">📖</span>
                    <div className="mt-3">
                      <h4 className="text-xs font-bold text-nura-foreground">Edukasi Anak</h4>
                      <p className="text-[9px] text-nura-muted-foreground font-semibold mt-1">6 artikel MPASI</p>
                    </div>
                  </div>
                  <div 
                    onClick={() => setScreen('faskes')}
                    className="p-4 bg-white border border-nura-foreground/10 rounded-2xl cursor-pointer active:scale-[0.98] transition-all flex flex-col justify-between"
                  >
                    <span className="text-xl">🏥</span>
                    <div className="mt-3">
                      <h4 className="text-xs font-bold text-nura-foreground">Faskes Terdekat</h4>
                      <p className="text-[9px] text-nura-muted-foreground font-semibold mt-1">4 Lokasi</p>
                    </div>
                  </div>
                </div>

                {/* History Log List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-nura-muted pb-1.5">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground">Riwayat Terbaru</h4>
                    <button onClick={() => setScreen('history')} className="text-[10px] font-bold text-nura-blue">Lihat Semua</button>
                  </div>
                  <div className="space-y-2">
                    {history.slice(0, 3).map(r => (
                      <div key={r.id} className="p-3 bg-nura-muted rounded-xl flex items-center justify-between border border-nura-foreground/5">
                        <div>
                          <div className="text-xs font-bold text-nura-foreground">{r.nama_anak}</div>
                          <div className="text-[9px] text-nura-muted-foreground font-semibold mt-0.5">{r.usia_bulan} bln · {r.tanggal}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase shadow-inner ${
                          r.status_anemia === 'Anemia Berat' ? 'bg-[#fee2e2] text-[#e53e3e]' : r.status_anemia === 'Anemia Ringan' ? 'bg-[#fef9c3] text-[#ca8a04]' : 'bg-[#dcfce7] text-[#16a34a]'
                        }`}>
                          {r.status_anemia}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN: PROFILE (Step 1) */}
          {screen === 'profile' && (
            <div className="flex flex-col justify-between h-full animate-fadeIn">
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
                    <div className="text-[9px] text-nura-muted-foreground font-bold mt-1">Tersimpan di memori perangkat</div>
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
                className={`w-full h-[56px] rounded-3xl font-bold text-sm transition-all ${(!patient.name || !patient.age) ? 'bg-slate-350 text-white cursor-default' : 'bg-nura-blue text-white hover:opacity-90 active:scale-[0.98]'}`}
              >
                Lanjut
              </button>
            </div>
          )}

          {/* SCREEN: MEASUREMENTS (Step 2) */}
          {screen === 'measurements' && (
            <div className="flex flex-col justify-between h-full animate-fadeIn">
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
                  <div className="p-3 bg-nura-muted rounded-xl space-y-1 text-xs border border-nura-foreground/5 font-semibold">
                    <div className="flex justify-between"><span>Status Gizi (BMI):</span><span className="text-nura-blue font-bold">{getBMIStatus()}</span></div>
                    <div className="flex justify-between"><span>Tinggi Badan:</span><span className="text-nura-blue font-bold">{getStuntingStatus()}</span></div>
                  </div>
                )}
              </div>

              <button 
                onClick={triggerAIInstall} disabled={!measurements.weight || !measurements.height}
                className={`w-full h-[56px] rounded-3xl font-bold text-sm transition-all ${(!measurements.weight || !measurements.height) ? 'bg-slate-350 text-white cursor-default' : 'bg-nura-blue text-white hover:opacity-90 active:scale-[0.98]'}`}
              >
                Lanjut
              </button>
            </div>
          )}

          {/* SCREEN: AI SETUP (Step 3) */}
          {screen === 'ai_setup' && (
            <div className="flex flex-col justify-between h-full animate-fadeIn">
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
                  <div className="text-[10px] text-nura-muted-foreground font-bold leading-relaxed max-w-xs">
                    AI berjalan lokal di perangkat · Tidak perlu internet
                  </div>
                </div>
              </div>

              <button disabled className="w-full h-[56px] bg-slate-350 text-white font-bold rounded-3xl text-sm cursor-default">
                Memuat Model AI...
              </button>
            </div>
          )}

          {/* SCREEN: CAMERA (Step 4) */}
          {screen === 'camera' && (
            <div className="flex flex-col justify-between h-full animate-fadeIn">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setScreen('measurements')} className="w-7 h-7 rounded-lg bg-nura-muted flex items-center justify-center"><ChevronLeft className="w-4 h-4 text-nura-muted-foreground" /></button>
                    <h3 className="text-xs font-bold text-nura-foreground">Ambil Foto Fisik</h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-nura-accent text-nura-blue px-2 py-0.5 rounded-md">Area: {currentArea.toUpperCase()}</span>
                </div>

                {/* Viewfinder 4:3 (Design System §14.8 / §16.6) */}
                <div className="w-full aspect-[4/3] bg-slate-900 rounded-xl overflow-hidden relative border border-nura-foreground/10 flex flex-col items-center justify-center">
                  {cameraActive ? (
                    <>
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100" />
                      <div className="absolute inset-0 border-2 border-nura-blue/45 flex items-center justify-center">
                        <div className={`w-28 h-28 border border-dashed border-nura-teal/80 ${currentArea === 'muka' ? 'rounded-full' : 'rounded-lg'}`}></div>
                      </div>
                      
                      {/* AI glow scanning strip */}
                      <div className="absolute left-0 right-0 h-0.5 bg-nura-teal shadow-[0_0_12px_rgba(0,164,154,0.7)] animate-[scan_2s_linear_infinite]"></div>
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

                {/* Shutter & Capture controls */}
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
                    // Shutter button: 72x72px white circle, border blue 5px (Design System §6.12 / §14.8)
                    <button 
                      onClick={capturePhoto}
                      className="w-16 h-16 rounded-full bg-white border-[5px] border-nura-blue shadow-[0_4px_20px_rgba(27,91,232,0.25)] flex items-center justify-center"
                    />
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={startCamera} className="px-3.5 py-2 text-[10px] font-bold border border-nura-foreground/10 rounded-xl bg-white text-nura-foreground">Buka Kamera</button>
                      <button onClick={() => fileInputRef.current.click()} className="px-3.5 py-2 text-[10px] font-bold border border-nura-foreground/10 rounded-xl bg-white text-nura-foreground">Pilih Berkas</button>
                    </div>
                  )}
                </div>

                {/* Area selectors */}
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
                className={`w-full h-[56px] rounded-3xl font-bold text-sm transition-all ${(!photos.muka && !photos.mata && !photos.kuku) ? 'bg-slate-350 text-white cursor-default' : 'bg-nura-blue text-white hover:opacity-90 active:scale-[0.98]'}`}
              >
                Mulai Analisis AI
              </button>
            </div>
          )}

          {/* SCREEN: RESULTS (Step 5) */}
          {screen === 'results' && (
            <div className="flex flex-col justify-between h-full animate-fadeIn">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-nura-foreground border-b border-nura-muted pb-2">Hasil Diagnosa AI</h3>

                {analyzing ? (
                  <div className="py-12 text-center space-y-3 flex flex-col items-center">
                    <div className="w-8 h-8 border-3 border-nura-blue border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-xs text-nura-muted-foreground font-semibold">Memproses di GPU perangkat... Tidak perlu internet.</div>
                  </div>
                ) : report ? (
                  <div className="space-y-4">
                    {/* Summary Card */}
                    <div className="p-4 bg-nura-muted border border-nura-foreground/5 rounded-2xl space-y-3 text-xs leading-relaxed font-semibold">
                      <div className="flex justify-between border-b border-nura-foreground/5 pb-2">
                        <span className="font-extrabold text-nura-foreground">{report.nama_anak}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase shadow-inner ${
                          report.status_anemia === 'Anemia Berat' ? 'bg-[#fee2e2] text-[#e53e3e]' : report.status_anemia === 'Anemia Ringan' ? 'bg-[#fef9c3] text-[#ca8a04]' : 'bg-[#dcfce7] text-[#16a34a]'
                        }`}>{report.status_anemia}</span>
                      </div>
                      
                      <div className="flex justify-between"><span>Indeks Tinggi Badan:</span><span className="text-nura-foreground font-bold">{report.status_stunting}</span></div>
                      <div className="flex justify-between"><span>Usia:</span><span className="text-nura-foreground font-bold">{report.usia_bulan} bulan</span></div>
                      
                      <div className="border-t border-nura-foreground/5 pt-2 font-medium text-nura-muted-foreground">
                        {report.catatan}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* 3 CTA Buttons (Design System §14.5) */}
              <div className="space-y-2.5 pt-4">
                <button onClick={() => setScreen('home')} className="w-full h-[52px] bg-nura-blue text-white font-bold rounded-2xl text-xs active:scale-[0.98] transition-all">Kembali ke Beranda</button>
                <button onClick={() => setScreen('faskes')} className="w-full h-[48px] bg-nura-teal text-white font-bold rounded-2xl text-xs active:scale-[0.98] transition-all">Hubungi Klinik Rujukan</button>
                <button onClick={() => window.print()} className="w-full h-[48px] bg-nura-muted text-nura-muted-foreground font-bold rounded-2xl text-xs active:scale-[0.98] transition-all">Cetak Laporan PDF</button>
              </div>
            </div>
          )}

          {/* SCREEN: EDUCATION */}
          {screen === 'education' && (
            <div className="flex flex-col justify-between h-full animate-fadeIn">
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-nura-muted pb-2">
                  <button onClick={() => setScreen('home')} className="w-8 h-8 rounded-xl bg-nura-muted flex items-center justify-center"><ChevronLeft className="w-5 h-5 text-nura-muted-foreground" /></button>
                  <h3 className="text-sm font-bold text-nura-foreground">Materi Edukasi</h3>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  <div className="p-4 bg-white border border-nura-foreground/10 rounded-2xl space-y-2">
                    <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase bg-nura-accent text-nura-blue">Gizi Anak</span>
                    <h4 className="text-xs font-bold text-nura-foreground">Pencegahan Stunting 1000 HPK</h4>
                    <p className="text-[10px] text-nura-muted-foreground font-semibold leading-relaxed">Berikan MPASI kaya protein hewani berkualitas tinggi sejak usia 6 bulan secara konsisten harian.</p>
                  </div>
                  <div className="p-4 bg-white border border-nura-foreground/10 rounded-2xl space-y-2">
                    <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase bg-nura-accent text-nura-blue">Zat Besi</span>
                    <h4 className="text-xs font-bold text-nura-foreground">Mengatasi Anemia Balita</h4>
                    <p className="text-[10px] text-nura-muted-foreground font-semibold leading-relaxed">Kekurangan zat besi menghambat pasokan oksigen otak. Berikan hati ayam, daging merah haluskan, dan telur.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN: FASKES */}
          {screen === 'faskes' && (
            <div className="flex flex-col justify-between h-full animate-fadeIn">
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-nura-muted pb-2">
                  <button onClick={() => setScreen('home')} className="w-8 h-8 rounded-xl bg-nura-muted flex items-center justify-center"><ChevronLeft className="w-5 h-5 text-nura-muted-foreground" /></button>
                  <h3 className="text-sm font-bold text-nura-foreground">Klinik Rujukan</h3>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  <div className="p-3 bg-white border border-nura-foreground/10 rounded-2xl flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold text-nura-foreground text-xs">Puskesmas Sukajadi</h4>
                      <p className="text-[9px] text-nura-muted-foreground font-semibold mt-0.5">Jl. Sukajadi No.12 · 1.2 km</p>
                    </div>
                    <a href="tel:022-2031122" className="px-2.5 py-1 rounded-xl bg-nura-accent text-nura-blue font-bold text-[10px]">📞 Hubungi</a>
                  </div>
                  <div className="p-3 bg-white border border-nura-foreground/10 rounded-2xl flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold text-nura-foreground text-xs">Posyandu Melati Indah V</h4>
                      <p className="text-[9px] text-nura-muted-foreground font-semibold mt-0.5">Balai RW 05, Kel. Pasteur · 0.4 km</p>
                    </div>
                    <a href="tel:0812-9900-8811" className="px-2.5 py-1 rounded-xl bg-nura-accent text-nura-blue font-bold text-[10px]">📞 Hubungi</a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN: HISTORY */}
          {screen === 'history' && (
            <div className="flex flex-col justify-between h-full animate-fadeIn">
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-nura-muted pb-2">
                  <button onClick={() => setScreen('home')} className="w-8 h-8 rounded-xl bg-nura-muted flex items-center justify-center"><ChevronLeft className="w-5 h-5 text-nura-muted-foreground" /></button>
                  <h3 className="text-sm font-bold text-nura-foreground">Semua Riwayat</h3>
                </div>

                <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                  {history.map(r => (
                    <div key={r.id} className="p-3 bg-white border border-nura-foreground/10 rounded-2xl flex justify-between items-center text-xs leading-none">
                      <div>
                        <h4 className="font-bold text-nura-foreground">{r.nama_anak}</h4>
                        <p className="text-[9px] text-nura-muted-foreground mt-1 font-semibold">{r.usia_bulan} bln · {r.tanggal}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase shadow-inner ${
                        r.status_anemia === 'Anemia Berat' ? 'bg-[#fee2e2] text-[#e53e3e]' : r.status_anemia === 'Anemia Ringan' ? 'bg-[#fef9c3] text-[#ca8a04]' : 'bg-[#dcfce7] text-[#16a34a]'
                      }`}>{r.status_anemia}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Navigation Dots Indicator Footer (Design System §6.14) */}
        <div className="h-10 border-t border-nura-muted flex items-center justify-center gap-1.5 shrink-0 bg-white select-none">
          {navDotsList.map((dotScreen) => {
            const isDotActive = screen === dotScreen;
            return (
              <div 
                key={dotScreen} 
                onClick={() => { setCameraActive(false); setScreen(dotScreen); }}
                className={`h-1.5 rounded-full cursor-pointer transition-all duration-200 ${isDotActive ? 'w-4.5 bg-nura-blue' : 'w-1.5 bg-slate-300'}`}
              />
            );
          })}
        </div>

      </div>
    </div>
  );
}

// ============================================
// WEB DESKTOP REPRESENTATION (Design System §15)
// ============================================
function DesktopApp({ history, addHistory }) {
  const [activeTab, setActiveTab] = useState('home');

  const MENU_ITEMS = [
    { id: 'home', label: 'Beranda', icon: <LayoutDashboard className="w-5 h-5 shrink-0" /> },
    { id: 'screening', label: 'Screening Kesehatan', icon: <Camera className="w-5 h-5 shrink-0" /> },
    { id: 'education', label: 'Edukasi & Literasi', icon: <BookOpen className="w-5 h-5 shrink-0" /> },
    { id: 'facilities', label: 'Faskes Terdekat', icon: <MapPin className="w-5 h-5 shrink-0" /> },
    { id: 'history', label: 'Riwayat Pemeriksaan', icon: <Clock className="w-5 h-5 shrink-0" /> }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home': 
        return <HomePage history={history} onTabChange={setActiveTab} />;
      case 'screening': 
        return <ScreeningPage onSaveHistory={addHistory} />;
      case 'education': 
        return <EdukasiPage />;
      case 'facilities': 
        return <FaskesPage />;
      case 'history': 
        return <RiwayatPage history={history} />;
      default: 
        return <HomePage history={history} onTabChange={setActiveTab} />;
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
                  onClick={() => setActiveTab(item.id)}
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
            <span className="text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground">Program Penyelamatan & Pencegahan Stunting Nasional</span>
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
// ROOT RENDER DISPATCHER
// ============================================
function App() {
  const isDesktop = useIsDesktop();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api('/tracker').then(setHistory);
  }, []);

  const handleSaveHistory = (newRecord) => {
    setHistory(prev => [newRecord, ...prev]);
  };

  return isDesktop
    ? <DesktopApp history={history} addHistory={handleSaveHistory} />
    : <MobileApp  history={history} addHistory={handleSaveHistory} />;
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
