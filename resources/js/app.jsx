import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { api } from './api';

// Page component imports
import HomePage from './components/HomePage';
import ScreeningPage from './components/ScreeningPage';
import EdukasiPage from './components/EdukasiPage';
import FaskesPage from './components/FaskesPage';
import RiwayatPage from './components/RiwayatPage';

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
        <div className="w-80 md:w-96 h-[480px] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden animate-scaleIn text-slate-800">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 border-b border-blue-500 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <h4 className="text-xs font-black uppercase tracking-wider">NURA Assistant AI</h4>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-blue-100 hover:text-white text-xs">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 scrollbar-thin">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-xl text-xs max-w-[80%] leading-relaxed ${m.sender === 'user' ? 'bg-blue-600 text-white font-bold' : 'bg-white border border-slate-200 text-slate-700'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-xl bg-white border border-slate-200 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-150 bg-white flex gap-2">
            <input 
              type="text" value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tanyakan penanganan anemia, stunting, dsb..." 
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 focus:border-blue-500 focus:outline-none rounded-lg text-slate-800 font-semibold" 
            />
            <button onClick={handleSend} className="px-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-all">Kirim</button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)} 
          className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-2xl shadow-2xl hover:scale-105 transition-all duration-200"
        >
          💬
        </button>
      )}
    </div>
  );
}

// ============================================
// MAIN APP COMPONENT
// ============================================
function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api('/tracker').then(setHistory);
  }, []);

  const handleSaveHistory = (newRecord) => {
    setHistory(prev => [newRecord, ...prev]);
  };

  const MENU_ITEMS = [
    { id: 'home', label: 'Beranda', icon: '⌂' },
    { id: 'screening', label: 'Screening Kesehatan', icon: '📸' },
    { id: 'education', label: 'Edukasi & Literasi', icon: '📖' },
    { id: 'facilities', label: 'Faskes Terdekat', icon: '🏥' },
    { id: 'history', label: 'Riwayat Pemeriksaan', icon: '📋' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home': 
        return <HomePage history={history} onTabChange={setActiveTab} />;
      case 'screening': 
        return <ScreeningPage onSaveHistory={handleSaveHistory} />;
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
    <div className="flex h-screen bg-slate-50 text-slate-700 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex shrink-0">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Brand Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100 bg-white">
            <span className="text-lg font-black tracking-wider text-slate-800">
              NURA <span className="text-[10px] uppercase tracking-widest font-extrabold text-blue-600 ml-1.5">Kesehatan Anak</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5 scrollbar-thin">
            {MENU_ITEMS.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button 
                  key={item.id} 
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all ${isActive ? 'bg-blue-50 text-blue-600 font-extrabold shadow-inner' : 'text-slate-400 hover:text-slate-750 hover:bg-slate-50'}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Offline Badge & Version Footer */}
        <div className="p-4 border-t border-slate-100 space-y-3.5 bg-slate-50/50">
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-emerald-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <div className="text-[9px] font-black uppercase tracking-wider leading-none">
              Mode Offline Aktif
              <span className="block text-[8px] font-semibold text-emerald-600 mt-0.5 lowercase">AI berjalan di perangkat</span>
            </div>
          </div>
          <div className="text-[9px] text-slate-400 font-bold text-center">NURA v1.0 · Juli 2026</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Program Penurunan Stunting & Deteksi Anemia Anak</span>
          </div>
          {/* Mobile Menu Dropdown */}
          <div className="flex md:hidden items-center gap-2">
            <select 
              value={activeTab} 
              onChange={(e) => setActiveTab(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 px-3 py-2 rounded-xl focus:outline-none"
            >
              {MENU_ITEMS.map(i => (
                <option key={i.id} value={i.id}>{i.icon} {i.label}</option>
              ))}
            </select>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {renderContent()}
        </main>
      </div>

      {/* App Chatbot Assistant */}
      <ChatbotWidget />
    </div>
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
