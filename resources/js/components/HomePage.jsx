import React from 'react';

export default function HomePage({ history, onTabChange }) {
  const recent = history.slice(0, 6);

  const stats = {
    total: history.length,
    needsFollowUp: history.filter(h => h.status_anemia === 'Anemia Berat' || h.status_stunting === 'Stunting').length,
    faskes: 4,
    articles: 6
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      {/* Header Row (Greeting Left + AI Status Card Right) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-nura-muted-foreground">Dashboard Pemantauan</div>
          <h2 className="text-2xl md:text-[28px] font-extrabold text-nura-foreground tracking-tight mt-1">Halo, Orang Tua! 👋</h2>
          <p className="text-nura-muted-foreground text-xs font-semibold mt-1">Pantau tumbuh kembang dan kesehatan si kecil dari satu tempat.</p>
        </div>
        
        {/* AI Status Card (Right) */}
        <div className="p-3.5 bg-[#e8f5f4] rounded-xl flex items-center gap-2.5 text-[#2d6b66] border border-nura-teal/10">
          <span className="w-2.5 h-2.5 rounded-full bg-nura-teal animate-pulse shrink-0"></span>
          <div className="text-xs font-bold leading-none">
            Offline Engine Active
            <span className="block text-[9px] text-[#2d6b66]/85 font-medium mt-1">AI berjalan lokal di perangkat</span>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards (Desktop grid-cols-4) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Pemeriksaan', val: stats.total, icon: '📈', color: 'text-nura-blue bg-nura-accent border-nura-blue/15' },
          { label: 'Perlu Tindak Lanjut', val: stats.needsFollowUp, icon: '⚠️', color: 'text-nura-red bg-[#fee2e2] border-nura-red/15' },
          { label: 'Faskes Tersedia', val: stats.faskes, icon: '🏥', color: 'text-nura-green bg-[#dcfce7] border-nura-green/15' },
          { label: 'Artikel Edukasi', val: stats.articles, icon: '📖', color: 'text-nura-yellow bg-[#fffbeb] border-nura-yellow/15' }
        ].map((s, idx) => (
          <div key={idx} className="p-4 bg-white border border-nura-foreground/10 rounded-2xl flex items-center gap-3 shadow-none hover:shadow-md transition-shadow">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${s.color}`}>
              {s.icon}
            </div>
            <div>
              <div className="text-[10px] text-nura-muted-foreground font-bold leading-none uppercase tracking-wider">{s.label}</div>
              <div className="text-lg md:text-xl font-extrabold text-nura-foreground font-mono mt-1.5 leading-none tracking-tight">{s.val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Area (Desktop grid-cols-5: 3fr Left + 2fr Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Side (3fr Column) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Large Gradient Screening Card (Linear Blue-Teal Gradient) */}
          <div 
            onClick={() => onTabChange('screening')}
            className="p-6 rounded-[24px] text-white shadow-none hover:shadow-lg cursor-pointer hover:scale-[1.005] transition-all flex items-center justify-between relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1b5be8 0%, #00a49a 100%)' }}
          >
            <div className="space-y-3 z-10 max-w-[85%]">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl border border-white/10">📸</div>
              <h3 className="text-xl font-extrabold tracking-tight mt-3">Screening Kesehatan Anak</h3>
              <div className="flex gap-1.5">
                {['Fisik', 'Gizi', 'Mental'].map((t, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-full bg-white/20 text-[9px] font-black uppercase tracking-wider">{t}</span>
                ))}
              </div>
              <p className="text-[10px] text-blue-50/95 leading-relaxed font-semibold">
                AI berjalan lokal di perangkat · Tidak perlu internet · Hasil instan
              </p>
            </div>
            
            <div className="text-2xl font-black text-white/35 shrink-0 px-4">➔</div>
          </div>

          {/* 2 Smaller Shortcuts (grid-cols-2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              onClick={() => onTabChange('education')}
              className="p-5 bg-white border border-nura-foreground/10 rounded-2xl flex flex-col justify-between hover:border-nura-blue/20 hover:shadow-md cursor-pointer transition-all"
            >
              <div className="space-y-2">
                <span className="text-xl">📖</span>
                <h4 className="text-xs font-bold text-nura-foreground">Edukasi & Literasi</h4>
                <p className="text-[10px] text-nura-muted-foreground font-semibold leading-relaxed">6 artikel tentang gizi dan kesehatan mental anak</p>
              </div>
              <span className="text-[10px] text-nura-blue font-extrabold mt-4 inline-block">Jelajah Materi ➔</span>
            </div>

            <div 
              onClick={() => onTabChange('facilities')}
              className="p-5 bg-white border border-nura-foreground/10 rounded-2xl flex flex-col justify-between hover:border-nura-teal/20 hover:shadow-md cursor-pointer transition-all"
            >
              <div className="space-y-2">
                <span className="text-xl">🏥</span>
                <h4 className="text-xs font-bold text-nura-foreground">Faskes Terdekat</h4>
                <p className="text-[10px] text-nura-muted-foreground font-semibold leading-relaxed">4 fasilitas kesehatan ditemukan di sekitar Anda</p>
              </div>
              <span className="text-[10px] text-nura-teal font-extrabold mt-4 inline-block">Lihat Faskes ➔</span>
            </div>
          </div>

        </div>

        {/* Right Side (2fr Column: Recent History List) */}
        <div className="lg:col-span-2 p-5 bg-white border border-nura-foreground/10 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-nura-muted pb-3.5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-nura-muted-foreground">Riwayat Terbaru</h3>
            <button 
              onClick={() => onTabChange('history')}
              className="text-[11px] font-bold text-nura-blue hover:opacity-80 transition-opacity"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-3.5">
            {recent.map(r => (
              <div 
                key={r.id} 
                className="flex items-center justify-between gap-3 text-xs border-b border-nura-muted/50 pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-nura-muted flex items-center justify-center font-bold text-nura-muted-foreground text-[10px]">👶</div>
                  <div>
                    <div className="font-bold text-nura-foreground">{r.nama_anak}</div>
                    <div className="text-[9px] text-nura-muted-foreground font-semibold leading-none mt-0.5">{r.usia_bulan} bln · {r.tanggal}</div>
                  </div>
                </div>
                
                {/* Saturated colors + pastel background based on Design System §2.3 */}
                <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase shrink-0 shadow-inner ${
                  r.status_anemia === 'Anemia Berat' 
                    ? 'bg-[#fee2e2] text-[#e53e3e]' 
                    : r.status_anemia === 'Anemia Ringan' 
                    ? 'bg-[#fef9c3] text-[#ca8a04]' 
                    : 'bg-[#dcfce7] text-[#16a34a]'
                }`}>
                  {r.status_anemia}
                </span>
              </div>
            ))}
            {recent.length === 0 && (
              <div className="text-center py-8 text-xs text-nura-muted-foreground font-medium">Belum ada riwayat terdaftar.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
