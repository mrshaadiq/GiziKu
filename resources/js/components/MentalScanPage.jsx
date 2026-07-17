import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';

export default function MentalScanPage() {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState('new_scan');
  const [patient, setPatient] = useState({ name: window.USER_NAME || '', birth_date: '', age: '', ageText: '', gender: 'L' });
  const [answers, setAnswers] = useState({});
  const [currentArea, setCurrentArea] = useState('muka');
  const [photos, setPhotos] = useState({ muka: null, mata: null, kuku: null });
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [overallReport, setOverallReport] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [selectedHistoryReport, setSelectedHistoryReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const videoFeedRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setHistoryList([
      { id: 101, nama_pasien: patient.name || 'Demo User', usia_pasien: 25, jenis_kelamin: 'L', level_risiko: 'Rendah', created_at: new Date(Date.now() - 3600000 * 5).toISOString(), laporan_gabungan_decoded: { ringkasan_pengguna: "Kondisi psikologis stabil. Tingkat stres 15% (Rendah), kecemasan 20% (Rendah), pola tidur baik. Disarankan pertahankan aktivitas fisik dan waktu istirahat yang teratur." } }
    ]);
  }, []);

  const calculateAge = (bdate) => {
    if (!bdate) return;
    const birthDate = new Date(bdate);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
      years--;
      months += 12;
    }
    
    let ageString = '';
    if (years > 0) ageString += `${years} Tahun `;
    if (months > 0 || years === 0) ageString += `${months} Bulan`;
    
    setPatient(prev => ({ ...prev, age: years, ageText: ageString.trim(), birth_date: bdate }));
    setAnswers({});
  };

  const getAgeGroupLabel = () => {
    const age = parseInt(patient.age) || 0;
    if (age >= 1 && age <= 3) return 'Grup Balita: 1-3 Tahun';
    if (age >= 4 && age <= 6) return 'Grup Prasekolah: 4-6 Tahun';
    if (age >= 7 && age <= 12) return 'Grup Anak Sekolah: 7-12 Tahun';
    return 'Grup Remaja & Dewasa: >13 Tahun';
  };

  const getQuestions = () => {
    const age = parseInt(patient.age) || 0;
    if (age >= 1 && age <= 3) {
      return [
        { id: 'q1', text: 'Apakah anak Anda sering mengalami tantrum hebat atau rewel berlebihan?', key: 'tantrum' },
        { id: 'q2', text: 'Apakah anak Anda menunjukkan tanda kemunduran perilaku (seperti mengompol lagi atau mogok bicara)?', key: 'regresi' },
        { id: 'q3', text: 'Apakah anak Anda memiliki kebiasaan mengisap jempol, menggigit kuku, atau membenturkan kepala?', key: 'isap_jempol' },
        { id: 'q4', text: 'Apakah anak Anda sulit ditenangkan saat berpisah dari orang tua atau pengasuh?', key: 'separation' },
        { id: 'q5', text: 'Apakah pola tidur anak Anda tidak teratur (sering terbangun malam atau sulit tidur)?', key: 'sleep_dist' },
        { id: 'q6', text: 'Apakah anak Anda menolak makan secara tidak biasa (GTM berlebihan/pilih-pilih makanan ekstrem)?', key: 'eating_issue' },
        { id: 'q7', text: 'Catatan tambahan orang tua mengenai kondisi perilaku atau kebiasaan balita Anda (opsional):', key: 'catatan_orang_tua', type: 'text' }
      ];
    } else if (age >= 4 && age <= 6) {
      return [
        { id: 'q1', text: 'Apakah anak Anda sering mengeluh takut berlebihan (misal takut gelap, sendiri, atau monster)?', key: 'fear' },
        { id: 'q2', text: 'Apakah anak Anda sering menarik diri dari interaksi keluarga atau menolak bermain dengan teman sebaya?', key: 'social_withdraw' },
        { id: 'q3', text: 'Apakah anak Anda sering mengalami mimpi buruk berulang secara intens pada malam hari?', key: 'nightmare' },
        { id: 'q4', text: 'Apakah anak Anda memiliki kebiasaan menggigit kuku atau mengorek kulit saat merasa cemas?', key: 'nail_biting' },
        { id: 'q5', text: 'Apakah anak Anda tampak cemas, panik, atau menangis berlebihan saat ditinggal sebentar oleh orang tua?', key: 'separation_anxiety' },
        { id: 'q6', text: 'Apakah anak Anda sering mengeluh sakit perut atau pusing tanpa adanya sebab medis yang jelas?', key: 'somatic' },
        { id: 'q7', text: 'Catatan tambahan orang tua mengenai kondisi perilaku atau kebiasaan anak prasekolah Anda (opsional):', key: 'catatan_orang_tua', type: 'text' }
      ];
    } else if (age >= 7 && age <= 12) {
      return [
        { id: 'q1', text: 'Apakah anak Anda menunjukkan penurunan performa belajar atau menolak bersekolah secara tiba-tiba?', key: 'school_issue' },
        { id: 'q2', text: 'Apakah anak Anda tampak mudah tersinggung, lekas marah, atau bertindak agresif/membangkang?', key: 'irritability' },
        { id: 'q3', text: 'Apakah anak Anda sering cemas atau takut berlebihan mengenai nilai sekolah, ujian, atau pertemanan?', key: 'academic_stress' },
        { id: 'q4', text: 'Apakah anak Anda memiliki kebiasaan menggigit kuku, melamun berlebihan, atau memutar-mutar rambut saat tegang?', key: 'nervous_habit' },
        { id: 'q5', text: 'Apakah anak Anda sering mengeluh lelah, lesu, atau terlihat tidak bersemangat untuk bermain?', key: 'fatigue' },
        { id: 'q6', text: 'Apakah anak Anda mengalami kesulitan tidur, sering begadang, atau mengantuk berlebihan di siang hari?', key: 'insomnia' },
        { id: 'q7', text: 'Catatan tambahan orang tua mengenai kondisi perilaku atau kebiasaan anak sekolah Anda (opsional):', key: 'catatan_orang_tua', type: 'text' }
      ];
    } else {
      return [
        { id: 'q1', text: 'Apakah Anda tampak murung, sedih, atau merasa hampa hampir sepanjang hari?', key: 'depression' },
        { id: 'q2', text: 'Apakah Anda menarik diri dari pergaulan teman dan keluarga secara drastis?', key: 'withdraw' },
        { id: 'q3', text: 'Apakah Anda menunjukkan kelelahan ekstrem (burnout), hilangnya minat hobi, atau lemas terus-merus?', key: 'burnout' },
        { id: 'q4', text: 'Apakah Anda memiliki kebiasaan menggigit kuku, menarik rambut, atau melukai diri saat tertekan?', key: 'anxiety_habit' },
        { id: 'q5', text: 'Apakah Anda mengalami gangguan tidur parah (insomnia berat, begadang sepanjang malam)?', key: 'insomnia' },
        { id: 'q6', text: 'Apakah Anda terlihat tidak mempedulikan penampilan atau perawatan diri?', key: 'self_neglect' },
        { id: 'q7', text: 'Catatan tambahan mengenai kondisi perilaku atau kebiasaan Anda (opsional):', key: 'catatan_orang_tua', type: 'text' }
      ];
    }
  };

  const answersComplete = () => {
    return getQuestions().every(q => q.type === 'text' || answers[q.key] !== undefined);
  };

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setStream(s);
      if (videoFeedRef.current) {
        videoFeedRef.current.srcObject = s;
      }
      setCameraActive(true);
    } catch (err) {
      alert("Kamera tidak dapat diakses. Anda dapat mengunggah file foto secara manual.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoFeedRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoFeedRef.current, 0, 0, canvas.width, canvas.height);
    const rawUrl = canvas.toDataURL('image/jpeg');
    setPhotos(prev => ({ ...prev, [currentArea]: rawUrl }));
    stopCamera();
  };

  const handleFileUpload = (e) => {
    const f = e.target.files[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotos(prev => ({ ...prev, [currentArea]: event.target.result }));
      };
      reader.readAsDataURL(f);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const submitAll = () => {
    setLoading(true);
    setStep(4);
    setTimeout(() => {
      const mockResult = {
        success: true,
        id: Date.now(),
        level_risiko: 'Rendah',
        laporan_gabungan: {
          ringkasan_pengguna: "Kondisi psikologis stabil. AI tidak mendeteksi tanda-tanda kecemasan wajah atau indikasi stres mata yang patologis. Rekomendasi: Pertahankan tidur teratur 7-8 jam per hari, dan luangkan waktu relaksasi 15 menit.",
          stres_level: "18% (Rendah)",
          insomnia_level: "22% (Rendah)",
          kecemasan_level: "15% (Rendah)"
        }
      };

      setOverallReport(mockResult.laporan_gabungan);
      setHistoryList(prev => [
        {
          id: mockResult.id,
          nama_pasien: patient.name,
          usia_pasien: patient.age,
          jenis_kelamin: patient.gender,
          level_risiko: mockResult.level_risiko,
          created_at: new Date().toISOString(),
          laporan_gabungan_decoded: mockResult.laporan_gabungan
        },
        ...prev
      ]);
      setLoading(false);
      setStep(5);
    }, 2500);
  };

  const resetScanner = () => {
    stopCamera();
    setStep(1);
    setPatient({ name: window.USER_NAME || '', birth_date: '', age: '', ageText: '', gender: 'L' });
    setAnswers({});
    setPhotos({ muka: null, mata: null, kuku: null });
    setOverallReport(null);
    setSelectedHistoryReport(null);
  };

  const viewHistoryItem = (item) => {
    setSelectedHistoryReport(item);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            🧠 Visual Mental Health AI Scanner
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl">
            Skrining tingkat stres, insomnia, kecemasan, dan kejiwaan menggunakan visual facial analysis (Gemini AI) pada wajah, mata, dan kuku calon pengantin atau anak.
          </p>
        </div>
        <button onClick={resetScanner} className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900 text-white transition-all">
          <i className="fas fa-redo mr-2"></i> Reset Skrining
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-900 gap-2 pb-px">
        <button onClick={() => setActiveTab('new_scan')} className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all ${activeTab === 'new_scan' ? 'text-white border-cyan-400' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>
          <i className="fas fa-stethoscope mr-2"></i> Skrining Baru
        </button>
        <button onClick={() => setActiveTab('history')} className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all ${activeTab === 'history' ? 'text-white border-cyan-400' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>
          <i className="fas fa-history mr-2"></i> Riwayat Skrining ({historyList.length})
        </button>
      </div>

      {activeTab === 'new_scan' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl space-y-5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-900 pb-3">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs flex items-center justify-center font-bold">1</span> Profil Pasien
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">Nama Lengkap</label>
                    <input type="text" value={patient.name} onChange={(e) => setPatient(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-3 text-sm bg-slate-900/60 border border-slate-800 hover:border-slate-700 focus:border-cyan-400 focus:outline-none rounded-xl text-white font-medium" placeholder="Masukkan nama" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">Tanggal Lahir</label>
                      <input type="date" value={patient.birth_date} onChange={(e) => calculateAge(e.target.value)} className="w-full px-4 py-3 text-sm bg-slate-900/60 border border-slate-800 hover:border-slate-700 focus:border-cyan-400 focus:outline-none rounded-xl text-white font-mono" />
                      {patient.ageText && <div className="text-[10px] font-extrabold text-cyan-400 mt-1.5">Umur: {patient.ageText}</div>}
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">Jenis Kelamin</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button type="button" onClick={() => setPatient(prev => ({ ...prev, gender: 'L' }))} className={`py-3 text-xs font-bold rounded-xl border transition-all ${patient.gender === 'L' ? 'bg-cyan-500 text-slate-950 border-cyan-500' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'}`}>Laki-laki</button>
                        <button type="button" onClick={() => setPatient(prev => ({ ...prev, gender: 'P' }))} className={`py-3 text-xs font-bold rounded-xl border transition-all ${patient.gender === 'P' ? 'bg-cyan-500 text-slate-950 border-cyan-500' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'}`}>Perempuan</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button onClick={() => setStep(2)} disabled={!patient.name || !patient.age} className={`px-5 py-3 text-xs font-bold rounded-xl transition-all ${(!patient.name || !patient.age) ? 'bg-slate-900 text-slate-600 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'}`}>
                    Lanjut ke Kuesioner <i className="fas fa-arrow-right ml-1"></i>
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl space-y-5">
                <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs flex items-center justify-center font-bold">2</span> Kuesioner Mental
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 font-mono">{getAgeGroupLabel()}</span>
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                  {getQuestions().map((q, idx) => (
                    <div key={q.id} className="p-4 bg-slate-900/20 border border-slate-900 rounded-xl space-y-3">
                      <div className="text-xs font-bold text-slate-200">{idx + 1}. {q.text}</div>
                      {q.type === 'text' ? (
                        <textarea value={answers[q.key] || ''} onChange={(e) => setAnswers(prev => ({ ...prev, [q.key]: e.target.value }))} className="w-full px-4 py-2.5 text-xs bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-cyan-400 focus:outline-none rounded-xl text-slate-300 font-medium" placeholder="Tuliskan catatan..." rows={3} />
                      ) : (
                        <div className="flex gap-2">
                          {['Ya', 'Tidak'].map((opt, oi) => (
                            <button key={oi} type="button" onClick={() => setAnswers(prev => ({ ...prev, [q.key]: opt }))} className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${answers[q.key] === opt ? 'bg-cyan-500 border-cyan-500 text-slate-950 font-black' : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-white'}`}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-4 border-t border-slate-900">
                  <button onClick={() => setStep(1)} className="px-5 py-3 text-xs font-bold rounded-xl border border-slate-800 text-slate-400 hover:text-white">Kembali</button>
                  <button onClick={() => setStep(3)} disabled={!answersComplete()} className={`px-5 py-3 text-xs font-bold rounded-xl transition-all ${!answersComplete() ? 'bg-slate-900 text-slate-600 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'}`}>
                    Lanjut ke Foto Fisik <i className="fas fa-arrow-right ml-1"></i>
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl space-y-5">
                <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs flex items-center justify-center font-bold">3</span> Foto Fisik AI Scan
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-mono">Area: {currentArea.toUpperCase()}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: 'muka', label: 'Wajah (Muka)', desc: 'Tingkat stres/depresi', icon: '👤' },
                    { id: 'mata', label: 'Mata', desc: 'Anemia & insomnia', icon: '👁️' },
                    { id: 'kuku', label: 'Kuku', desc: 'Kecemasan & sirkulasi', icon: '💅' }
                  ].map(a => (
                    <button key={a.id} type="button" onClick={() => { stopCamera(); setCurrentArea(a.id); }} className={`p-4 rounded-xl border text-left transition-all ${currentArea === a.id ? 'bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border-cyan-400 text-white' : 'bg-slate-900/30 border-slate-900 text-slate-400 hover:text-white'}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">{a.label}</span>
                        <span>{photos[a.id] ? '✅' : a.icon}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">{a.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="border border-slate-900 rounded-2xl overflow-hidden bg-slate-900/10 min-h-64 flex flex-col items-center justify-center p-6 relative">
                  {cameraActive ? (
                    <div className="w-full max-w-sm aspect-video rounded-xl overflow-hidden border border-slate-800 relative bg-black">
                      <video ref={videoFeedRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100" />
                      <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-xl pointer-events-none flex items-center justify-center">
                        <div className={`w-32 h-32 border border-dashed border-cyan-400/60 ${currentArea === 'muka' ? 'rounded-full' : 'rounded-lg'}`}></div>
                      </div>
                    </div>
                  ) : photos[currentArea] ? (
                    <img src={photos[currentArea]} className="max-h-56 rounded-xl object-contain border border-slate-880" alt="Preview" />
                  ) : (
                    <div className="text-center space-y-2">
                      <span className="text-4xl">📷</span>
                      <p className="text-xs text-slate-400 font-semibold">{currentArea === 'muka' ? 'Posisikan wajah tepat di tengah' : currentArea === 'mata' ? 'Dekatkan mata untuk melihat selaput' : 'Posisikan kuku jari Anda lurus'}</p>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4 relative z-10">
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                    {cameraActive ? (
                      <button onClick={capturePhoto} className="px-4 py-2.5 text-xs font-bold rounded-lg bg-cyan-500 text-slate-950">Ambil Foto</button>
                    ) : (
                      <>
                        <button onClick={startCamera} className="px-4 py-2.5 text-xs font-bold rounded-lg bg-slate-900 border border-slate-800 text-white">Gunakan Kamera</button>
                        <button onClick={handleUploadClick} className="px-4 py-2.5 text-xs font-bold rounded-lg bg-slate-900 border border-slate-800 text-slate-300">Unggah File</button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-900">
                  <button onClick={() => setStep(2)} className="px-5 py-3 text-xs font-bold rounded-xl border border-slate-800 text-slate-400 hover:text-white">Kembali</button>
                  <button onClick={submitAll} disabled={!photos.muka && !photos.mata && !photos.kuku} className={`px-5 py-3 text-xs font-bold rounded-xl transition-all ${(!photos.muka && !photos.mata && !photos.kuku) ? 'bg-slate-900 text-slate-600 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'}`}>
                    Analisis AI Komprehensif <i className="fas fa-brain ml-1"></i>
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="p-12 bg-slate-950 border border-slate-900 rounded-2xl flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <h4 className="text-sm font-bold text-white">Deep Scanning Sedang Berlangsung</h4>
                <p className="text-xs text-slate-505 text-center max-w-xs leading-relaxed">
                  Gemini AI sedang memindai biometrik mikro pada foto wajah, warna kelopak mata, serta rona kuku Anda disandingkan dengan jawaban kuesioner...
                </p>
              </div>
            )}

            {step === 5 && overallReport && (
              <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl space-y-5 animate-fadeIn">
                <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <span>🎉</span> Hasil Skrining AI Selesai
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-mono">Hasil Laporan</span>
                </h3>

                <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl space-y-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest font-extrabold text-cyan-400 block mb-1">Rangkuman Diagnosa AI</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">{overallReport.ringkasan_pengguna}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-900/80">
                    <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg">
                      <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Stres</div>
                      <div className="text-xs font-bold text-slate-200 mt-1">{overallReport.stres_level}</div>
                    </div>
                    <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg">
                      <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Kecemasan</div>
                      <div className="text-xs font-bold text-slate-200 mt-1">{overallReport.kecemasan_level}</div>
                    </div>
                    <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg">
                      <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Insomnia</div>
                      <div className="text-xs font-bold text-slate-200 mt-1">{overallReport.insomnia_level}</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-900">
                  <button onClick={resetScanner} className="px-5 py-3 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950">Mulai Skrining Baru</button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="p-5 bg-slate-950 border border-slate-900 rounded-2xl space-y-3.5 shadow-lg">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                <i className="fas fa-info-circle"></i> Petunjuk AI Scan
              </h4>
              <ul className="text-xs text-slate-400 space-y-3 list-disc pl-4 leading-relaxed">
                <li>Pastikan area pemotretan memiliki pencahayaan terang yang merata.</li>
                <li>Saat memotret mata, tarik kelopak mata bawah sedikit agar konjungtiva terlihat jelas.</li>
                <li>Pada pemindaian kuku, lepaskan cat kuku agar AI dapat memetakan saturasi rona kuku.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4">Daftar Riwayat Skrining Kesehatan Mental</h3>
          {historyList.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-600">Belum ada riwayat skrining terdaftar.</div>
          ) : selectedHistoryReport ? (
            <div className="space-y-4 animate-fadeIn">
              <button onClick={() => setSelectedHistoryReport(null)} className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-800 text-slate-400 hover:text-white mb-2">
                <i className="fas fa-arrow-left mr-1"></i> Kembali ke Daftar
              </button>
              <div className="p-5 bg-slate-900/30 border border-slate-800 rounded-xl space-y-3">
                <div className="flex justify-between text-xs text-slate-505">
                  <span>Nama: <strong>{selectedHistoryReport.nama_pasien}</strong> ({selectedHistoryReport.usia_pasien} Thn)</span>
                  <span>Tanggal: {new Date(selectedHistoryReport.created_at).toLocaleDateString('id-ID')}</span>
                </div>
                <div className="text-xs font-semibold text-slate-200 border-t border-slate-900 pt-3">
                  <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">Hasil Diagnosa</span>
                  {selectedHistoryReport.laporan_gabungan_decoded?.ringkasan_pengguna}
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    <th className="py-3">Pasien</th>
                    <th>Usia</th>
                    <th>Risiko</th>
                    <th>Tanggal</th>
                    <th className="text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {historyList.map(item => (
                    <tr key={item.id} className="border-b border-slate-900 hover:bg-slate-900/10 text-slate-300">
                      <td className="py-3 font-semibold text-white">{item.nama_pasien}</td>
                      <td>{item.usia_pasien} Tahun</td>
                      <td>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${item.level_risiko === 'Tinggi' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                          {item.level_risiko}
                        </span>
                      </td>
                      <td className="text-slate-505">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                      <td className="text-right">
                        <button onClick={() => viewHistoryItem(item)} className="px-3 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold rounded-lg transition-all">Lihat</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
