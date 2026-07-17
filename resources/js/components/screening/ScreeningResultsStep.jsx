import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  Activity, 
  MapPin, 
  Printer, 
  RefreshCw, 
  FileText,
  Heart
} from 'lucide-react';

export default function ScreeningResultsStep({ report, onReset, onTabChange }) {
  if (!report) return null;

  const isAnemia = report.status_anemia !== 'Normal';
  const isStunting = report.status_stunting !== 'Normal';

  return (
    <div className="space-y-6 flex-1 animate-fadeIn">
      {/* Warning / Success Banner (Top - Image 4) */}
      <div className={`p-5 rounded-2xl border-2 flex items-start gap-4 ${
        isAnemia 
          ? 'bg-amber-50 border-amber-100 text-amber-850' 
          : 'bg-emerald-50 border-emerald-100 text-emerald-850'
      }`}>
        <div className="shrink-0 mt-0.5">
          {isAnemia ? (
            <AlertTriangle className="w-5 h-5 text-amber-600 animate-pulse" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          )}
        </div>
        <div>
          <h4 className="text-sm font-black tracking-tight leading-none">
            {isAnemia 
              ? `Tindakan Diperlukan: Tanda ${report.status_anemia} Terdeteksi`
              : 'Hasil Skrining: Status Kesehatan Anak Normal'
            }
          </h4>
          <p className="text-[10px] opacity-80 font-bold mt-1.5 uppercase tracking-wide">
            {report.nama_anak} · {report.usia_bulan} bulan · {report.tanggal}
          </p>
        </div>
      </div>

      {/* Main Results Content (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Column: AI Diagnosis & Recommendations (3fr) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* AI Analysis Cards Section */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Analisis AI
            </h3>
            
            {/* Eye Diagnosis Card */}
            <div className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all ${
              isAnemia 
                ? 'bg-amber-50/30 border-amber-100/50' 
                : 'bg-emerald-50/20 border-emerald-100/50'
            }`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                isAnemia ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">
                  Diagnostik Kelopak Mata
                </span>
                <p className="text-xs font-bold text-nura-foreground mt-1">
                  {isAnemia 
                    ? 'Konjungtiva: Pucat / Kurang Merah (Indikasi kadar zat besi rendah)'
                    : 'Konjungtiva: Merah Muda Sehat (Indikasi hemoglobin normal)'
                  }
                </p>
              </div>
            </div>

            {/* Nail Diagnosis Card */}
            <div className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all ${
              isAnemia 
                ? 'bg-amber-50/30 border-amber-100/50' 
                : 'bg-emerald-50/20 border-emerald-100/50'
            }`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                isAnemia ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">
                  Diagnostik Bantalan Kuku
                </span>
                <p className="text-xs font-bold text-nura-foreground mt-1">
                  {isAnemia 
                    ? 'Warna Kuku: Pucat Sirkulasi Perifer Kurang Optimal'
                    : 'Warna Kuku: Merah Muda Sehat Normal'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Local Nutrition Recommendations Section */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Rekomendasi Nutrisi Lokal
            </h3>

            <div className="space-y-2.5">
              {/* Moringa Card */}
              <div className="p-3 bg-emerald-50/30 border border-emerald-100/40 rounded-xl flex items-center gap-3">
                <span className="text-xl">🍃</span>
                <div>
                  <h4 className="text-xs font-black text-emerald-700 leading-tight">Daun Kelor (Moringa)</h4>
                  <p className="text-[10px] text-emerald-600/80 font-bold mt-0.5">Kaya Vitamin A & Zat Besi</p>
                </div>
              </div>

              {/* Egg Card */}
              <div className="p-3 bg-amber-50/30 border border-amber-100/40 rounded-xl flex items-center gap-3">
                <span className="text-xl">🥚</span>
                <div>
                  <h4 className="text-xs font-black text-amber-700 leading-tight">Telur Rebus</h4>
                  <p className="text-[10px] text-amber-600/80 font-bold mt-0.5">Sumber protein utama untuk tumbuh kembang</p>
                </div>
              </div>

              {/* Fish Card */}
              <div className="p-3 bg-blue-50/30 border border-blue-100/40 rounded-xl flex items-center gap-3">
                <span className="text-xl">🐟</span>
                <div>
                  <h4 className="text-xs font-black text-blue-700 leading-tight">Ikan Kembung (Mackerel)</h4>
                  <p className="text-[10px] text-blue-600/80 font-bold mt-0.5">Omega-3 terjangkau sumber pangan lokal</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Summary (2fr) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Action Call-to-actions */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Tindak Lanjut
            </h3>

            <div className="flex flex-col gap-2.5">
              {/* Find Clinic Button */}
              <button
                type="button"
                onClick={() => onTabChange('facilities')}
                className="w-full h-[48px] bg-nura-teal hover:opacity-90 active:scale-[0.98] text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-nura-teal/10 transition-all"
              >
                <MapPin className="w-4 h-4" /> Temukan Klinik Terdekat
              </button>

              {/* Download PDF Button */}
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full h-[48px] bg-nura-blue hover:opacity-90 active:scale-[0.98] text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-nura-blue/10 transition-all"
              >
                <Printer className="w-4 h-4" /> Unduh & Bagikan PDF
              </button>

              {/* Restart Button */}
              <button
                type="button"
                onClick={onReset}
                className="w-full h-[44px] hover:bg-slate-100 border border-transparent hover:border-slate-200 text-nura-muted-foreground hover:text-nura-foreground font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Mulai Pemeriksaan Baru
              </button>
            </div>
          </div>

          {/* Screening Summary Table */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Ringkasan Pemeriksaan
            </h3>

            <div className="border border-slate-150 rounded-xl overflow-hidden text-xs bg-white">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 px-4 font-bold text-slate-450 uppercase text-[9px] tracking-wider">Nama</td>
                    <td className="py-2.5 px-4 font-extrabold text-nura-foreground text-right">{report.nama_anak}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 px-4 font-bold text-slate-450 uppercase text-[9px] tracking-wider">Usia</td>
                    <td className="py-2.5 px-4 font-extrabold text-nura-foreground text-right">{report.usia_bulan} bulan</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 px-4 font-bold text-slate-450 uppercase text-[9px] tracking-wider">TB / BB</td>
                    <td className="py-2.5 px-4 font-extrabold text-nura-foreground text-right">{report.tinggi_badan} cm / {report.berat_badan} kg</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 px-4 font-bold text-slate-450 uppercase text-[9px] tracking-wider">Stunting</td>
                    <td className={`py-2.5 px-4 font-black text-right ${isStunting ? 'text-nura-red' : 'text-nura-green'}`}>
                      {report.status_stunting === 'Normal' ? 'Normal' : 'Stunting'}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 px-4 font-bold text-slate-450 uppercase text-[9px] tracking-wider">Status Anemia</td>
                    <td className={`py-2.5 px-4 font-black text-right ${isAnemia ? 'text-amber-600' : 'text-nura-green'}`}>
                      {report.status_anemia}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-450 uppercase text-[9px] tracking-wider">Tanggal</td>
                    <td className="py-2.5 px-4 font-extrabold text-nura-foreground text-right font-mono">{report.tanggal}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
