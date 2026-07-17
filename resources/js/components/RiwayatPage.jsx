import React, { useState } from 'react';

export default function RiwayatPage({ history }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const filtered = history.filter(r => 
    r.nama_anak.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-500 p-6 md:p-8 text-white shadow-xl shadow-blue-500/10">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">📋 Riwayat Pemeriksaan Anak</h2>
        <p className="text-blue-100 text-xs mt-2 max-w-2xl font-medium">Lihat seluruh catatan pemeriksaan, status gizi/stunting, indikator anemia, dan cetak hasil rekomendasi dokter.</p>
      </div>

      {selectedRecord ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <button 
              onClick={() => setSelectedRecord(null)} 
              className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 bg-white hover:bg-slate-50 transition-all"
            >
              ← Kembali ke Daftar
            </button>
            <span className="text-xs text-slate-400 font-bold font-mono">{selectedRecord.tanggal}</span>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-150 rounded-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Identitas Balita</span>
                <h3 className="text-base font-extrabold text-slate-800 mt-0.5">{selectedRecord.nama_anak} ({selectedRecord.usia_bulan} bulan)</h3>
              </div>
              <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase shadow-inner ${selectedRecord.level_urgensi === 'Tinggi' || selectedRecord.status_anemia === 'Anemia Berat' ? 'bg-red-50 text-red-600 border border-red-100' : selectedRecord.status_anemia === 'Anemia Ringan' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                {selectedRecord.status_anemia}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-slate-600">
              <div className="p-3 bg-white border border-slate-150 rounded-xl">
                <span className="text-[9px] text-slate-400 uppercase block font-bold">Berat Badan</span>
                <span className="text-sm font-bold text-slate-700 mt-1 block">{selectedRecord.berat_badan} kg</span>
              </div>
              <div className="p-3 bg-white border border-slate-150 rounded-xl">
                <span className="text-[9px] text-slate-400 uppercase block font-bold">Tinggi Badan</span>
                <span className="text-sm font-bold text-slate-700 mt-1 block">{selectedRecord.tinggi_badan} cm</span>
              </div>
              <div className="p-3 bg-white border border-slate-150 rounded-xl">
                <span className="text-[9px] text-slate-400 uppercase block font-bold">Status Stunting</span>
                <span className={`text-sm font-bold mt-1 block ${selectedRecord.status_stunting === 'Normal' ? 'text-emerald-600' : 'text-red-500'}`}>{selectedRecord.status_stunting}</span>
              </div>
              <div className="p-3 bg-white border border-slate-150 rounded-xl">
                <span className="text-[9px] text-slate-400 uppercase block font-bold">Diagnosa Anemia</span>
                <span className={`text-sm font-bold mt-1 block ${selectedRecord.status_anemia === 'Normal' ? 'text-emerald-600' : selectedRecord.status_anemia === 'Anemia Ringan' ? 'text-amber-500' : 'text-red-500'}`}>{selectedRecord.status_anemia}</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <span className="text-[9px] uppercase tracking-wider text-slate-450 font-bold block mb-1">Catatan Diagnosa & Penanganan Medis</span>
              <p className="text-xs text-slate-650 leading-relaxed font-semibold">{selectedRecord.catatan}</p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button 
              onClick={() => window.print()}
              className="px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 transition-all"
            >
              🖨️ Cetak Laporan PDF
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          {/* Search bar */}
          <div className="flex items-center gap-3">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari berdasarkan nama anak..."
              className="flex-1 max-w-sm px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-none rounded-xl text-slate-800 font-semibold"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-150 rounded-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                  <th className="py-3 px-6">Nama Anak</th>
                  <th>Usia</th>
                  <th>Tinggi (cm)</th>
                  <th>Status Stunting</th>
                  <th>Pemeriksaan Anemia</th>
                  <th>Tanggal</th>
                  <th className="text-right px-6">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className="border-b border-slate-150 hover:bg-slate-50/50 text-slate-600 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-800">{r.nama_anak}</td>
                    <td>{r.usia_bulan} bulan</td>
                    <td className="font-mono">{r.tinggi_badan} cm</td>
                    <td>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${r.status_stunting === 'Normal' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        {r.status_stunting}
                      </span>
                    </td>
                    <td>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${r.status_anemia === 'Normal' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : r.status_anemia === 'Anemia Ringan' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        {r.status_anemia}
                      </span>
                    </td>
                    <td className="text-slate-450 font-mono">{r.tanggal || '17 Jul 2026'}</td>
                    <td className="text-right px-6">
                      <button 
                        onClick={() => setSelectedRecord(r)}
                        className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 text-[10px] font-extrabold rounded-xl transition-all"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
