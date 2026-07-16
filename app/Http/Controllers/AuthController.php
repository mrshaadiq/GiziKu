<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Mail\SendOtpMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Session;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    // ============================================
    // REGISTER FLOW
    // ============================================

    public function showRegister()
    {
        return view('auth.register');
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'phone' => 'required|string|max:20|unique:users,phone',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'verification_method' => 'required|string|in:email,whatsapp',
        ]);

        $otpCode = random_int(100000, 999999);

        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'phone' => $request->phone,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => 2, // regular user
            'email_verification_code' => $otpCode,
        ]);

        // Send Email
        try {
            Mail::to($user->email)->send(new SendOtpMail('verification', $otpCode));
        } catch (\Exception $e) {
            // Log mail failure but allow registration to succeed locally
            logger('Mail failed: ' . $e->getMessage());
        }

        // Store email in session for verify step
        session(['verify_email' => $user->email]);

        return redirect()->route('verify.show')->with('success', 'Pendaftaran berhasil! Silakan masukkan kode OTP yang telah dikirim ke email Anda.');
    }

    // ============================================
    // EMAIL VERIFICATION FLOW
    // ============================================

    public function showVerify()
    {
        if (!session()->has('verify_email')) {
            return redirect()->route('login.user')->with('error', 'Silakan daftar atau masuk terlebih dahulu.');
        }

        return view('auth.verify');
    }

    public function verify(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $email = session('verify_email');
        if (!$email) {
            return redirect()->route('login.user')->with('error', 'Sesi verifikasi telah kedaluwarsa.');
        }

        $user = User::where('email', $email)
                    ->where('email_verification_code', $request->code)
                    ->first();

        if ($user) {
            $user->email_verified_at = now();
            $user->email_verification_code = null;
            $user->save();

            // Log user in
            Auth::login($user);
            session()->forget('verify_email');

            return redirect()->route('user.dashboard')->with('success', 'Akun Anda berhasil diverifikasi!');
        }

        return back()->with('error', 'Kode verifikasi salah. Silakan coba lagi.')->withInput();
    }

    public function resendCode()
    {
        $email = session('verify_email');
        if (!$email) {
            return redirect()->route('login.user')->with('error', 'Sesi verifikasi telah kedaluwarsa.');
        }

        $user = User::where('email', $email)->first();
        if (!$user) {
            return redirect()->route('login.user')->with('error', 'Pengguna tidak ditemukan.');
        }

        $otpCode = random_int(100000, 999999);
        $user->email_verification_code = $otpCode;
        $user->save();

        try {
            Mail::to($user->email)->send(new SendOtpMail('verification', $otpCode));
        } catch (\Exception $e) {
            logger('Mail failed: ' . $e->getMessage());
        }

        return back()->with('success', 'Kode verifikasi baru telah dikirim ke email Anda.');
    }

    // ============================================
    // LOGIN USER FLOW
    // ============================================

    public function showLoginUser()
    {
        return view('auth.login-user');
    }

    public function loginUser(Request $request)
    {
        $request->validate([
            'login' => 'required|string',
            'password' => 'required|string',
        ]);

        // Support login by email or username
        $user = User::where('email', $request->login)
                    ->orWhere('username', $request->login)
                    ->first();

        if ($user && Hash::check($request->password, $user->password)) {
            // Check if email is verified
            if (is_null($user->email_verified_at)) {
                $otpCode = random_int(100000, 999999);
                $user->email_verification_code = $otpCode;
                $user->save();

                try {
                    Mail::to($user->email)->send(new SendOtpMail('verification', $otpCode));
                } catch (\Exception $e) {
                    logger('Mail failed: ' . $e->getMessage());
                }

                session(['verify_email' => $user->email]);
                return redirect()->route('verify.show')->with('error', 'Email Anda belum diverifikasi. Kode verifikasi baru telah dikirim.');
            }

            Auth::login($user);
            
            if ($user->isAdmin()) {
                return redirect()->route('admin.dashboard')->with('success', 'Selamat datang Administrator!');
            }

            return redirect()->route('user.dashboard')->with('success', 'Berhasil masuk ke Dashboard!');
        }

        return back()->withErrors(['login' => 'Kredensial yang Anda masukkan salah.'])->withInput();
    }

    // ============================================
    // LOGIN ADMIN FLOW
    // ============================================

    public function showLoginAdmin()
    {
        return view('auth.login-admin');
    }

    public function loginAdmin(Request $request)
    {
        $request->validate([
            'login' => 'required|string',
            'password' => 'required|string',
        ]);

        // Find user by email or username with Admin role
        $user = User::where(function($query) use ($request) {
                        $query->where('email', $request->login)
                              ->orWhere('username', $request->login);
                    })
                    ->where('role_id', 1) // Admin role
                    ->first();

        if ($user && Hash::check($request->password, $user->password)) {
            Auth::login($user);
            return redirect()->route('admin.dashboard')->with('success', 'Selamat datang Administrator!');
        }

        return back()->withErrors(['login' => 'Akses ditolak atau kredensial admin salah.'])->withInput();
    }

    // ============================================
    // FORGOT PASSWORD FLOW
    // ============================================

    public function showForgotPassword()
    {
        return view('auth.forgot-password');
    }

    public function sendResetCode(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'method' => 'required|string|in:email,whatsapp',
        ]);

        $user = User::where('phone', $request->phone)->first();

        if (!$user) {
            return back()->withErrors(['phone' => 'Nomor telepon tidak terdaftar.'])->withInput();
        }

        $resetCode = random_int(100000, 999999);
        $user->reset_code = $resetCode;
        $user->reset_code_expired_at = now()->addMinutes(10);
        $user->save();

        try {
            Mail::to($user->email)->send(new SendOtpMail('reset', $resetCode));
        } catch (\Exception $e) {
            logger('Mail failed: ' . $e->getMessage());
        }

        // Store reset user info in session
        session(['reset_user_email' => $user->email]);

        return redirect()->route('reset.verify.show')->with('success', 'Kode reset password telah dikirim ke email Anda.');
    }

    public function showResetVerify()
    {
        if (!session()->has('reset_user_email')) {
            return redirect()->route('forgot.password')->with('error', 'Masukkan nomor telepon terlebih dahulu.');
        }

        return view('auth.reset-verify');
    }

    public function verifyResetCode(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $email = session('reset_user_email');
        if (!$email) {
            return redirect()->route('forgot.password')->with('error', 'Sesi reset password telah kedaluwarsa.');
        }

        $user = User::where('email', $email)
                    ->where('reset_code', $request->code)
                    ->where('reset_code_expired_at', '>', now())
                    ->first();

        if ($user) {
            session(['reset_code_verified' => true]);
            return redirect()->route('reset.password.show')->with('success', 'Kode berhasil diverifikasi. Silakan buat password baru Anda.');
        }

        return back()->with('error', 'Kode reset salah atau sudah kedaluwarsa.')->withInput();
    }

    public function showResetPassword()
    {
        if (!session()->has('reset_code_verified') || !session()->has('reset_user_email')) {
            return redirect()->route('forgot.password')->with('error', 'Silakan verifikasi kode reset terlebih dahulu.');
        }

        return view('auth.reset-password');
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $email = session('reset_user_email');
        if (!$email) {
            return redirect()->route('forgot.password')->with('error', 'Sesi reset password telah kedaluwarsa.');
        }

        $user = User::where('email', $email)->first();
        if ($user) {
            $user->password = Hash::make($request->password);
            $user->reset_code = null;
            $user->reset_code_expired_at = null;
            $user->save();

            // Clear session variables
            session()->forget(['reset_user_email', 'reset_code_verified']);

            return redirect()->route('login.user')->with('success', 'Password Anda berhasil diperbarui. Silakan masuk.');
        }

        return redirect()->route('forgot.password')->with('error', 'Terjadi kesalahan. Silakan coba lagi.');
    }

    // ============================================
    // LOGOUT
    // ============================================

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home')->with('success', 'Berhasil keluar.');
    }

    // ============================================
    // GOOGLE OAUTH FLOW
    // ============================================

    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Exception $e) {
            return redirect()->route('login.user')->with('error', 'Gagal masuk menggunakan Google. Silakan coba lagi.');
        }

        // Search for user by google_id or email
        $user = User::where('google_id', $googleUser->getId())
                    ->orWhere('email', $googleUser->getEmail())
                    ->first();

        if ($user) {
            // If user has email but no google_id, link them
            if (is_null($user->google_id)) {
                $user->google_id = $googleUser->getId();
            }
            // Auto verify email since it comes from Google
            if (is_null($user->email_verified_at)) {
                $user->email_verified_at = now();
            }
            $user->save();
        } else {
            // Generate a random username that is unique
            $baseUsername = strtolower(explode('@', $googleUser->getEmail())[0]);
            $username = $baseUsername;
            $count = 1;
            while (User::where('username', $username)->exists()) {
                $username = $baseUsername . $count;
                $count++;
            }

            // Create a new user with Google details
            $user = User::create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'username' => $username,
                'google_id' => $googleUser->getId(),
                'email_verified_at' => now(),
                'role_id' => 2, // Regular user
                'password' => null, // Password is null for social login
            ]);
        }

        Auth::login($user);

        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard')->with('success', 'Selamat datang Administrator!');
        }

        return redirect()->route('user.dashboard')->with('success', 'Berhasil masuk dengan Google!');
    }
}
