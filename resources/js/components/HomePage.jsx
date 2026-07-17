import React from 'react';

export default function HomePage({ history, onTabChange }) {
  const recent = history.slice(0, 5);

  const stats = {
    total: history.length,
    needsFollowUp: history.filter(h => h.status_anemia === 'Anemia Berat' || h.status_stunting === 'Stunting').length,
    faskes: 4,
    articles: 6
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div>
        <div className="text-xs font-black text-slate-400 font-mono">Jumat, 17 Juli 2026</div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight mt-1">Halo, Orang Tua! 👋</h2>
        <p className="text-slate-400 text-xs mt-1.5 font-semibold">Pantau tumbuh kembang dan kesehatan si kecil dari satu tempat.</p>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Pemeriksaan', val: stats.total, icon: '📈', color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { label: 'Perlu Tindak Lanjut', val: stats.needsFollowUp, icon: '⚠️', color: 'text-rose-600 bg-rose-50 border-rose-100' },
          { label: 'Faskes Tersedia', val: stats.faskes, icon: '🏥', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          { label: 'Artikel Edukasi', val: stats.articles, icon: '📖', color: 'text-amber-600 bg-amber-50 border-amber-100' }
        ].map((s, idx) => (
          <div key={idx} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${s.color}`}>
              {s.icon}
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold leading-none">{s.label}</div>
              <div className="text-lg md:text-xl font-black text-slate-800 font-mono mt-1 leading-none">{s.val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Screening Banner & Shortcuts */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Large Screening Card */}
          <div 
            onClick={() => onTabChange('screening')}
            className="p-6 bg-gradient-to-r from-blue-600 to-teal-500 rounded-3xl text-white shadow-xl shadow-blue-500/10 cursor-pointer hover:shadow-2xl hover:scale-[1.01] transition-all flex items-center justify-between relative overflow-hidden"
          >
            <div className="space-y-3 z-10 max-w-[80%]">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl">📸</div>
              <h3 className="text-lg md:text-xl font-black tracking-tight mt-3">Screening Kesehatan Anak</h3>
              <div className="flex gap-1.5">
                {['Fisik', 'Gizi', 'Mental'].map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-white/20 text-[9px] font-black uppercase tracking-wider">{t}</span>
                ))}
              </div>
              <p className="text-[10px] text-blue-50/80 leading-relaxed font-semibold">
                Analisis AI berbasis kamera · Berjalan sepenuhnya di perangkat · Hasil instan tanpa internet
              </p>
            </div>
            
            <div className="text-2xl font-black text-white/40 shrink-0">➔</div>
          </div>

          {/* 2 Smaller Shortcuts Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              onClick={() => onTabChange('education')}
              className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-slate-300 cursor-pointer transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-xl">📖</span>
                <h4 className="text-xs font-bold text-slate-800">Edukasi & Literasi</h4>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">6 artikel tentang gizi dan kesehatan mental anak</p>
              </div>
              <span className="text-[10px] text-blue-600 hover:text-blue-500 font-black mt-4 inline-block">Jelajah Materi ➔</span>
            </div>

            <div 
              onClick={() => onTabChange('facilities')}
              className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-slate-300 cursor-pointer transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-xl">🏥</span>
                <h4 className="text-xs font-bold text-slate-800">Faskes Terdekat</h4>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">4 fasilitas kesehatan ditemukan di sekitar Anda</p>
              </div>
              <span className="text-[10px] text-emerald-600 hover:text-emerald-500 font-black mt-4 inline-block">Lihat Faskes ➔</span>
            </div>
          </div>

        </div>

        {/* Right Side: Recent History List */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-black text-slate-800">Riwayat Terbaru</h3>
            <button 
              onClick={() => onTabChange('history')}
              className="text-[10px] font-black text-blue-600 hover:text-blue-500"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-3.5">
            {recent.map(r => (
              <div 
                key={r.id} 
                className="flex items-center justify-between gap-3 text-xs border-b border-slate-50 pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center font-bold text-slate-400 text-[10px]">👶</div>
                  <div>
                    <div className="font-extrabold text-slate-800">{r.nama_anak}</div>
                    <div className="text-[9px] text-slate-400 font-bold leading-none mt-0.5">{r.usia_bulan} bln · {r.tanggal}</div>
                  </div>
                </div>
                
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase shrink-0 shadow-inner ${r.status_anemia === 'Anemia Berat' ? 'bg-red-50 text-red-600 border border-red-100' : r.status_anemia === 'Anemia Ringan' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                  {r.status_anemia}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
