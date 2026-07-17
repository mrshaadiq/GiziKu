import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function EdukasiPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [filterType, setFilterType] = useState('Semua');
  
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

  if (loading) return <div className="flex items-center justify-center p-12"><div className="w-8 h-8 border-3 border-nura-blue border-t-transparent rounded-full animate-spin"></div></div>;

  const filteredArticles = filterType === 'Semua'
    ? articles.filter(a => a.tipe === 'artikel')
    : articles.filter(a => a.tipe === 'artikel' && a.kategori === filterType);

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      {/* Brand Gradient Banner */}
      <div 
        className="relative overflow-hidden rounded-[24px] p-6 md:p-8 text-white shadow-none"
        style={{ background: 'linear-gradient(135deg, #1b5be8 0%, #0f3fa3 100%)' }}
      >
        <div className="text-[11px] font-bold uppercase tracking-widest text-blue-200">Hub Literasi</div>
        <h2 className="text-2xl md:text-[28px] font-extrabold tracking-tight mt-1">Edukasi & Literasi Orang Tua</h2>
        <p className="text-blue-100 text-xs mt-2 max-w-2xl font-medium">Pelajari gizi anak, MPASI sehat, pencegahan stunting, serta uji pemahaman Anda.</p>
      </div>

      {selectedArticle ? (
        <div className="bg-white border border-nura-foreground/10 rounded-2xl p-6 space-y-4 animate-fadeIn">
          <button 
            onClick={() => setSelectedArticle(null)} 
            className="h-[44px] px-6 text-xs font-bold rounded-2xl bg-nura-muted text-nura-muted-foreground hover:bg-slate-200/80 transition-all active:scale-[0.98]"
          >
            ← Kembali
          </button>
          <div className="border-b border-nura-muted pb-3.5 mt-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-nura-accent text-nura-blue border border-nura-blue/15">{selectedArticle.kategori}</span>
            <h3 className="text-lg font-extrabold text-nura-foreground mt-2.5">{selectedArticle.judul}</h3>
          </div>
          <p className="text-xs text-nura-foreground/80 leading-relaxed whitespace-pre-wrap font-semibold">{selectedArticle.konten}</p>
        </div>
      ) : activeQuiz ? (
        <div className="bg-white border border-nura-foreground/10 rounded-2xl p-6 space-y-4 animate-fadeIn">
          <button 
            onClick={() => setActiveQuiz(null)} 
            className="h-[44px] px-6 text-xs font-bold rounded-2xl bg-nura-muted text-nura-muted-foreground hover:bg-slate-200/80 transition-all active:scale-[0.98]"
          >
            ← Kembali
          </button>
          <div className="border-b border-nura-muted pb-3 mt-2">
            <h3 className="text-base font-bold text-nura-foreground">Kuis Pemahaman Kesehatan Anak</h3>
            <p className="text-xs text-nura-muted-foreground mt-1 font-semibold">Tersimpan di memori perangkat</p>
          </div>

          <div className="space-y-4">
            {activeQuiz.quiz_data.map((q, idx) => (
              <div key={idx} className="p-4 bg-nura-muted border border-nura-foreground/5 rounded-xl space-y-3">
                <div className="text-xs font-bold text-nura-foreground">{idx + 1}. {q.question}</div>
                <div className="grid grid-cols-1 gap-2">
                  {q.options.map((opt, oi) => {
                    const isSelected = quizAnswers[idx] === oi;
                    let btnStyle = 'bg-white border-nura-foreground/10 text-nura-muted-foreground hover:bg-slate-50 hover:text-nura-foreground';
                    if (quizSubmitted) {
                      if (oi === q.correct) {
                        btnStyle = 'bg-[#dcfce7] border-[#16a34a] text-[#16a34a] font-bold';
                      } else if (isSelected) {
                        btnStyle = 'bg-[#fee2e2] border-[#e53e3e] text-[#e53e3e] font-bold';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-nura-blue border-nura-blue text-white font-extrabold';
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
              className={`w-full h-[48px] text-xs font-bold rounded-2xl transition-all ${Object.keys(quizAnswers).length < activeQuiz.quiz_data.length ? 'bg-slate-350 text-white cursor-default' : 'bg-nura-blue text-white hover:opacity-90 active:scale-[0.98]'}`}
            >
              Kirim Jawaban
            </button>
          ) : (
            <div className="p-5 bg-nura-muted rounded-2xl text-center space-y-3.5 animate-fadeIn">
              <span className="text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground block">Skor Evaluasi Kuis</span>
              <div className="text-3xl font-black font-mono text-nura-blue">{quizScore}%</div>
              <p className="text-xs text-nura-muted-foreground max-w-sm mx-auto font-semibold">
                {quizScore >= 80 ? 'Hebat! Anda memiliki pemahaman yang matang mengenai asupan gizi pencegah anemia dan stunting anak.' : 'Kami merekomendasikan Anda untuk membaca kembali materi edukasi di atas agar pemantauan si kecil semakin optimal.'}
              </p>
              <button onClick={() => startQuiz(activeQuiz)} className="mt-2 px-4 py-2.5 text-xs font-bold rounded-xl border border-nura-foreground/10 bg-white text-nura-foreground hover:bg-slate-50 transition-all">Ulangi Kuis</button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Tab Filter Chips (Design System §6.6 / §6.14) */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-nura-muted border border-nura-foreground/5 rounded-full w-max">
            {['Semua', 'Gizi & Tumbuh Kembang', 'Nutrisi Anak'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterType === type ? 'bg-white text-nura-blue shadow-sm' : 'text-nura-muted-foreground hover:text-nura-foreground'}`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Desktop Articles Grid (grid-cols-3 if standalone, or grid-cols-2) */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-nura-muted-foreground mb-3">Artikel Edukasi</h3>
              {filteredArticles.map(a => (
                <div key={a.id} className="p-5 bg-white border border-nura-foreground/10 rounded-2xl flex flex-col justify-between hover:border-nura-blue/20 hover:shadow-md transition-all">
                  <div>
                    <span className="px-3 py-1 rounded-full text-[9px] font-bold uppercase bg-nura-accent text-nura-blue border border-nura-blue/15">{a.kategori}</span>
                    <h4 className="text-sm font-extrabold text-nura-foreground mt-3">{a.judul}</h4>
                    <p className="text-xs text-nura-muted-foreground mt-1.5 font-semibold leading-relaxed">{a.ringkasan}</p>
                  </div>
                  <button onClick={() => setSelectedArticle(a)} className="text-xs text-nura-blue hover:opacity-80 font-bold self-start mt-4 flex items-center gap-1">
                    Baca Artikel ➔
                  </button>
                </div>
              ))}
            </div>

            {/* Quiz side cards */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-nura-muted-foreground mb-3">Evaluasi Mandiri</h3>
              {articles.filter(a => a.tipe === 'kuis').map(a => (
                <div key={a.id} className="p-5 bg-white border border-nura-foreground/10 rounded-2xl space-y-4 text-center shadow-sm">
                  <span className="text-3xl block">📝</span>
                  <h4 className="text-sm font-extrabold text-nura-foreground">Kuis Kesiapan Kesehatan Anak</h4>
                  <p className="text-xs text-nura-muted-foreground leading-relaxed font-semibold">Uji tingkat kepedulian & pemahaman tumbuh kembang emas.</p>
                  <button 
                    onClick={() => startQuiz(a)} 
                    className="w-full h-[48px] text-xs font-bold rounded-2xl bg-nura-blue hover:opacity-90 text-white font-bold transition-all shadow-md shadow-nura-blue/10"
                  >
                    Mulai Kuis
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
