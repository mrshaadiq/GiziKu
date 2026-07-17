import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function EdukasiPage() {
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

  if (loading) return <div className="flex items-center justify-center p-12"><div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-500 p-6 md:p-8 text-white shadow-xl shadow-blue-500/10">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">📖 Edukasi & Literasi Orang Tua</h2>
        <p className="text-blue-100 text-xs mt-2 max-w-2xl font-medium">Pelajari artikel gizi, penanganan anemia, pencegahan stunting balita, serta uji pemahaman Anda melalui kuis interaktif.</p>
      </div>

      {selectedArticle ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 animate-fadeIn">
          <button onClick={() => setSelectedArticle(null)} className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 bg-white hover:bg-slate-50 transition-all">
            ← Kembali ke Artikel
          </button>
          <div className="border-b border-slate-100 pb-3 mt-2">
            <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase bg-blue-50 text-blue-600 border border-blue-100">{selectedArticle.kategori}</span>
            <h3 className="text-lg font-black text-slate-800 mt-2">{selectedArticle.judul}</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">{selectedArticle.konten}</p>
        </div>
      ) : activeQuiz ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 animate-fadeIn">
          <button onClick={() => setActiveQuiz(null)} className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 bg-white hover:bg-slate-50 transition-all">
            ← Kembali
          </button>
          <div className="border-b border-slate-100 pb-3 mt-2">
            <h3 className="text-base font-black text-slate-800">📝 Kuis Pemahaman Kesehatan Anak</h3>
            <p className="text-xs text-slate-400 mt-1">Uji pemahaman Anda seputar tumbuh kembang emas balita.</p>
          </div>

          <div className="space-y-4">
            {activeQuiz.quiz_data.map((q, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                <div className="text-xs font-bold text-slate-800">{idx + 1}. {q.question}</div>
                <div className="grid grid-cols-1 gap-2">
                  {q.options.map((opt, oi) => {
                    const isSelected = quizAnswers[idx] === oi;
                    let btnStyle = 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50';
                    if (quizSubmitted) {
                      if (oi === q.correct) {
                        btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold';
                      } else if (isSelected) {
                        btnStyle = 'bg-red-50 border-red-500 text-red-700 font-bold';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-blue-600 border-blue-600 text-white font-black';
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
              className={`w-full py-3.5 text-xs font-bold rounded-xl transition-all ${Object.keys(quizAnswers).length < activeQuiz.quiz_data.length ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white font-black shadow-lg shadow-blue-500/15'}`}
            >
              Kirim Jawaban
            </button>
          ) : (
            <div className="p-5 bg-slate-50 border border-slate-150 rounded-xl text-center space-y-2.5 animate-fadeIn">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-450 block">Skor Evaluasi Kuis</span>
              <div className="text-3xl font-black font-mono text-blue-600">{quizScore}%</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                {quizScore >= 80 ? 'Hebat! Anda memiliki pemahaman yang matang mengenai asupan gizi pencegah anemia dan stunting anak.' : 'Kami merekomendasikan Anda untuk membaca kembali materi edukasi di atas agar pemantauan si kecil semakin optimal.'}
              </p>
              <button onClick={() => startQuiz(activeQuiz)} className="mt-2 px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">Ulangi Kuis</button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 mb-2">Artikel Edukasi Balita</h3>
            {articles.filter(a => a.tipe === 'artikel').map(a => (
              <div key={a.id} className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between hover:border-slate-300 transition-all shadow-sm">
                <div>
                  <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase bg-blue-50 text-blue-600 border border-blue-100">{a.kategori}</span>
                  <h4 className="text-sm font-extrabold text-slate-800 mt-3">{a.judul}</h4>
                  <p className="text-xs text-slate-450 mt-1.5 font-medium leading-relaxed">{a.ringkasan}</p>
                </div>
                <button onClick={() => setSelectedArticle(a)} className="text-xs text-blue-600 hover:text-blue-500 font-extrabold self-start mt-4 flex items-center gap-1">
                  Baca Selengkapnya ➔
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-extrabold text-slate-800 mb-2">Evaluasi Interaktif</h3>
            {articles.filter(a => a.tipe === 'kuis').map(a => (
              <div key={a.id} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4 text-center shadow-sm">
                <span className="text-3xl block">📝</span>
                <h4 className="text-sm font-bold text-slate-800">Kuis Kesiapan Kesehatan Anak</h4>
                <p className="text-xs text-slate-450 leading-relaxed font-semibold">Uji tingkat kepedulian & pemahaman tumbuh kembang emas.</p>
                <button onClick={() => startQuiz(a)} className="w-full py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black shadow-md shadow-blue-500/10 transition-all">Mulai Kuis</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
