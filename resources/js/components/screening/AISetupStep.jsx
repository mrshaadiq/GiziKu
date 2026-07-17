import React from 'react';

export default function AISetupStep({ loadingAI, aiReady, onPrev, onNext }) {
  return (
    <div className="space-y-6 flex-1 flex flex-col justify-between">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-extrabold text-nura-foreground">Persiapan Model AI</h3>
          <p className="text-xs text-nura-muted-foreground font-medium mt-0.5">
            Memuat model klasifikasi visual lokal ke memori perangkat
          </p>
        </div>

        {loadingAI ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-10 h-10 border-4 border-nura-blue border-t-transparent rounded-full animate-spin"></div>
            <div className="text-xs text-nura-muted-foreground font-semibold">
              Mengunduh & mengoptimalkan model deteksi lokal...
            </div>
            <div className="w-64 bg-nura-accent h-2 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-nura-blue to-nura-teal animate-[progress_2s_ease-in-out_infinite]" style={{ width: '60%' }}></div>
            </div>
            <div className="text-[10px] text-nura-muted-foreground font-bold">
              AI berjalan lokal di perangkat · Tidak perlu internet
            </div>
          </div>
        ) : (
          <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-emerald-650 flex items-center gap-1.5">
              <span>✓</span> Model AI Siap Berjalan Offline
            </h4>
            <p className="text-[11px] text-emerald-600/90 leading-relaxed font-semibold">
              Model pendeteksi kepucatan konjungtiva dan morfologi kuku telah berhasil dioptimalkan di browser perangkat Anda. Data foto tidak akan dikirim ke server.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-6 border-t border-slate-100 mt-8">
        <button 
          onClick={onPrev} 
          disabled={loadingAI}
          className="h-[48px] px-6 text-xs font-bold rounded-full bg-nura-muted text-nura-muted-foreground hover:bg-slate-200/80 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Kembali
        </button>
        <button 
          onClick={onNext} 
          disabled={loadingAI || !aiReady}
          className={`h-[48px] px-8 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
            (loadingAI || !aiReady) 
              ? 'bg-slate-300 text-white cursor-default' 
              : 'bg-nura-blue text-white hover:opacity-90 active:scale-[0.98]'
          }`}
        >
          Mulai Scan <span className="text-[10px]">➔</span>
        </button>
      </div>
    </div>
  );
}
