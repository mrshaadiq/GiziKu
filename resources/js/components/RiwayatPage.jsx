import React, { useState } from 'react';
import { Baby, Calendar, ChevronRight, FileText, ArrowLeft, Scale, Ruler, HeartPulse } from 'lucide-react';

export default function RiwayatPage({ history }) {
  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Group history by child name
  const groupedChildren = history.reduce((acc, record) => {
    const key = record.nama_anak.trim();
    if (!acc[key]) {
      acc[key] = {
        name: key,
        records: []
      };
    }
    acc[key].records.push(record);
    return acc;
  }, {});

  // Convert to array and sort children by their latest screening date
  const childrenList = Object.values(groupedChildren).map(child => {
    // Sort records by ID or date descending (latest first)
    const sortedRecords = [...child.records].sort((a, b) => b.id - a.id);
    return {
      name: child.name,
      latestRecord: sortedRecords[0],
      records: sortedRecords
    };
  }).filter(child => 
    child.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full font-sans text-nura-foreground select-none">
      {/* Brand Gradient Banner */}
      <div 
        className="relative overflow-hidden rounded-[24px] p-6 md:p-8 text-white shadow-none"
        style={{ background: 'linear-gradient(135deg, #1b5be8 0%, #0f3fa3 100%)' }}
      >
        <div className="text-[11px] font-bold uppercase tracking-widest text-blue-200">Arsip Diagnosa</div>
        <h2 className="text-2xl md:text-[28px] font-extrabold tracking-tight mt-1">Riwayat Pemeriksaan Anak</h2>
        <p className="text-blue-100 text-xs mt-2 max-w-2xl font-medium">
          Daftar rekam medis gizi anak terkelompok berdasarkan profil anak. Pantau grafik tumbuh kembang tersegmen secara mandiri.
        </p>
      </div>

      {selectedRecord ? (
        /* DETAIL RECORD VIEW */
        <div className="bg-white border border-nura-foreground/10 rounded-2xl p-6 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-nura-muted pb-3.5">
            <button 
              onClick={() => setSelectedRecord(null)} 
              className="h-[40px] px-5 text-xs font-bold rounded-xl bg-nura-muted text-nura-muted-foreground hover:bg-slate-200 transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Riwayat Anak
            </button>
            <span className="text-xs text-nura-muted-foreground font-bold font-mono">{selectedRecord.tanggal || new Date(selectedRecord.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>

          <div className="p-5 bg-nura-muted border border-nura-foreground/5 rounded-xl space-y-5">
            <div className="flex items-center justify-between border-b border-nura-foreground/10 pb-3">
              <div>
                <span className="text-[10px] font-bold text-nura-muted-foreground uppercase tracking-widest block font-mono">ID Pemeriksaan: #{selectedRecord.id}</span>
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
              <div className="p-3 bg-white border border-nura-foreground/5 rounded-xl flex items-center gap-2.5">
                <Scale className="w-5 h-5 text-nura-blue shrink-0" />
                <div>
                  <span className="text-[9px] text-nura-muted-foreground uppercase block font-bold">Berat Badan</span>
                  <span className="text-xs font-black text-nura-foreground font-mono">{selectedRecord.berat_badan} kg</span>
                </div>
              </div>
              <div className="p-3 bg-white border border-nura-foreground/5 rounded-xl flex items-center gap-2.5">
                <Ruler className="w-5 h-5 text-nura-blue shrink-0" />
                <div>
                  <span className="text-[9px] text-nura-muted-foreground uppercase block font-bold">Tinggi Badan</span>
                  <span className="text-xs font-black text-nura-foreground font-mono">{selectedRecord.tinggi_badan} cm</span>
                </div>
              </div>
              <div className="p-3 bg-white border border-nura-foreground/5 rounded-xl flex items-center gap-2.5">
                <Baby className="w-5 h-5 text-nura-blue shrink-0" />
                <div>
                  <span className="text-[9px] text-nura-muted-foreground uppercase block font-bold">Status Stunting</span>
                  <span className={`text-xs font-bold ${selectedRecord.status_stunting === 'Normal' ? 'text-nura-green' : 'text-nura-red'}`}>{selectedRecord.status_stunting}</span>
                </div>
              </div>
              <div className="p-3 bg-white border border-nura-foreground/5 rounded-xl flex items-center gap-2.5">
                <HeartPulse className="w-5 h-5 text-nura-blue shrink-0" />
                <div>
                  <span className="text-[9px] text-nura-muted-foreground uppercase block font-bold">Anemia</span>
                  <span className={`text-xs font-bold ${selectedRecord.status_anemia === 'Normal' ? 'text-nura-green' : selectedRecord.status_anemia === 'Anemia Ringan' ? 'text-nura-yellow' : 'text-nura-red'}`}>{selectedRecord.status_anemia}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-nura-foreground/10 pt-3.5">
              <span className="text-[10px] uppercase tracking-widest text-nura-muted-foreground font-bold block mb-1">Catatan Diagnosa & Penanganan Medis</span>
              <p className="text-xs text-nura-foreground/90 leading-relaxed font-semibold font-sans">{selectedRecord.catatan}</p>
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
      ) : selectedChild ? (
        /* SINGLE CHILD TIMELINE VIEW */
        <div className="bg-white border border-nura-foreground/10 rounded-2xl p-6 space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-nura-muted pb-3.5">
            <button 
              onClick={() => setSelectedChild(null)} 
              className="h-[40px] px-5 text-xs font-bold rounded-xl bg-nura-muted text-nura-muted-foreground hover:bg-slate-200 transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Anak
            </button>
            <div className="text-right">
              <span className="text-[10px] font-bold text-nura-muted-foreground uppercase tracking-widest block">Profil Anak</span>
              <h3 className="text-sm font-black text-nura-foreground">{selectedChild.name}</h3>
            </div>
          </div>

          {/* Timeline check items */}
          <div className="relative border-l-2 border-slate-100 ml-4 pl-6 space-y-6 py-2">
            {selectedChild.records.map((r, idx) => {
              const dateStr = r.tanggal || new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
              return (
                <div key={r.id} className="relative group">
                  {/* Circle Indicator on line */}
                  <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-nura-blue border-4 border-white shadow-md"></span>
                  
                  <div className="p-4 bg-nura-muted border border-nura-foreground/5 hover:border-nura-blue/20 rounded-xl transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-nura-foreground">{r.usia_bulan} bulan</span>
                        <span className="text-[10px] text-nura-muted-foreground font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {dateStr}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-semibold text-nura-muted-foreground">
                        <span>BB: <strong className="text-nura-foreground font-mono">{r.berat_badan} kg</strong></span>
                        <span>•</span>
                        <span>TB: <strong className="text-nura-foreground font-mono">{r.tinggi_badan} cm</strong></span>
                        <span>•</span>
                        <span>Stunting: <strong className={r.status_stunting === 'Normal' ? 'text-nura-green' : 'text-nura-red'}>{r.status_stunting}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        r.status_anemia === 'Normal' 
                          ? 'bg-[#dcfce7] text-[#16a34a]' 
                          : r.status_anemia === 'Anemia Ringan' 
                          ? 'bg-[#fef9c3] text-[#ca8a04]' 
                          : 'bg-[#fee2e2] text-[#e53e3e]'
                      }`}>
                        {r.status_anemia}
                      </span>
                      <button 
                        onClick={() => setSelectedRecord(r)}
                        className="px-3.5 py-1.5 bg-white border border-nura-foreground/10 hover:bg-slate-50 text-nura-blue text-[10px] font-bold rounded-lg transition-all"
                      >
                        Detail Diagnosa
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* CHILDREN GRID VIEW */
        <div className="bg-white border border-nura-foreground/10 rounded-2xl p-6 space-y-4 shadow-none">
          {/* Search bar */}
          <div className="flex items-center gap-3">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari berdasarkan nama anak..."
              className="flex-1 max-w-sm h-[52px] px-4 py-3 text-xs bg-nura-muted border-2 border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-nura-foreground font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {childrenList.map(child => {
              const latest = child.latestRecord;
              const dateStr = latest.tanggal || new Date(latest.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
              return (
                <div 
                  key={child.name}
                  onClick={() => setSelectedChild(child)}
                  className="p-5 bg-nura-muted border border-nura-foreground/5 hover:border-nura-blue/20 hover:bg-white rounded-2xl cursor-pointer hover:shadow-md transition-all flex justify-between items-center"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-nura-accent flex items-center justify-center text-sm">
                        👶
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-nura-foreground">{child.name}</h4>
                        <p className="text-[9px] text-nura-muted-foreground font-semibold">Tinggi Terakhir: {latest.tinggi_badan} cm ({latest.usia_bulan} bln)</p>
                      </div>
                    </div>

                    <div className="flex gap-2 items-center text-[9px] font-bold">
                      <span className={`px-2 py-0.5 rounded ${latest.status_stunting === 'Normal' ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#fee2e2] text-[#e53e3e]'}`}>
                        {latest.status_stunting}
                      </span>
                      <span className={`px-2 py-0.5 rounded ${latest.status_anemia === 'Normal' ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#fee2e2] text-[#e53e3e]'}`}>
                        {latest.status_anemia}
                      </span>
                      <span className="text-nura-muted-foreground font-mono">{child.records.length}x periksa</span>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-nura-muted-foreground" />
                </div>
              );
            })}

            {childrenList.length === 0 && (
              <div className="md:col-span-2 py-12 text-center text-xs text-nura-muted-foreground font-semibold">
                Belum ada riwayat pemeriksaan anak yang tersimpan.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
