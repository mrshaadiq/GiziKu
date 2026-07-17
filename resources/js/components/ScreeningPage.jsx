import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';

// Import modular step components
import ChildProfileStep from './screening/ChildProfileStep';
import MeasurementsStep from './screening/MeasurementsStep';
import AISetupStep from './screening/AISetupStep';
import PhotoCaptureStep from './screening/PhotoCaptureStep';
import ScreeningResultsStep from './screening/ScreeningResultsStep';

export default function ScreeningPage({ onSaveHistory, onTabChange }) {
  const [step, setStep] = useState(1);
  const [patient, setPatient] = useState({ name: '', age: '', gender: 'L' });
  const [measurements, setMeasurements] = useState({ weight: '', height: '' });
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiReady, setAiReady] = useState(false);
  
  // Camera & Photo states
  const [currentArea, setCurrentArea] = useState('mata'); // Default to kelopak mata as in Image 3
  const [photos, setPhotos] = useState({ muka: null, mata: null, kuku: null });
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  
  // Results & Analysis states
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState(null);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Synchronize camera stream to video element when it mounts
  useEffect(() => {
    if (cameraActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [cameraActive, stream, currentArea]);

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
          
          {/* Progress Bar */}
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
          <span className="w-2.5 h-2.5 rounded-full bg-nura-teal shrink-0"></span>
          <div className="text-xs font-bold leading-tight">
            Mode Offline Aktif
            <span className="block text-[9px] text-[#2d6b66]/80 font-medium mt-0.5">AI berjalan lokal di perangkat</span>
          </div>
        </div>
      </div>

      {/* Right Content Panel (flex-1) */}
      <div className="flex-1 w-full bg-white border border-nura-foreground/10 rounded-2xl p-6 md:p-8 min-h-[420px] flex flex-col justify-between">
        
        {step === 1 && (
          <ChildProfileStep 
            patient={patient} 
            setPatient={setPatient} 
            onNext={() => setStep(2)} 
          />
        )}

        {step === 2 && (
          <MeasurementsStep 
            measurements={measurements} 
            setMeasurements={setMeasurements} 
            onPrev={() => setStep(1)} 
            onNext={() => setStep(3)} 
            getBMI={getBMI} 
            getBMIStatus={getBMIStatus} 
            getStuntingStatus={getStuntingStatus} 
          />
        )}

        {step === 3 && (
          <AISetupStep 
            loadingAI={loadingAI} 
            aiReady={aiReady} 
            onPrev={() => setStep(2)} 
            onNext={() => setStep(4)} 
          />
        )}

        {step === 4 && (
          <PhotoCaptureStep 
            currentArea={currentArea} 
            setCurrentArea={setCurrentArea} 
            photos={photos} 
            setPhotos={setPhotos} 
            cameraActive={cameraActive} 
            setCameraActive={setCameraActive} 
            startCamera={startCamera} 
            stopCamera={stopCamera} 
            capturePhoto={capturePhoto} 
            handleFileUpload={handleFileUpload} 
            onPrev={() => setStep(3)} 
            runAnalysis={runAnalysis} 
            videoRef={videoRef} 
            fileInputRef={fileInputRef} 
          />
        )}

        {step === 5 && (
          <ScreeningResultsStep 
            report={report} 
            onReset={() => {
              setStep(1);
              setPatient({ name: '', age: '', gender: 'L' });
              setMeasurements({ weight: '', height: '' });
              setPhotos({ muka: null, mata: null, kuku: null });
              setReport(null);
            }} 
            onTabChange={onTabChange} 
          />
        )}

      </div>
    </div>
  );
}
