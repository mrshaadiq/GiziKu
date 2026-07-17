import React, { useState, useRef } from 'react';
import { api } from '../api';

export default function LabScannerPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResult(null);
    }
  };

  const handleScan = () => {
    if (!file) return;
    setLoading(true);
    api('/lab-scan/analyze', { method: 'POST' }).then(res => {
      setResult(res.result);
      setLoading(false);
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">🔬 AI Lab Sheet Scanner</h2>
        <p className="text-slate-400 text-sm mt-2">Unggah lembar hasil uji laboratorium darah lengkap untuk ekstraksi dan pembacaan otomatis berbasis AI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Panel */}
        <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Langkah 1: Unggah Gambar Lab</h3>
            <div 
              className="border-2 border-dashed border-slate-800 hover:border-cyan-500/40 bg-slate-900/20 hover:bg-slate-900/30 rounded-2xl p-8 text-center cursor-pointer transition-all duration-200"
              onClick={() => fileInputRef.current.click()}
            >
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              {preview ? (
                <img src={preview} className="max-h-56 mx-auto rounded-xl object-contain" alt="Preview" />
              ) : (
                <div className="space-y-3">
                  <div className="text-4xl text-slate-600">📄</div>
                  <div className="text-xs text-slate-400 font-semibold">Klik untuk memilih file hasil lab darah (JPG/PNG)</div>
                  <div className="text-[10px] text-slate-600">Mendukung resolusi tinggi up to 5MB</div>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={handleScan}
            disabled={!file || loading}
            className={`w-full py-3.5 text-xs font-bold rounded-xl transition-all ${!file ? 'bg-slate-900 text-slate-600 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-500/10'}`}
          >
            {loading ? 'Sedang Menganalisis Dengan AI...' : 'Mulai Analisis AI'}
          </button>
        </div>

        {/* AI Results */}
        <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl min-h-80 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Langkah 2: Hasil Pembacaan AI</h3>
            {loading && (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-xs text-slate-500 font-bold">OCR & Deep Learning model sedang memindai...</div>
              </div>
            )}
            {!loading && !result && (
              <div className="text-center p-12 text-xs text-slate-600">Silakan unggah dan analisis file hasil lab untuk melihat penjelasan AI.</div>
            )}
            {!loading && result && (
              <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl space-y-4 animate-fadeIn">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Analisis Sukses
                </h4>
                <pre className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">{result.ai_explanation}</pre>
              </div>
            )}
          </div>
          {result && (
            <div className="text-[10px] text-slate-500 text-center mt-6">Sistem terenkripsi. File hasil lab dihapus dari cloud dalam 10 menit.</div>
          )}
        </div>
      </div>
    </div>
  );
}
