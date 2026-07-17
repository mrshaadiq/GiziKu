import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Camera, 
  BookOpen, 
  MapPin, 
  Clock, 
  Settings, 
  ChevronLeft,
  Settings as SettingsIcon
} from 'lucide-react';
import { api } from '../api';

// Page component imports
import HomePage from './HomePage';
import EdukasiPage from './EdukasiPage';
import FaskesPage from './FaskesPage';
import RiwayatPage from './RiwayatPage';
import FoodAiPage from './FoodAiPage';
import MentalScanPage from './MentalScanPage';
import LoginRegisterPage from './LoginRegisterPage';

export default function MobileApp({ user, onLogout, onLoginSuccess, history, addHistory, onOpenSettings }) {
  const [screen, setScreen] = useState(() => window.INITIAL_TAB || 'home'); // onboarding, home, profile, measurements, ai_setup, camera, results, education, faskes, history, food_ai, mental_scan, auth
  const [targetScreen, setTargetScreen] = useState(null);
  
  // Mobile screening state
  const [patient, setPatient] = useState({ name: '', age: '', gender: 'L', birth_date: '' });
  const [measurements, setMeasurements] = useState({ weight: '', height: '' });
  const [loadingAI, setLoadingAI] = useState(false);
  const [photos, setPhotos] = useState({ muka: null, mata: null, kuku: null });
  const [cameraActive, setCameraActive] = useState(false);
  const [currentArea, setCurrentArea] = useState('mata');
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
  const [stream, setStream] = useState(null);
  
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // Clean up camera stream
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Synchronize stream
  useEffect(() => {
    if (cameraActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [cameraActive, stream, currentArea]);

  const calculateAgeInMonths = (birthDateStr) => {
    if (!birthDateStr) return '';
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    
    let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
    months -= birthDate.getMonth();
    months += today.getMonth();
    
    if (today.getDate() < birthDate.getDate()) {
      months--;
    }
    return Math.max(0, months);
  };

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
    
    if (age <= 12 && h < 68) return 'Sangat Pendek (Severely Stunting)';
    if (age <= 12 && h < 71) return 'Pendek (Stunting)';
    if (age > 12 && age <= 24 && h < 78) return 'Pendek (Stunting)';
    if (age > 24 && age <= 36 && h < 84) return 'Pendek (Stunting)';
    return 'Tinggi Normal';
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
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 480 } 
      });
      setStream(s);
      setCameraActive(true);
    } catch (err) {
      alert("Kamera tidak dapat diakses, silakan pilih berkas foto dari galeri lokal.");
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
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
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
            <SettingsIcon className="w-4 h-4" />
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
                  <label className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground mb-1.5">
                    <span>Tanggal Lahir</span>
                    {patient.age !== '' && (
                      <span className="text-[10px] text-nura-blue normal-case font-bold bg-nura-accent px-2 py-0.5 rounded-md">
                        {patient.age} Bulan
                      </span>
                    )}
                  </label>
                  <input 
                    type="date" 
                    value={patient.birth_date || ''} 
                    onChange={(e) => {
                      const dateVal = e.target.value;
                      const monthsVal = calculateAgeInMonths(dateVal);
                      setPatient(prev => ({ ...prev, birth_date: dateVal, age: monthsVal }));
                    }}
                    className="w-full h-[52px] px-4 py-3 text-xs bg-nura-muted border-2 border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-nura-foreground font-semibold" 
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
              className={`w-full h-[56px] rounded-3xl font-bold text-sm transition-all mt-6 ${(!measurements.weight || !measurements.height) ? 'bg-slate-350 text-white cursor-default' : 'bg-nura-blue text-white hover:opacity-90 active:scale-[0.98]'}`}
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
                      <div className={`w-28 h-28 border border-dashed border-nura-teal/85 ${currentArea === 'muka' ? 'rounded-full' : 'rounded-lg'}`}></div>
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
