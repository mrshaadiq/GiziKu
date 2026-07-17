import React, { useState } from 'react';

export default function RiwayatPage({ history }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const filtered = history.filter(r => 
    r.nama_anak.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      {/* Brand Gradient Banner */}
      <div 
        className="relative overflow-hidden rounded-[24px] p-6 md:p-8 text-white shadow-none"
        style={{ background: 'linear-gradient(135deg, #1b5be8 0%, #0f3fa3 100%)' }}
      >
        <div className="text-[11px] font-bold uppercase tracking-widest text-blue-200">Arsip Diagnosa</div>
        <h2 className="text-2xl md:text-[28px] font-extrabold tracking-tight mt-1">Riwayat Pemeriksaan Anak</h2>
        <p className="text-blue-100 text-xs mt-2 max-w-2xl font-medium">Lihat seluruh catatan pemeriksaan, status gizi/stunting, indikator anemia, dan cetak hasil rekomendasi dokter.</p>
      </div>

      {selectedRecord ? (
        <div className="bg-white border border-nura-foreground/10 rounded-2xl p-6 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-nura-muted pb-3.5">
            <button 
              onClick={() => setSelectedRecord(null)} 
              className="h-[44px] px-6 text-xs font-bold rounded-2xl bg-nura-muted text-nura-muted-foreground hover:bg-slate-200/80 transition-all active:scale-[0.98]"
            >
              ← Kembali ke Daftar
            </button>
            <span className="text-xs text-nura-muted-foreground font-bold font-mono">{selectedRecord.tanggal}</span>
          </div>

          <div className="p-5 bg-nura-muted border border-nura-foreground/5 rounded-xl space-y-5">
            <div className="flex items-center justify-between border-b border-nura-foreground/10 pb-3">
              <div>
                <span className="text-[10px] font-bold text-nura-muted-foreground uppercase tracking-widest block">Identitas Balita</span>
                <h3 className="text-base font-extrabold text-nura-foreground mt-0.5">{selectedRecord.nama_anak} ({selectedRecord.usia_bulan} bulan)</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase shadow-inner ${
                selectedRecord.status_anemia === 'Anemia Berat' 
                  ? 'bg-[#fee2e2] text-[#e53e3e]' 
                  : selectedRecord.status_anemia === 'Anemia Ringan' 
                  ? 'bg-[#fef9c3] text-[#ca8a04]' 
                  : 'bg-[#dcfce7] text-[#16a34a]'
              }`}>
                {selectedRecord.status_anemia}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-nura-muted-foreground">
              <div className="p-3 bg-white border border-nura-foreground/5 rounded-xl">
                <span className="text-[10px] text-nura-muted-foreground uppercase block font-bold">Berat Badan</span>
                <span className="text-sm font-black text-nura-foreground mt-1 block font-mono">{selectedRecord.berat_badan} kg</span>
              </div>
              <div className="p-3 bg-white border border-nura-foreground/5 rounded-xl">
                <span className="text-[10px] text-nura-muted-foreground uppercase block font-bold">Tinggi Badan</span>
                <span className="text-sm font-black text-nura-foreground mt-1 block font-mono">{selectedRecord.tinggi_badan} cm</span>
              </div>
              <div className="p-3 bg-white border border-nura-foreground/5 rounded-xl">
                <span className="text-[10px] text-nura-muted-foreground uppercase block font-bold">Status Stunting</span>
                <span className={`text-sm font-bold mt-1 block ${selectedRecord.status_stunting === 'Normal' ? 'text-nura-green' : 'text-nura-red'}`}>{selectedRecord.status_stunting}</span>
              </div>
              <div className="p-3 bg-white border border-nura-foreground/5 rounded-xl">
                <span className="text-[10px] text-nura-muted-foreground uppercase block font-bold">Diagnosa Anemia</span>
                <span className={`text-sm font-bold mt-1 block ${selectedRecord.status_anemia === 'Normal' ? 'text-nura-green' : selectedRecord.status_anemia === 'Anemia Ringan' ? 'text-nura-yellow' : 'text-nura-red'}`}>{selectedRecord.status_anemia}</span>
              </div>
            </div>

            <div className="border-t border-nura-foreground/10 pt-3.5">
              <span className="text-[10px] uppercase tracking-widest text-nura-muted-foreground font-bold block mb-1">Catatan Diagnosa & Penanganan Medis</span>
              <p className="text-xs text-nura-foreground/90 leading-relaxed font-semibold">{selectedRecord.catatan}</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button 
              onClick={() => window.print()}
              className="h-[44px] px-6 text-xs font-bold rounded-2xl border border-nura-foreground/10 text-nura-foreground hover:bg-slate-50 flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              🖨️ Cetak Laporan PDF
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-nura-foreground/10 rounded-2xl p-6 space-y-4 shadow-none">
          {/* Search bar matching Design System §6.5 */}
          <div className="flex items-center gap-3">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari berdasarkan nama anak..."
              className="flex-1 max-w-sm h-[52px] px-4 py-3 text-xs bg-nura-muted border-2 border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-nura-foreground font-semibold"
            />
          </div>

          {/* Table (Design System §15.9) */}
          <div className="overflow-x-auto border border-nura-foreground/10 rounded-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-nura-foreground/10 bg-[#f8fafc] text-nura-muted-foreground uppercase tracking-wider text-[10px] font-bold">
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
                  <tr key={r.id} className="border-b border-nura-foreground/5 hover:bg-nura-muted/50 text-nura-foreground/80 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-nura-foreground">{r.nama_anak}</td>
                    <td>{r.usia_bulan} bulan</td>
                    <td className="font-mono">{r.tinggi_badan} cm</td>
                    <td>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${r.status_stunting === 'Normal' ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#fee2e2] text-[#e53e3e]'}`}>
                        {r.status_stunting}
                      </span>
                    </td>
                    <td>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        r.status_anemia === 'Normal' 
                          ? 'bg-[#dcfce7] text-[#16a34a]' 
                          : r.status_anemia === 'Anemia Ringan' 
                          ? 'bg-[#fef9c3] text-[#ca8a04]' 
                          : 'bg-[#fee2e2] text-[#e53e3e]'
                      }`}>
                        {r.status_anemia}
                      </span>
                    </td>
                    <td className="text-nura-muted-foreground font-mono">{r.tanggal || '17 Jul 2026'}</td>
                    <td className="text-right px-6">
                      <button 
                        onClick={() => setSelectedRecord(r)}
                        className="px-3.5 py-1.5 bg-nura-accent hover:opacity-90 border border-nura-blue/15 text-nura-blue text-[10px] font-bold rounded-xl transition-all"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-nura-muted-foreground font-semibold">Tersimpan di memori perangkat</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
