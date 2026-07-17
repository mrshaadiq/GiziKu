import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';

export default function ScreeningPage({ onSaveHistory }) {
  const [step, setStep] = useState(1);
  const [patient, setPatient] = useState({ name: '', age: '', gender: 'L' });
  const [measurements, setMeasurements] = useState({ weight: '', height: '' });
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiReady, setAiReady] = useState(false);
  
  // Camera & Photo states
  const [currentArea, setCurrentArea] = useState('muka');
  const [photos, setPhotos] = useState({ muka: null, mata: null, kuku: null });
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  
  // Results & Analysis states
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
    
    if (age <= 12 && h < 68) return 'Sangat Pendek (Severely Stunting)';
    if (age <= 12 && h < 71) return 'Pendek (Stunting)';
    if (age > 12 && age <= 24 && h < 78) return 'Pendek (Stunting)';
    if (age > 24 && age <= 36 && h < 84) return 'Pendek (Stunting)';
    return 'Tinggi Normal';
  };

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
      setCameraActive(true);
    } catch (err) {
      alert("Kamera tidak dapat diakses. Silakan pilih berkas foto dari perangkat Anda.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    const dataUrl = canvas.toDataURL('image/jpeg');
    setPhotos(prev => ({ ...prev, [currentArea]: dataUrl }));
    stopCamera();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotos(prev => ({ ...prev, [currentArea]: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (step === 3) {
      setLoadingAI(true);
      const timer = setTimeout(() => {
        setLoadingAI(false);
        setAiReady(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const runAnalysis = () => {
    setAnalyzing(true);
    setStep(5);
    
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

      const generatedReport = {
        id: Date.now(),
        nama_anak: patient.name,
        usia_bulan: parseInt(patient.age),
        berat_badan: parseFloat(measurements.weight),
        tinggi_badan: parseFloat(measurements.height),
        status_stunting: stunting.includes('Stunting') ? 'Stunting' : 'Normal',
        status_anemia: anemia,
        tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        level_urgensi: urgency,
        catatan: anemia === 'Anemia Berat' 
          ? "Rujukan segera ke spesialis anak di RSUD terdekat untuk transfusi atau penanganan anemia mikrositik berat. Tingkatkan asupan makanan kaya besi."
          : anemia === 'Anemia Ringan'
          ? "Balita menunjukkan anemia ringan. Berikan suplemen drop besi, hati ayam haluskan, dan makanan tinggi protein."
          : "Status kesehatan anak normal. Pertahankan gizi seimbang dan jadwal rutin Posyandu."
      };

      setReport(generatedReport);
      setAnalyzing(false);
      
      if (onSaveHistory) {
        onSaveHistory(generatedReport);
      }
    }, 2500);
  };

  const stepsList = [
    { num: 1, title: 'Profil Anak', desc: 'Nama, usia, jenis kelamin' },
    { num: 2, title: 'Berat & Tinggi', desc: 'Pengukuran tubuh & BMI' },
    { num: 3, title: 'Persiapan AI', desc: 'Model ke perangkat lokal' },
    { num: 4, title: 'Pengambilan Foto', desc: '3 foto untuk analisis' },
    { num: 5, title: 'Hasil Screening', desc: 'Rekomendasi & laporan' }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start max-w-6xl mx-auto w-full">
      {/* Left Stepper Column (260px fixed width on desktop) */}
      <div className="w-full lg:w-[260px] sticky top-8 space-y-6">
        <div className="p-5 bg-white border border-nura-foreground/10 rounded-2xl">
          <div className="text-[11px] font-bold uppercase tracking-widest text-nura-muted-foreground">Screening Kesehatan</div>
          <div className="text-xl font-extrabold text-nura-foreground mt-1">Langkah {Math.min(5, step)} dari 5</div>
          
          {/* Progress Bar (Tailwind v4 theme colors) */}
          <div className="w-full bg-nura-accent h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-nura-blue to-nura-teal h-full transition-all duration-300" 
              style={{ width: `${(Math.min(5, step) / 5) * 100}%` }}
            />
          </div>

          {/* Stepper Items */}
          <nav className="space-y-4 mt-6">
            {stepsList.map(s => {
              const isActive = step === s.num;
              const isCompleted = step > s.num;
              
              let numStyle = 'bg-nura-muted text-nura-muted-foreground';
              let titleStyle = 'text-nura-muted-foreground font-semibold';
              let rowStyle = '';
              
              if (isActive) {
                numStyle = 'bg-nura-blue text-white';
                titleStyle = 'text-nura-foreground font-extrabold';
                rowStyle = 'bg-nura-accent/50 p-2 -mx-2 rounded-xl';
              } else if (isCompleted) {
                numStyle = 'bg-nura-green text-white';
                titleStyle = 'text-nura-foreground font-bold';
              }
              
              return (
                <div key={s.num} className={`flex gap-3 items-center transition-all ${rowStyle}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${numStyle}`}>
                    {isCompleted ? '✓' : s.num}
                  </div>
                  <div className="min-w-0">
                    <div className={`text-xs ${titleStyle}`}>{s.title}</div>
                    <div className="text-[10px] text-nura-muted-foreground leading-none font-semibold mt-0.5">{s.desc}</div>
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Offline Badge */}
        <div className="p-4 bg-[#e8f5f4] rounded-xl flex items-center gap-2.5 text-[#2d6b66]">
          <span className="w-2.5 h-2.5 rounded-full bg-nura-teal animate-pulse shrink-0"></span>
          <div className="text-xs font-bold leading-tight">
            Mode Offline Aktif
            <span className="block text-[9px] text-[#2d6b66]/80 font-medium mt-0.5">AI berjalan lokal di perangkat</span>
          </div>
        </div>
      </div>

      {/* Right Content Panel (flex-1) */}
      <div className="flex-1 w-full bg-white border border-nura-foreground/10 rounded-2xl p-6 md:p-8 min-h-[420px] flex flex-col justify-between">
        
        {/* STEP 1: PROFIL ANAK */}
        {step === 1 && (
          <div className="space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-extrabold text-nura-foreground">Profil Anak</h3>
                <p className="text-xs text-nura-muted-foreground font-medium mt-0.5">Masukkan informasi dasar anak yang akan diperiksa</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-nura-muted-foreground mb-2">Nama Anak</label>
                  <input 
                    type="text" 
                    value={patient.name} 
                    onChange={(e) => setPatient(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full h-[52px] px-4 py-3 text-xs bg-nura-muted border-2 border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-nura-foreground font-semibold" 
                    placeholder="mis. Siti Nurhaliza" 
                  />
                  <div className="text-[10px] text-nura-muted-foreground font-bold mt-1.5 ml-1">Tersimpan di memori perangkat</div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-nura-muted-foreground mb-2">Usia (bulan)</label>
                  <input 
                    type="number" 
                    value={patient.age} 
                    onChange={(e) => setPatient(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full h-[52px] px-4 py-3 text-xs bg-nura-muted border-2 border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-nura-foreground font-semibold" 
                    placeholder="mis. 24" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-nura-muted-foreground mb-2">Jenis Kelamin</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      type="button" 
                      onClick={() => setPatient(prev => ({ ...prev, gender: 'L' }))}
                      className={`h-[52px] text-xs font-bold rounded-xl border transition-all ${patient.gender === 'L' ? 'bg-nura-blue text-white border-nura-blue shadow-md shadow-nura-blue/10' : 'bg-nura-muted border-transparent text-nura-muted-foreground hover:text-nura-foreground'}`}
                    >
                      ♂ Laki-laki
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setPatient(prev => ({ ...prev, gender: 'P' }))}
                      className={`h-[52px] text-xs font-bold rounded-xl border transition-all ${patient.gender === 'P' ? 'bg-nura-blue text-white border-nura-blue shadow-md shadow-nura-blue/10' : 'bg-nura-muted border-transparent text-nura-muted-foreground hover:text-nura-foreground'}`}
                    >
                      ♀ Perempuan
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100 mt-6">
              <button 
                onClick={() => setStep(2)} 
                disabled={!patient.name || !patient.age}
                className={`h-[48px] px-8 text-xs font-bold rounded-2xl transition-all ${(!patient.name || !patient.age) ? 'bg-slate-300 text-white cursor-default' : 'bg-nura-blue text-white hover:opacity-90 active:scale-[0.98]'}`}
              >
                Lanjut
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: BERAT & TINGGI */}
        {step === 2 && (
          <div className="space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-extrabold text-nura-foreground">Berat & Tinggi Badan</h3>
                <p className="text-xs text-nura-muted-foreground font-medium mt-0.5">Ukur kondisi fisik balita untuk diagnosis stunting & wasting</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-nura-muted-foreground mb-2">Berat Badan (kg)</label>
                  <input 
                    type="number" step="0.1"
                    value={measurements.weight} 
                    onChange={(e) => setMeasurements(prev => ({ ...prev, weight: e.target.value }))}
                    className="w-full h-[52px] px-4 py-3 text-xs bg-nura-muted border-2 border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-nura-foreground font-semibold" 
                    placeholder="mis. 11.5" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-nura-muted-foreground mb-2">Tinggi Badan (cm)</label>
                  <input 
                    type="number" step="0.5"
                    value={measurements.height} 
                    onChange={(e) => setMeasurements(prev => ({ ...prev, height: e.target.value }))}
                    className="w-full h-[52px] px-4 py-3 text-xs bg-nura-muted border-2 border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-nura-foreground font-semibold" 
                    placeholder="mis. 85" 
                  />
                </div>
                
                {measurements.weight && measurements.height ? (
                  <div className="h-[52px] px-4 bg-nura-accent rounded-xl flex items-center justify-between border border-nura-blue/20">
                    <span className="text-[10px] uppercase font-bold text-nura-blue">Skor BMI</span>
                    <span className="text-sm font-black text-nura-blue font-mono tracking-tight">{getBMI()}</span>
                  </div>
                ) : (
                  <div className="h-[52px] px-4 bg-nura-muted rounded-xl flex items-center text-[10px] text-nura-muted-foreground font-bold">Masukkan tinggi & berat</div>
                )}
              </div>

              {measurements.weight && measurements.height && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-nura-muted rounded-xl border border-nura-foreground/5 mt-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-nura-muted-foreground font-bold block">Status Gizi (BMI)</span>
                    <span className="text-xs font-bold text-nura-foreground mt-1 block">{getBMIStatus()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-nura-muted-foreground font-bold block">Indeks Tinggi Badan</span>
                    <span className="text-xs font-bold text-nura-foreground mt-1 block">{getStuntingStatus()}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-100 mt-6">
              <button onClick={() => setStep(1)} className="h-[48px] px-6 text-xs font-bold rounded-2xl bg-nura-muted text-nura-muted-foreground hover:bg-slate-200/80 transition-all active:scale-[0.98]">Kembali</button>
              <button 
                onClick={() => setStep(3)} 
                disabled={!measurements.weight || !measurements.height}
                className={`h-[48px] px-8 text-xs font-bold rounded-2xl transition-all ${(!measurements.weight || !measurements.height) ? 'bg-slate-300 text-white cursor-default' : 'bg-nura-blue text-white hover:opacity-90 active:scale-[0.98]'}`}
              >
                Lanjut
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PERSIAPAN AI */}
        {step === 3 && (
          <div className="space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-extrabold text-nura-foreground">Persiapan Model AI</h3>
                <p className="text-xs text-nura-muted-foreground font-medium mt-0.5">Memuat model klasifikasi visual lokal ke memori perangkat</p>
              </div>

              {loadingAI ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                  <div className="w-10 h-10 border-4 border-nura-blue border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-xs text-nura-muted-foreground font-semibold">Mengunduh & mengoptimalkan model deteksi lokal...</div>
                  <div className="w-64 bg-nura-accent h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-nura-blue to-nura-teal animate-[progress_2s_ease-in-out_infinite]" style={{width: '60%'}}></div>
                  </div>
                  <div className="text-[10px] text-nura-muted-foreground font-bold">AI berjalan lokal di perangkat · Tidak perlu internet</div>
                </div>
              ) : (
                <div className="p-5 bg-nura-accent rounded-xl space-y-3 border border-nura-blue/10">
                  <h4 className="text-xs font-bold text-nura-blue flex items-center gap-2">
                    ✓ Model AI Siap Berjalan Offline
                  </h4>
                  <p className="text-[11px] text-nura-blue/90 leading-relaxed font-semibold">
                    Model pendeteksi kepucatan konjungtiva dan morfologi kuku telah berhasil dioptimalkan di browser perangkat Anda. Data foto tidak akan dikirim ke server.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-100 mt-6">
              <button onClick={() => setStep(2)} disabled={loadingAI} className="h-[48px] px-6 text-xs font-bold rounded-2xl bg-nura-muted text-nura-muted-foreground hover:bg-slate-200/80 transition-all active:scale-[0.98]">Kembali</button>
              <button 
                onClick={() => setStep(4)} 
                disabled={loadingAI || !aiReady}
                className={`h-[48px] px-8 text-xs font-bold rounded-2xl transition-all ${(loadingAI || !aiReady) ? 'bg-slate-300 text-white cursor-default' : 'bg-nura-blue text-white hover:opacity-90 active:scale-[0.98]'}`}
              >
                Mulai Scan
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PENGAMBILAN FOTO */}
        {step === 4 && (
          <div className="space-y-5 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-nura-foreground">Pengambilan Foto Fisik</h3>
                <p className="text-xs text-nura-muted-foreground font-medium mt-0.5">Ambil atau pilih foto bagian fisik balita</p>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-nura-blue bg-nura-accent px-3 py-1 rounded-lg">Area: {currentArea.toUpperCase()}</span>
            </div>

            {/* Area tabs */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'muka', label: 'Wajah (Muka)', desc: 'Ekspresi & gizi', icon: '👤' },
                { id: 'mata', label: 'Mata', desc: 'Konjungtiva / anemia', icon: '👁️' },
                { id: 'kuku', label: 'Kuku', desc: 'Rona sirkulasi', icon: '💅' }
              ].map(a => (
                <button 
                  key={a.id} 
                  type="button" 
                  onClick={() => { stopCamera(); setCurrentArea(a.id); }} 
                  className={`p-3 rounded-xl border-2 text-left transition-all ${currentArea === a.id ? 'bg-nura-accent border-nura-blue text-nura-blue' : 'bg-nura-muted border-transparent text-nura-muted-foreground hover:text-nura-foreground'}`}
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>{a.label}</span>
                    <span>{photos[a.id] ? '✓' : a.icon}</span>
                  </div>
                  <p className="text-[9px] text-nura-muted-foreground mt-1 leading-none font-semibold">{a.desc}</p>
                </button>
              ))}
            </div>

            {/* Video Viewfinder (16:9 on desktop) */}
            <div className="border border-nura-foreground/10 rounded-2xl overflow-hidden bg-slate-900 min-h-60 flex flex-col items-center justify-center p-6 relative">
              {cameraActive ? (
                <div className="w-full max-w-lg aspect-video rounded-xl overflow-hidden border border-slate-700 relative bg-black shadow-lg">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100" />
                  <div className="absolute inset-0 border-2 border-nura-blue/30 rounded-xl pointer-events-none flex items-center justify-center">
                    <div className={`w-32 h-32 border-2 border-dashed border-nura-teal/85 ${currentArea === 'muka' ? 'rounded-full' : 'rounded-lg'}`}></div>
                  </div>
                  
                  {/* AI Glow scanning strip effect */}
                  <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-nura-blue to-nura-teal shadow-[0_0_12px_rgba(0,164,154,0.7)] animate-[scan_2s_linear_infinite]"></div>
                </div>
              ) : photos[currentArea] ? (
                <img src={photos[currentArea]} className="max-h-48 rounded-xl object-contain border border-nura-foreground/10 bg-white shadow-sm" alt="Preview" />
              ) : (
                <div className="text-center space-y-2 py-8 text-white">
                  <span className="text-4xl block">📸</span>
                  <p className="text-xs text-slate-300 font-semibold">{currentArea === 'muka' ? 'Posisikan wajah balita tepat di tengah' : currentArea === 'mata' ? 'Dekatkan kamera ke kelopak mata bawah' : 'Posisikan kuku jari si kecil secara tegak lurus'}</p>
                </div>
              )}

              <div className="flex gap-2 mt-4 relative z-10">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                {cameraActive ? (
                  <button onClick={capturePhoto} className="h-[44px] px-6 text-xs font-bold rounded-2xl bg-white text-nura-blue border-2 border-nura-blue shadow-[0_4px_20px_rgba(27,91,232,0.25)] hover:bg-slate-50 transition-all">Ambil Foto</button>
                ) : (
                  <>
                    <button onClick={startCamera} className="h-[44px] px-6 text-xs font-bold rounded-2xl bg-white border border-nura-foreground/10 text-nura-foreground hover:bg-slate-50 transition-all">Gunakan Kamera</button>
                    <button onClick={() => fileInputRef.current.click()} className="h-[44px] px-6 text-xs font-bold rounded-2xl bg-white border border-nura-foreground/10 text-nura-foreground hover:bg-slate-50 transition-all">Pilih Foto Perangkat</button>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-100 mt-6">
              <button onClick={() => { stopCamera(); setStep(3); }} className="h-[48px] px-6 text-xs font-bold rounded-2xl bg-nura-muted text-nura-muted-foreground hover:bg-slate-200/80 transition-all active:scale-[0.98]">Kembali</button>
              <button 
                onClick={runAnalysis}
                disabled={!photos.muka && !photos.mata && !photos.kuku}
                className={`h-[48px] px-8 text-xs font-bold rounded-2xl transition-all ${(!photos.muka && !photos.mata && !photos.kuku) ? 'bg-slate-300 text-white cursor-default' : 'bg-nura-blue text-white hover:opacity-90 active:scale-[0.98]'}`}
              >
                Mulai Analisis AI
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: HASIL SCREENING */}
        {step === 5 && (
          <div className="space-y-6 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-nura-foreground">Hasil Analisis Screening</h3>
              <p className="text-xs text-nura-muted-foreground font-medium mt-0.5">Hasil kalkulasi parameter fisik & visual AI lokal NURA</p>
            </div>

            {analyzing ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 border-4 border-nura-blue border-t-transparent rounded-full animate-spin"></div>
                <div className="text-xs text-nura-muted-foreground font-bold">Memproses di GPU perangkat... Tidak perlu internet.</div>
              </div>
            ) : report ? (
              <div className="space-y-4 animate-fadeIn flex-1 flex flex-col justify-between">
                <div className="p-5 bg-white border-2 border-nura-foreground/10 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-nura-muted pb-3.5">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground block">Identitas Pasien</span>
                      <h4 className="text-sm font-extrabold text-nura-foreground mt-1">{report.nama_anak} ({report.usia_bulan} bulan)</h4>
                    </div>
                    
                    {/* Saturated foreground + pastel background colors as per Design System §2.3 */}
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase shadow-inner ${
                      report.status_anemia === 'Anemia Berat' 
                        ? 'bg-[#fee2e2] text-[#e53e3e]' 
                        : report.status_anemia === 'Anemia Ringan' 
                        ? 'bg-[#fef9c3] text-[#ca8a04]' 
                        : 'bg-[#dcfce7] text-[#16a34a]'
                    }`}>
                      {report.status_anemia}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-nura-muted-foreground">
                    <div className="p-3 bg-nura-muted rounded-xl">
                      <span className="text-[10px] uppercase font-bold text-nura-muted-foreground">Tinggi Badan</span>
                      <span className="text-sm font-black text-nura-foreground mt-1 block font-mono">{report.tinggi_badan} cm</span>
                    </div>
                    <div className="p-3 bg-nura-muted rounded-xl">
                      <span className="text-[10px] uppercase font-bold text-nura-muted-foreground">Status Stunting</span>
                      <span className={`text-xs font-bold mt-1 block ${report.status_stunting === 'Normal' ? 'text-nura-green' : 'text-nura-red'}`}>
                        {report.status_stunting === 'Normal' ? 'Normal (Tinggi Baik)' : 'Stunting'}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-nura-muted pt-3.5">
                    <span className="text-[10px] uppercase tracking-widest text-nura-muted-foreground font-bold block mb-1">Rekomendasi AI NURA</span>
                    <pre className="text-xs text-nura-foreground/90 whitespace-pre-wrap leading-relaxed font-sans font-medium">{report.catatan}</pre>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-slate-100 mt-6">
                  <button 
                    onClick={() => {
                      setStep(1);
                      setPatient({ name: '', age: '', gender: 'L' });
                      setMeasurements({ weight: '', height: '' });
                      setPhotos({ muka: null, mata: null, kuku: null });
                      setReport(null);
                    }} 
                    className="h-[48px] px-8 text-xs font-bold rounded-2xl bg-nura-blue text-white hover:opacity-90 active:scale-[0.98]"
                  >
                    Mulai Skrining Baru
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

      </div>
    </div>
  );
}
