import React from 'react';
import { Camera, RotateCw, ChevronRight } from 'lucide-react';

export default function PhotoCaptureStep({
  currentArea,
  setCurrentArea,
  photos,
  setPhotos,
  cameraActive,
  setCameraActive,
  startCamera,
  stopCamera,
  capturePhoto,
  handleFileUpload,
  onPrev,
  runAnalysis,
  videoRef,
  fileInputRef
}) {
  const photoAreas = [
    { 
      id: 'mata', 
      label: 'Kelopak Mata', 
      desc: 'Kadar zat besi / Hb', 
      icon: '👁️', 
      guide: 'Tarik perlahan kelopak mata bawah. Tahan dalam cahaya alami. Pastikan pencahayaan alami cukup untuk hasil akurat.' 
    },
    { 
      id: 'kuku', 
      label: 'Kuku Jari', 
      desc: 'Rona sirkulasi perifer', 
      icon: '💅', 
      guide: 'Posisikan kuku jari anak secara jelas dan tegak lurus di bawah pencahayaan alami yang cukup untuk mendeteksi rona merah kuku.' 
    },
    { 
      id: 'muka', 
      label: 'Wajah Penuh', 
      desc: 'Keaktifan & otot wajah', 
      icon: '👤', 
      guide: 'Posisikan wajah balita tepat di tengah garis penunjuk dengan ekspresi rileks dan pencahayaan yang merata.' 
    }
  ];

  const currentMetadata = photoAreas.find(a => a.id === currentArea) || photoAreas[0];
  const allPhotosTaken = photos.muka && photos.mata && photos.kuku;

  // Move to next photo area automatically after capturing, if any is missing
  const selectNextMissingArea = () => {
    const nextArea = photoAreas.find(a => !photos[a.id]);
    if (nextArea) {
      setCurrentArea(nextArea.id);
    }
  };

  return (
    <div className="space-y-6 flex-1 flex flex-col justify-between">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-extrabold text-nura-foreground">Pengambilan Foto</h3>
          <p className="text-xs text-nura-muted-foreground font-medium mt-0.5">
            Ambil 3 foto untuk analisis AI yang akurat
          </p>
        </div>

        {/* Inner Card (Sidebar + Viewfinder Layout) */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Left Area Selector List */}
          <div className="flex flex-row md:flex-col gap-2.5 w-full md:w-[180px] shrink-0 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            {photoAreas.map(a => {
              const isSelected = currentArea === a.id;
              const isCompleted = !!photos[a.id];
              
              let btnStyle = 'flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all font-bold text-xs shrink-0 md:shrink ';
              let iconStyle = 'w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] ';

              if (isCompleted) {
                btnStyle += 'bg-emerald-50 border-emerald-100 text-emerald-600';
                iconStyle += 'bg-emerald-100 text-emerald-600';
              } else if (isSelected) {
                btnStyle += 'bg-nura-accent border-nura-blue/20 text-nura-blue shadow-sm';
                iconStyle += 'bg-nura-blue text-white';
              } else {
                btnStyle += 'bg-slate-50 border-transparent text-nura-muted-foreground hover:text-nura-foreground hover:bg-slate-100/50';
                iconStyle += 'bg-slate-200 text-slate-500';
              }

              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => { stopCamera(); setCurrentArea(a.id); }}
                  className={btnStyle}
                >
                  <div className={iconStyle}>
                    {isCompleted ? '✓' : a.icon}
                  </div>
                  <div>
                    <div className="font-extrabold">{a.label}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Viewfinder & Control Panel */}
          <div className="flex-1 w-full space-y-4">
            {/* Viewfinder (Dark Camera Area) */}
            <div className="aspect-[4/3] w-full bg-[#0a0f1d] border border-nura-foreground/10 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center p-6 shadow-inner">
              {cameraActive ? (
                <div className="w-full h-full relative">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-xl transform -scale-x-100" />
                  
                  {/* Dashed Helper Guide overlay */}
                  <div className="absolute inset-0 border-2 border-nura-blue/20 rounded-xl flex items-center justify-center pointer-events-none">
                    <div className={`w-36 h-36 border border-dashed border-nura-teal/80 ${currentArea === 'muka' ? 'rounded-full' : 'rounded-2xl'}`}></div>
                  </div>
                  
                  {/* AI Glow scanning strip effect */}
                  <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-nura-blue to-nura-teal shadow-[0_0_15px_rgba(0,164,154,0.8)] animate-[scan_2.5s_linear_infinite]"></div>
                </div>
              ) : photos[currentArea] ? (
                // Captured Photo State (Image 2)
                <div className="w-full h-full relative flex flex-col items-center justify-center bg-[#070b13] rounded-xl overflow-hidden">
                  <img src={photos[currentArea]} className="w-full h-full object-cover opacity-60 filter blur-[1px]" alt="Captured" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-2">
                    <span className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-xl font-bold border-2 border-white shadow-lg shadow-emerald-500/20">✓</span>
                    <span className="text-xs font-black tracking-wide uppercase">Foto berhasil diambil</span>
                  </div>
                </div>
              ) : (
                // Waiting/Empty State (Image 3)
                <div className="w-full h-full relative flex flex-col items-center justify-center text-slate-500 py-12">
                  {/* Focus Corner Guides */}
                  <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-slate-500 rounded-tl-md"></div>
                  <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-slate-500 rounded-tr-md"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-slate-500 rounded-bl-md"></div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-slate-500 rounded-br-md"></div>
                  
                  <span className="text-4xl opacity-30 select-none">{currentMetadata.icon}</span>
                  <p className="text-[10px] text-slate-400 font-bold max-w-xs text-center mt-3 leading-relaxed">
                    Buka kamera atau pilih berkas foto untuk memindai {currentMetadata.label} anak
                  </p>
                </div>
              )}
            </div>

            {/* Warning Guide Box */}
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2 text-[10px] leading-relaxed text-amber-850 font-semibold shadow-sm">
              <span className="text-amber-500 font-extrabold text-xs">⚠️</span>
              <p>{currentMetadata.guide}</p>
            </div>

            {/* Viewfinder Actions Panel */}
            <div className="flex items-center justify-center gap-4 pt-1">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileUpload} 
              />
              
              {cameraActive ? (
                // Active camera shutter
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="w-16 h-16 rounded-full bg-white border-[5px] border-nura-blue shadow-[0_4px_24px_rgba(27,91,232,0.25)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                />
              ) : photos[currentArea] ? (
                // Captured controls (Image 2)
                <div className="flex items-center gap-4 w-full justify-between">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="h-[44px] px-5 text-xs font-bold rounded-2xl bg-slate-50 border border-slate-200 text-nura-foreground hover:bg-slate-100/50 flex items-center gap-1.5 transition-all active:scale-[0.98]"
                  >
                    <RotateCw className="w-3.5 h-3.5" /> Ulangi Foto
                  </button>
                  
                  <button
                    type="button"
                    onClick={startCamera}
                    className="w-14 h-14 rounded-full bg-white border-[4px] border-nura-blue shadow-[0_4px_15px_rgba(27,91,232,0.15)] flex items-center justify-center text-nura-blue hover:scale-105 transition-all"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                  
                  <button
                    type="button"
                    onClick={selectNextMissingArea}
                    className="h-[44px] px-5 text-xs font-bold rounded-2xl bg-nura-blue text-white hover:opacity-90 flex items-center gap-1 transition-all active:scale-[0.98]"
                  >
                    Foto Berikutnya <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                // Idle state controls
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="h-[44px] px-5 text-xs font-bold rounded-2xl bg-white border border-slate-200 text-nura-foreground hover:bg-slate-50 flex items-center gap-1.5 transition-all active:scale-[0.98]"
                  >
                    <Camera className="w-4 h-4 text-nura-blue" /> Gunakan Kamera
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="h-[44px] px-5 text-xs font-bold rounded-2xl bg-white border border-slate-200 text-nura-foreground hover:bg-slate-50 transition-all active:scale-[0.98]"
                  >
                    Pilih Foto Perangkat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Outer Stepper Footer */}
      <div className="flex justify-between pt-6 border-t border-slate-100 mt-8">
        <button 
          onClick={() => { stopCamera(); onPrev(); }} 
          className="h-[48px] px-6 text-xs font-bold rounded-full bg-nura-muted text-nura-muted-foreground hover:bg-slate-200/80 transition-all active:scale-[0.98]"
        >
          Kembali
        </button>
        <button 
          onClick={runAnalysis}
          disabled={!photos.muka && !photos.mata && !photos.kuku}
          className={`h-[48px] px-8 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
            (!photos.muka && !photos.mata && !photos.kuku) 
              ? 'bg-slate-300 text-white cursor-default' 
              : 'bg-nura-blue text-white hover:opacity-90 active:scale-[0.98]'
          }`}
        >
          Mulai Analisis AI <span className="text-[10px]">➔</span>
        </button>
      </div>
    </div>
  );
}
