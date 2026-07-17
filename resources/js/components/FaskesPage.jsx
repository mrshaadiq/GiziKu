import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { MapPin, Phone, Award, Compass, Search } from 'lucide-react';

export default function FaskesPage() {
  const [faskesList, setFaskesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('Semua');
  
  // Selected faskes for Map focusing
  const [selectedFaskesId, setSelectedFaskesId] = useState(null);

  // Active province from local storage
  const [userProvince, setUserProvince] = useState('');

  useEffect(() => {
    // Load location
    try {
      const savedLoc = localStorage.getItem('gn_location');
      if (savedLoc) {
        const parsed = JSON.parse(savedLoc);
        if (parsed.province) {
          setUserProvince(parsed.province);
        }
      }
    } catch (e) {
      console.warn("Gagal memuat lokasi", e);
    }

    api('/faskes').then(data => {
      setFaskesList(data);
      if (data && data.length > 0) {
        setSelectedFaskesId(data[0].id);
      }
      setLoading(false);
    });
  }, []);

  const filtered = filterType === 'Semua' 
    ? faskesList 
    : faskesList.filter(f => f.tipe === filterType);

  const activeFaskes = faskesList.find(f => f.id === selectedFaskesId);

  // Generate dynamic map query URL
  const getMapUrl = () => {
    let query = 'Puskesmas Rumah Sakit Terdekat';
    if (activeFaskes) {
      query = `${activeFaskes.nama}, ${activeFaskes.alamat}`;
    } else if (userProvince) {
      query = `Fasilitas Kesehatan di ${userProvince}`;
    }
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  };

  if (loading) return <div className="flex items-center justify-center p-12"><div className="w-8 h-8 border-3 border-nura-blue border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full font-sans text-nura-foreground">
      {/* Brand Header */}
      <div 
        className="relative overflow-hidden rounded-[24px] p-6 md:p-8 text-white shadow-none"
        style={{ background: 'linear-gradient(135deg, #1b5be8 0%, #0f3fa3 100%)' }}
      >
        <div className="text-[11px] font-bold uppercase tracking-widest text-blue-200">Fasilitas Rujukan</div>
        <h2 className="text-2xl md:text-[28px] font-extrabold tracking-tight mt-1">Fasilitas Kesehatan Terdekat</h2>
        <p className="text-blue-100 text-xs mt-2 max-w-2xl font-medium">
          Temukan jejaring Puskesmas, Rumah Sakit Rujukan, Posyandu, dan Klinik Anak terdekat untuk penanganan gizi dan tumbuh kembang. Klik faskes untuk memetakan lokasinya.
        </p>
      </div>

      {/* Filter Tabs & Search Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 p-1.5 bg-nura-muted border border-nura-foreground/5 rounded-full w-max">
          {['Semua', 'Puskesmas', 'Rumah Sakit Rujukan', 'Posyandu', 'Klinik Swasta'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterType === type ? 'bg-white text-nura-blue shadow-sm' : 'text-nura-muted-foreground hover:text-nura-foreground'}`}
            >
              {type}
            </button>
          ))}
        </div>
        {userProvince && (
          <span className="text-xs text-nura-muted-foreground font-semibold flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-nura-blue animate-spin" /> Menampilkan faskes sekitar: <strong className="text-nura-foreground">{userProvince}</strong>
          </span>
        )}
      </div>

      {/* Interactive split view (Map left, list right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: Google Maps Embed (7 Cols) */}
        <div className="lg:col-span-7 flex">
          <div className="w-full bg-white border border-nura-foreground/10 rounded-3xl p-4 shadow-none flex flex-col justify-between min-h-[450px]">
            <div className="flex items-center justify-between border-b border-nura-muted pb-3 mb-3 shrink-0 select-none">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-nura-muted-foreground">Peta Lokasi Interaktif</h3>
                {activeFaskes && <p className="text-[10px] text-nura-blue font-extrabold mt-0.5">{activeFaskes.nama}</p>}
              </div>
              <span className="px-2.5 py-0.5 bg-nura-accent text-nura-blue rounded-md text-[8px] font-black uppercase tracking-wider">Google Maps</span>
            </div>

            <div className="flex-1 rounded-2xl overflow-hidden border border-nura-foreground/10 bg-slate-100 relative min-h-[360px]">
              <iframe
                title="Peta Lokasi Faskes"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={getMapUrl()}
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Faskes List (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col min-h-0">
          <div className="w-full bg-white border border-nura-foreground/10 rounded-3xl p-5 shadow-none flex-1 flex flex-col min-h-[450px]">
            <h3 className="text-xs font-bold uppercase tracking-widest text-nura-muted-foreground border-b border-nura-muted pb-3 mb-3.5 shrink-0 select-none">
              Daftar Jejaring Kesehatan
            </h3>

            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[400px]">
              {filtered.map(f => {
                const isSelected = selectedFaskesId === f.id;
                return (
                  <div 
                    key={f.id} 
                    onClick={() => setSelectedFaskesId(f.id)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-3.5 ${
                      isSelected 
                        ? 'bg-nura-accent/50 border-nura-blue shadow-sm' 
                        : 'bg-white border-nura-foreground/10 hover:bg-nura-muted'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border shadow-inner ${
                            f.tipe === 'Posyandu' 
                              ? 'bg-purple-50 text-purple-600 border-purple-100' 
                              : f.tipe === 'Puskesmas' 
                              ? 'bg-blue-50 text-blue-600 border-blue-100' 
                              : f.tipe === 'Klinik Swasta' 
                              ? 'bg-amber-50 text-amber-600 border-amber-100' 
                              : 'bg-rose-50 text-rose-600 border-rose-100'
                          }`}>
                            {f.tipe}
                          </span>
                          <h4 className="text-xs font-black text-nura-foreground mt-2 leading-snug">{f.nama}</h4>
                        </div>
                        <span className="text-[9px] font-bold text-nura-muted-foreground font-mono bg-nura-muted px-2 py-0.5 rounded-lg shrink-0">📍 {f.jarak}</span>
                      </div>

                      <div className="text-[11px] space-y-1 text-nura-muted-foreground leading-relaxed font-semibold">
                        <div className="flex gap-1 items-start">
                          <MapPin className="w-3.5 h-3.5 text-nura-blue shrink-0 mt-0.5" />
                          <span>Alamat: <span className="font-medium">{f.alamat}</span></span>
                        </div>
                        <div className="flex gap-1 items-center">
                          <Phone className="w-3.5 h-3.5 text-nura-blue shrink-0" />
                          <span>Phone: <span className="font-medium font-mono">{f.phone}</span></span>
                        </div>
                        <div className="flex gap-1 items-center">
                          <Award className="w-3.5 h-3.5 text-nura-teal shrink-0" />
                          <span>Medis: <span className="text-nura-blue font-bold">{f.dokter}</span></span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-nura-muted select-none">
                      <span className="text-[8px] uppercase tracking-wider text-nura-muted-foreground font-black block">Layanan Utama</span>
                      <p className="text-[10px] text-nura-muted-foreground font-medium mt-0.5 leading-relaxed">{f.layanan}</p>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="text-center py-12 text-xs text-nura-muted-foreground font-semibold">Tidak ada fasilitas kesehatan tipe ini.</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
