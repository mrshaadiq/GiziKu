import React from 'react';

export default function MeasurementsStep({ 
  measurements, 
  setMeasurements, 
  onPrev, 
  onNext, 
  getBMI, 
  getBMIStatus, 
  getStuntingStatus 
}) {
  const isFormValid = measurements.weight && measurements.height;

  return (
    <div className="space-y-6 flex-1 flex flex-col justify-between">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-extrabold text-nura-foreground">Berat & Tinggi Badan</h3>
          <p className="text-xs text-nura-muted-foreground font-medium mt-0.5">
            Ukur kondisi fisik balita untuk diagnosis stunting & wasting
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground mb-2">
              Berat Badan (kg)
            </label>
            <input 
              type="number" 
              step="0.1"
              value={measurements.weight} 
              onChange={(e) => setMeasurements(prev => ({ ...prev, weight: e.target.value }))}
              className="w-full h-[52px] px-4 py-3 text-xs bg-slate-50 border border-slate-200 focus:border-nura-blue focus:bg-white focus:outline-none rounded-2xl text-nura-foreground font-semibold placeholder:text-slate-350 transition-all" 
              placeholder="mis. 11.5" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground mb-2">
              Tinggi Badan (cm)
            </label>
            <input 
              type="number" 
              step="0.5"
              value={measurements.height} 
              onChange={(e) => setMeasurements(prev => ({ ...prev, height: e.target.value }))}
              className="w-full h-[52px] px-4 py-3 text-xs bg-slate-50 border border-slate-200 focus:border-nura-blue focus:bg-white focus:outline-none rounded-2xl text-nura-foreground font-semibold placeholder:text-slate-350 transition-all" 
              placeholder="mis. 85" 
            />
          </div>
          
          {measurements.weight && measurements.height ? (
            <div className="h-[52px] px-4 bg-nura-accent rounded-2xl flex items-center justify-between border border-nura-blue/20">
              <span className="text-[10px] uppercase font-bold text-nura-blue">Skor BMI</span>
              <span className="text-sm font-black text-nura-blue font-mono tracking-tight">{getBMI()}</span>
            </div>
          ) : (
            <div className="h-[52px] px-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center text-[10px] text-nura-muted-foreground font-bold">
              Masukkan tinggi & berat
            </div>
          )}
        </div>

        {measurements.weight && measurements.height && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl mt-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-nura-muted-foreground font-bold block">
                Status Gizi (BMI)
              </span>
              <span className="text-xs font-bold text-nura-foreground mt-1.5 block">
                {getBMIStatus()}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-nura-muted-foreground font-bold block">
                Indeks Tinggi Badan
              </span>
              <span className="text-xs font-bold text-nura-foreground mt-1.5 block">
                {getStuntingStatus()}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-6 border-t border-slate-100 mt-8">
        <button 
          onClick={onPrev} 
          className="h-[48px] px-6 text-xs font-bold rounded-full bg-nura-muted text-nura-muted-foreground hover:bg-slate-200/80 transition-all active:scale-[0.98]"
        >
          Kembali
        </button>
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
