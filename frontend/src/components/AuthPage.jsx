import { useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import ThreeBackground from './ThreeBackground';
import '../styles/Auth.css';

export default function AuthPage() {
  const { login, register, error, clearError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Password visibility
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [showSignupPwd, setShowSignupPwd] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setFormError('');
    setSuccessMsg('');
    clearError();
  };

  const handleLoginSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setFormError('');
      setSuccessMsg('');

      if (!loginForm.email || !loginForm.password) {
        setFormError('Please fill in all fields');
        return;
      }

      setLoading(true);
      const result = await login({
        email: loginForm.email,
        password: loginForm.password,
      });
      setLoading(false);

      if (!result.success) {
        setFormError(result.message);
      }
    },
    [loginForm, login]
  );

  const handleSignupSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setFormError('');
      setSuccessMsg('');

      const { fullName, email, password, confirmPassword } = signupForm;

      if (!fullName || !email || !password || !confirmPassword) {
        setFormError('Please fill in all fields');
        return;
      }
      if (fullName.trim().length < 2) {
        setFormError('Full name must be at least 2 characters');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setFormError('Please enter a valid email address');
        return;
      }
      if (password.length < 6) {
        setFormError('Password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) {
        setFormError('Passwords do not match');
        return;
      }

      setLoading(true);
      const result = await register({ fullName, email, password, confirmPassword });
      setLoading(false);

      if (!result.success) {
        setFormError(result.message);
      }
    },
    [signupForm, register]
  );

  return (
    <div className="auth-page">
      <ThreeBackground />

      <div className="auth-container">
        {/* Brand header */}
        <div className="auth-brand">
          <div className="brand-icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2L37 11V29L20 38L3 29V11L20 2Z" stroke="url(#brandGrad)" strokeWidth="2" fill="none" />
              <path d="M20 8L31 14V26L20 32L9 26V14L20 8Z" stroke="url(#brandGrad)" strokeWidth="1.5" fill="none" opacity="0.6" />
              <path d="M20 14L25 17V23L20 26L15 23V17L20 14Z" fill="url(#brandGrad)" opacity="0.4" />
              <defs>
                <linearGradient id="brandGrad" x1="3" y1="2" x2="37" y2="38" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00ffff" />
                  <stop offset="1" stopColor="#ff006e" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="brand-name">DekNek<span>3D</span></h1>
          <p className="brand-tagline">3D Animation & Model Generator</p>
        </div>

        {/* Glass card */}
        <div className="auth-card">
          {/* Toggle tabs */}
          <div className="auth-tabs">
            <button
              id="login-tab"
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => toggleMode()}
              type="button"
            >
              Login
            </button>
            <button
              id="signup-tab"
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => toggleMode()}
              type="button"
            >
              Sign Up
            </button>
            <div className={`tab-slider ${isLogin ? 'left' : 'right'}`} />
          </div>

          {/* Error / Success messages */}
          {(formError || error) && (
            <div className="auth-message error">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 4v5M8 11v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {formError || error}
            </div>
          )}
          {successMsg && (
            <div className="auth-message success">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {successMsg}
            </div>
          )}

          {/* Forms container with slide */}
          <div className="auth-forms-wrapper">
            <div className={`auth-forms-slider ${isLogin ? 'show-login' : 'show-signup'}`}>
              {/* LOGIN FORM */}
              <form className="auth-form login-form" onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label htmlFor="login-email">Email Address</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M22 4L12 13 2 4" />
                    </svg>
                    <input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                      autoComplete="email"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="login-password">Password</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    <input
                      id="login-password"
                      type={showLoginPwd ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                      autoComplete="current-password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="pwd-toggle"
                      onClick={() => setShowLoginPwd((v) => !v)}
                      tabIndex={-1}
                      aria-label="Toggle password visibility"
                    >
                      {showLoginPwd ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  id="login-submit"
                  type="submit"
                  className="auth-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="btn-loader">
                      <span className="spinner" />
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* SIGNUP FORM */}
              <form className="auth-form signup-form" onSubmit={handleSignupSubmit}>
                <div className="form-group">
                  <label htmlFor="signup-name">Full Name</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={signupForm.fullName}
                      onChange={(e) => setSignupForm((p) => ({ ...p, fullName: e.target.value }))}
                      autoComplete="name"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="signup-email">Email Address</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M22 4L12 13 2 4" />
                    </svg>
                    <input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm((p) => ({ ...p, email: e.target.value }))}
                      autoComplete="email"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="signup-password">Password</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    <input
                      id="signup-password"
                      type={showSignupPwd ? 'text' : 'password'}
                      placeholder="Create a password (6+ chars)"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm((p) => ({ ...p, password: e.target.value }))}
                      autoComplete="new-password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="pwd-toggle"
                      onClick={() => setShowSignupPwd((v) => !v)}
                      tabIndex={-1}
                      aria-label="Toggle password visibility"
                    >
                      {showSignupPwd ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="signup-confirm">Confirm Password</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                      <circle cx="12" cy="16" r="1" />
                    </svg>
                    <input
                      id="signup-confirm"
                      type={showSignupConfirm ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                      autoComplete="new-password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="pwd-toggle"
                      onClick={() => setShowSignupConfirm((v) => !v)}
                      tabIndex={-1}
                      aria-label="Toggle password visibility"
                    >
                      {showSignupConfirm ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  id="signup-submit"
                  type="submit"
                  className="auth-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="btn-loader">
                      <span className="spinner" />
                      Creating account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Footer toggle */}
          <p className="auth-footer">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" className="auth-toggle-link" onClick={toggleMode}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
