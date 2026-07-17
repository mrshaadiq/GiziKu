import React, { useState } from 'react';
import { api, csrfToken } from '../api';
import { User, Lock, Mail, Phone, KeyRound, ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';

export default function LoginRegisterPage({ initialMode = 'login', onLoginSuccess, onCancel }) {
  const [mode, setMode] = useState(initialMode); // login, register, verify
  
  // Login Form
  const [loginData, setLoginData] = useState({ login: '', password: '' });
  
  // Register Form
  const [registerData, setRegisterData] = useState({
    name: '',
    username: '',
    phone: '',
    email: '',
    password: ''
  });
  
  // Verification Form
  const [otpCode, setOtpCode] = useState('');
  const [verificationEmail, setVerificationEmail] = useState('');

  // States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const clearMessages = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data.success) {
        onLoginSuccess(data.user);
      } else if (!data.success && data.verify) {
        // Needs OTP Verification
        setVerificationEmail(data.email);
        setSuccessMsg(data.message);
        setMode('verify');
      } else {
        setErrorMsg(data.message || 'Login gagal.');
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setErrorMsg('Terjadi kesalahan koneksi saat login.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify(registerData)
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data.success) {
        setVerificationEmail(data.email || registerData.email);
        setSuccessMsg(data.message);
        setMode('verify');
      } else {
        setErrorMsg(data.message || 'Pendaftaran gagal.');
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setErrorMsg('Terjadi kesalahan koneksi saat registrasi.');
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify({
          code: otpCode,
          email: verificationEmail
        })
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data.success) {
        onLoginSuccess(data.user);
      } else {
        setErrorMsg(data.message || 'Kode OTP salah.');
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setErrorMsg('Terjadi kesalahan koneksi saat memverifikasi OTP.');
    }
  };

  const handleResendOtp = async () => {
    clearMessages();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify({ email: verificationEmail })
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data.success) {
        setSuccessMsg(data.message);
      } else {
        setErrorMsg(data.message || 'Gagal mengirim ulang OTP.');
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setErrorMsg('Kesalahan koneksi saat mengirim ulang OTP.');
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white border border-nura-foreground/10 rounded-[32px] p-8 shadow-xl font-sans text-nura-foreground select-none relative overflow-hidden my-6">
      
      {/* Back button */}
      <button 
        onClick={onCancel}
        className="absolute top-6 left-6 p-2 rounded-xl bg-nura-muted text-nura-muted-foreground hover:text-nura-foreground hover:bg-slate-200 transition-all select-none"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      <div className="text-center mt-6 mb-8 space-y-2">
        <h2 className="text-xl font-extrabold tracking-tight">
          {mode === 'login' && 'Masuk GiziKu'}
          {mode === 'register' && 'Daftar Akun Baru'}
          {mode === 'verify' && 'Verifikasi Kode OTP'}
        </h2>
        <p className="text-xs text-nura-muted-foreground font-semibold">
          {mode === 'login' && 'Masukkan username/email dan kata sandi Anda.'}
          {mode === 'register' && 'Lengkapi form di bawah untuk membuat akun.'}
          {mode === 'verify' && `Masukkan 6 digit kode OTP yang dikirim ke email ${verificationEmail}`}
        </p>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl flex gap-3 text-xs font-semibold leading-relaxed mb-6">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl flex gap-3 text-xs font-semibold leading-relaxed mb-6">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" strokeWidth={2.5} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* LOGIN MODE */}
      {mode === 'login' && (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground">Username / Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-nura-muted-foreground pointer-events-none">
                <User className="w-4 h-4" />
              </span>
              <input 
                type="text"
                required
                value={loginData.login}
                onChange={(e) => setLoginData(prev => ({ ...prev, login: e.target.value }))}
                placeholder="Masukkan username atau email"
                className="w-full h-[52px] pl-10.5 pr-4 py-3 text-xs bg-nura-muted border-2 border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-nura-foreground font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground">Kata Sandi</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-nura-muted-foreground pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input 
                type="password"
                required
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Masukkan kata sandi"
                className="w-full h-[52px] pl-10.5 pr-4 py-3 text-xs bg-nura-muted border-2 border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-nura-foreground font-semibold"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-[48px] bg-nura-blue text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-6 shadow-md shadow-nura-blue/15 active:scale-[0.98]"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Masuk Sistem'}
          </button>

          <p className="text-center text-xs text-nura-muted-foreground font-bold mt-6 select-none">
            Belum memiliki akun?{' '}
            <button type="button" onClick={() => { setMode('register'); clearMessages(); }} className="text-nura-blue hover:underline">
              Daftar Sekarang
            </button>
          </p>
        </form>
      )}

      {/* REGISTER MODE */}
      {mode === 'register' && (
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground">Nama Lengkap</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-nura-muted-foreground pointer-events-none">
                <User className="w-4 h-4" />
              </span>
              <input 
                type="text"
                required
                value={registerData.name}
                onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Masukkan nama lengkap Anda"
                className="w-full h-[52px] pl-10.5 pr-4 py-3 text-xs bg-nura-muted border-2 border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-nura-foreground font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground">Username</label>
              <input 
                type="text"
                required
                value={registerData.username}
                onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="username"
                className="w-full h-[52px] px-4 py-3 text-xs bg-nura-muted border-2 border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-nura-foreground font-semibold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground">No. Telepon</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-nura-muted-foreground pointer-events-none">
                  <Phone className="w-3.5 h-3.5" />
                </span>
                <input 
                  type="text"
                  required
                  value={registerData.phone}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="08..."
                  className="w-full h-[52px] pl-8.5 pr-4 py-3 text-xs bg-nura-muted border-2 border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-nura-foreground font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground">Alamat Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-nura-muted-foreground pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <input 
                type="email"
                required
                value={registerData.email}
                onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="nama@email.com"
                className="w-full h-[52px] pl-10.5 pr-4 py-3 text-xs bg-nura-muted border-2 border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-nura-foreground font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground">Kata Sandi</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-nura-muted-foreground pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input 
                type="password"
                required
                value={registerData.password}
                onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Kata sandi minimal 8 karakter"
                className="w-full h-[52px] pl-10.5 pr-4 py-3 text-xs bg-nura-muted border-2 border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-xl text-nura-foreground font-semibold"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-[48px] bg-nura-blue text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-6 shadow-md shadow-nura-blue/15 active:scale-[0.98]"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Buat Akun'}
          </button>

          <p className="text-center text-xs text-nura-muted-foreground font-bold mt-6 select-none">
            Sudah memiliki akun?{' '}
            <button type="button" onClick={() => { setMode('login'); clearMessages(); }} className="text-nura-blue hover:underline">
              Masuk
            </button>
          </p>
        </form>
      )}

      {/* VERIFY CODE MODE */}
      {mode === 'verify' && (
        <form onSubmit={handleVerifySubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-nura-muted-foreground text-center">Kode OTP 6 Digit</label>
            <div className="relative max-w-[240px] mx-auto">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-nura-muted-foreground pointer-events-none">
                <KeyRound className="w-4 h-4" />
              </span>
              <input 
                type="text"
                maxLength={6}
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full h-[56px] text-center pl-10.5 pr-4 py-3 text-lg font-black tracking-widest bg-nura-muted border-2 border-transparent focus:border-nura-blue focus:bg-white focus:outline-none rounded-2xl text-nura-foreground font-mono"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button 
              type="submit" 
              disabled={loading || otpCode.length !== 6}
              className="w-full h-[48px] bg-nura-blue disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Verifikasi Akun'}
            </button>

            <button 
              type="button"
              onClick={handleResendOtp}
              disabled={loading}
              className="w-full py-3 border border-nura-foreground/10 hover:bg-nura-muted text-[10px] font-bold text-nura-muted-foreground rounded-xl transition-all"
            >
              Kirim Ulang Kode OTP
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
