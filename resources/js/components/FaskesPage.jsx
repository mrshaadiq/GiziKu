import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function FaskesPage() {
  const [faskesList, setFaskesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('Semua');

  useEffect(() => {
    api('/faskes').then(data => {
      setFaskesList(data);
      setLoading(false);
    });
  }, []);

  const filtered = filterType === 'Semua' 
    ? faskesList 
    : faskesList.filter(f => f.tipe === filterType);

  if (loading) return <div className="flex items-center justify-center p-12"><div className="w-8 h-8 border-3 border-nura-blue border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      {/* Brand Gradient Header */}
      <div 
        className="relative overflow-hidden rounded-[24px] p-6 md:p-8 text-white shadow-none"
        style={{ background: 'linear-gradient(135deg, #1b5be8 0%, #0f3fa3 100%)' }}
      >
        <div className="text-[11px] font-bold uppercase tracking-widest text-blue-200">Fasilitas Rujukan</div>
        <h2 className="text-2xl md:text-[28px] font-extrabold tracking-tight mt-1">Fasilitas Kesehatan Terdekat</h2>
        <p className="text-blue-100 text-xs mt-2 max-w-2xl font-medium">Temukan jejaring Puskesmas, Rumah Sakit Rujukan, Posyandu, dan Klinik Anak terdekat untuk penanganan gizi dan tumbuh kembang.</p>
      </div>

      {/* Filter Tabs (Design System §6.6) */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-nura-muted border border-nura-foreground/5 rounded-full w-max">
        {['Semua', 'Puskesmas', 'Rumah Sakit Rujukan', 'Posyandu', 'Klinik Swasta'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterType === type ? 'bg-white text-nura-blue shadow-sm' : 'text-nura-muted-foreground hover:text-nura-foreground'}`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Faskes Cards Grid (Design System grid-cols-2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map(f => (
          <div key={f.id} className="p-5 bg-white border border-nura-foreground/10 rounded-2xl flex flex-col justify-between hover:border-nura-blue/20 hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border shadow-inner ${
                    f.tipe === 'Posyandu' 
                      ? 'bg-purple-50 text-purple-600 border-purple-100' 
                      : f.tipe === 'Puskesmas' 
                      ? 'bg-blue-50 text-blue-600 border-blue-100' 
                      : f.tipe === 'Klinik Swasta' 
                      ? 'bg-amber-50 text-amber-600 border-amber-100' 
                      : 'bg-rose-50 text-rose-600 border-rose-100'
                  }`}>
                    {f.tipe}
                  </span>
                  <h4 className="text-sm font-extrabold text-nura-foreground mt-2">{f.nama}</h4>
                </div>
                <span className="text-[10px] font-bold text-nura-muted-foreground font-mono bg-nura-muted px-2.5 py-1 rounded-lg shrink-0">📍 {f.jarak}</span>
              </div>

              <div className="text-xs space-y-1.5 text-nura-foreground/80 leading-relaxed font-semibold">
                <div>📌 Alamat: <span className="font-medium text-nura-muted-foreground">{f.alamat}</span></div>
                <div>📞 Hubungi: <span className="font-medium text-nura-muted-foreground font-mono">{f.phone}</span></div>
                <div>🩺 Tenaga Medis: <span className="text-nura-blue font-bold">{f.dokter}</span></div>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-nura-muted">
              <span className="text-[9px] uppercase tracking-wider text-nura-muted-foreground font-bold block mb-1">Layanan Utama</span>
              <p className="text-xs text-nura-muted-foreground font-medium leading-relaxed">{f.layanan}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
