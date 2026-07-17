import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { api } from './api';

// Page component imports
import HomePage from './components/HomePage';
import DashboardPage from './components/DashboardPage';
import LabScannerPage from './components/LabScannerPage';
import MentalScanPage from './components/MentalScanPage';
import {
  GeneticTreePage,
  GeoTriagePage,
  ReadinessScorePage,
  ReferralCardPage,
  CostSimulatorPage,
  CertificatePage,
  TrackerPage,
  ActionPlanPage,
  DonorNetworkPage,
  EpidemiologiPage,
  LiterasiPage
} from './components/AdditionalFeatures';

// ============================================
// AI CHATBOT WIDGET
// ============================================
function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Halo! Saya GiziKu AI. Ada yang bisa saya bantu terkait rhesus darah, thalasemia carrier, pencegahan stunting, atau kesehatan mental pranikah?' }
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
        <div className="w-80 md:w-96 h-[480px] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden animate-scaleIn">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">GiziKu Assistant AI</h4>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-xl text-xs max-w-[80%] leading-relaxed ${m.sender === 'user' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'bg-slate-900 border border-slate-850 text-slate-205'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-850 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-880 bg-slate-900/30 flex gap-2">
            <input 
              type="text" value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tanyakan silsilah, RhoGAM, dsb..." 
              className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-slate-800 focus:border-cyan-400 focus:outline-none rounded-lg text-white" 
            />
            <button onClick={handleSend} className="px-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs">Kirim</button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)} 
          className="w-14 h-14 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-full flex items-center justify-center text-2xl shadow-2xl hover:scale-105 transition-transform duration-200"
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
  const [userName] = useState(window.USER_NAME || 'Demo User');

  const MENU_ITEMS = [
    { id: 'home', label: 'Peta Risiko Indonesia', icon: '🗺️' },
    { id: 'dashboard', label: 'Ringkasan Dashboard', icon: '📊' },
    { id: 'mental', label: 'Skrining Visual Mental AI', icon: '🧠' },
    { id: 'literasi', label: 'Hub Literasi & Kuis', icon: '📖' },
    { id: 'lab-scan', label: 'AI Lab Sheet Scanner', icon: '🔬' },
    { id: 'genetic-tree', label: 'Kalkulator Rhesus', icon: '🌳' },
    { id: 'geo-triage', label: 'Triage Kerawanan', icon: '📍' },
    { id: 'readiness', label: 'Skor Kesiapan Nikah', icon: '⭐' },
    { id: 'referral', label: 'Kartu Rujukan Digital', icon: '🎫' },
    { id: 'cost', label: 'Simulator Biaya Skrining', icon: '💰' },
    { id: 'certificate', label: 'Sertifikat Layak Nikah', icon: '📜' },
    { id: 'tracker', label: 'Pemantauan Kasus 72-Jam', icon: '🕵️' },
    { id: 'action-plan', label: 'AI Action Plan 72-Jam', icon: '⚡' },
    { id: 'donors', label: 'Jejaring Donor Rhesus', icon: '🩸' },
    { id: 'epidemiologi', label: 'Analisis Epidemiologi', icon: '📈' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomePage />;
      case 'dashboard': return <DashboardPage />;
      case 'mental': return <MentalScanPage />;
      case 'literasi': return <LiterasiPage />;
      case 'lab-scan': return <LabScannerPage />;
      case 'genetic-tree': return <GeneticTreePage />;
      case 'geo-triage': return <GeoTriagePage />;
      case 'readiness': return <ReadinessScorePage />;
      case 'referral': return <ReferralCardPage />;
      case 'cost': return <CostSimulatorPage />;
      case 'certificate': return <CertificatePage />;
      case 'tracker': return <TrackerPage />;
      case 'action-plan': return <ActionPlanPage />;
      case 'donors': return <DonorNetworkPage />;
      case 'epidemiologi': return <EpidemiologiPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-900 flex flex-col justify-between hidden md:flex shrink-0">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Brand Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-900 bg-slate-950">
            <span className="text-lg font-black tracking-wider bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">GIZIKU SPA</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5 scrollbar-thin">
            {MENU_ITEMS.map(item => (
              <button 
                key={item.id} 
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all ${activeTab === item.id ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-900/30'}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-slate-900 bg-slate-900/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center font-bold text-slate-950">{userName.slice(0, 2).toUpperCase()}</div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">{userName}</div>
            <div className="text-[10px] text-cyan-400 font-extrabold tracking-wider uppercase mt-0.5">Demo Mode</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-900/10">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-900 flex items-center justify-between px-6 bg-slate-950">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Program Penurunan Stunting & Deteksi Rhesus Pranikah</span>
          </div>
          {/* Mobile Menu Toggle (Simplified) */}
          <div className="flex md:hidden items-center gap-2">
            <select 
              value={activeTab} 
              onChange={(e) => setActiveTab(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs font-bold text-white px-3 py-2 rounded-xl focus:outline-none"
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
