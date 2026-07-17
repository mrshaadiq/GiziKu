import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  useEffect(() => { api('/epidemiologi/dashboard').then(setData); }, []);

  if (!data) return <div className="flex items-center justify-center p-12"><div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">📊 Dashboard Ringkasan GiziKu</h2>
        <p className="text-slate-400 text-sm mt-2">Deteksi Dini Rhesus Negatif, Morfologi Sel Darah Merah (Skrining Carrier Thalasemia), dan Risiko Anemia/Stunting</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-950 border border-slate-900 rounded-2xl shadow-lg">
          <div className="text-slate-500 text-2xl">👥</div>
          <div className="text-2xl md:text-3xl font-black font-mono text-white mt-3">{data.total_catin}</div>
          <div className="text-xs font-bold text-slate-400 mt-1">Calon Pengantin Skrining</div>
        </div>
        <div className="p-5 bg-slate-950 border border-slate-900 rounded-2xl shadow-lg">
          <div className="text-slate-500 text-2xl">⏱️</div>
          <div className="text-2xl md:text-3xl font-black font-mono text-amber-400 mt-3">{data.active_cases}</div>
          <div className="text-xs font-bold text-slate-400 mt-1">Kasus Aktif (72-Hour)</div>
        </div>
        <div className="p-5 bg-slate-950 border border-slate-900 rounded-2xl shadow-lg">
          <div className="text-slate-500 text-2xl">✅</div>
          <div className="text-2xl md:text-3xl font-black font-mono text-emerald-400 mt-3">{data.resolved_cases}</div>
          <div className="text-xs font-bold text-slate-400 mt-1">Tindakan Selesai</div>
        </div>
        <div className="p-5 bg-slate-950 border border-slate-900 rounded-2xl shadow-lg">
          <div className="text-slate-500 text-2xl">🏥</div>
          <div className="text-2xl md:text-3xl font-black font-mono text-cyan-400 mt-3">{data.total_faskes}</div>
          <div className="text-xs font-bold text-slate-400 mt-1">Faskes Rujukan Jejaring</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-6 bg-slate-950 border border-slate-900 rounded-2xl space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-cyan-400">💡 Alur Deteksi & Skrining Pranikah</h3>
          <div className="space-y-3 text-xs text-slate-400">
            <div className="flex gap-3 items-start"><span className="w-5 h-5 rounded-full bg-cyan-400/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span><div><strong className="text-white">Isi Kuesioner Kesehatan Mental / Profil:</strong> Menganalisis latar belakang perilaku dan psikologis calon pengantin secara holistik.</div></div>
            <div className="flex gap-3 items-start"><span className="w-5 h-5 rounded-full bg-cyan-400/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span><div><strong className="text-white">Gunakan AI Lab Scanner:</strong> Unggah foto lembar hasil lab darah Anda untuk deteksi instan indikator Hemoglobin, Rhesus, dan Thalasemia Carrier.</div></div>
            <div className="flex gap-3 items-start"><span className="w-5 h-5 rounded-full bg-cyan-400/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span><div><strong className="text-white">Bandingkan Pasangan (Pohon Genetik):</strong> Hitung kecocokan genetik dan rhesus golongan darah untuk memproyeksikan keamanan janin kelak.</div></div>
            <div className="flex gap-3 items-start"><span className="w-5 h-5 rounded-full bg-cyan-400/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">4</span><div><strong className="text-white">Rujukan Faskes:</strong> Jika berisiko tinggi, cetak Kartu Rujukan Digital dan temukan rumah sakit terdekat yang menyediakan persediaan obat RhoGAM.</div></div>
          </div>
        </div>

        <div className="p-6 bg-amber-950/10 border border-amber-500/15 rounded-2xl flex flex-col justify-between">
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-2">⚕️ Disclaimer Medis Resmi</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              GiziKu AI menggunakan algoritma kecerdasan buatan terlatih dan integrasi data nasional untuk memindai risiko klinis pada calon pengantin. Namun, hasil analisis sistem ini bersifat skrining dini dan rekomendasi edukasi, bukan diagnosis medis mutlak. Keputusan klinis dan resep obat harus tetap dikonfirmasi oleh dokter.
            </p>
          </div>
          <div className="text-[10px] text-amber-500/80 font-mono mt-4">Kemenkes RI & BKKBN Partner App</div>
        </div>
      </div>
    </div>
  );
}
