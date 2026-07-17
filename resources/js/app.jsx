import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { api } from './api';

// Lucide icons as per Design System §8
import { 
  LayoutDashboard, 
  Camera, 
  BookOpen, 
  MapPin, 
  Clock, 
  WifiOff, 
  Cpu, 
  ChevronLeft, 
  Baby, 
  Scale, 
  Activity, 
  Phone, 
  Info,
  CheckCircle2,
  Utensils,
  Settings,
  Sparkles,
  Brain
} from 'lucide-react';

// Page component imports (Desktop views)
import HomePage from './components/HomePage';
import ScreeningPage from './components/ScreeningPage';
import EdukasiPage from './components/EdukasiPage';
import FaskesPage from './components/FaskesPage';
import RiwayatPage from './components/RiwayatPage';
import MobileApp from './components/MobileApp';
import FoodAiPage from './components/FoodAiPage';
import MentalScanPage from './components/MentalScanPage';
import LoginRegisterPage from './components/LoginRegisterPage';

// ============================================
// PLATFORM DETECTION HOOK (Design System §13)
// ============================================
function useIsDesktop() {
  const [is, setIs] = useState(() => window.innerWidth >= 1024);
  useEffect(() => {
    const h = () => setIs(window.innerWidth >= 1024);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return is;
}

// ============================================
// NURA AI CHATBOT WIDGET
// ============================================
function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Halo! Saya NURA Assistant AI. Ada yang bisa saya bantu terkait rhesus, stunting anak, anemia balita, imunisasi, atau MPASI?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const body = {
      conversation: [...messages, userMsg].map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }))
    };

    api('/chat', { method: 'POST', body: JSON.stringify(body) }).then(res => {
      setMessages(prev => [...prev, { sender: 'bot', text: res.output }]);
      setLoading(false);
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 md:w-96 h-[480px] bg-white border border-nura-foreground/15 rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden animate-scaleIn text-nura-foreground font-sans">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-nura-blue to-nura-blue/90 border-b border-nura-blue/20 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-nura-teal animate-pulse"></span>
              <h4 className="text-xs font-bold uppercase tracking-wider">NURA Assistant AI</h4>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-blue-150 hover:text-white text-xs">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-nura-muted scrollbar-thin">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-xl text-xs max-w-[80%] leading-relaxed ${m.sender === 'user' ? 'bg-nura-blue text-white font-bold' : 'bg-white border border-nura-foreground/10 text-nura-foreground/90'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-xl bg-white border border-nura-foreground/10 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-nura-blue rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-nura-blue rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-nura-blue rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-nura-muted bg-white flex gap-2">
            <input 
              type="text" value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tanyakan penanganan anemia..." 
              className="flex-1 h-[40px] px-3 text-xs bg-nura-muted border border-nura-foreground/10 focus:border-nura-blue focus:bg-white focus:outline-none rounded-lg text-nura-foreground font-semibold" 
            />
            <button onClick={handleSend} className="px-4 bg-nura-blue hover:opacity-90 text-white font-bold rounded-lg text-xs transition-all">Kirim</button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)} 
          className="w-14 h-14 bg-gradient-to-tr from-nura-blue to-nura-blue/90 rounded-full flex items-center justify-center text-2xl shadow-2xl hover:scale-105 transition-all duration-200"
        >
          💬
        </button>
      )}
    </div>
  );
}

// ============================================
// WEB DESKTOP REPRESENTATION (Design System §15)
// ============================================
function DesktopApp({ user, onLogout, onLoginSuccess, history, addHistory, onOpenSettings }) {
  const [activeTab, setActiveTab] = useState(() => window.INITIAL_TAB || 'home');
  const [targetTab, setTargetTab] = useState(null);

  const MENU_ITEMS = [
    { id: 'home', label: 'Beranda', icon: <LayoutDashboard className="w-5 h-5 shrink-0" /> },
    { id: 'screening', label: 'Screening Kesehatan', icon: <Camera className="w-5 h-5 shrink-0" /> },
    { id: 'mental_scan', label: 'Skrining Mental AI', icon: <Brain className="w-5 h-5 shrink-0" /> },
    { id: 'food_ai', label: 'Rekomendasi Makanan AI', icon: <Utensils className="w-5 h-5 shrink-0" /> },
    { id: 'education', label: 'Edukasi & Literasi', icon: <BookOpen className="w-5 h-5 shrink-0" /> },
    { id: 'facilities', label: 'Faskes Terdekat', icon: <MapPin className="w-5 h-5 shrink-0" /> },
    { id: 'history', label: 'Riwayat Pemeriksaan', icon: <Clock className="w-5 h-5 shrink-0" /> }
  ];

  if (user && user.role_id === 1) {
    MENU_ITEMS.push({ id: 'admin_import', label: 'Import Excel (Stunting)', icon: <Settings className="w-5 h-5 shrink-0" /> });
  }

  const handleTabChange = (tabId) => {
    if (tabId === 'admin_import') {
      window.location.href = '/admin/dashboard';
      return;
    }
    const publicTabs = ['home', 'education', 'facilities'];
    if (!publicTabs.includes(tabId) && !user) {
      setTargetTab(tabId);
      setActiveTab('auth');
    } else {
      setActiveTab(tabId);
    }
  };

  const handleLoginSuccess = (userData) => {
    onLoginSuccess(userData);
    if (targetTab) {
      setActiveTab(targetTab);
      setTargetTab(null);
    } else {
      setActiveTab('home');
    }
  };

  const renderContent = () => {
    if (activeTab === 'auth') {
      return (
        <div className="max-w-md mx-auto py-8">
          <AuthPage onLoginSuccess={handleLoginSuccess} />
        </div>
      );
    }

    switch (activeTab) {
      case 'home': 
        return <HomePage history={history} onTabChange={handleTabChange} />;
      case 'screening': 
        return <ScreeningPage onSaveHistory={addHistory} onTabChange={setActiveTab} />;
      case 'mental_scan':
        return <MentalScanPage />;
      case 'food_ai':
        return <FoodAiPage history={history} />;
      case 'education': 
        return <EdukasiPage user={user} />;
      case 'facilities': 
        return <FaskesPage />;
      case 'history': 
        return <RiwayatPage history={history} />;
      default: 
        return <HomePage history={history} onTabChange={handleTabChange} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f0f4f8] text-nura-foreground overflow-hidden font-sans">
      {/* Sidebar fixed 260px left (Design System §15.2) */}
      <aside className="w-[260px] bg-white border-r-[1.5px] border-nura-foreground/8 flex flex-col justify-between shrink-0">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Brand Logo */}
          <div className="h-16 flex items-center gap-3 px-6 border-b border-nura-foreground/5 bg-white">
            <img src="/assets/images/logo.png" className="w-8 h-8 object-contain rounded-lg" alt="NURA Logo" />
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-nura-foreground leading-tight">NURA</span>
              <span className="text-[9px] uppercase tracking-wider font-bold text-nura-blue">Kesehatan Anak</span>
            </div>
          </div>

          {/* Navigation Links (Design System §15.3) */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5 scrollbar-thin">
            {MENU_ITEMS.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button 
                  key={item.id} 
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-xs font-bold rounded-xl transition-all ${
                    isActive 
                      ? 'bg-nura-accent text-nura-blue shadow-inner' 
                      : 'text-nura-muted-foreground hover:text-nura-foreground hover:bg-nura-muted'
                  }`}
                  onClick={() => handleTabChange(item.id)}
                >
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Offline Status Card & Version Footer */}
        <div className="p-4 border-t border-nura-foreground/5 space-y-3.5 bg-nura-muted/40">
          <div className="p-3 bg-[#e8f5f4] rounded-xl flex items-center gap-2.5 text-[#2d6b66] border border-nura-teal/5">
            <WifiOff className="w-4 h-4 text-nura-teal shrink-0" />
            <div className="text-[9px] font-bold uppercase tracking-wider leading-none">
              Mode Offline Aktif
              <span className="block text-[8px] font-semibold text-[#2d6b66]/80 mt-1 lowercase">AI berjalan di perangkat</span>
            </div>
          </div>
          <div className="text-[10px] text-nura-muted-foreground font-bold text-center">NURA v1.1 · Juli 2026</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#f0f4f8]">
        {/* Top Page Header */}
        <header className="h-16 border-b border-nura-foreground/8 flex items-center justify-between px-6 bg-white shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground font-semibold">Program Penyelamatan & Pencegahan Stunting Nasional</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onOpenSettings}
              className="w-10 h-10 rounded-xl bg-nura-muted hover:bg-slate-200/80 flex items-center justify-center text-nura-muted-foreground hover:text-nura-foreground transition-all"
              title="Pengaturan API Key"
            >
              <Settings className="w-5 h-5" />
            </button>
            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-100">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-black text-nura-foreground leading-none">{user.name}</span>
                  <span className="text-[9px] font-bold text-nura-muted-foreground uppercase tracking-wider mt-0.5">{user.role_name || 'Pengguna'}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="px-3.5 py-2 text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100/60 rounded-xl transition-all"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setActiveTab('auth')}
                className="px-4.5 py-2 text-xs font-bold text-white bg-nura-blue hover:opacity-90 rounded-xl transition-all shadow-md shadow-nura-blue/15"
              >
                Masuk
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Content Container (Design System §7.2) */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6 max-w-6xl mx-auto w-full">
          {renderContent()}
        </main>
      </div>

      {/* App Chatbot Assistant */}
      <ChatbotWidget />
    </div>
  );
}

// ============================================
// SETTINGS MODAL (API KEY SETTINGS)
// ============================================
function SettingsModal({ isOpen, onClose }) {
  const [key, setKey] = useState('');

  useEffect(() => {
    if (isOpen) {
      setKey(localStorage.getItem('gn_deepseek_key') || '');
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('gn_deepseek_key', key.trim());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn text-nura-foreground font-sans">
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-[28px] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-nura-muted pb-3">
          <h3 className="text-sm font-black text-nura-foreground flex items-center gap-2">
            ⚙️ Pengaturan API Key AI
          </h3>
          <button onClick={onClose} className="text-nura-muted-foreground hover:text-nura-foreground text-xs font-bold">✕</button>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground">
              DeepSeek API Key
            </label>
            <input 
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Masukkan DeepSeek API Key (sk-...)"
              className="w-full h-[48px] px-3.5 py-2.5 text-xs bg-nura-muted border border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-nura-foreground font-semibold"
            />
            <p className="text-[9px] text-nura-muted-foreground leading-relaxed font-semibold">
              Key disimpan secara lokal di browser (`gn_deepseek_key`). Jika dikosongkan, sistem akan otomatis menggunakan API Key Server (Gemini/Groq) atau mode rekomendasi offline.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button 
            onClick={onClose}
            className="px-4.5 py-2 text-xs font-bold rounded-xl bg-nura-muted text-nura-muted-foreground hover:bg-slate-200/80 transition-all"
          >
            Batal
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 text-xs font-bold rounded-xl bg-nura-blue text-white hover:opacity-90 transition-all shadow-md shadow-nura-blue/15"
          >
            Simpan Key
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ROOT RENDER DISPATCHER
// ============================================
function App() {
  const isDesktop = useIsDesktop();
  const [user, setUser] = useState(() => window.USER || null);
  const [history, setHistory] = useState([]);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    fetch('/api/tracker')
      .then(res => res.json())
      .then(data => {
        setHistory(data);
      })
      .catch(err => {
        console.error(err);
      });
  }, [user]);

  const handleSaveHistory = (newRecord) => {
    fetch('/api/tracker', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      },
      body: JSON.stringify(newRecord)
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.success) {
          fetch('/api/tracker')
            .then(res => res.json())
            .then(setHistory);
        } else {
          setHistory(prev => [newRecord, ...prev]);
        }
      })
      .catch(() => {
        setHistory(prev => [newRecord, ...prev]);
      });
  };

  const handleLogout = () => {
    fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      }
    })
      .then(res => res.json())
      .then(() => {
        setUser(null);
        window.location.reload();
      })
      .catch(() => {
        setUser(null);
        window.location.reload();
      });
  };

  return (
    <>
      {isDesktop
        ? <DesktopApp user={user} onLogout={handleLogout} onLoginSuccess={setUser} history={history} addHistory={handleSaveHistory} onOpenSettings={() => setShowSettings(true)} />
        : <MobileApp  user={user} onLogout={handleLogout} onLoginSuccess={setUser} history={history} addHistory={handleSaveHistory} onOpenSettings={() => setShowSettings(true)} />}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}

// Render React mounting root
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
