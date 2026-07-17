import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Baby, 
  Utensils, 
  Smile, 
  Meh, 
  Frown, 
  AlertCircle, 
  Settings, 
  Navigation, 
  RefreshCw, 
  Heart, 
  Sparkles, 
  Plus, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { api } from '../api';

export default function FoodAiPage({ history = [] }) {
  // 1. Location state
  const [location, setLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('gn_location');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [manualProvince, setManualProvince] = useState('');

  // 2. Active child profile state
  const [children, setChildren] = useState([]);
  const [activeChildId, setActiveChildId] = useState(null);
  
  // Custom child inputs for adding new child
  const [showAddForm, setShowAddForm] = useState(false);
  const [newChild, setNewChild] = useState({
    name: '',
    age: '', // in months
    gender: 'L',
    status_stunting: 'Normal',
    status_anemia: 'Normal',
    healthNotes: ''
  });

  // Mood and health notes for the active child
  const [mood, setMood] = useState('netral'); // senang, netral, frustrasi
  const [healthNotes, setHealthNotes] = useState('');

  // 3. AI call states
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');
  const [useServerAI, setUseServerAI] = useState(false);

  // Load children from GiziKu history
  useEffect(() => {
    const list = [];
    const namesSeen = new Set();
    
    // Group GiziKu history records by child name to create child profiles
    history.forEach(record => {
      const name = record.nama_anak;
      if (name && !namesSeen.has(name.toLowerCase())) {
        namesSeen.add(name.toLowerCase());
        list.push({
          id: record.id || Date.now() + Math.random(),
          name: record.nama_anak,
          age: record.usia_bulan || 24,
          gender: record.jenis_kelamin || 'L',
          status_stunting: record.status_stunting || 'Normal',
          status_anemia: record.status_anemia || 'Normal',
          healthNotes: record.catatan || ''
        });
      }
    });

    // Prefill with some local storage children as fallback
    try {
      const savedChildren = localStorage.getItem('gn_children');
      if (savedChildren) {
        const parsed = JSON.parse(savedChildren);
        parsed.forEach(c => {
          if (!namesSeen.has(c.name.toLowerCase())) {
            namesSeen.add(c.name.toLowerCase());
            list.push(c);
          }
        });
      }
    } catch (e) {
      console.warn("Gagal membaca gn_children dari localStorage", e);
    }

    setChildren(list);

    if (list.length > 0) {
      setActiveChildId(list[0].id);
      setHealthNotes(list[0].healthNotes || '');
    }
  }, [history]);

  // Sync healthNotes when active child changes
  useEffect(() => {
    if (activeChildId) {
      const child = children.find(c => c.id === activeChildId);
      if (child) {
        setHealthNotes(child.healthNotes || '');
        setRecommendations([]);
        setError('');
      }
    }
  }, [activeChildId, children]);

  // 4. Geolocation handler
  const handleGpsDetect = () => {
    setDetectingGps(true);
    setGpsError('');
    
    if (!navigator.geolocation) {
      setGpsError('Geolokasi tidak didukung oleh browser Anda.');
      setDetectingGps(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Fetch reverse geocode via Nominatim OSM
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=id`);
          const data = await res.json();
          
          let province = '';
          if (data.address) {
            province = data.address.state || data.address.region || data.address.province || '';
          }

          if (province) {
            // Clean Nominatim state string (e.g. "Daerah Khusus Ibukota Jakarta" -> "DKI Jakarta")
            province = cleanProvinceName(province);
            const locationData = { province, latitude, longitude };
            localStorage.setItem('gn_location', JSON.stringify(locationData));
            setLocation(locationData);
          } else {
            setGpsError('Provinsi tidak terdeteksi dari GPS. Pilih secara manual.');
          }
        } catch (err) {
          setGpsError('Gagal memproses nama daerah. Silakan pilih secara manual.');
        } finally {
          setDetectingGps(false);
        }
      },
      (err) => {
        setGpsError('Akses lokasi ditolak browser. Pilih secara manual.');
        setDetectingGps(false);
      },
      { timeout: 10000 }
    );
  };

  const handleManualSelect = () => {
    if (!manualProvince) return;
    const locationData = { province: manualProvince };
    localStorage.setItem('gn_location', JSON.stringify(locationData));
    setLocation(locationData);
  };

  // Helper to clean province strings from OpenStreetMap
  const cleanProvinceName = (prov) => {
    let p = prov.replace(/Daerah Istimewa/gi, 'D.I.').replace(/Daerah Khusus Ibukota/gi, 'DKI');
    
    // Cross check with 34 provinces to find closest match
    const provincesList = Object.values(window.GIZIKU_PROVINCES || {}).map(pr => pr.name);
    const match = provincesList.find(pl => p.toLowerCase().includes(pl.toLowerCase()) || pl.toLowerCase().includes(p.toLowerCase()));
    
    return match || p;
  };

  // 5. Add custom child profile locally
  const handleAddChild = (e) => {
    e.preventDefault();
    if (!newChild.name || !newChild.age) return;

    const childObj = {
      id: Date.now(),
      name: newChild.name,
      age: parseInt(newChild.age),
      gender: newChild.gender,
      status_stunting: newChild.status_stunting,
      status_anemia: newChild.status_anemia,
      healthNotes: newChild.healthNotes
    };

    const updated = [childObj, ...children];
    setChildren(updated);
    setActiveChildId(childObj.id);
    setHealthNotes(childObj.healthNotes);
    localStorage.setItem('gn_children', JSON.stringify(updated.filter(c => !history.some(h => h.nama_anak.toLowerCase() === c.name.toLowerCase()))));
    
    setNewChild({
      name: '',
      age: '',
      gender: 'L',
      status_stunting: 'Normal',
      status_anemia: 'Normal',
      healthNotes: ''
    });
    setShowAddForm(false);
  };

  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood);
    if (selectedMood === 'frustrasi') {
      fetchRecommendations(selectedMood);
    }
  };

  // 6. Fetch Recommendations (Direct DeepSeek API or Laravel Backend fallback)
  const fetchRecommendations = async (activeMood = mood) => {
    const activeChild = children.find(c => c.id === activeChildId);
    if (!activeChild || !location) return;

    setLoading(true);
    setError('');
    setRecommendations([]);

    // Check if we have a locally saved DeepSeek key
    const localApiKey = localStorage.getItem('gn_deepseek_key');
    const isDeepSeekConfigured = localApiKey && localApiKey.trim().length > 10;

    // Skenario A: Gunakan DeepSeek Lokal (jika dipilih/dikonfigurasi dan tidak dipaksa server)
    if (isDeepSeekConfigured && !useServerAI) {
      try {
        const systemPrompt = `Anda adalah ahli pangan lokal Indonesia yang sangat hafal komoditas pertanian, perkebunan, perikanan, peternakan, dan hasil bumi khas tiap provinsi di Indonesia.
Tugas Anda adalah memberikan beberapa rekomendasi makanan lokal khas atau bahan pangan lokal dari provinsi yang dituju untuk anak balita.
Rekomendasi Anda harus menyesuaikan dengan usia anak (dalam bulan), status stunting, status anemia, dan aman dari alergi yang dimiliki.

ATURAN PENTING:
1. Rekomendasikan bahan pangan atau masakan lokal khas dari provinsi tersebut (jangan beri masakan generik yang sama untuk setiap provinsi).
2. Hindari bahan pemicu alergi yang disebutkan oleh pengguna.
3. Sesuaikan tekstur dan kecocokan nutrisi dengan usia anak.
4. Jika anak stunting, fokuskan pada bahan tinggi protein hewani, kalsium, zinc. Jika anak anemia, fokuskan pada zat besi tinggi dan vitamin C penunjang.
5. Berikan penjelasan singkat (1-2 kalimat) yang dipersonalisasi menyebutkan nama anak dan alasan mengapa makanan ini cocok.

WAJIB BALAS HANYA DALAM FORMAT JSON BERIKUT (tanpa markdown code block, tanpa teks lain, langsung JSON objek):
{
  "foods": [
    {
      "name": "Nama makanan/bahan pangan",
      "origin": "Komoditas/daerah penghasil spesifik di provinsi tersebut",
      "why": "Alasan kecocokan untuk anak ini"
    }
  ]
}`;

        const userPrompt = `Berikan rekomendasi makanan lokal untuk anak berikut:
- Nama Anak: ${activeChild.name}
- Usia: ${activeChild.age} bulan
- Provinsi (Lokasi): ${location.province}
- Status Stunting: ${activeChild.status_stunting}
- Status Anemia: ${activeChild.status_anemia}
- Catatan Kesehatan / Alergi: ${healthNotes || 'Tidak ada'}
- Suasana Hati / Mood: ${activeMood === 'frustrasi' ? 'Rewel / Frustrasi' : activeMood}

Ingat, kembalikan JSON yang valid sesuai struktur yang diminta.`;

        const response = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localApiKey}`
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.4
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}`);
        }

        const data = await response.json();
        let content = data.choices[0].message.content.trim();
        
        // Clean markdown blocks
        if (content.startsWith('```json')) content = content.substring(7);
        if (content.endsWith('```')) content = content.substring(0, content.length - 3);
        content = content.trim();

        const parsed = JSON.parse(content);
        if (parsed.foods) {
          setRecommendations(parsed.foods);
        } else {
          throw new Error("Format JSON tidak valid");
        }
      } catch (err) {
        console.error("DeepSeek local API failed, falling back to server API...", err);
        // Fallback to server API call
        await fetchServerRecommendations(activeChild, activeMood);
      } finally {
        setLoading(false);
      }
    } else {
      // Skenario B: Gunakan Server API (Gemini/Groq)
      await fetchServerRecommendations(activeChild, activeMood);
      setLoading(false);
    }
  };

  const fetchServerRecommendations = async (child, activeMood) => {
    try {
      const res = await api('/food-recommendations', {
        method: 'POST',
        body: JSON.stringify({
          nama_anak: child.name,
          usia_bulan: child.age,
          provinsi: location.province,
          status_stunting: child.status_stunting,
          status_anemia: child.status_anemia,
          alergi: healthNotes,
          mood: activeMood
        })
      });

      if (res.success && res.result && res.result.foods) {
        setRecommendations(res.result.foods);
      } else if (res.result && res.result.foods) {
        // Fallback result contained inside response
        setRecommendations(res.result.foods);
        if (res.message) {
          setError(res.message);
        }
      } else {
        throw new Error("Gagal memperoleh data rekomendasi");
      }
    } catch (err) {
      setError("AI Server tidak dapat dihubungi. Menampilkan rekomendasi lokal offline.");
      // Skenario C: Fallback Offline/Statis Lokal
      const localFallback = getLocalFallback(child, activeMood);
      setRecommendations(localFallback.foods);
    }
  };

  const getLocalFallback = (child, activeMood) => {
    const foods = [];
    const hasFish = !(healthNotes.toLowerCase().includes('ikan') || healthNotes.toLowerCase().includes('udang') || healthNotes.toLowerCase().includes('seafood'));
    const hasEgg = !healthNotes.toLowerCase().includes('telur');
    const hasNut = !healthNotes.toLowerCase().includes('kacang');

    if (location.province.toLowerCase().includes('jawa')) {
      if (hasEgg && hasFish) {
        foods.push({
          name: 'Nasi Tim Ikan Kembung Halus',
          origin: 'Perikanan lokal Jawa Barat / Pantai Utara Jawa',
          why: `Sangat sesuai untuk ${child.name} karena kaya akan protein hewani dan asam lemak esensial guna mencegah dampak stunting.`
        });
      }
      if (hasNut) {
        foods.push({
          name: 'Bubur Kacang Hijau Santan Segar',
          origin: 'Pertanian rakyat Jawa Tengah',
          why: `Memberikan asupan mineral Seng (Zinc) dan zat besi nabati yang optimal untuk metabolisme tubuh ${child.name}.`
        });
      }
      foods.push({
        name: 'Sop Labu Siam & Wortel Cincang',
        origin: 'Hasil bumi perkebunan Lembang / Dieng',
        why: `Teksturnya yang lembut serta kandungan vitamin A-nya baik untuk mendukung nafsu makan ${child.name} yang sedang rewel.`
      });
    } else {
      if (hasFish) {
        foods.push({
          name: 'Bubur Sagu Ikan Tuna Halus',
          origin: 'Komoditas laut pesisir timur Indonesia',
          why: `Mengandung zat besi heme yang sangat tinggi untuk mengatasi lesu akibat anemia pada ${child.name}.`
        });
      }
      foods.push({
        name: 'Sayur Daun Kelor & Ubi Jalar Rebus Lumat',
        origin: 'Pangan pekarangan lokal daerah luar Jawa',
        why: `Kombinasi zat besi nabati dari kelor dan energi dari ubi jalar membantu mencukupi kebutuhan hizi harian ${child.name}.`
      });
    }
    return { foods };
  };

  const provincesList = Object.values(window.GIZIKU_PROVINCES || {});
  const activeChild = children.find(c => c.id === activeChildId);

  // Render Pintu Gerbang Lokasi (Location Gate)
  if (!location) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-nura-foreground/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-none animate-fadeIn">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-nura-accent rounded-2xl flex items-center justify-center text-3xl mx-auto text-nura-blue border border-nura-blue/15 animate-bounce">
            📍
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-nura-foreground tracking-tight">Gerbang Deteksi Lokasi</h2>
          <p className="text-xs text-nura-muted-foreground max-w-md mx-auto leading-relaxed font-semibold">
            Gizi Nusantara merekomendasikan komoditas pertanian & perikanan khas lokal. Mohon izinkan akses lokasi Anda agar AI dapat mendeteksi nama provinsi Anda secara otomatis.
          </p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleGpsDetect}
            disabled={detectingGps}
            className="w-full h-[56px] bg-nura-blue hover:opacity-90 active:scale-[0.99] text-white font-bold rounded-2xl text-sm transition-all shadow-md shadow-nura-blue/15 flex items-center justify-center gap-2"
          >
            {detectingGps ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Mendeteksi Lokasi GPS...
              </>
            ) : (
              <>
                <Navigation className="w-5 h-5" />
                Izinkan Lokasi & Deteksi Otomatis
              </>
            )}
          </button>

          {gpsError && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-[11px] text-nura-red font-bold flex gap-2 items-center">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{gpsError}</span>
            </div>
          )}

          <div className="relative flex py-2 items-center text-xs text-nura-muted-foreground select-none">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-4 font-bold text-[10px] uppercase">Atau Pilih Manual</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          <div className="flex gap-2">
            <select
              value={manualProvince}
              onChange={(e) => setManualProvince(e.target.value)}
              className="flex-1 h-[52px] px-4 bg-nura-muted border border-nura-foreground/10 focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-xs text-nura-foreground font-semibold"
            >
              <option value="">Pilih Provinsi Anda...</option>
              {provincesList.map(p => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </select>
            <button 
              onClick={handleManualSelect}
              disabled={!manualProvince}
              className={`px-6 h-[52px] font-bold text-xs rounded-xl transition-all ${
                !manualProvince 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-nura-teal text-white hover:opacity-95'
              }`}
            >
              Simpan ➔
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Aplikasi Utama (Main Application UI)
  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      {/* Top Banner with location badge */}
      <div 
        className="relative overflow-hidden rounded-[24px] p-6 md:p-8 text-white shadow-none flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        style={{ background: 'linear-gradient(135deg, #1b5be8 0%, #00a49a 100%)' }}
      >
        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Gizi Nusantara AI</div>
          <h2 className="text-2xl font-extrabold tracking-tight">Rekomendasi Makanan Khas Provinsi</h2>
          <p className="text-blue-100 text-xs font-medium max-w-2xl mt-1">
            Menemukan makanan lokal padat gizi khas daerah Anda yang ramah alergi dan disesuaikan dengan kondisi stunting/anemia anak.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <div className="px-3.5 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 flex items-center gap-2 text-xs font-bold text-white select-none">
            <MapPin className="w-4 h-4 text-white" />
            <span>Provinsi: {location.province}</span>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('gn_location');
              setLocation(null);
            }}
            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white text-[10px] font-bold uppercase"
            title="Ganti Lokasi"
          >
            Ubah
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* PANEL KIRI (Anak & Kondisi) - 5 Columns */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Child Selection Box */}
          <div className="bg-white border border-nura-foreground/10 rounded-2xl p-5 space-y-4 shadow-none">
            <div className="flex items-center justify-between border-b border-nura-muted pb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-nura-muted-foreground flex items-center gap-1.5">
                <Baby className="w-4 h-4 text-nura-blue" /> Pilih Profil Anak
              </h3>
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-[11px] font-bold text-nura-blue hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Tambah Baru
              </button>
            </div>

            {/* Quick Add Child Form */}
            {showAddForm && (
              <form onSubmit={handleAddChild} className="p-4 bg-nura-muted rounded-xl border border-nura-foreground/5 space-y-3.5 animate-slideDown">
                <h4 className="text-[10px] uppercase tracking-widest font-black text-nura-foreground">Profil Anak Baru</h4>
                <div className="space-y-2">
                  <input 
                    type="text"
                    required
                    value={newChild.name}
                    onChange={(e) => setNewChild(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nama anak..."
                    className="w-full h-[40px] px-3 bg-white border border-nura-foreground/10 focus:border-nura-blue focus:outline-none rounded-lg text-xs font-semibold text-nura-foreground"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="number"
                      required
                      min="1"
                      max="120"
                      value={newChild.age}
                      onChange={(e) => setNewChild(prev => ({ ...prev, age: e.target.value }))}
                      placeholder="Usia (bulan)..."
                      className="h-[40px] px-3 bg-white border border-nura-foreground/10 focus:border-nura-blue focus:outline-none rounded-lg text-xs font-semibold text-nura-foreground"
                    />
                    <select
                      value={newChild.gender}
                      onChange={(e) => setNewChild(prev => ({ ...prev, gender: e.target.value }))}
                      className="h-[40px] px-3 bg-white border border-nura-foreground/10 focus:border-nura-blue focus:outline-none rounded-lg text-xs font-semibold text-nura-foreground"
                    >
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={newChild.status_stunting}
                      onChange={(e) => setNewChild(prev => ({ ...prev, status_stunting: e.target.value }))}
                      className="h-[40px] px-3 bg-white border border-nura-foreground/10 focus:border-nura-blue focus:outline-none rounded-lg text-xs font-semibold text-nura-foreground"
                    >
                      <option value="Normal">Status: Normal</option>
                      <option value="Stunting">Status: Stunting</option>
                    </select>
                    <select
                      value={newChild.status_anemia}
                      onChange={(e) => setNewChild(prev => ({ ...prev, status_anemia: e.target.value }))}
                      className="h-[40px] px-3 bg-white border border-nura-foreground/10 focus:border-nura-blue focus:outline-none rounded-lg text-xs font-semibold text-nura-foreground"
                    >
                      <option value="Normal">Anemia: Normal</option>
                      <option value="Anemia Ringan">Anemia Ringan</option>
                      <option value="Anemia Berat">Anemia Berat</option>
                    </select>
                  </div>
                  <input 
                    type="text"
                    value={newChild.healthNotes}
                    onChange={(e) => setNewChild(prev => ({ ...prev, healthNotes: e.target.value }))}
                    placeholder="Alergi/riwayat kesehatan (koma)..."
                    className="w-full h-[40px] px-3 bg-white border border-nura-foreground/10 focus:border-nura-blue focus:outline-none rounded-lg text-xs font-semibold text-nura-foreground"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button 
                    type="button" 
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 bg-white border border-nura-foreground/10 rounded-lg text-[10px] font-bold text-nura-muted-foreground"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="px-4.5 py-1.5 bg-nura-blue text-white rounded-lg text-[10px] font-bold"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            )}

            {/* List of children */}
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {children.map(c => {
                const isSelected = activeChildId === c.id;
                return (
                  <div 
                    key={c.id}
                    onClick={() => setActiveChildId(c.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                      isSelected 
                        ? 'bg-nura-accent border-nura-blue shadow-inner' 
                        : 'bg-white border-nura-foreground/10 hover:bg-nura-muted'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold text-xs text-nura-foreground">{c.name}</div>
                      <div className="text-[10px] text-nura-muted-foreground font-semibold mt-0.5">
                        {c.age} bln · {c.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </div>
                    </div>

                    <div className="flex gap-1 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                        c.status_stunting === 'Normal' ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#fee2e2] text-[#e53e3e]'
                      }`}>
                        {c.status_stunting === 'Normal' ? 'Normal' : 'Stunting'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                        c.status_anemia === 'Normal' 
                          ? 'bg-[#dcfce7] text-[#16a34a]' 
                          : c.status_anemia === 'Anemia Ringan' 
                          ? 'bg-[#fef9c3] text-[#ca8a04]' 
                          : 'bg-[#fee2e2] text-[#e53e3e]'
                      }`}>
                        {c.status_anemia}
                      </span>
                    </div>
                  </div>
                );
              })}
              {children.length === 0 && (
                <div className="text-center py-6 text-[11px] text-nura-muted-foreground font-medium">
                  Belum ada profil anak terdaftar. Klik "+ Tambah Baru".
                </div>
              )}
            </div>
          </div>

          {/* Health Notes & Mood Selection */}
          {activeChild && (
            <div className="bg-white border border-nura-foreground/10 rounded-2xl p-5 space-y-4 shadow-none">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-nura-muted-foreground">Detail & Kondisi Anak</h3>
                <p className="text-[10px] text-nura-muted-foreground mt-0.5 font-medium">
                  Kustomisasi informasi kesehatan {activeChild.name} saat ini
                </p>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground mb-1.5">
                    Riwayat Alergi / Kondisi Khusus
                  </label>
                  <input 
                    type="text"
                    value={healthNotes}
                    onChange={(e) => setHealthNotes(e.target.value)}
                    placeholder="mis: alergi telur, tidak suka sayuran pahit, asma"
                    className="w-full h-[48px] px-3.5 py-2.5 text-xs bg-nura-muted border border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-nura-foreground font-semibold"
                  />
                  <span className="text-[9px] text-nura-muted-foreground mt-1 block leading-relaxed font-semibold">
                    *AI akan menghindari bahan-bahan pemicu alergi yang Anda sebutkan di atas.
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground mb-2">
                    Tandai Suasana Hati (Mood) Anak
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'senang', label: 'Senang', icon: <Smile className="w-4 h-4" />, color: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' },
                      { id: 'netral', label: 'Netral', icon: <Meh className="w-4 h-4" />, color: 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' },
                      { id: 'frustrasi', label: 'Rewel / Frustrasi', icon: <Frown className="w-4 h-4" />, color: 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100 animate-pulse' }
                    ].map(m => {
                      const isSelected = mood === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => handleMoodSelect(m.id)}
                          className={`p-2.5 border rounded-xl flex flex-col items-center justify-center gap-1.5 font-extrabold text-[10px] transition-all duration-200 ${
                            isSelected 
                              ? `${m.color} ring-2 ring-offset-1 ring-nura-blue scale-[1.03] shadow-sm` 
                              : 'bg-white border-nura-foreground/10 text-nura-muted-foreground hover:bg-nura-muted'
                          }`}
                        >
                          {m.icon}
                          <span>{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 select-none">
                    <input 
                      type="checkbox"
                      id="server-ai-check"
                      checked={useServerAI}
                      onChange={(e) => setUseServerAI(e.target.checked)}
                      className="w-4 h-4 rounded text-nura-blue focus:ring-nura-blue"
                    />
                    <label htmlFor="server-ai-check" className="text-[10px] font-bold text-nura-muted-foreground uppercase cursor-pointer">
                      Gunakan AI Server (Gemini/Groq)
                    </label>
                  </div>
                </div>

                <button 
                  onClick={() => fetchRecommendations()}
                  disabled={loading}
                  className="w-full h-[48px] bg-nura-blue hover:opacity-90 active:scale-[0.98] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-nura-blue/10 mt-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Membuat Menu AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Dapatkan Rekomendasi Makanan
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* PANEL KANAN (Rekomendasi) - 7 Columns */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-nura-foreground/10 rounded-2xl p-6 min-h-[400px] flex flex-col justify-between shadow-none">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-nura-muted pb-3.5">
                <div>
                  <h3 className="text-sm font-extrabold text-nura-foreground">Menu Gizi Rekomendasi AI</h3>
                  <p className="text-[10px] text-nura-muted-foreground font-medium mt-0.5">
                    Hasil personalisasi berdasarkan data tubuh & hasil bumi daerah
                  </p>
                </div>

                {recommendations.length > 0 && (
                  <span className="px-2.5 py-1 bg-nura-accent border border-nura-blue/15 text-nura-blue rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Personalisasi Aktif
                  </span>
                )}
              </div>

              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <div className="w-10 h-10 border-4 border-nura-blue border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-xs text-nura-muted-foreground font-bold">Menganalisis profil anak & memetakan hasil bumi daerah...</div>
                  <p className="text-[10px] text-nura-muted-foreground/80 font-medium max-w-xs text-center leading-relaxed">
                    AI sedang menyaring komoditas khas {location.province} yang tinggi gizi dan ramah untuk {activeChild?.name}.
                  </p>
                </div>
              ) : error ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3 text-xs text-amber-800 leading-relaxed font-semibold">
                  <ShieldAlert className="w-5 h-5 shrink-0 text-amber-700" />
                  <div>
                    <h4 className="font-bold text-amber-900">Catatan Sistem AI:</h4>
                    <p className="mt-1 font-medium">{error}</p>
                  </div>
                </div>
              ) : null}

              {/* Display food cards */}
              {!loading && recommendations.length > 0 && (
                <div className="grid grid-cols-1 gap-4 animate-fadeIn">
                  {recommendations.map((food, idx) => (
                    <div 
                      key={idx}
                      className="p-4 bg-white border border-nura-foreground/10 hover:border-nura-blue/20 rounded-2xl shadow-none hover:shadow-md transition-all space-y-3 relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-nura-blue to-nura-teal" />
                      
                      <div className="pl-2.5">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="text-xs font-black text-nura-foreground leading-snug">
                            {food.name}
                          </h4>
                          <span className="px-2.5 py-0.5 bg-nura-accent text-nura-blue rounded-md text-[8px] font-black uppercase tracking-wider shrink-0 select-none border border-nura-blue/10">
                            Komoditas Lokal
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[9px] text-nura-teal font-extrabold mt-1.5">
                          <MapPin className="w-3 h-3" />
                          <span>Asal Bumi: {food.origin}</span>
                        </div>

                        <div className="border-t border-slate-50 pt-2.5 mt-2.5 text-[11px] text-nura-muted-foreground leading-relaxed font-medium">
                          {food.why}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && recommendations.length === 0 && (
                <div className="py-20 text-center space-y-3.5 text-nura-muted-foreground">
                  <span className="text-5xl block animate-pulse">🥗</span>
                  <div className="space-y-1">
                    <h4 className="text-xs font-extrabold text-nura-foreground">Siap Memberi Rekomendasi</h4>
                    <p className="text-[10px] font-semibold max-w-sm mx-auto leading-relaxed text-nura-muted-foreground/80">
                      Silakan pilih profil anak di panel kiri, tentukan mood anak ke **"Rewel / Frustrasi"** atau klik tombol **"Dapatkan Rekomendasi"** untuk membuat rancangan menu AI.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Verification & Tip Footer */}
            <div className="p-3 bg-[#e8f5f4] rounded-xl border border-nura-teal/5 flex gap-2.5 text-[10px] text-[#2d6b66] leading-relaxed font-semibold mt-6 select-none shrink-0">
              <Heart className="w-4 h-4 text-nura-teal shrink-0 mt-0.5" />
              <span>
                <strong>Tips Bidan NURA:</strong> Rekomendasi di atas disesuaikan untuk usia anak Anda. Pastikan kebersihan bahan pangan lokal saat pengolahan MPASI mandiri di rumah.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
