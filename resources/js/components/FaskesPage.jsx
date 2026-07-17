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

  if (loading) return <div className="flex items-center justify-center p-12"><div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-500 p-6 md:p-8 text-white shadow-xl shadow-blue-500/10">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">🏥 Fasilitas Kesehatan Terdekat</h2>
        <p className="text-blue-100 text-xs mt-2 max-w-2xl font-medium">Temukan jejaring Puskesmas, Rumah Sakit Rujukan, Posyandu, dan Klinik Anak terdekat untuk penanganan gizi dan tumbuh kembang.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 border border-slate-200 rounded-xl w-max">
        {['Semua', 'Puskesmas', 'Rumah Sakit Rujukan', 'Posyandu', 'Klinik Swasta'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${filterType === type ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Faskes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(f => (
          <div key={f.id} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-slate-350 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase shadow-inner ${f.tipe === 'Posyandu' ? 'bg-purple-50 text-purple-600 border border-purple-100' : f.tipe === 'Puskesmas' ? 'bg-blue-50 text-blue-600 border border-blue-100' : f.tipe === 'Klinik Swasta' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                    {f.tipe}
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-800 mt-2">{f.nama}</h4>
                </div>
                <span className="text-[10px] font-black text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded-lg shrink-0">📍 {f.jarak}</span>
              </div>

              <div className="text-xs space-y-1 text-slate-600 leading-relaxed font-semibold">
                <div>📌 Alamat: <span className="font-medium text-slate-500">{f.alamat}</span></div>
                <div>📞 Hubungi: <span className="font-medium text-slate-500 font-mono">{f.phone}</span></div>
                <div>🩺 Tenaga Medis: <span className="text-blue-600 font-bold">{f.dokter}</span></div>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-100">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Layanan Utama</span>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{f.layanan}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
