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
  CheckCircle2
} from 'lucide-react';

// Page component imports (Desktop views)
import HomePage from './components/HomePage';
import ScreeningPage from './components/ScreeningPage';
import EdukasiPage from './components/EdukasiPage';
import FaskesPage from './components/FaskesPage';
import RiwayatPage from './components/RiwayatPage';
import MobileApp from './components/MobileApp';

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

// MobileApp extracted to ./components/MobileApp.jsx

// ============================================
// WEB DESKTOP REPRESENTATION (Design System §15)
// ============================================
function DesktopApp({ history, addHistory }) {
  const [activeTab, setActiveTab] = useState('home');

  const MENU_ITEMS = [
    { id: 'home', label: 'Beranda', icon: <LayoutDashboard className="w-5 h-5 shrink-0" /> },
    { id: 'screening', label: 'Screening Kesehatan', icon: <Camera className="w-5 h-5 shrink-0" /> },
    { id: 'education', label: 'Edukasi & Literasi', icon: <BookOpen className="w-5 h-5 shrink-0" /> },
    { id: 'facilities', label: 'Faskes Terdekat', icon: <MapPin className="w-5 h-5 shrink-0" /> },
    { id: 'history', label: 'Riwayat Pemeriksaan', icon: <Clock className="w-5 h-5 shrink-0" /> }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home': 
        return <HomePage history={history} onTabChange={setActiveTab} />;
      case 'screening': 
        return <ScreeningPage onSaveHistory={addHistory} onTabChange={setActiveTab} />;
      case 'education': 
        return <EdukasiPage />;
      case 'facilities': 
        return <FaskesPage />;
      case 'history': 
        return <RiwayatPage history={history} />;
      default: 
        return <HomePage history={history} onTabChange={setActiveTab} />;
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
                  onClick={() => setActiveTab(item.id)}
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
            <span className="text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground">Program Penyelamatan & Pencegahan Stunting Nasional</span>
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
// ROOT RENDER DISPATCHER
// ============================================
function App() {
  const isDesktop = useIsDesktop();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api('/tracker').then(setHistory);
  }, []);

  const handleSaveHistory = (newRecord) => {
    setHistory(prev => [newRecord, ...prev]);
  };

  return isDesktop
    ? <DesktopApp history={history} addHistory={handleSaveHistory} />
    : <MobileApp  history={history} addHistory={handleSaveHistory} />;
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
