import React, { useState, useEffect } from 'react';
import { api, csrfToken } from '../api';
import { 
  Clock, 
  Apple, 
  Brain, 
  Heart, 
  Baby, 
  Utensils, 
  Smile, 
  BookOpen, 
  ChevronLeft,
  Plus,
  Edit3,
  Trash2,
  HelpCircle,
  Save,
  X,
  RefreshCw
} from 'lucide-react';

export default function EdukasiPage({ user }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [filterType, setFilterType] = useState('Semua');
  
  // Admin Edit Form State
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null if adding new
  const [formData, setFormData] = useState({
    judul: '',
    tipe: 'artikel',
    kategori: 'Gizi & Tumbuh Kembang',
    ringkasan: '',
    konten: '',
    quiz_data: [
      { question: '', options: ['', '', ''], correct: 0 }
    ]
  });

  const [saving, setSaving] = useState(false);

  // Quiz states
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  const isAdmin = user && (user.role_id === 1 || user.role_name === 'admin' || user.email === 'admin@gmail.com');

  const fetchArticles = () => {
    setLoading(true);
    fetch('/api/education')
      .then(res => res.json())
      .then(data => {
        setArticles(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleAnswerSelect = (qIdx, optIdx) => {
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const submitQuiz = (questions) => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) {
        score++;
      }
    });
    const finalPercent = Math.round((score / questions.length) * 100);
    setQuizScore(finalPercent);
    setQuizSubmitted(true);
  };

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  // Admin handlers
  const handleOpenAddForm = () => {
    setEditingItem(null);
    setFormData({
      judul: '',
      tipe: 'artikel',
      kategori: 'Gizi & Tumbuh Kembang',
      ringkasan: '',
      konten: '',
      quiz_data: [
        { question: '', options: ['', '', ''], correct: 0 }
      ]
    });
    setShowAdminForm(true);
  };

  const handleOpenEditForm = (item) => {
    let quizData = [{ question: '', options: ['', '', ''], correct: 0 }];
    if (item.tipe === 'kuis') {
      quizData = Array.isArray(item.quiz_data) 
        ? item.quiz_data 
        : (item.quiz_data_decoded || JSON.parse(item.quiz_data || '[]'));
    }

    setEditingItem(item);
    setFormData({
      judul: item.judul || '',
      tipe: item.tipe || 'artikel',
      kategori: item.kategori || 'Gizi & Tumbuh Kembang',
      ringkasan: item.ringkasan || '',
      konten: item.konten || '',
      quiz_data: quizData
    });
    setShowAdminForm(true);
  };

  const handleQuizQuestionChange = (qIdx, field, val) => {
    setFormData(prev => {
      const qList = [...prev.quiz_data];
      qList[qIdx] = { ...qList[qIdx], [field]: val };
      return { ...prev, quiz_data: qList };
    });
  };

  const handleQuizOptionChange = (qIdx, optIdx, val) => {
    setFormData(prev => {
      const qList = [...prev.quiz_data];
      const opts = [...qList[qIdx].options];
      opts[optIdx] = val;
      qList[qIdx] = { ...qList[qIdx], options: opts };
      return { ...prev, quiz_data: qList };
    });
  };

  const addQuizQuestion = () => {
    setFormData(prev => ({
      ...prev,
      quiz_data: [...prev.quiz_data, { question: '', options: ['', '', ''], correct: 0 }]
    }));
  };

  const removeQuizQuestion = (idx) => {
    if (formData.quiz_data.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      quiz_data: prev.quiz_data.filter((_, i) => i !== idx)
    }));
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    setSaving(true);

    const url = editingItem ? `/api/education/${editingItem.id}` : '/api/education';
    const method = editingItem ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify(formData)
      });

      const resData = await response.json();
      setSaving(false);

      if (response.ok) {
        alert(resData.message || 'Berhasil disimpan!');
        setShowAdminForm(false);
        fetchArticles();
      } else {
        alert(resData.message || 'Gagal menyimpan.');
      }
    } catch (err) {
      console.error(err);
      setSaving(false);
      alert('Kesalahan koneksi ke server.');
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus materi edukasi ini?')) return;

    try {
      const response = await fetch(`/api/education/${id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': csrfToken
        }
      });

      const resData = await response.json();
      if (response.ok) {
        alert(resData.message || 'Materi berhasil dihapus.');
        fetchArticles();
      } else {
        alert(resData.message || 'Gagal menghapus.');
      }
    } catch (err) {
      console.error(err);
      alert('Kesalahan koneksi saat menghapus.');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-12">
      <div className="w-8 h-8 border-3 border-nura-blue border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const filteredArticles = filterType === 'Semua'
    ? articles.filter(a => a.tipe === 'artikel')
    : articles.filter(a => a.tipe === 'artikel' && a.kategori === filterType);

  // Style mapper to match Design System aesthetics
  const getCategoryStyles = (category, id) => {
    const cat = category ? category.toLowerCase() : '';
    if (cat.includes('gizi') || cat.includes('nutrisi')) {
      if (id % 3 === 1) {
        return {
          bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
          iconBg: 'bg-emerald-100 text-emerald-600',
          dot: 'bg-emerald-500',
          icon: <Apple className="w-4 h-4" />
        };
      }
      if (id % 3 === 2) {
        return {
          bg: 'bg-rose-50 text-rose-600 border-rose-100',
          iconBg: 'bg-rose-100 text-rose-600',
          dot: 'bg-rose-500',
          icon: <Heart className="w-4 h-4" />
        };
      }
      return {
        bg: 'bg-amber-50 text-amber-600 border-amber-100',
        iconBg: 'bg-amber-100 text-amber-600',
        dot: 'bg-amber-500',
        icon: <Utensils className="w-4 h-4" />
      };
    } else { // Mental Health, Tumbuh Kembang, or other
      if (id % 2 === 0) {
        return {
          bg: 'bg-purple-50 text-purple-600 border-purple-100',
          iconBg: 'bg-purple-100 text-purple-600',
          dot: 'bg-purple-500',
          icon: <Brain className="w-4 h-4" />
        };
      }
      return {
        bg: 'bg-blue-50 text-blue-600 border-blue-100',
        iconBg: 'bg-blue-100 text-blue-600',
        dot: 'bg-blue-500',
        icon: <Smile className="w-4 h-4" />
      };
    }
  };

  // Get unique categories dynamically from database articles
  const availableCategories = ['Semua', ...new Set(articles.filter(a => a.tipe === 'artikel').map(a => a.kategori).filter(Boolean))];

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full font-sans text-nura-foreground">
      {/* Header / Banner area */}
      <div 
        className="relative overflow-hidden rounded-[24px] p-6 md:p-8 text-white shadow-none flex justify-between items-center"
        style={{ background: 'linear-gradient(135deg, #1b5be8 0%, #0f3fa3 100%)' }}
      >
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-200">Hub Literasi</div>
          <h2 className="text-2xl md:text-[28px] font-extrabold tracking-tight mt-1">Edukasi & Literasi Orang Tua</h2>
          <p className="text-blue-100 text-xs mt-2 max-w-2xl font-medium">Pelajari gizi anak, MPASI sehat, pencegahan stunting, serta uji pemahaman Anda.</p>
        </div>
        
        {isAdmin && (
          <button 
            onClick={handleOpenAddForm}
            className="px-4.5 py-3 rounded-xl bg-white text-nura-blue hover:bg-slate-50 text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Tambah Materi
          </button>
        )}
      </div>

      {showAdminForm ? (
        /* ADMIN FORM VIEW */
        <div className="bg-white border border-nura-foreground/10 rounded-2xl p-6 space-y-5 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-nura-muted pb-3.5">
            <h3 className="text-sm font-black text-nura-foreground">
              {editingItem ? '⚙️ Edit Materi Edukasi' : '➕ Tambah Materi Edukasi'}
            </h3>
            <button onClick={() => setShowAdminForm(false)} className="text-nura-muted-foreground hover:text-nura-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveArticle} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground mb-2">Tipe Konten</label>
                <select
                  value={formData.tipe}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipe: e.target.value }))}
                  className="w-full h-[48px] px-3.5 bg-nura-muted border border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-xs text-nura-foreground font-semibold"
                >
                  <option value="artikel">Artikel Bacaan</option>
                  <option value="kuis">Kuis Interaktif</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground mb-2">Kategori</label>
                <select
                  value={formData.kategori}
                  onChange={(e) => setFormData(prev => ({ ...prev, kategori: e.target.value }))}
                  className="w-full h-[48px] px-3.5 bg-nura-muted border border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-xs text-nura-foreground font-semibold"
                >
                  <option value="Gizi & Tumbuh Kembang">Gizi & Tumbuh Kembang</option>
                  <option value="Nutrisi Anak">Nutrisi Anak</option>
                  <option value="Kesehatan Fisik">Kesehatan Fisik</option>
                  <option value="Kesehatan Mental">Kesehatan Mental</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground mb-2">Judul Materi</label>
                <input 
                  type="text"
                  required
                  value={formData.judul}
                  onChange={(e) => setFormData(prev => ({ ...prev, judul: e.target.value }))}
                  placeholder="Masukkan judul materi"
                  className="w-full h-[48px] px-3.5 bg-nura-muted border border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-xs text-nura-foreground font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground mb-2">Ringkasan Singkat</label>
              <textarea 
                rows={2}
                value={formData.ringkasan}
                onChange={(e) => setFormData(prev => ({ ...prev, ringkasan: e.target.value }))}
                placeholder="Masukkan ringkasan singkat (deskripsi di kartu)"
                className="w-full px-3.5 py-2 bg-nura-muted border border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-xs text-nura-foreground font-semibold"
              />
            </div>

            {formData.tipe === 'artikel' ? (
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground mb-2">Isi Konten Artikel</label>
                <textarea 
                  rows={8}
                  required={formData.tipe === 'artikel'}
                  value={formData.konten}
                  onChange={(e) => setFormData(prev => ({ ...prev, konten: e.target.value }))}
                  placeholder="Ketik isi artikel secara lengkap di sini..."
                  className="w-full px-3.5 py-2.5 bg-nura-muted border border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-xs text-nura-foreground font-semibold leading-relaxed"
                />
              </div>
            ) : (
              /* DYNAMIC QUIZ EDITOR */
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground">Editor Soal Kuis</span>
                  <button 
                    type="button" 
                    onClick={addQuizQuestion}
                    className="px-3.5 py-1.5 bg-nura-accent hover:opacity-90 text-nura-blue text-[10px] font-black rounded-lg transition-all"
                  >
                    + Tambah Soal
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.quiz_data.map((q, qIdx) => (
                    <div key={qIdx} className="p-4 bg-nura-muted rounded-xl space-y-3 relative border border-nura-foreground/5">
                      <button 
                        type="button"
                        onClick={() => removeQuizQuestion(qIdx)}
                        className="absolute top-3 right-3 text-rose-500 hover:opacity-80 text-[10px] font-bold"
                      >
                        Hapus
                      </button>

                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold text-nura-muted-foreground uppercase">Soal #{qIdx + 1}</label>
                        <input 
                          type="text" 
                          required
                          value={q.question}
                          onChange={(e) => handleQuizQuestionChange(qIdx, 'question', e.target.value)}
                          placeholder="Pertanyaan kuis..."
                          className="w-full h-[40px] px-3 bg-white border border-nura-foreground/10 focus:border-nura-blue focus:outline-none rounded-lg text-xs font-semibold"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="space-y-1">
                            <label className="block text-[8px] font-bold text-nura-muted-foreground uppercase">Opsi {oIdx + 1}</label>
                            <input 
                              type="text" 
                              required
                              value={opt}
                              onChange={(e) => handleQuizOptionChange(qIdx, oIdx, e.target.value)}
                              placeholder={`Opsi jawaban ${oIdx + 1}...`}
                              className="w-full h-[40px] px-3 bg-white border border-nura-foreground/10 focus:border-nura-blue focus:outline-none rounded-lg text-xs font-semibold"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="space-y-1 w-max">
                        <label className="block text-[8px] font-bold text-nura-muted-foreground uppercase">Opsi Jawaban Benar</label>
                        <select
                          value={q.correct}
                          onChange={(e) => handleQuizQuestionChange(qIdx, 'correct', parseInt(e.target.value))}
                          className="h-[40px] px-3 bg-white border border-nura-foreground/10 focus:border-nura-blue focus:outline-none rounded-lg text-xs font-semibold"
                        >
                          <option value={0}>Opsi 1</option>
                          <option value={1}>Opsi 2</option>
                          <option value={2}>Opsi 3</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button 
                type="button"
                onClick={() => setShowAdminForm(false)}
                className="h-[44px] px-6 text-xs font-bold rounded-xl bg-nura-muted text-nura-muted-foreground hover:bg-slate-200/80 transition-all"
              >
                Batal
              </button>
              <button 
                type="submit"
                disabled={saving}
                className="h-[44px] px-8 text-xs font-bold rounded-xl bg-nura-blue text-white hover:opacity-90 active:scale-[0.98] transition-all shadow-md shadow-nura-blue/15"
              >
                {saving ? 'Menyimpan...' : 'Simpan Materi'}
              </button>
            </div>
          </form>
        </div>
      ) : selectedArticle ? (
        /* DETAIL ARTICLE VIEW */
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
              <span>Estimasi baca: {selectedArticle.durasi || '5 menit'}</span>
            </div>
          </div>
          
          <p className="text-xs text-nura-foreground/85 leading-relaxed whitespace-pre-wrap font-semibold font-sans pt-2">
            {selectedArticle.konten}
          </p>
        </div>
      ) : activeQuiz ? (
        /* ACTIVE QUIZ PLAY VIEW */
        <div className="bg-white border border-nura-foreground/10 rounded-2xl p-6 md:p-8 space-y-4 animate-fadeIn">
          <button 
            onClick={() => setActiveQuiz(null)} 
            className="h-[44px] px-6 text-xs font-bold rounded-2xl bg-nura-muted text-nura-muted-foreground hover:bg-slate-200/80 transition-all flex items-center gap-2 active:scale-[0.98]"
          >
            <ChevronLeft className="w-4 h-4" /> Kembali
          </button>
          
          <div className="border-b border-nura-muted pb-4 mt-2">
            <h3 className="text-lg font-extrabold text-nura-foreground">{activeQuiz.judul}</h3>
            <p className="text-xs text-nura-muted-foreground mt-1 font-semibold">Uji pemahaman Anda seputar nutrisi, anemia, dan pencegahan stunting secara mandiri.</p>
          </div>

          <div className="space-y-4">
            {(Array.isArray(activeQuiz.quiz_data) ? activeQuiz.quiz_data : (activeQuiz.quiz_data_decoded || JSON.parse(activeQuiz.quiz_data || '[]'))).map((q, idx) => (
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
              onClick={() => {
                const questions = Array.isArray(activeQuiz.quiz_data) 
                  ? activeQuiz.quiz_data 
                  : (activeQuiz.quiz_data_decoded || JSON.parse(activeQuiz.quiz_data || '[]'));
                submitQuiz(questions);
              }} 
              disabled={Object.keys(quizAnswers).length < (Array.isArray(activeQuiz.quiz_data) ? activeQuiz.quiz_data.length : (activeQuiz.quiz_data_decoded || JSON.parse(activeQuiz.quiz_data || '[]')).length)}
              className={`w-full h-[48px] text-xs font-bold rounded-2xl transition-all ${
                Object.keys(quizAnswers).length < (Array.isArray(activeQuiz.quiz_data) ? activeQuiz.quiz_data.length : (activeQuiz.quiz_data_decoded || JSON.parse(activeQuiz.quiz_data || '[]')).length)
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
        /* STANDARD OVERVIEW VIEW */
        <div className="space-y-6">
          {/* Header Description */}
          <div>
            <h2 className="text-2xl md:text-[28px] font-black text-nura-foreground tracking-tight">Edukasi & Literasi</h2>
            <p className="text-nura-muted-foreground text-xs font-semibold mt-1 font-sans">Pelajari materi kesehatan gizi dan mental anak yang telah dikurasi oleh tim ahli.</p>
          </div>

          {/* Tab Filter Chips */}
          <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-full w-max">
            {availableCategories.map(type => (
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
                  className="bg-white border border-nura-foreground/10 rounded-2xl p-5 hover:shadow-lg hover:border-nura-blue/20 transition-all flex flex-col justify-between relative group"
                >
                  {/* Admin Edit/Delete overlays */}
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex gap-1 bg-white/95 p-1 rounded-lg border border-nura-foreground/5 opacity-0 group-hover:opacity-100 transition-all shadow-sm select-none z-10">
                      <button 
                        onClick={() => handleOpenEditForm(a)}
                        className="p-1 text-nura-blue hover:bg-nura-accent rounded"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteArticle(a.id)}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Category Pill with Icon and Dot */}
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase border ${styles.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`}></span>
                        <span>{a.kategori || 'Materi'}</span>
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
                      <span>{a.durasi || '5 menit'}</span>
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
            {filterType === 'Semua' && articles.filter(a => a.tipe === 'kuis').map(a => (
              <div 
                key={a.id}
                className="bg-gradient-to-tr from-nura-blue to-nura-blue/90 text-white rounded-2xl p-5 flex flex-col justify-between shadow-lg shadow-nura-blue/15 hover:scale-[1.005] transition-all relative group"
              >
                {/* Admin overlays for quizzes */}
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex gap-1 bg-white/95 p-1 rounded-lg border border-nura-foreground/5 opacity-0 group-hover:opacity-100 transition-all shadow-sm select-none z-10">
                    <button 
                      onClick={() => handleOpenEditForm(a)}
                      className="p-1 text-nura-blue hover:bg-nura-accent rounded"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteArticle(a.id)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[9px] font-bold uppercase bg-white/20 text-white">
                      Evaluasi
                    </span>
                    <span className="text-xl">📝</span>
                  </div>
                  <h4 className="text-xs font-extrabold leading-snug">
                    {a.judul}
                  </h4>
                  <p className="text-[10px] text-blue-100 font-semibold leading-relaxed">
                    {a.ringkasan}
                  </p>
                </div>
                
                <button 
                  onClick={() => startQuiz(a)} 
                  className="mt-6 w-full h-[44px] text-xs font-bold bg-white text-nura-blue rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all"
                >
                  Mulai Kuis ➔
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
