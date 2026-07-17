import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  Activity, 
  History, 
  Sparkles, 
  Camera, 
  FileText, 
  AlertTriangle, 
  Heart, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  RefreshCw,
  User,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { api, csrfToken } from '../api';

export default function MentalScanPage({ initialHistory = [] }) {
  // Tabs & Steps
  const [activeTab, setActiveTab] = useState('new_scan');
  const [step, setStep] = useState(1);

  // Patient Profile
  const [patient, setPatient] = useState({
    name: window.USER_NAME || '',
    birth_date: '',
    age: '',
    ageText: '',
    gender: 'L'
  });

  // Questionnaire & Answers
  const [answers, setAnswers] = useState({});
  const [currentArea, setCurrentArea] = useState('muka');
  const [photos, setPhotos] = useState({ muka: null, mata: null, kuku: null });
  const [compressing, setCompressing] = useState({ muka: false, mata: false, kuku: false });

  // Camera stream
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);

  // AI results
  const [overallReport, setOverallReport] = useState(null);
  const [currentScanId, setCurrentScanId] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [selectedHistoryReport, setSelectedHistoryReport] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize or fetch history
  useEffect(() => {
    if (window.MENTAL_HISTORY && window.MENTAL_HISTORY.length > 0) {
      setHistoryList(window.MENTAL_HISTORY);
    } else if (initialHistory && initialHistory.length > 0) {
      setHistoryList(initialHistory);
    } else {
      // Fetch history from newly created route
      setLoadingHistory(true);
      api('/mental-scan-list')
        .then(data => {
          if (Array.isArray(data)) {
            setHistoryList(data);
          }
        })
        .catch(err => console.error("Gagal memuat riwayat", err))
        .finally(() => setLoadingHistory(false));
    }
  }, [initialHistory]);

  // Handle active tab from controller/window initial state
  useEffect(() => {
    if (window.INITIAL_TAB === 'mental_scan') {
      setActiveTab('mental_scan');
    }
  }, []);

  // Age Calculator
  const calculateAge = (birthDateString) => {
    if (!birthDateString) {
      setPatient(prev => ({ ...prev, birth_date: '', age: '', ageText: '' }));
      return;
    }

    const birthDate = new Date(birthDateString);
    const today = new Date();
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
      years--;
      months += 12;
    }
    
    if (today.getDate() < birthDate.getDate()) {
      months--;
      if (months < 0) {
        months = 11;
        years--;
      }
    }
    
    if (years < 0) {
      setPatient(prev => ({ ...prev, birth_date: birthDateString, age: 0, ageText: '0 Bulan' }));
      return;
    }

    let ageString = '';
    if (years > 0) {
      ageString += `${years} Tahun `;
    }
    if (months > 0 || years === 0) {
      ageString += `${months} Bulan`;
    }
    
    setPatient(prev => ({
      ...prev,
      birth_date: birthDateString,
      age: years,
      ageText: ageString.trim()
    }));

    // Reset questionnaire answers on age change to load correct questions
    setAnswers({});
  };

  // Dynamic age group definitions
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
        { id: 'q1', text: 'Apakah anak/pasien Anda tampak murung, sedih, atau merasa hampa hampir sepanjang hari?', key: 'depression' },
        { id: 'q2', text: 'Apakah anak/pasien Anda menarik diri dari pergaulan teman dan keluarga secara drastis (mengurung diri di kamar)?', key: 'withdraw' },
        { id: 'q3', text: 'Apakah anak/pasien Anda menunjukkan kelelahan ekstrem (burnout), hilangnya minat hobi, atau lemas terus-menerus?', key: 'burnout' },
        { id: 'q4', text: 'Apakah anak/pasien Anda memiliki kebiasaan menggigit kuku, menarik rambut, atau melukai diri saat tertekan?', key: 'anxiety_habit' },
        { id: 'q5', text: 'Apakah anak/pasien Anda mengalami gangguan tidur parah (insomnia berat, begadang sepanjang malam)?', key: 'insomnia' },
        { id: 'q6', text: 'Apakah anak/pasien Anda terlihat tidak mempedulikan penampilan, kebersihan tubuh, atau perawatan dirinya?', key: 'self_neglect' },
        { id: 'q7', text: 'Catatan tambahan orang tua mengenai kondisi perilaku atau kebiasaan remaja/dewasa Anda (opsional):', key: 'catatan_orang_tua', type: 'text' }
      ];
    }
  };

  const answersComplete = () => {
    const currentQs = getQuestions();
    return currentQs.every(q => {
      if (q.type === 'text') return true;
      return answers[q.key] !== undefined;
    });
  };

  const handleAnswerSelect = (key, val) => {
    setAnswers(prev => ({ ...prev, [key]: val }));
  };

  const switchScanArea = (area) => {
    stopCamera();
    setCurrentArea(area);
  };

  const guidelineText = () => {
    if (currentArea === 'muka') return 'Posisikan wajah tepat di tengah lingkaran';
    if (currentArea === 'mata') return 'Dekatkan kamera ke mata untuk menganalisis konjungtiva/pupil';
    if (currentArea === 'kuku') return 'Posisikan jari kuku lurus di dalam area panduan';
    return '';
  };

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 1280, height: 720 } 
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
      setCameraActive(true);
    } catch (err) {
      console.error("Webcam error:", err);
      alert("Kamera tidak dapat diakses. Anda dapat menggunakan tombol 'Unggah File Foto' untuk mengunggah file foto.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (cameraActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [cameraActive, stream]);

  // Convert Base64 to Blob helper
  const dataURLtoBlob = (dataurl) => {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
  };

  // Asynchronous image compression
  const compressImage = async (base64Str, quality = 0.85) => {
    if (window.createImageBitmap) {
      try {
        const blob = dataURLtoBlob(base64Str);
        const maxDim = 1200;
        
        const tempImg = await new Promise((resolve, reject) => {
          const img = new Image();
          img.src = base64Str;
          img.onload = () => resolve(img);
          img.onerror = reject;
        });
        
        let width = tempImg.width;
        let height = tempImg.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        
        const bitmap = await createImageBitmap(blob, {
          resizeWidth: width,
          resizeHeight: height,
          resizeQuality: 'high'
        });
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bitmap, 0, 0);
        
        return canvas.toDataURL('image/webp', quality);
      } catch (e) {
        console.warn("createImageBitmap failed, falling back to standard canvas resize", e);
      }
    }
    
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;
        
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/webp', quality));
      };
    });
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const rawUrl = canvas.toDataURL('image/jpeg');
    stopCamera();

    setCompressing(prev => ({ ...prev, [currentArea]: true }));
    const compressed = await compressImage(rawUrl);
    setPhotos(prev => ({ ...prev, [currentArea]: compressed }));
    setCompressing(prev => ({ ...prev, [currentArea]: false }));
  };

  const retakePhoto = () => {
    setPhotos(prev => ({ ...prev, [currentArea]: null }));
    startCamera();
  };

  const triggerUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const rawUrl = e.target.result;
        setCompressing(prev => ({ ...prev, [currentArea]: true }));
        const compressed = await compressImage(rawUrl);
        setPhotos(prev => ({ ...prev, [currentArea]: compressed }));
        setCompressing(prev => ({ ...prev, [currentArea]: false }));
      };
      reader.readAsDataURL(file);
    }
  };

  const isReadyToAnalyze = () => {
    return patient.name && 
           patient.age && 
           answersComplete() && 
           (photos.muka || photos.mata || photos.kuku);
  };

  // Submit all photos + questionnaire for analysis
  const submitAll = async () => {
    setStep(4);
    const formData = new FormData();
    formData.append('nama_pasien', patient.name);
    formData.append('usia_pasien', patient.age);
    formData.append('jenis_kelamin', patient.gender);
    formData.append('jawaban_kuesioner', JSON.stringify(answers));
    if (patient.birth_date) {
      formData.append('tanggal_lahir', patient.birth_date);
    }

    if (photos.muka && photos.muka.startsWith('data:')) {
      formData.append('foto_muka', dataURLtoBlob(photos.muka), 'muka.webp');
    }
    if (photos.mata && photos.mata.startsWith('data:')) {
      formData.append('foto_mata', dataURLtoBlob(photos.mata), 'mata.webp');
    }
    if (photos.kuku && photos.kuku.startsWith('data:')) {
      formData.append('foto_kuku', dataURLtoBlob(photos.kuku), 'kuku.webp');
    }

    try {
      const response = await fetch('/api/mental-scan/analyze-full', {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRF-TOKEN': csrfToken
        }
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setOverallReport(data.laporan_gabungan);
        setCurrentScanId(data.id);
        setStep(5);
        
        // Add to list
        const newHistoryItem = {
          id: data.id,
          nama_pasien: patient.name,
          usia_pasien: patient.age,
          jenis_kelamin: patient.gender,
          level_risiko: data.level_risiko,
          analisis_gabungan: data.laporan_gabungan.ringkasan_pengguna || data.laporan_gabungan.ringkasan_orang_tua,
          created_at: new Date().toISOString(),
          laporan_gabungan_decoded: data.laporan_gabungan
        };
        setHistoryList(prev => [newHistoryItem, ...prev]);
      } else {
        alert(data.message || "Gagal melakukan skrining AI.");
        setStep(3);
      }
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Terjadi kesalahan koneksi saat mengirim data ke AI.");
      setStep(3);
    }
  };

  const resetScanner = () => {
    stopCamera();
    setStep(1);
    setPatient({
      name: window.USER_NAME || '',
      birth_date: '',
      age: '',
      ageText: '',
      gender: 'L'
    });
    setAnswers({});
    setPhotos({ muka: null, mata: null, kuku: null });
    setOverallReport(null);
    setSelectedHistoryReport(null);
  };

  const viewHistoryItem = (item) => {
    let reportDecoded = item.laporan_gabungan_decoded;
    if (typeof reportDecoded === 'string') {
      reportDecoded = JSON.parse(reportDecoded);
    } else if (!reportDecoded && item.analisis_gabungan_ai) {
      reportDecoded = JSON.parse(item.analisis_gabungan_ai);
    }
    
    setSelectedHistoryReport({
      ...item,
      laporan_gabungan_decoded: reportDecoded
    });
  };

  const getRiskClass = (risk) => {
    const r = String(risk || '').toLowerCase();
    if (r === 'rendah' || r === 'risiko rendah') return 'bg-emerald-500 text-white';
    if (r === 'sedang' || r === 'risiko sedang') return 'bg-amber-500 text-white';
    if (r === 'tinggi' || r === 'risiko tinggi') return 'bg-rose-500 text-white';
    return 'bg-slate-400 text-white';
  };

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full font-sans text-nura-foreground">
      {/* Brand Header */}
      <div className="relative overflow-hidden rounded-[24px] p-6 md:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[#0c1322] border border-nura-foreground/10">
        <div className="relative z-10 space-y-2">
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center gap-3">
            <Brain className="w-6 h-6 text-nura-blue animate-pulse" />
            Visual Mental Health AI Scanner
          </h2>
          <p className="text-xs md:text-sm text-nura-muted-foreground max-w-xl">
            Skrining awal tingkat stres, insomnia, kecemasan, dan kondisi psikologis menggunakan deteksi visual kecerdasan buatan (Gemini AI) pada wajah, mata, dan kuku Anda atau anak Anda.
          </p>
        </div>
        <div className="relative z-10 flex gap-2">
          <button onClick={resetScanner} className="px-4 py-2 text-xs font-bold rounded-xl border border-nura-foreground/10 text-white bg-white/5 hover:bg-white/10 transition-all flex items-center gap-2">
            <RotateCcw className="w-3.5 h-3.5" /> Reset Skrining
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-nura-foreground/10 gap-2 pb-px select-none">
        <button 
          onClick={() => { setActiveTab('new_scan'); setSelectedHistoryReport(null); }} 
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${activeTab === 'new_scan' ? 'text-nura-blue border-nura-blue font-black' : 'text-nura-muted-foreground border-transparent hover:text-nura-foreground'}`}
        >
          <Activity className="w-4 h-4" /> Skrining Baru
        </button>
        <button 
          onClick={() => setActiveTab('history')} 
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${activeTab === 'history' ? 'text-nura-blue border-nura-blue font-black' : 'text-nura-muted-foreground border-transparent hover:text-nura-foreground'}`}
        >
          <History className="w-4 h-4" /> Riwayat Skrining ({historyList.length})
        </button>
      </div>

      {/* SCANNING TAB */}
      {activeTab === 'new_scan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main workspace (Left 8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* STEP 1: Profil Pasien */}
            {step === 1 && (
              <div className="bg-white border border-nura-foreground/10 rounded-2xl p-6 space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-8 h-8 rounded-lg bg-nura-accent flex items-center justify-center text-nura-blue font-extrabold text-sm">1</div>
                  <h3 className="text-sm font-extrabold text-nura-foreground">Profil Pasien / Pengguna</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground mb-2">Nama Pasien / Anak</label>
                    <input 
                      type="text" 
                      value={patient.name}
                      onChange={(e) => setPatient(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Masukkan nama pasien" 
                      className="w-full h-[52px] px-4 py-3 text-xs bg-nura-muted border-2 border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-nura-foreground font-semibold"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground mb-2">Tanggal Lahir</label>
                      <input 
                        type="date" 
                        value={patient.birth_date}
                        onChange={(e) => calculateAge(e.target.value)}
                        className="w-full h-[52px] px-4 py-3 text-xs bg-nura-muted border-2 border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-nura-foreground font-semibold"
                      />
                      {patient.ageText && (
                        <p className="text-[11px] font-extrabold text-nura-teal mt-2">
                          Umur saat ini: {patient.ageText}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground mb-2">Jenis Kelamin</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          type="button" 
                          onClick={() => setPatient(prev => ({ ...prev, gender: 'L' }))} 
                          className={`py-3 text-xs font-bold rounded-xl border transition-all ${patient.gender === 'L' ? 'bg-nura-blue border-nura-blue text-white shadow-md shadow-nura-blue/10' : 'bg-nura-muted border-transparent text-nura-muted-foreground'}`}
                        >
                          Laki-laki
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setPatient(prev => ({ ...prev, gender: 'P' }))} 
                          className={`py-3 text-xs font-bold rounded-xl border transition-all ${patient.gender === 'P' ? 'bg-nura-blue border-nura-blue text-white shadow-md shadow-nura-blue/10' : 'bg-nura-muted border-transparent text-nura-muted-foreground'}`}
                        >
                          Perempuan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => setStep(2)} 
                    disabled={!patient.name || !patient.age} 
                    className={`h-[48px] px-6 text-xs font-bold rounded-xl flex items-center gap-2 transition-all ${
                      (!patient.name || !patient.age) 
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                        : 'bg-nura-blue text-white hover:opacity-90 active:scale-[0.98]'
                    }`}
                  >
                    Lanjut ke Kuesioner <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Kuesioner Keluhan */}
            {step === 2 && (
              <div className="bg-white border border-nura-foreground/10 rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-nura-accent flex items-center justify-center text-nura-blue font-extrabold text-sm">2</div>
                    <h3 className="text-sm font-extrabold text-nura-foreground">Kuesioner Mental ({getAgeGroupLabel()})</h3>
                  </div>
                  <span className="text-xs text-nura-teal font-mono font-bold">
                    Usia: {patient.age} Tahun
                  </span>
                </div>

                {/* Questions list */}
                <div className="space-y-5 max-h-[420px] overflow-y-auto pr-2">
                  {getQuestions().map((q, idx) => (
                    <div key={q.id} className="space-y-3 p-4 bg-nura-muted border border-nura-foreground/5 rounded-2xl">
                      <p className="text-xs font-bold text-nura-foreground leading-relaxed">
                        {idx + 1}. {q.text}
                      </p>
                      
                      {q.type !== 'text' ? (
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'sering', label: 'Ya, sering' },
                            { id: 'kadang', label: 'Kadang-kadang' },
                            { id: 'jarang', label: 'Jarang / Tidak' }
                          ].map(opt => (
                            <button 
                              key={opt.id}
                              type="button"
                              onClick={() => handleAnswerSelect(q.key, opt.id)} 
                              className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${
                                answers[q.key] === opt.id 
                                  ? 'border-nura-blue bg-nura-blue text-white shadow-sm' 
                                  : 'border-nura-foreground/10 bg-white text-nura-muted-foreground hover:border-nura-blue/30 hover:text-nura-foreground'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <textarea 
                          value={answers[q.key] || ''}
                          onChange={(e) => handleAnswerSelect(q.key, e.target.value)}
                          placeholder="Ketik catatan keluhan detail, kebiasaan buruk anak, atau riwayat perubahan perilaku secara spesifik di sini..." 
                          className="w-full h-24 p-3 bg-white text-xs border border-nura-foreground/10 focus:border-nura-blue focus:outline-none rounded-xl text-nura-foreground font-semibold resize-none"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => setStep(1)} 
                    className="h-[48px] px-6 text-xs font-bold rounded-xl bg-nura-muted text-nura-muted-foreground hover:bg-slate-200"
                  >
                    Kembali
                  </button>
                  <button 
                    onClick={() => setStep(3)} 
                    disabled={!answersComplete()} 
                    className={`h-[48px] px-6 text-xs font-bold rounded-xl flex items-center gap-2 transition-all ${
                      !answersComplete() 
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                        : 'bg-nura-blue text-white hover:opacity-90 active:scale-[0.98]'
                    }`}
                  >
                    Lanjut ke Foto <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Ambil Foto */}
            {step === 3 && (
              <div className="bg-white border border-nura-foreground/10 rounded-2xl p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-nura-accent flex items-center justify-center text-nura-blue font-extrabold text-sm">3</div>
                    <h3 className="text-sm font-extrabold text-nura-foreground">Ambil Foto Area Skrining</h3>
                  </div>

                  <div className="flex bg-nura-muted p-1 rounded-xl border border-nura-foreground/5">
                    {[
                      { id: 'muka', label: '👤 Muka' },
                      { id: 'mata', label: '👁️ Mata' },
                      { id: 'kuku', label: '💅 Kuku' }
                    ].map(a => (
                      <button 
                        key={a.id}
                        type="button" 
                        onClick={() => switchScanArea(a.id)} 
                        className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${
                          currentArea === a.id 
                            ? 'bg-nura-blue text-white font-extrabold' 
                            : 'text-nura-muted-foreground hover:text-nura-foreground'
                        }`}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Camera stream view finder */}
                <div className="relative w-full aspect-[4/3] bg-slate-900 rounded-2xl overflow-hidden border border-nura-foreground/10 flex items-center justify-center">
                  {cameraActive && !photos[currentArea] && (
                    <>
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
                      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between items-center p-4 z-10">
                        <div />
                        <div className={`border-2 border-dashed border-white/60 ${
                          currentArea === 'kuku' ? 'w-64 h-48 rounded-xl' : 'w-56 h-56 rounded-full'
                        } shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]`} />
                        <div className="bg-black/80 border border-white/10 px-4 py-2 rounded-full text-[10px] text-white font-bold tracking-wide">
                          {guidelineText()}
                        </div>
                      </div>
                      <div className="absolute left-0 right-0 h-0.5 bg-nura-blue shadow-[0_0_12px_rgba(27,91,232,0.7)] animate-[scan_2s_linear_infinite]" />
                    </>
                  )}

                  {photos[currentArea] && (
                    <img src={photos[currentArea]} className="w-full h-full object-contain" alt="Captured" />
                  )}

                  {compressing[currentArea] && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 z-30">
                      <div className="w-8 h-8 border-3 border-transparent border-t-nura-teal animate-spin rounded-full" />
                      <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Mengompresi ke WebP HD...</span>
                    </div>
                  )}

                  {!cameraActive && !photos[currentArea] && (
                    <div className="text-center p-6 flex flex-col items-center gap-4 text-white">
                      <div className="w-14 h-14 rounded-full bg-nura-accent/15 flex items-center justify-center text-nura-blue text-xl border border-nura-blue/20">
                        <Camera className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-black">Kamera Belum Aktif</p>
                        <p className="text-[10px] text-slate-400 mt-1 max-w-sm font-semibold">
                          Aktifkan kamera perangkat untuk mengambil foto fisik, atau unggah foto yang sudah ada.
                        </p>
                      </div>
                      <div className="flex gap-2 justify-center">
                        <button onClick={startCamera} className="px-4.5 py-2.5 bg-nura-blue hover:opacity-95 text-[10px] font-bold text-white rounded-xl transition-all shadow-md">
                          Buka Kamera
                        </button>
                        <button onClick={triggerUpload} className="px-4.5 py-2.5 border border-white/20 hover:bg-white/5 text-[10px] font-bold text-white rounded-xl transition-all">
                          Unggah File Foto
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileUpload} />

                {/* Controls */}
                <div className="flex items-center justify-between gap-4 select-none shrink-0">
                  <div>
                    {cameraActive && (
                      <button onClick={stopCamera} className="px-3.5 py-2 text-[10px] font-bold rounded-xl border border-nura-foreground/10 text-nura-foreground hover:bg-nura-muted transition-all">
                        Unggah File Saja
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {cameraActive && !photos[currentArea] && (
                      <button onClick={capturePhoto} className="px-5 py-2.5 bg-nura-blue hover:opacity-95 text-[10px] font-bold text-white rounded-xl transition-all shadow-md flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Tangkap Foto
                      </button>
                    )}
                    {photos[currentArea] && (
                      <button onClick={retakePhoto} className="px-5 py-2.5 border border-nura-foreground/10 text-[10px] font-bold text-nura-foreground rounded-xl hover:bg-nura-muted transition-all flex items-center gap-1.5">
                        <RotateCcw className="w-4 h-4" /> Foto Ulang
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => { setStep(2); stopCamera(); }} 
                    className="h-[48px] px-6 text-xs font-bold rounded-xl bg-nura-muted text-nura-muted-foreground hover:bg-slate-200"
                  >
                    Kembali
                  </button>
                  <div />
                </div>
              </div>
            )}

            {/* STEP 4: Loader AI */}
            {step === 4 && (
              <div className="bg-white border border-nura-foreground/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-nura-blue animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-nura-blue">
                    <Brain className="w-6 h-6 animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-black text-nura-foreground">Menganalisis Kesehatan Mental...</h4>
                  <p className="text-[10px] text-nura-muted-foreground max-w-sm mx-auto leading-relaxed font-semibold">
                    Gemini AI sedang menginterpretasikan visual area fisik dan menghubungkannya dengan keluhan perilaku kelompok usia {patient.age} Tahun.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 5: Results Display */}
            {step === 5 && overallReport && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white border border-nura-foreground/10 rounded-2xl p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-nura-teal tracking-widest block">Laporan Diagnostik AI</span>
                      <h3 className="text-base font-extrabold text-nura-foreground mt-1">Hasil Diagnosa AI NURA</h3>
                    </div>
                    <div className="flex items-center gap-2 select-none">
                      {currentScanId && (
                        <a 
                          href={`/user/mental-scan/${currentScanId}/pdf`} 
                          className="px-4 py-2 bg-nura-blue hover:opacity-90 text-[10px] font-bold text-white rounded-xl transition-all flex items-center gap-1.5 shadow-md"
                        >
                          <FileText className="w-3.5 h-3.5" /> Download PDF
                        </a>
                      )}
                      <span className={`px-4.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-inner ${getRiskClass(overallReport.level_risiko)}`}>
                        Risiko: {overallReport.level_risiko}
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-nura-muted border border-nura-foreground/5 rounded-2xl p-5 space-y-3 font-semibold">
                    <h4 className="text-xs font-bold text-nura-foreground flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-nura-blue" /> Ringkasan Analisis
                    </h4>
                    <p className="text-xs text-nura-muted-foreground leading-relaxed font-medium">
                      {overallReport.ringkasan_pengguna || overallReport.ringkasan_orang_tua || '-'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Detected conditions */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-nura-muted-foreground">Kondisi Mental Terdeteksi</h4>
                      <div className="space-y-2">
                        {overallReport.kondisi_mental_utama?.map((item, idx) => (
                          <div key={idx} className="bg-nura-muted border border-nura-foreground/5 p-4 rounded-xl space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-extrabold text-nura-foreground capitalize">{item.kondisi}</span>
                              <span className={`text-[9px] font-bold uppercase tracking-wider ${
                                item.keyakinan === 'tinggi' ? 'text-red-500' : 'text-amber-500'
                              }`}>
                                Keyakinan: {item.keyakinan}
                              </span>
                            </div>
                            <p className="text-[11px] text-nura-muted-foreground font-medium leading-relaxed">{item.penjelasan}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Physical correlations */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-nura-muted-foreground">Korelasi Indikator Fisik</h4>
                      <div className="space-y-2">
                        {overallReport.korelasi_antar_area?.map((item, idx) => (
                          <div key={idx} className="bg-nura-muted border border-nura-foreground/5 p-4 rounded-xl space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-extrabold text-nura-foreground">{item.temuan}</span>
                              <div className="flex gap-1">
                                {item.area_terlibat?.map(area => (
                                  <span key={area} className="text-[8px] bg-nura-accent border border-nura-blue/15 text-nura-blue font-bold px-1.5 py-0.5 rounded capitalize">
                                    {area}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <p className="text-[11px] text-nura-muted-foreground font-medium leading-relaxed">{item.kesimpulan}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-4 border-t border-slate-100 pt-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-nura-muted-foreground">Rekomendasi Tindakan Mandiri</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {overallReport.rekomendasi_tindakan?.map((rec, idx) => (
                        <div key={idx} className="bg-nura-muted border border-nura-foreground/5 p-4 rounded-2xl flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-extrabold text-nura-foreground capitalize">{rec.tindakan}</span>
                              <span className="text-[8px] bg-nura-accent text-nura-blue px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                                {rec.prioritas}
                              </span>
                            </div>
                            <p className="text-[10px] text-nura-muted-foreground font-medium leading-relaxed">{rec.deskripsi}</p>
                          </div>
                          <span className="text-[9px] text-nura-muted-foreground/80 font-bold flex items-center gap-1.5 mt-3 select-none">
                            <Clock className="w-3 h-3 text-nura-blue" /> {rec.frekuensi}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Relaxation Methods */}
                  <div className="space-y-4 border-t border-slate-100 pt-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-nura-muted-foreground">Teknik Relaksasi & Meditasi</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {overallReport.rekomendasi_relaksasi?.map((rel, idx) => (
                        <div key={idx} className="bg-nura-muted border border-nura-foreground/5 p-4 rounded-2xl flex gap-3">
                          <div className="w-9 h-9 rounded-xl bg-nura-accent flex items-center justify-center text-nura-blue shrink-0">
                            <Heart className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <h5 className="text-xs font-extrabold text-nura-foreground">{rel.metode}</h5>
                            <p className="text-[10px] text-nura-muted-foreground leading-relaxed font-semibold">{rel.alasan}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Referral Advice */}
                  {overallReport.perlu_rujuk_nakes && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex gap-3 text-red-800 leading-relaxed font-semibold">
                      <AlertTriangle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
                      <div className="space-y-1">
                        <h5 className="text-xs font-bold text-red-900">Perhatian: Perlu Konsultasi Medis</h5>
                        <p className="text-[11px] text-red-700/90 leading-relaxed font-medium">{overallReport.alasan_rujuk}</p>
                      </div>
                    </div>
                  )}

                  <div className="text-[9px] text-nura-muted-foreground border-t border-slate-100 pt-4 leading-relaxed font-semibold">
                    <strong>Disclaimer:</strong> {overallReport.disclaimer}
                  </div>
                </div>

                <div className="flex justify-end pt-4 select-none">
                  <button onClick={resetScanner} className="h-[48px] px-6 text-xs font-bold rounded-xl bg-nura-blue text-white hover:opacity-95 shadow-md shadow-nura-blue/15">
                    Mulai Skrining Baru
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Stepper Status Sidebar (Right 4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white border border-nura-foreground/10 rounded-2xl p-5 space-y-4 shadow-none">
              <h3 className="text-xs font-bold uppercase tracking-widest text-nura-muted-foreground">Status Skrining</h3>
              
              <div className="space-y-3.5 font-bold">
                {[
                  { label: '1. Profil Pasien', done: step > 1 },
                  { label: '2. Kuesioner Keluhan', done: step > 2 },
                  { label: '3. Foto Muka/Wajah', done: !!photos.muka },
                  { label: '4. Foto Mata', done: !!photos.mata },
                  { label: '5. Foto Kuku', done: !!photos.kuku }
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-xs pb-2 border-b border-slate-50 last:border-0 last:pb-0">
                    <span className="text-nura-muted-foreground">{s.label}</span>
                    <span className={`text-[10px] flex items-center gap-1 ${s.done ? 'text-nura-green' : 'text-nura-red'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{s.done ? 'Siap' : 'Belum'}</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 select-none">
                <button 
                  onClick={submitAll} 
                  disabled={!isReadyToAnalyze() || step >= 4} 
                  className="w-full py-3 bg-nura-blue disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-md shadow-nura-blue/10 flex items-center justify-center gap-2"
                >
                  <Brain className="w-4 h-4 animate-bounce" /> KIRIM ANALISIS AI
                </button>
              </div>
            </div>

            {/* Photo Guide */}
            <div className="bg-white border border-nura-foreground/10 rounded-2xl p-5 space-y-3 shadow-none">
              <h3 className="text-xs font-bold uppercase tracking-widest text-nura-muted-foreground">Panduan Foto</h3>
              <ul className="space-y-3 text-xs text-nura-muted-foreground list-disc pl-4 font-semibold leading-relaxed">
                <li><strong>Wajah:</strong> Posisi tegak menghadap kamera, pencahayaan merata, ekspresi rileks.</li>
                <li><strong>Mata:</strong> Ambil foto kelopak mata bawah dekat secara fokus dan tajam.</li>
                <li><strong>Kuku:</strong> Ambil foto close-up ujung kuku tangan secara tegak lurus.</li>
              </ul>
            </div>

          </div>

        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {loadingHistory && (
            <div className="py-12 flex justify-center"><RefreshCw className="w-8 h-8 text-nura-blue animate-spin" /></div>
          )}

          {/* Historical detailed report */}
          {selectedHistoryReport && (
            <div className="bg-white border border-nura-foreground/10 rounded-2xl p-6 space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <button onClick={() => setSelectedHistoryReport(null)} className="text-xs font-bold text-nura-blue hover:underline mb-2 block flex items-center gap-1">
                    <ArrowLeft className="w-4.5 h-4.5" /> Kembali ke Daftar Riwayat
                  </button>
                  <h3 className="text-base font-extrabold text-nura-foreground">
                    Riwayat: {selectedHistoryReport.nama_pasien}
                  </h3>
                  <p className="text-[10px] text-nura-muted-foreground font-mono mt-0.5">
                    Tanggal Skrining: {formatDate(selectedHistoryReport.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2 select-none">
                  <a 
                    href={`/user/mental-scan/${selectedHistoryReport.id}/pdf`} 
                    className="px-4 py-2 bg-nura-blue hover:opacity-90 text-[10px] font-bold text-white rounded-xl transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <FileText className="w-3.5 h-3.5" /> Download PDF
                  </a>
                  <span className={`px-4.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-inner ${
                    getRiskClass(selectedHistoryReport.laporan_gabungan_decoded?.level_risiko || selectedHistoryReport.level_risiko)
                  }`}>
                    Risiko: {selectedHistoryReport.laporan_gabungan_decoded?.level_risiko || selectedHistoryReport.level_risiko}
                  </span>
                </div>
              </div>

              {/* Assessment summary */}
              <div className="bg-nura-muted border border-nura-foreground/5 rounded-2xl p-5 space-y-3 font-semibold">
                <h4 className="text-xs font-bold text-nura-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-nura-blue" /> Ringkasan Analisis
                </h4>
                <p className="text-xs text-nura-muted-foreground leading-relaxed font-medium">
                  {selectedHistoryReport.laporan_gabungan_decoded?.ringkasan_pengguna || selectedHistoryReport.analisis_gabungan || '-'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Conditions */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-nura-muted-foreground">Kondisi Mental Terdeteksi</h4>
                  <div className="space-y-2">
                    {selectedHistoryReport.laporan_gabungan_decoded?.kondisi_mental_utama?.map((item, idx) => (
                      <div key={idx} className="bg-nura-muted border border-nura-foreground/5 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-extrabold text-nura-foreground capitalize">{item.kondisi}</span>
                          <span className="text-[9px] font-bold text-nura-blue uppercase tracking-wider">
                            Keyakinan: {item.keyakinan}
                          </span>
                        </div>
                        <p className="text-[11px] text-nura-muted-foreground font-medium leading-relaxed">{item.penjelasan}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Physical correlations */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-nura-muted-foreground">Korelasi Indikator Fisik</h4>
                  <div className="space-y-2">
                    {selectedHistoryReport.laporan_gabungan_decoded?.korelasi_antar_area?.map((item, idx) => (
                      <div key={idx} className="bg-nura-muted border border-nura-foreground/5 p-4 rounded-xl space-y-2">
                        <span className="text-xs font-extrabold text-nura-foreground block">{item.temuan}</span>
                        <p className="text-[11px] text-nura-muted-foreground font-medium leading-relaxed mt-1">{item.kesimpulan}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4 border-t border-slate-100 pt-6">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-nura-muted-foreground">Rekomendasi Tindakan</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedHistoryReport.laporan_gabungan_decoded?.rekomendasi_tindakan?.map((rec, idx) => (
                    <div key={idx} className="bg-nura-muted border border-nura-foreground/5 p-4 rounded-2xl flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-nura-foreground capitalize">{rec.tindakan}</span>
                          <span className="text-[8px] bg-nura-accent text-nura-blue px-2 py-0.5 rounded font-bold">{rec.prioritas}</span>
                        </div>
                        <p className="text-[10px] text-nura-muted-foreground font-medium leading-relaxed">{rec.deskripsi}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Scans list */}
          {!loadingHistory && !selectedHistoryReport && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              {historyList.map(item => (
                <div 
                  key={item.id}
                  onClick={() => viewHistoryItem(item)}
                  className="bg-white border border-nura-foreground/10 hover:border-nura-blue/20 rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between gap-4 hover:shadow-md"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="text-xs font-black text-nura-foreground">{item.nama_pasien}</h4>
                        <span className="text-[9px] text-nura-muted-foreground font-bold">
                          Usia: {item.usia_pasien} Th | {item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase font-bold text-white ${
                        getRiskClass(item.level_risiko)
                      }`}>
                        {item.level_risiko}
                      </span>
                    </div>
                    <p className="text-[11px] text-nura-muted-foreground mt-3 leading-relaxed line-clamp-3 font-semibold">
                      {item.analisis_gabungan || '-'}
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-50 select-none">
                    <span className="text-[9px] text-nura-muted-foreground font-bold">{formatDate(item.created_at)}</span>
                    <span className="text-[9px] text-nura-blue font-extrabold hover:underline">Lihat Laporan ➔</span>
                  </div>
                </div>
              ))}
              
              {historyList.length === 0 && (
                <div className="col-span-full text-center py-12 border border-dashed border-nura-foreground/10 rounded-2xl bg-nura-muted">
                  <p className="text-xs text-nura-muted-foreground font-semibold">Belum ada riwayat pemeriksaan kesehatan mental.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
