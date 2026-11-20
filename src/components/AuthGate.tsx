import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, Moon, Sun } from 'lucide-react';
import { RegisteredUser } from '../types/index.ts';
import { EDITORIAL_EASE } from './ScrollChoreography.tsx';

interface AuthGateProps {
  onAuthenticated: (user: RegisteredUser, token: string) => void;
  themeMode?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const AuthGate: React.FC<AuthGateProps> = ({
  onAuthenticated,
  themeMode = 'light',
  onToggleTheme,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const switchMode = (nextMode: 'login' | 'register') => {
    setMode(nextMode);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    if (mode === 'register' && trimmedName.length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      return;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'register' && password !== confirmPassword) {
      setError('Passwords do not match. Please verify both fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = mode === 'register' ? '/api/user-auth/register' : '/api/user-auth/login';
      const payload =
        mode === 'register'
          ? { name: trimmedName, email: trimmedEmail, password }
          : { email: trimmedEmail, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.data?.token || !data.data?.user) {
        setError(data.error || 'Authentication failed. Please check your credentials.');
        setIsSubmitting(false);
        return;
      }

      localStorage.setItem('maggie_visitor_token', data.data.token);
      onAuthenticated(data.data.user, data.data.token);
    } catch {
      setError('Unable to reach the server. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-10 bg-[#1c0408] overflow-hidden">
      {/* Velvet Celebration Backdrop with Scrim */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#2b040a] via-[#1c0408] to-[#111111]">
        <img
          src="/src/assets/images/maggie_hero_celebration_1794012861156.jpg"
          alt="Candlelit Velvet Celebration Backdrop"
          referrerPolicy="no-referrer"
          decoding="async"
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1c0408]/92 via-[#2b040a]/85 to-[#111111]/95 pointer-events-none" />
      </div>

      {/* Centered Editorial Keepsake Card */}
      <motion.main
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: EDITORIAL_EASE }}
        className="relative z-10 w-full max-w-md bg-[#FAF6F0] dark:bg-[#1c0b10] border-2 border-[#D4AF37]/60 rounded-2xl shadow-2xl p-6 sm:p-8 text-[#1c1c18] dark:text-[#f5efe6] transition-colors duration-300"
      >
        {onToggleTheme && (
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="absolute top-4 right-4 w-9 h-9 rounded-full border border-[#dfbfbe]/80 dark:border-[#D4AF37]/40 bg-white/80 dark:bg-[#240e14] text-[#584140] dark:text-[#F3E5AB] hover:text-[#871321] dark:hover:text-white transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#871321]"
          >
            {themeMode === 'dark' ? (
              <Sun className="w-4 h-4 text-[#D4AF37]" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        )}

        {/* Editorial Header */}
        <div className="text-center pb-6 border-b border-[#dfbfbe]/70 dark:border-[#3d1c24]">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-[#871321] border border-[#D4AF37] flex items-center justify-center shadow-md">
            <span className="font-bodoni text-xl font-bold text-[#F9F6F0]" aria-hidden="true">
              M
            </span>
          </div>
          <p className="font-mono-split text-[11px] uppercase tracking-[0.2em] text-[#871321] dark:text-[#e67381] font-bold">
            Maggie's Archive · Chapter 24
          </p>
          <h1 className="font-stylish text-4xl sm:text-[2.75rem] font-normal tracking-wide leading-[1.18] text-[#1c1c18] dark:text-[#f5efe6] mt-1.5 text-balance">
            {mode === 'login' ? 'Private Guest Entrance' : 'Join the Celebration'}
          </h1>
          <p className="font-playfair italic text-sm text-[#584140] dark:text-[#d4c3be] mt-2 leading-relaxed">
            {mode === 'login'
              ? 'Sign in with your email and password to enter the birthday keepsake.'
              : 'Create a guest account to unlock the Vogue edition, scrapbook, and wishes.'}
          </p>
        </div>

        {/* Segmented Mode Switcher */}
        <div
          role="tablist"
          aria-label="Authentication mode"
          className="grid grid-cols-2 gap-1 p-1 mt-6 bg-[#EFE8DC] dark:bg-[#120609] rounded-lg border border-[#dfbfbe]/70 dark:border-[#3d1c24]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            onClick={() => switchMode('login')}
            className={`min-h-[40px] px-3 py-2 rounded-md font-mono-split text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#871321] ${
              mode === 'login'
                ? 'bg-[#FAF6F0] dark:bg-[#2a1118] text-[#871321] dark:text-[#F3E5AB] shadow-sm border border-[#D4AF37]/40'
                : 'text-[#584140] dark:text-[#a9928d] hover:text-[#1c1c18] dark:hover:text-[#f5efe6]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'register'}
            onClick={() => switchMode('register')}
            className={`min-h-[40px] px-3 py-2 rounded-md font-mono-split text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#871321] ${
              mode === 'register'
                ? 'bg-[#FAF6F0] dark:bg-[#2a1118] text-[#871321] dark:text-[#F3E5AB] shadow-sm border border-[#D4AF37]/40'
                : 'text-[#584140] dark:text-[#a9928d] hover:text-[#1c1c18] dark:hover:text-[#f5efe6]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          {mode === 'register' && (
            <div>
              <label
                htmlFor="auth-name"
                className="block font-mono-split text-xs font-bold uppercase tracking-wider text-[#422b2a] dark:text-[#e3d4cf] mb-1.5"
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  className="w-4 h-4 text-[#8c7170] dark:text-[#a9928d] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="auth-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Elena Rostova"
                  className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-white dark:bg-[#120609] border border-[#d6c7bc] dark:border-[#4a222c] rounded-lg text-sm text-[#1c1c18] dark:text-[#f5efe6] placeholder:text-[#9c8b85] dark:placeholder:text-[#8c7170] focus:outline-none focus:ring-2 focus:ring-[#871321] focus:border-[#871321] transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="auth-email"
              className="block font-mono-split text-xs font-bold uppercase tracking-wider text-[#422b2a] dark:text-[#e3d4cf] mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="w-4 h-4 text-[#8c7170] dark:text-[#a9928d] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="auth-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="guest@example.com"
                className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-white dark:bg-[#120609] border border-[#d6c7bc] dark:border-[#4a222c] rounded-lg text-sm text-[#1c1c18] dark:text-[#f5efe6] placeholder:text-[#9c8b85] dark:placeholder:text-[#8c7170] focus:outline-none focus:ring-2 focus:ring-[#871321] focus:border-[#871321] transition-colors"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="auth-password"
              className="block font-mono-split text-xs font-bold uppercase tracking-wider text-[#422b2a] dark:text-[#e3d4cf] mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className="w-4 h-4 text-[#8c7170] dark:text-[#a9928d] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={mode === 'login' ? 'Enter your password' : 'Minimum 6 characters'}
                className="w-full min-h-[44px] pl-10 pr-12 py-2.5 bg-white dark:bg-[#120609] border border-[#d6c7bc] dark:border-[#4a222c] rounded-lg text-sm text-[#1c1c18] dark:text-[#f5efe6] placeholder:text-[#9c8b85] dark:placeholder:text-[#8c7170] focus:outline-none focus:ring-2 focus:ring-[#871321] focus:border-[#871321] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-md text-[#584140] dark:text-[#d4c3be] hover:text-[#1c1c18] dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#871321]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label
                htmlFor="auth-confirm-password"
                className="block font-mono-split text-xs font-bold uppercase tracking-wider text-[#422b2a] dark:text-[#e3d4cf] mb-1.5"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="w-4 h-4 text-[#8c7170] dark:text-[#a9928d] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="auth-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full min-h-[44px] pl-10 pr-12 py-2.5 bg-white dark:bg-[#120609] border border-[#d6c7bc] dark:border-[#4a222c] rounded-lg text-sm text-[#1c1c18] dark:text-[#f5efe6] placeholder:text-[#9c8b85] dark:placeholder:text-[#8c7170] focus:outline-none focus:ring-2 focus:ring-[#871321] focus:border-[#871321] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-md text-[#584140] dark:text-[#d4c3be] hover:text-[#1c1c18] dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#871321]"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                role="alert"
                className="flex items-start gap-2.5 p-3 rounded-lg bg-[#871321]/10 dark:bg-[#871321]/30 border border-[#871321]/30 dark:border-[#e67381]/40 text-[#720d19] dark:text-rose-200 text-xs font-medium"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#871321] dark:text-[#e67381]" aria-hidden="true" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[46px] px-6 py-3 bg-[#871321] hover:bg-[#630011] disabled:opacity-60 text-white rounded-lg font-mono-split text-xs font-bold uppercase tracking-[0.18em] transition-all shadow-lg border border-[#D4AF37]/60 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#871321] focus-visible:ring-offset-2"
          >
            <span>
              {isSubmitting
                ? mode === 'login'
                  ? 'Signing In...'
                  : 'Creating Account...'
                : mode === 'login'
                  ? 'Enter Celebration'
                  : 'Create Account & Enter'}
            </span>
            {!isSubmitting && <ArrowRight className="w-4 h-4 text-[#F3E5AB]" aria-hidden="true" />}
          </button>
        </form>

        {/* Footer Note */}
        <div className="mt-6 pt-5 border-t border-[#dfbfbe]/70 dark:border-[#3d1c24] text-center space-y-2">
          <p className="text-xs text-[#584140] dark:text-[#d4c3be]">
            {mode === 'login' ? 'First time visiting?' : 'Already registered?'}{' '}
            <button
              type="button"
              onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
              className="font-semibold text-[#871321] dark:text-[#F3E5AB] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#871321] rounded"
            >
              {mode === 'login' ? 'Create an account' : 'Sign in instead'}
            </button>
          </p>
          <p className="font-mono-split text-[11px] text-[#786361] dark:text-[#a9928d]">
            Protected guest registry · MongoDB credential storage
          </p>
        </div>
      </motion.main>
    </div>
  );
};
