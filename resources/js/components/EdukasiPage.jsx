import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  Clock, 
  Apple, 
  Brain, 
  Heart, 
  Baby, 
  Utensils, 
  Smile, 
  BookOpen, 
  ChevronLeft 
} from 'lucide-react';

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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-3 border-nura-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const filteredArticles = filterType === 'Semua'
    ? articles.filter(a => a.tipe === 'artikel')
    : articles.filter(a => a.tipe === 'artikel' && a.kategori === filterType);

  // Style mapper to match Image 5 aesthetics
  const getCategoryStyles = (category, id) => {
    if (category === 'Gizi & Nutrisi') {
      if (id === 1) {
        return {
          bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
          iconBg: 'bg-emerald-100 text-emerald-600',
          dot: 'bg-emerald-500',
          icon: <Apple className="w-4 h-4" />
        };
      }
      if (id === 3) {
        return {
          bg: 'bg-rose-50 text-rose-600 border-rose-100',
          iconBg: 'bg-rose-100 text-rose-600',
          dot: 'bg-rose-500',
          icon: <Heart className="w-4 h-4" />
        };
      }
      if (id === 5) {
        return {
          bg: 'bg-amber-50 text-amber-600 border-amber-100',
          iconBg: 'bg-amber-100 text-amber-600',
          dot: 'bg-amber-500',
          icon: <Utensils className="w-4 h-4" />
        };
      }
      return {
        bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        iconBg: 'bg-emerald-100 text-emerald-600',
        dot: 'bg-emerald-500',
        icon: <Apple className="w-4 h-4" />
      };
    } else { // Kesehatan Mental
      if (id === 2) {
        return {
          bg: 'bg-purple-50 text-purple-600 border-purple-100',
          iconBg: 'bg-purple-100 text-purple-600',
          dot: 'bg-purple-500',
          icon: <Brain className="w-4 h-4" />
        };
      }
      if (id === 4) {
        return {
          bg: 'bg-blue-50 text-blue-600 border-blue-100',
          iconBg: 'bg-blue-100 text-blue-600',
          dot: 'bg-blue-500',
          icon: <Baby className="w-4 h-4" />
        };
      }
      if (id === 6) {
        return {
          bg: 'bg-purple-50 text-purple-600 border-purple-100',
          iconBg: 'bg-purple-100 text-purple-600',
          dot: 'bg-purple-500',
          icon: <Smile className="w-4 h-4" />
        };
      }
      return {
        bg: 'bg-purple-50 text-purple-600 border-purple-100',
        iconBg: 'bg-purple-100 text-purple-600',
        dot: 'bg-purple-500',
        icon: <Brain className="w-4 h-4" />
      };
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      {selectedArticle ? (
        <div className="bg-white border border-nura-foreground/10 rounded-2xl p-6 md:p-8 space-y-4 animate-fadeIn">
          <button 
            onClick={() => setSelectedArticle(null)} 
            className="h-[44px] px-6 text-xs font-bold rounded-2xl bg-nura-muted text-nura-muted-foreground hover:bg-slate-200/80 transition-all flex items-center gap-2 active:scale-[0.98]"
          >
            <ChevronLeft className="w-4 h-4" /> Kembali
          </button>
          
          <div className="border-b border-nura-muted pb-4 mt-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-nura-accent text-nura-blue border border-nura-blue/15">
              {selectedArticle.kategori}
            </span>
            <h3 className="text-xl font-extrabold text-nura-foreground mt-3">{selectedArticle.judul}</h3>
            <div className="flex items-center gap-1 text-[10px] text-nura-muted-foreground mt-1.5 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>Estimasi baca: {selectedArticle.durasi}</span>
            </div>
          </div>
          
          <p className="text-xs text-nura-foreground/85 leading-relaxed whitespace-pre-wrap font-semibold font-sans pt-2">
            {selectedArticle.konten}
          </p>
        </div>
      ) : activeQuiz ? (
        <div className="bg-white border border-nura-foreground/10 rounded-2xl p-6 md:p-8 space-y-4 animate-fadeIn">
          <button 
            onClick={() => setActiveQuiz(null)} 
            className="h-[44px] px-6 text-xs font-bold rounded-2xl bg-nura-muted text-nura-muted-foreground hover:bg-slate-200/80 transition-all flex items-center gap-2 active:scale-[0.98]"
          >
            <ChevronLeft className="w-4 h-4" /> Kembali
          </button>
          
          <div className="border-b border-nura-muted pb-4 mt-2">
            <h3 className="text-lg font-extrabold text-nura-foreground">Kuis Pemahaman Kesehatan Anak</h3>
            <p className="text-xs text-nura-muted-foreground mt-1 font-semibold">Uji pemahaman Anda seputar nutrisi, anemia, dan pencegahan stunting secara mandiri.</p>
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
              className={`w-full h-[48px] text-xs font-bold rounded-2xl transition-all ${
                Object.keys(quizAnswers).length < activeQuiz.quiz_data.length 
                  ? 'bg-slate-300 text-white cursor-default' 
                  : 'bg-nura-blue text-white hover:opacity-90 active:scale-[0.98]'
              }`}
            >
              Kirim Jawaban
            </button>
          ) : (
            <div className="p-5 bg-nura-muted rounded-2xl text-center space-y-3.5 animate-fadeIn">
              <span className="text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground block">Skor Evaluasi Kuis</span>
              <div className="text-3xl font-black font-mono text-nura-blue">{quizScore}%</div>
              <p className="text-xs text-nura-muted-foreground max-w-sm mx-auto font-semibold">
                {quizScore >= 80 
                  ? 'Hebat! Anda memiliki pemahaman yang matang mengenai asupan gizi pencegah anemia dan stunting anak.' 
                  : 'Kami merekomendasikan Anda untuk membaca kembali materi edukasi di atas agar pemantauan si kecil semakin optimal.'}
              </p>
              <button 
                onClick={() => startQuiz(activeQuiz)} 
                className="mt-2 px-5 py-2.5 text-xs font-bold rounded-xl border border-nura-foreground/10 bg-white text-nura-foreground hover:bg-slate-50 transition-all active:scale-[0.98]"
              >
                Ulangi Kuis
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Typography matching screenshot */}
          <div>
            <h2 className="text-2xl md:text-[28px] font-black text-nura-foreground tracking-tight">Edukasi & Literasi</h2>
            <p className="text-nura-muted-foreground text-xs font-semibold mt-1">Pelajari materi kesehatan gizi dan mental anak yang telah dikurasi oleh tim ahli.</p>
          </div>

          {/* Tab Filter Chips */}
          <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-full w-max">
            {['Semua', 'Gizi & Nutrisi', 'Kesehatan Mental'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  filterType === type 
                    ? 'bg-nura-blue text-white shadow-sm' 
                    : 'text-nura-muted-foreground hover:text-nura-foreground'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Grid of Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(a => {
              const styles = getCategoryStyles(a.kategori, a.id);
              return (
                <div 
                  key={a.id} 
                  className="bg-white border border-nura-foreground/10 rounded-2xl p-5 hover:shadow-lg hover:border-nura-blue/20 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Category Pill with Icon and Dot */}
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase border ${styles.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`}></span>
                        <span>{a.kategori === 'Gizi & Nutrisi' ? 'Gizi' : 'Kesehatan Mental'}</span>
                      </div>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${styles.iconBg}`}>
                        {styles.icon}
                      </div>
                    </div>

                    <h4 className="text-xs font-extrabold text-nura-foreground leading-snug line-clamp-2">
                      {a.judul}
                    </h4>
                    <p className="text-[10px] text-nura-muted-foreground font-semibold leading-relaxed line-clamp-3">
                      {a.ringkasan}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-5 text-[10px] font-bold">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{a.durasi}</span>
                    </div>
                    <button 
                      onClick={() => setSelectedArticle(a)} 
                      className="text-nura-blue hover:opacity-80 transition-opacity flex items-center gap-1"
                    >
                      Baca Selengkapnya ➔
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Kuis / Evaluation Card inside Grid */}
            {filterType === 'Semua' && (
              <div className="bg-gradient-to-tr from-nura-blue to-nura-blue/90 text-white rounded-2xl p-5 flex flex-col justify-between shadow-lg shadow-nura-blue/15 hover:scale-[1.005] transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[9px] font-bold uppercase bg-white/20 text-white">
                      Evaluasi
                    </span>
                    <span className="text-xl">📝</span>
                  </div>
                  <h4 className="text-xs font-extrabold leading-snug">
                    Kuis Kesiapan Kesehatan Anak
                  </h4>
                  <p className="text-[10px] text-blue-100 font-semibold leading-relaxed">
                    Uji tingkat kepedulian & pemahaman tumbuh kembang emas anak di rumah secara offline.
                  </p>
                </div>
                
                <button 
                  onClick={() => startQuiz(articles.find(a => a.tipe === 'kuis'))} 
                  className="mt-6 w-full h-[44px] text-xs font-bold bg-white text-nura-blue rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all"
                >
                  Mulai Kuis ➔
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
