import React, { useState, useEffect } from 'react';
import IndonesiaMap from './IndonesiaMap';
import { Compass, AlertTriangle, ShieldCheck, Heart, UserCheck, ShieldAlert } from 'lucide-react';

export default function HomePage({ history = [], onTabChange, provinces = {}, isAuthenticated = false, onAuthClick }) {
  const [selectedCode, setSelectedCode] = useState('JB'); // Default focus on Jawa Barat

  // Trigger default selection of Jawa Barat on mount
  useEffect(() => {
    if (provinces && Object.keys(provinces).length > 0) {
      if (provinces['JB']) {
        setSelectedCode('JB');
      }
    }
  }, [provinces]);

  const activeProv = provinces[selectedCode] || {
    name: 'Pilih Provinsi',
    stunting: '-',
    status: 'Silakan pilih wilayah pada peta',
    faskes: 'Detail fasilitas rujukan akan muncul di sini setelah Anda mengklik salah satu wilayah di peta.',
    urgency: 'Pilih salah satu provinsi untuk memuat rencana pencegahan gizi buruk regional.'
  };

  const getStatusBadgeClass = (status) => {
    if (!status) return 'bg-slate-100 text-slate-800 border-slate-200';
    if (status.toLowerCase().includes('di bawah') || status.toLowerCase().includes('rendah')) {
      return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    }
    return 'bg-rose-50 text-rose-600 border-rose-100';
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto w-full font-sans text-nura-foreground">
      {/* Greeting Header & Call to Action */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-nura-muted pb-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-nura-muted-foreground">Peta Sebaran Nasional</div>
          <h2 className="text-2xl md:text-[28px] font-extrabold text-nura-foreground tracking-tight mt-1">Pemetaan Stunting Indonesia</h2>
          <p className="text-nura-muted-foreground text-xs font-semibold mt-1">
            Visualisasi tingkat prevalensi stunting, akses faskes rujukan, dan tingkat urgensi penanganan gizi nasional.
          </p>
        </div>

        {!isAuthenticated ? (
          <div className="flex gap-2.5">
            <button 
              onClick={() => onAuthClick('login')} 
              className="px-5 py-2.5 bg-nura-blue hover:opacity-95 text-xs font-bold text-white rounded-xl transition-all shadow-md shadow-nura-blue/15"
            >
              Masuk Akun
            </button>
            <button 
              onClick={() => onAuthClick('register')} 
              className="px-5 py-2.5 border border-nura-foreground/10 hover:bg-nura-muted text-xs font-bold text-nura-foreground rounded-xl transition-all bg-white"
            >
              Daftar Baru
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-xl text-emerald-700 border border-emerald-100">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold font-mono">Sesi Login Aktif</span>
          </div>
        )}
      </div>

      {/* Split view: Map + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Indonesia Map & Legend (7 Cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
          <IndonesiaMap 
            provinceData={provinces} 
            selectedCode={selectedCode} 
            onSelectProvince={setSelectedCode} 
          />

          {/* Map Legend */}
          <div className="flex flex-wrap gap-4 p-4.5 bg-white border border-nura-foreground/10 rounded-2xl select-none justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-sm"></div>
              <span className="text-xs font-bold text-nura-muted-foreground">Tinggi (&gt; 30%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-sm"></div>
              <span className="text-xs font-bold text-nura-muted-foreground">Sedang (20% - 30%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm"></div>
              <span className="text-xs font-bold text-nura-muted-foreground">Rendah (&le; 20%)</span>
            </div>
          </div>
        </div>

        {/* Right: Province Details Card (5 Cols) */}
        <div className="lg:col-span-4 flex">
          <div className="w-full bg-white border border-nura-foreground/10 rounded-3xl p-6 shadow-none flex flex-col justify-between min-h-[400px]">
            <div className="space-y-4">
              <div className="border-b border-nura-muted pb-3.5 select-none">
                <span className="text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground">Detail Wilayah</span>
                <h3 className="text-lg font-black text-nura-foreground mt-1 flex items-center gap-2">
                  📍 {activeProv.name}
                </h3>
              </div>

              {/* Stunting % and status */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-nura-muted-foreground">Prevalensi Stunting ({activeProv.year || 2024})</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black font-mono text-nura-foreground tracking-tight">
                    {activeProv.stunting}%
                  </span>
                  {activeProv.status !== 'Silakan pilih wilayah pada peta' && (
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border shadow-inner ${getStatusBadgeClass(activeProv.status)}`}>
                      {activeProv.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Faskes access */}
              <div className="space-y-1 pt-2 border-t border-slate-50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-nura-muted-foreground">Akses Fasilitas Kesehatan</span>
                <p className="text-xs text-nura-muted-foreground leading-relaxed font-semibold">
                  {activeProv.faskes}
                </p>
              </div>

              {/* Urgency */}
              <div className="space-y-1 pt-2 border-t border-slate-50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-nura-muted-foreground font-mono">Prioritas & Penanganan</span>
                <p className="text-xs text-nura-muted-foreground leading-relaxed font-semibold">
                  {activeProv.urgency}
                </p>
              </div>
            </div>

            <div className="text-[9px] text-nura-muted-foreground font-mono border-t border-slate-100 pt-3 mt-4 select-none">
              Sumber data: stunting_indonesia_final (Rilis Kemenkes)
            </div>
          </div>
        </div>
      </div>

      {/* Guest Callout or Authenticated Dashboard Grid */}
      {!isAuthenticated ? (
        <div className="p-6 rounded-[24px] text-white shadow-md flex flex-col md:flex-row justify-between items-center gap-6"
             style={{ background: 'linear-gradient(135deg, #1b5be8 0%, #00a49a 100%)' }}
        >
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <h3 className="text-base font-extrabold tracking-tight">Lakukan Skrining Kesehatan Mandiri & Konsultasi Gizi AI</h3>
            <p className="text-xs text-blue-50/90 leading-relaxed font-semibold">
              Gunakan kamera perangkat Anda untuk mendeteksi anemia anak melalui visual kuku/mata, periksa stunting dengan indeks antropometri, dan peroleh rekomendasi makanan lokal pencegah gizi buruk dari AI.
            </p>
          </div>
          <button 
            onClick={() => onAuthClick('login')} 
            className="px-6 py-3 bg-white hover:bg-slate-50 text-nura-blue text-xs font-bold rounded-xl transition-all shadow-lg shrink-0 whitespace-nowrap active:scale-[0.98]"
          >
            Mulai Skrining Sekarang ➔
          </button>
        </div>
      ) : (
        /* Authenticated Features Grid */
        <div className="space-y-6">
          <div className="border-t border-nura-muted pt-6 select-none">
            <h3 className="text-xs font-bold uppercase tracking-widest text-nura-muted-foreground mb-4">Fitur Utama Anda</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div 
              onClick={() => onTabChange('screening')}
              className="p-5 bg-white border border-nura-foreground/10 hover:border-nura-blue/20 rounded-2xl flex flex-col justify-between hover:shadow-md cursor-pointer transition-all space-y-3"
            >
              <div className="space-y-2">
                <span className="text-xl">📸</span>
                <h4 className="text-xs font-black text-nura-foreground">Skrining Stunting & Anemia</h4>
                <p className="text-[10px] text-nura-muted-foreground font-semibold leading-relaxed">
                  Deteksi kepucatan konjungtiva mata, kuku, dan antropometri pertumbuhan anak.
                </p>
              </div>
              <span className="text-[10px] text-nura-blue font-extrabold flex items-center gap-1">Buka Skrining ➔</span>
            </div>

            <div 
              onClick={() => onTabChange('mental_scan')}
              className="p-5 bg-white border border-nura-foreground/10 hover:border-nura-blue/20 rounded-2xl flex flex-col justify-between hover:shadow-md cursor-pointer transition-all space-y-3"
            >
              <div className="space-y-2">
                <span className="text-xl">🧠</span>
                <h4 className="text-xs font-black text-nura-foreground">Skrining Kesehatan Mental</h4>
                <p className="text-[10px] text-nura-muted-foreground font-semibold leading-relaxed">
                  Deteksi dini stres, kecemasan, insomnia, dan perilaku psikologis anak.
                </p>
              </div>
              <span className="text-[10px] text-nura-blue font-extrabold flex items-center gap-1">Buka Skrining Mental ➔</span>
            </div>

            <div 
              onClick={() => onTabChange('food_ai')}
              className="p-5 bg-white border border-nura-foreground/10 hover:border-nura-teal/20 rounded-2xl flex flex-col justify-between hover:shadow-md cursor-pointer transition-all space-y-3"
            >
              <div className="space-y-2">
                <span className="text-xl">🍎</span>
                <h4 className="text-xs font-black text-nura-foreground">Rekomendasi Makanan AI</h4>
                <p className="text-[10px] text-nura-muted-foreground font-semibold leading-relaxed">
                  Rencana asupan gizi harian berbasis komoditas lokal dan preferensi anak.
                </p>
              </div>
              <span className="text-[10px] text-nura-teal font-extrabold flex items-center gap-1">Rekomendasi Menu ➔</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
