import React, { useState, useEffect } from 'react';
import { api, formatRupiah } from '../api';

// ============================================
// 1. GENETIC TREE PAGE
// ============================================
export function GeneticTreePage() {
  const [maleBlood, setMaleBlood] = useState('A');
  const [maleRh, setMaleRh] = useState('+');
  const [femaleBlood, setFemaleBlood] = useState('A');
  const [femaleRh, setFemaleRh] = useState('+');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const calculate = () => {
    setLoading(true);
    api('/genetic-tree/calculate', { method: 'POST' }).then(res => {
      setResult(res);
      setLoading(false);
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">🌳 Kalkulator Genetika & Rhesus Golongan Darah</h2>
        <p className="text-slate-400 text-sm mt-2">Menganalisis persentase kecocokan rhesus darah calon orang tua serta risiko inkompatibilitas rhesus janin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-900 pb-3">🧬 Profil Pasangan</h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-900/20 border border-slate-900 rounded-xl space-y-3">
              <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest">Golongan Darah Pria</span>
              <div className="grid grid-cols-4 gap-2">
                {['A', 'B', 'AB', 'O'].map(b => (
                  <button key={b} onClick={() => setMaleBlood(b)} className={`py-2 text-xs font-bold rounded-lg border ${maleBlood === b ? 'bg-cyan-500 border-cyan-500 text-slate-950' : 'bg-slate-950 border-slate-900 text-slate-400'}`}>{b}</button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['+', '-'].map(r => (
                  <button key={r} onClick={() => setMaleRh(r)} className={`py-2 text-xs font-bold rounded-lg border ${maleRh === r ? 'bg-cyan-500 border-cyan-500 text-slate-950' : 'bg-slate-950 border-slate-900 text-slate-400'}`}>Rhesus {r === '+' ? 'Positif (+)' : 'Negatif (-)'}</button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-900/20 border border-slate-900 rounded-xl space-y-3">
              <span className="text-[10px] font-extrabold text-pink-400 uppercase tracking-widest">Golongan Darah Wanita</span>
              <div className="grid grid-cols-4 gap-2">
                {['A', 'B', 'AB', 'O'].map(b => (
                  <button key={b} onClick={() => setFemaleBlood(b)} className={`py-2 text-xs font-bold rounded-lg border ${femaleBlood === b ? 'bg-pink-500 border-pink-500 text-slate-950' : 'bg-slate-950 border-slate-900 text-slate-400'}`}>{b}</button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['+', '-'].map(r => (
                  <button key={r} onClick={() => setFemaleRh(r)} className={`py-2 text-xs font-bold rounded-lg border ${femaleRh === r ? 'bg-pink-500 border-pink-500 text-slate-950' : 'bg-slate-950 border-slate-900 text-slate-400'}`}>Rhesus {r === '+' ? 'Positif (+)' : 'Negatif (-)'}</button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={calculate} disabled={loading} className="w-full py-3.5 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg font-black">
            {loading ? 'Menghitung Silsilah...' : 'Proyeksikan Silsilah Genetik'}
          </button>
        </div>

        <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl min-h-80 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-4">🔮 Hasil Proyeksi Genetik AI</h3>
            {loading && <div className="flex justify-center p-12"><div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div></div>}
            {!loading && !result && <div className="text-center p-12 text-xs text-slate-600">Tekan tombol Proyeksikan Silsilah Genetik untuk melihat rincian risiko kehamilan.</div>}
            {!loading && result && (
              <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Tingkat Risiko</span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">{result.risk_level}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium mt-2">{result.explanation}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 2. GEOTRIAGE PAGE
// ============================================
export function GeoTriagePage() {
  const [provinces, setProvinces] = useState([]);
  useEffect(() => { api('/geo-triage/provinces').then(setProvinces); }, []);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">📍 Triage Wilayah Risiko Stunting</h2>
        <p className="text-slate-400 text-sm mt-2">Daftar klasifikasi urutan prioritas wilayah berdasarkan prevalensi stunting nasional terupdate.</p>
      </div>

      <div className="bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3.5 px-6">Provinsi</th>
                <th>Prevalensi Stunting</th>
                <th>Tingkat Kerawanan</th>
                <th>Faskes Rujukan</th>
              </tr>
            </thead>
            <tbody>
              {provinces.map(p => (
                <tr key={p.province_code} className="border-b border-slate-900 hover:bg-slate-900/10 text-slate-300 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-white">{p.province_name}</td>
                  <td className="font-mono text-cyan-400 font-bold">{p.stunting}%</td>
                  <td>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase shadow-inner" style={{background: p.risk_color + '20', color: p.risk_color}}>
                      SKOR {p.risk_score}
                    </span>
                  </td>
                  <td className="max-w-xs truncate text-slate-400 text-[11px]">{p.faskes_access}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 3. READINESS SCORE PAGE
// ============================================
export function ReadinessScorePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const calculate = () => {
    setLoading(true);
    api('/readiness-score').then(res => {
      setResult(res);
      setLoading(false);
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">⭐ Skor Kesiapan Nikah & Kehamilan</h2>
        <p className="text-slate-400 text-sm mt-2">Menghitung skor kelayakan organ dan kecukupan nutrisi sebelum mendaftar KUA.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">Hitung Kesiapan Pranikah</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Sistem akan melakukan komparasi data klinis berupa kadar Hb (mencegah anemia), status thalasemia carrier, berat badan/tinggi badan ideal, serta tingkat kesehatan psikologis Anda.</p>
          </div>
          <button onClick={calculate} disabled={loading} className="w-full py-3.5 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black mt-6 shadow-lg shadow-cyan-500/10">
            {loading ? 'Mengevaluasi Kesiapan...' : 'Mulai Evaluasi Kesiapan'}
          </button>
        </div>

        <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl min-h-64 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Hasil Skor Evaluasi</h3>
            {loading && <div className="flex justify-center p-12"><div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div></div>}
            {!loading && !result && <div className="text-center p-12 text-xs text-slate-600">Klik tombol Evaluasi Kesiapan untuk menghitung persentase indeks kelayakan.</div>}
            {!loading && result && (
              <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-black font-mono text-cyan-400">{result.readiness_score}%</div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">{result.kategori}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium border-t border-slate-900/80 pt-3">{result.analisis}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 4. REFERRAL CARD PAGE
// ============================================
export function ReferralCardPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const calculate = () => {
    setLoading(true);
    api('/referral/generate', { method: 'POST' }).then(res => {
      setResult(res.referral_card);
      setLoading(false);
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">🎫 Cetak Kartu Rujukan Digital</h2>
        <p className="text-slate-400 text-sm mt-2">Dapatkan kartu rujukan otomatis ke RSUD terdekat bila terindikasi memiliki golongan darah Rhesus Negatif.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">Buat Kartu Rujukan</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Bagi ibu hamil atau calon ibu dengan rhesus negatif yang membutuhkan suntikan imunoglobulin pencegah inkompatibilitas janin, kartu rujukan digital ini memfasilitasi administrasi cepat di RSUD rujukan.</p>
          </div>
          <button onClick={calculate} disabled={loading} className="w-full py-3.5 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black mt-6 shadow-lg shadow-cyan-500/10">
            {loading ? 'Membuat Surat Rujukan...' : 'Terbitkan Kartu Rujukan'}
          </button>
        </div>

        <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl min-h-64 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Kartu Rujukan Digital</h3>
            {loading && <div className="flex justify-center p-12"><div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div></div>}
            {!loading && !result && <div className="text-center p-12 text-xs text-slate-600">Tekan tombol Terbitkan Kartu untuk mencetak rujukan RSUD.</div>}
            {!loading && result && (
              <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-xl space-y-4 animate-fadeIn relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl"></div>
                <div className="flex justify-between items-start border-b border-slate-900 pb-3">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-cyan-400">GiziKu Referral System</span>
                    <h4 className="text-xs font-bold text-white mt-0.5">{result.nomor_rujukan}</h4>
                  </div>
                  <span className="text-[10px] text-slate-505 font-mono">{result.tanggal}</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-wider">Diagnosa Deteksi</div>
                    <div className="font-semibold text-slate-200">{result.diagnosa}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-wider">Faskes Tujuan Rujukan</div>
                    <div className="font-semibold text-cyan-400">{result.faskes_tujuan}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 5. COST SIMULATOR PAGE
// ============================================
export function CostSimulatorPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const calculate = () => {
    setLoading(true);
    api('/cost-simulate', { method: 'POST' }).then(res => {
      setResult(res.ai_explanation);
      setLoading(false);
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">💰 Simulator Biaya Skrining & Subsidi BPJS</h2>
        <p className="text-slate-400 text-sm mt-2">Menghitung rincian estimasi biaya tes lab pranikah mandiri versus cakupan subsidi BPJS Kesehatan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">Simulasi Biaya Skrining</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Bandingkan biaya tes laboratorium mandiri dengan skema subsidi BPJS untuk Rhesus Negatif dan Thalasemia Carrier agar perencanaan pernikahan lebih hemat dan aman.</p>
          </div>
          <button onClick={calculate} disabled={loading} className="w-full py-3.5 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black mt-6 shadow-lg shadow-cyan-500/10">
            {loading ? 'Menghitung Biaya...' : 'Mulai Simulasi Biaya'}
          </button>
        </div>

        <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl min-h-64 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Estimasi Biaya Skrining</h3>
            {loading && <div className="flex justify-center p-12"><div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div></div>}
            {!loading && !result && <div className="text-center p-12 text-xs text-slate-600">Klik tombol untuk menghitung estimasi biaya skrining medis.</div>}
            {!loading && result && (
              <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl animate-fadeIn">
                <pre className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">{result}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 6. CERTIFICATE PAGE
// ============================================
export function CertificatePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const calculate = () => {
    setLoading(true);
    api('/certificate/1').then(res => {
      setResult(res);
      setLoading(false);
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">📜 Sertifikat Layak Nikah Digital (e-Certificate)</h2>
        <p className="text-slate-400 text-sm mt-2">Dapatkan sertifikat digital tanda kelayakan kesehatan reproduksi pranikah setelah melakukan seluruh rangkaian tes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">Terbitkan Sertifikat Digital</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Sertifikat ini menunjukkan bahwa kedua calon pengantin telah menyelesaikan skrining gizi, rhesus darah, dan thalasemia carrier dengan hasil yang kompatibel dan siap diajukan ke Kantor Urusan Agama (KUA).</p>
          </div>
          <button onClick={calculate} disabled={loading} className="w-full py-3.5 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black mt-6 shadow-lg shadow-cyan-500/10">
            {loading ? 'Memproses Sertifikat...' : 'Unduh Sertifikat Layak Nikah'}
          </button>
        </div>

        <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl min-h-64 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Sertifikat Layak Nikah</h3>
            {loading && <div className="flex justify-center p-12"><div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div></div>}
            {!loading && !result && <div className="text-center p-12 text-xs text-slate-600">Klik tombol untuk memproses penerbitan sertifikat resmi elektronik.</div>}
            {!loading && result && (
              <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-amber-500/30 rounded-xl space-y-4 animate-fadeIn relative text-center">
                <div className="text-3xl">🏆</div>
                <h4 className="text-xs font-black uppercase tracking-widest text-amber-400">Sertifikat Elektronik Layak Nikah</h4>
                <div className="text-[10px] text-slate-500 mt-0.5">NOMOR: {result.nomor_sertifikat}</div>
                
                <div className="grid grid-cols-2 gap-4 text-left border-y border-slate-900 py-3 mt-4 text-xs">
                  <div>
                    <span className="text-[9px] text-slate-550 uppercase">Catin Pria</span>
                    <div className="font-bold text-slate-200 mt-0.5">{result.nama_pria}</div>
                    <div className="text-[10px] text-slate-400">{result.golongan_darah_pria}</div>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-550 uppercase">Catin Wanita</span>
                    <div className="font-bold text-slate-200 mt-0.5">{result.nama_wanita}</div>
                    <div className="text-[10px] text-slate-400">{result.golongan_darah_wanita}</div>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest block">Status Kelayakan</span>
                  <span className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 inline-block mt-1">{result.status_skrining}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 7. TRACKER PAGE
// ============================================
export function TrackerPage() {
  const [list, setList] = useState([]);
  useEffect(() => { api('/tracker').then(setList); }, []);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">🕵️ Pemantauan Pasien Berisiko Tinggi (72-Hour Action)</h2>
        <p className="text-slate-400 text-sm mt-2">Log real-time pemantauan ibu hamil atau catin berisiko tinggi oleh petugas medis/kader Posyandu setempat.</p>
      </div>

      <div className="bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-slate-505 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3.5 px-6">Nama Pasien</th>
                <th>Usia</th>
                <th>Tingkat Kerawanan</th>
                <th>Status Penanganan</th>
                <th>Waktu Kejadian</th>
              </tr>
            </thead>
            <tbody>
              {list.map(t => (
                <tr key={t.id} className="border-b border-slate-900 hover:bg-slate-900/10 text-slate-300 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-white">{t.nama_pasien}</td>
                  <td>{t.usia_pasien} Tahun</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${t.level_urgensi === 'Tinggi' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {t.level_urgensi}
                    </span>
                  </td>
                  <td className="font-semibold text-cyan-400">{t.status_tindakan}</td>
                  <td className="text-slate-500 font-mono">{new Date(t.created_at).toLocaleDateString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 8. ACTION PLAN PAGE
// ============================================
export function ActionPlanPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const calculate = () => {
    setLoading(true);
    api('/action-plan/generate', { method: 'POST' }).then(res => {
      setResult(res.result.ai_explanation);
      setLoading(false);
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">⚡ Rencana Intervensi 72-Jam (AI Action Plan)</h2>
        <p className="text-slate-400 text-sm mt-2">Dapatkan rencana aksi klinis darurat 72-jam otomatis berbasis AI jika terdeteksi inkompatibilitas rhesus darah.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">Buat Rencana Intervensi</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Skrining rhesus negatif memerlukan langkah cepat untuk mencegah inkompatibilitas rhesus janin pada kehamilan berikutnya. Dapatkan rekomendasi dan urutan tindakan medis di sini.</p>
          </div>
          <button onClick={calculate} disabled={loading} className="w-full py-3.5 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black mt-6 shadow-lg shadow-cyan-500/10">
            {loading ? 'Membuat Rencana Tindakan...' : 'Mulai Rencana Tindakan'}
          </button>
        </div>

        <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl min-h-64 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Rencana Aksi Medis</h3>
            {loading && <div className="flex justify-center p-12"><div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div></div>}
            {!loading && !result && <div className="text-center p-12 text-xs text-slate-600">Tekan tombol di sebelah kiri untuk merumuskan aksi rujukan.</div>}
            {!loading && result && (
              <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl animate-fadeIn">
                <pre className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">{result}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 9. DONOR NETWORK PAGE
// ============================================
export function DonorNetworkPage() {
  const [donors, setDonors] = useState([]);
  useEffect(() => { api('/donors').then(setDonors); }, []);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">🩸 Jejaring Donor Rhesus Negatif Nasional</h2>
        <p className="text-slate-400 text-sm mt-2">Hubungi jejaring pendonor darah rhesus negatif sukarela terdekat untuk kebutuhan darurat persalinan.</p>
      </div>

      <div className="bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3.5 px-6">Nama Donatur</th>
                <th>Golongan Darah</th>
                <th>Kontak / Telp</th>
                <th>Wilayah Kota</th>
              </tr>
            </thead>
            <tbody>
              {donors.map(d => (
                <tr key={d.id} className="border-b border-slate-900 hover:bg-slate-900/10 text-slate-300 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-white">{d.nama}</td>
                  <td>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-red-500/10 border border-red-500/20 text-red-400">
                      {d.golongan_darah} Rh {d.rhesus}
                    </span>
                  </td>
                  <td className="font-mono text-cyan-400 font-bold">{d.phone}</td>
                  <td className="text-slate-400">{d.kota}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 10. EPIDEMIOLOGI PAGE
// ============================================
export function EpidemiologiPage() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api('/epidemiologi/stats').then(setStats); }, []);

  if (!stats) return <div className="flex items-center justify-center p-12"><div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">📈 Analisis Epidemiologi Nasional</h2>
        <p className="text-slate-400 text-sm mt-2">Portal intelijen data kesehatan reproduksi nasional untuk analisis prevalensi stunting, Thalasemia, dan inkompatibilitas rhesus.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl">
          <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Total Provinsi Terdata</div>
          <div className="text-xl font-bold font-mono text-white mt-1">{stats.summary.total_provinces} Provinsi</div>
        </div>
        <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl">
          <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Zona Urgensi Merah</div>
          <div className="text-xl font-bold font-mono text-red-500 mt-1">{stats.summary.high_risk_provinces} Provinsi</div>
        </div>
        <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl">
          <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Rata-rata AKI Nasional</div>
          <div className="text-xl font-bold font-mono text-amber-500 mt-1">{stats.summary.avg_aki} Kematian</div>
        </div>
        <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl">
          <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Total Carrier Thalasemia</div>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-1">{stats.summary.total_thalasemia.toLocaleString()} Jiwa</div>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-4">Urutan Sebaran Risiko Tertinggi</h3>
        <div className="space-y-3">
          {stats.provinces.map(p => (
            <div key={p.province_code} className="p-4 bg-slate-900/30 border border-slate-880 hover:border-slate-800 rounded-xl flex items-center justify-between text-xs transition-all">
              <div>
                <div className="font-bold text-slate-200">{p.province_name}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">AKI: {p.aki} · Populasi Rh(-): {p.populasi_rh_negatif_persen}% · Kasus Thalasemia: {p.kasus_thalasemia}</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-red-500/10 text-red-400 border border-red-500/20">RISIKO {p.risk_score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// 11. LITERASI / EDUKASI PAGE
// ============================================
export function LiterasiPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  
  // Quiz states
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  useEffect(() => {
    api('/education').then(data => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  const handleAnswerSelect = (qIdx, optIdx) => {
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const submitQuiz = (quizData) => {
    let score = 0;
    quizData.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) {
        score++;
      }
    });
    const finalPercent = Math.round((score / quizData.length) * 100);
    setQuizScore(finalPercent);
    setQuizSubmitted(true);
  };

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  if (loading) return <div className="flex items-center justify-center p-12"><div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">📖 Hub Literasi & Kuis Pranikah GiziKu</h2>
        <p className="text-slate-400 text-sm mt-2">Dapatkan pemahaman mendalam tentang Rhesus Negatif, Thalasemia, pencegahan stunting, serta evaluasi pemahaman melalui kuis interaktif.</p>
      </div>

      {selectedArticle ? (
        <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 space-y-4 animate-fadeIn">
          <button onClick={() => setSelectedArticle(null)} className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-800 text-slate-400 hover:text-white">
            <i className="fas fa-arrow-left mr-1"></i> Kembali ke Daftar Artikel
          </button>
          <div className="border-b border-slate-900 pb-3 mt-2">
            <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{selectedArticle.kategori}</span>
            <h3 className="text-lg font-bold text-white mt-2">{selectedArticle.judul}</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">{selectedArticle.konten}</p>
        </div>
      ) : activeQuiz ? (
        <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 space-y-4 animate-fadeIn">
          <button onClick={() => setActiveQuiz(null)} className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-800 text-slate-400 hover:text-white">
            <i className="fas fa-arrow-left mr-1"></i> Kembali ke Daftar
          </button>
          <div className="border-b border-slate-900 pb-3 mt-2">
            <h3 className="text-base font-bold text-white">📝 Evaluasi Kesiapan Kesehatan Pranikah</h3>
            <p className="text-xs text-slate-505 mt-1">Uji pemahaman Anda seputar kelainan darah, keturunan genetik, dan rhesus kehamilan.</p>
          </div>

          <div className="space-y-4">
            {activeQuiz.quiz_data.map((q, idx) => (
              <div key={idx} className="p-4 bg-slate-900/20 border border-slate-900 rounded-xl space-y-3">
                <div className="text-xs font-bold text-slate-200">{idx + 1}. {q.question}</div>
                <div className="grid grid-cols-1 gap-2">
                  {q.options.map((opt, oi) => {
                    const isSelected = quizAnswers[idx] === oi;
                    let btnStyle = 'bg-slate-950 border-slate-900 text-slate-400 hover:text-white';
                    if (quizSubmitted) {
                      if (oi === q.correct) {
                        btnStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-400 font-bold';
                      } else if (isSelected) {
                        btnStyle = 'bg-red-500/15 border-red-500 text-red-400 font-bold';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-cyan-500 border-cyan-500 text-slate-950 font-black';
                    }
                    
                    return (
                      <button 
                        key={oi} type="button" 
                        disabled={quizSubmitted}
                        onClick={() => handleAnswerSelect(idx, oi)}
                        className={`p-3 text-left text-xs font-semibold rounded-lg border transition-all ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {!quizSubmitted ? (
            <button 
              onClick={() => submitQuiz(activeQuiz.quiz_data)} 
              disabled={Object.keys(quizAnswers).length < activeQuiz.quiz_data.length}
              className={`w-full py-3.5 text-xs font-bold rounded-xl transition-all ${Object.keys(quizAnswers).length < activeQuiz.quiz_data.length ? 'bg-slate-900 text-slate-600 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-500/10'}`}
            >
              Kirim Jawaban
            </button>
          ) : (
            <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-xl text-center space-y-2.5 animate-fadeIn">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">Skor Evaluasi Anda</span>
              <div className="text-3xl font-black font-mono text-cyan-400">{quizScore}%</div>
              <p className="text-xs text-slate-400">
                {quizScore >= 80 ? 'Hebat! Anda memiliki pemahaman yang matang mengenai kesehatan reproduksi pranikah.' : 'Kami merekomendasikan Anda untuk membaca kembali materi edukasi di atas agar persiapan pranikah semakin optimal.'}
              </p>
              <button onClick={() => startQuiz(activeQuiz)} className="mt-2 px-4 py-2 text-xs font-bold rounded-lg border border-slate-800 text-slate-300 hover:text-white">Ulangi Kuis</button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-white mb-2">Artikel Edukasi Populer</h3>
            {articles.filter(a => a.tipe === 'artikel').map(a => (
              <div key={a.id} className="p-4 bg-slate-955 border border-slate-900 rounded-2xl flex flex-col justify-between hover:border-slate-800 transition-all">
                <div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{a.kategori}</span>
                  <h4 className="text-sm font-bold text-white mt-2.5">{a.judul}</h4>
                  <p className="text-xs text-slate-400 mt-1">{a.ringkasan}</p>
                </div>
                <button onClick={() => setSelectedArticle(a)} className="text-xs text-cyan-400 hover:text-cyan-300 font-bold self-start mt-4 flex items-center gap-1">
                  Baca Selengkapnya <i className="fas fa-arrow-right text-[10px]"></i>
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-bold text-white mb-2">Evaluasi Interaktif</h3>
            {articles.filter(a => a.tipe === 'kuis').map(a => (
              <div key={a.id} className="p-5 bg-slate-950 border border-slate-900 rounded-2xl space-y-4 text-center">
                <span className="text-3xl">📝</span>
                <h4 className="text-sm font-bold text-white mt-2">Kuis Kesiapan Kesehatan Pranikah</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Uji pemahaman Anda seputar kelainan darah bawaan dan kesiapan janin.</p>
                <button onClick={() => startQuiz(a)} className="w-full py-2.5 text-xs font-bold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-md shadow-cyan-500/10">Mulai Kuis Sekarang</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
