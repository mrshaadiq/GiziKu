<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\AdminMiddleware;

// Main landing page (named home)
Route::get('/', function () {
    return view('home.index');
})->name('home');

// Login redirect (required by Laravel's auth middleware)
Route::get('/login', function () {
    return redirect()->route('login.user');
})->name('login');

// ============================================
// AUTH ROUTES (UNIFIED SYSTEM)
// ============================================

Route::middleware('guest')->group(function () {
    // Register
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);

    // Logins
    Route::get('/login/admin', [AuthController::class, 'showLoginAdmin'])->name('login.admin');
    Route::post('/login/admin', [AuthController::class, 'loginAdmin']);

    Route::get('/login/user', [AuthController::class, 'showLoginUser'])->name('login.user');
    Route::post('/login/user', [AuthController::class, 'loginUser']);

    // Forgot / Reset Password
    Route::get('/forgot-password', [AuthController::class, 'showForgotPassword'])->name('forgot.password');
    Route::post('/forgot-password', [AuthController::class, 'sendResetCode']);
    Route::get('/reset/verify', [AuthController::class, 'showResetVerify'])->name('reset.verify.show');
    Route::post('/reset/verify', [AuthController::class, 'verifyResetCode'])->name('reset.verify');
    Route::get('/reset/password', [AuthController::class, 'showResetPassword'])->name('reset.password.show');
    Route::post('/reset/password', [AuthController::class, 'resetPassword'])->name('reset.password');
});

// Verification (requires email to be in session, accessible for unverified logged-out users in the process)
Route::get('/verify', [AuthController::class, 'showVerify'])->name('verify.show');
Route::post('/verify', [AuthController::class, 'verify'])->name('verify');
Route::post('/verify/resend', [AuthController::class, 'resendCode'])->name('verify.resend');

// Logout
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// ============================================
// PROTECTED DASHBOARDS
// ============================================

Route::middleware('auth')->group(function () {
    // User dashboard
    Route::get('/user/dashboard', function () {
        return view('user.dashboard');
    })->name('user.dashboard');
});

Route::middleware(['auth', AdminMiddleware::class])->group(function () {
    // Admin dashboard
    Route::get('/admin/dashboard', function () {
        return view('admin.dashboard');
    })->name('admin.dashboard');
});
