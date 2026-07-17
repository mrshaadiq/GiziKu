import React from 'react';

export default function ChildProfileStep({ patient, setPatient, onNext }) {
  const calculateAgeInMonths = (birthDateStr) => {
    if (!birthDateStr) return '';
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    
    let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
    months -= birthDate.getMonth();
    months += today.getMonth();
    
    if (today.getDate() < birthDate.getDate()) {
      months--;
    }
    return Math.max(0, months);
  };

  const isFormValid = patient.name.trim() && patient.age.toString().trim();

  return (
    <div className="space-y-6 flex-1 flex flex-col justify-between">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-extrabold text-nura-foreground">Profil Anak</h3>
          <p className="text-xs text-nura-muted-foreground font-medium mt-0.5">
            Masukkan informasi dasar anak yang akan diperiksa
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground mb-2">
              Nama Anak
            </label>
            <input 
              type="text" 
              value={patient.name} 
              onChange={(e) => setPatient(prev => ({ ...prev, name: e.target.value }))}
              className="w-full h-[52px] px-4 py-3 text-xs bg-slate-50 border border-slate-200 focus:border-nura-blue focus:bg-white focus:outline-none rounded-2xl text-nura-foreground font-semibold placeholder:text-slate-350 transition-all" 
              placeholder="mis. Siti Nurhaliza" 
            />
            <div className="text-[9px] text-nura-muted-foreground font-bold mt-1.5 ml-1">
              Tersimpan di memori perangkat
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground mb-2">
                <span>Tanggal Lahir</span>
                {patient.age !== '' && (
                  <span className="text-[10px] text-nura-blue normal-case font-bold bg-nura-accent px-2 py-0.5 rounded-md">
                    {patient.age} Bulan
                  </span>
                )}
              </label>
              <input 
                type="date" 
                value={patient.birth_date || ''} 
                onChange={(e) => {
                  const dateVal = e.target.value;
                  const monthsVal = calculateAgeInMonths(dateVal);
                  setPatient(prev => ({ ...prev, birth_date: dateVal, age: monthsVal }));
                }}
                className="w-full h-[52px] px-4 py-3 text-xs bg-slate-50 border border-slate-200 focus:border-nura-blue focus:bg-white focus:outline-none rounded-2xl text-nura-foreground font-semibold placeholder:text-slate-350 transition-all" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground mb-2">
                Jenis Kelamin
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  type="button" 
                  onClick={() => setPatient(prev => ({ ...prev, gender: 'L' }))}
                  className={`h-[52px] text-xs font-bold rounded-2xl border transition-all flex items-center justify-center gap-1.5 ${
                    patient.gender === 'L' 
                      ? 'bg-nura-blue text-white border-nura-blue shadow-md shadow-nura-blue/15' 
                      : 'bg-slate-50 border-slate-200 text-nura-muted-foreground hover:text-nura-foreground hover:bg-slate-100/50'
                  }`}
                >
                  <span>👦</span> Laki-laki
                </button>
                <button 
                  type="button" 
                  onClick={() => setPatient(prev => ({ ...prev, gender: 'P' }))}
                  className={`h-[52px] text-xs font-bold rounded-2xl border transition-all flex items-center justify-center gap-1.5 ${
                    patient.gender === 'P' 
                      ? 'bg-nura-blue text-white border-nura-blue shadow-md shadow-nura-blue/15' 
                      : 'bg-slate-50 border-slate-200 text-nura-muted-foreground hover:text-nura-foreground hover:bg-slate-100/50'
                  }`}
                >
                  <span>👧</span> Perempuan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-slate-100 mt-8">
        <button 
          onClick={onNext} 
          disabled={!isFormValid}
          className={`h-[48px] px-8 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
            !isFormValid 
              ? 'bg-slate-300 text-white cursor-default' 
              : 'bg-nura-blue text-white hover:opacity-90 active:scale-[0.98]'
          }`}
        >
          Lanjut <span className="text-[10px]">➔</span>
        </button>
      </div>
    </div>
  );
}
