import React, { useState, useEffect } from 'react';
import { api } from '../api';
import IndonesiaSVGMap from './IndonesiaSVGMap';

export default function HomePage() {
  const [provinces, setProvinces] = useState([]);
  const [activeLayer, setActiveLayer] = useState('risk');
  const [selectedProvince, setSelectedProvince] = useState(null);

  useEffect(() => {
    api('/geo-triage/provinces').then(data => {
      setProvinces(data);
    });
  }, []);

  const highRisk = provinces.filter(p => p.risk_score >= 45);
  const selected = provinces.find(p => p.province_code === selectedProvince);

  const SOURCES = [
    { label: 'BPS — Angka Kematian Ibu (AKI)', url: 'https://www.bps.go.id/id/statistics-table/2/MTczNyMy/angka-kematian-ibu-melahirkan-per-100-000-kelahiran-hidup.html' },
    { label: 'Kemenkes — Data Thalasemia Indonesia', url: 'https://www.kemkes.go.id/article/view/23010400004/data-dan-informasi-profil-kesehatan-indonesia-2022.html' },
    { label: 'WHO — Maternal Mortality Ratio', url: 'https://www.who.int/data/gho/data/indicators/indicator-details/GHO/maternal-mortality-ratio-(per-100-000-live-births)' },
    { label: 'Kemenkes — Profil Faskes (Puskesmas)', url: 'https://www.kemkes.go.id/article/view/23123100005/profil-kementerian-kesehatan-ri-tahun-2023.html' },
    { label: 'BPS — Jumlah Penduduk per Provinsi', url: 'https://www.bps.go.id/id/statistics-table/2/MTk2IzI=/projected-population-by-province-2020-2025.html' },
  ];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          🗺️ Peta Risiko Kesehatan Pranikah Indonesia
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-2xl">
          Visualisasi data interaktif risiko stunting, rhesus negatif, kasus thalasemia, dan angka kematian ibu di 34 provinsi Indonesia untuk intervensi kesehatan calon pengantin.
        </p>
      </div>

      {/* Layer Toggles */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-950 border border-slate-900 rounded-xl w-max">
        {[
          { id: 'risk', label: '🎯 Skor Risiko Gabungan' },
          { id: 'aki', label: '💔 Kematian Ibu (AKI)' },
          { id: 'thalasemia', label: '🧬 Kasus Thalasemia' },
          { id: 'literasi', label: '📖 Indeks Literasi' },
        ].map(l => (
          <button 
            key={l.id} 
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${activeLayer === l.id ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'}`}
            onClick={() => setActiveLayer(l.id)}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Map Widget */}
      <div className="p-6 bg-slate-950/80 border border-slate-900 rounded-2xl shadow-xl shadow-black/40">
        <IndonesiaSVGMap
          provinces={provinces}
          activeLayer={activeLayer}
          selectedProvince={selectedProvince}
          onSelectProvince={(p) => setSelectedProvince(p.province_code === selectedProvince ? null : p.province_code)}
        />

        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-6 border-t border-slate-900 text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-emerald-500"></span> Risiko Rendah</div>
          <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-yellow-500"></span> Risiko Sedang</div>
          <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-orange-500"></span> Risiko Tinggi</div>
          <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-red-600"></span> Risiko Sangat Tinggi</div>
        </div>
      </div>

      {/* Selected Province details */}
      {selected && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border rounded-2xl p-6 transition-all duration-300 shadow-lg shadow-black/30" style={{borderColor: selected.risk_color + '40'}}>
          <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">📍 Provinsi {selected.province_name}</h3>
            <span className="px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider shadow-inner" style={{background: selected.risk_color + '20', color: selected.risk_color}}>
              SKOR RISIKO: {selected.risk_score}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3.5 bg-slate-950/50 border border-slate-900 rounded-xl">
              <div className="text-xl font-bold font-mono text-cyan-400">{selected.stunting}%</div>
              <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mt-1">Prevalensi Stunting</div>
            </div>
            <div className="p-3.5 bg-slate-950/50 border border-slate-900 rounded-xl">
              <div className="text-xl font-bold font-mono text-white">{selected.aki}</div>
              <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mt-1">Kematian Ibu (per 100k)</div>
            </div>
            <div className="p-3.5 bg-slate-950/50 border border-slate-900 rounded-xl">
              <div className="text-xl font-bold font-mono text-white">{selected.kasus_thalasemia?.toLocaleString()}</div>
              <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mt-1">Kasus Thalasemia</div>
            </div>
            <div className="p-3.5 bg-slate-950/50 border border-slate-900 rounded-xl">
              <div className="text-xl font-bold font-mono text-white">{selected.populasi_rh_negatif_persen}%</div>
              <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mt-1">Populasi Rhesus (-)</div>
            </div>
            <div className="p-3.5 bg-slate-950/50 border border-slate-900 rounded-xl">
              <div className="text-xl font-bold font-mono text-amber-400">{selected.defisit_stok_rh_negatif} vial</div>
              <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mt-1">Defisit Imunoglobulin</div>
            </div>
            <div className="p-3.5 bg-slate-950/50 border border-slate-900 rounded-xl">
              <div className="text-xl font-bold font-mono text-white">{selected.indeks_literasi}/5</div>
              <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mt-1">Indeks Literasi</div>
            </div>
            <div className="p-3.5 bg-slate-950/50 border border-slate-900 rounded-xl col-span-2">
              <div className="text-xs text-slate-300 leading-relaxed font-medium">{selected.faskes_access}</div>
              <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mt-1.5">Aksesibilitas Faskes Rujukan</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-red-950/15 border border-red-500/15 rounded-xl">
            <span className="text-[9px] uppercase tracking-widest font-extrabold text-red-400 block mb-1">Rencana Prioritas Penanganan Daerah</span>
            <p className="text-xs text-slate-400 leading-relaxed">{selected.urgency_priority}</p>
          </div>
        </div>
      )}

      {/* High Risk Provinces */}
      <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">⚠️ Provinsi Dengan Urgensi Tinggi ({highRisk.length})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {highRisk.slice(0, 8).map(p => (
            <div 
              key={p.province_code} 
              className="p-3.5 bg-slate-900/30 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 hover:bg-slate-900/50 transition-all"
              style={{borderLeftWidth: '4px', borderLeftColor: p.risk_color}}
              onClick={() => setSelectedProvince(p.province_code === selectedProvince ? null : p.province_code)}
            >
              <div className="text-xs font-bold text-white">{p.province_name}</div>
              <div className="text-sm font-black font-mono mt-1" style={{color: p.risk_color}}>RISIKO: {p.risk_score}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Stunting: {p.stunting}% · AKI: {p.aki}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Government data resources */}
      <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-300 mb-2">📚 Sumber Data Nasional Resmi</h3>
        <p className="text-xs text-slate-500 mb-4">Intervensi klinis & epidemiologi GiziKu terintegrasi dengan publikasi data resmi:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {SOURCES.map((s, i) => (
            <a 
              key={i} href={s.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-900 hover:border-cyan-500/30 hover:bg-slate-900/30 text-xs text-cyan-400 hover:text-cyan-300 transition-all font-semibold"
            >
              <span>🔗</span>
              <span className="truncate">{s.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
