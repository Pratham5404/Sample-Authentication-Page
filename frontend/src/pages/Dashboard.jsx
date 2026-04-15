import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const { user, logout, updateProfile, changePassword } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [profileForm, setProfileForm] = useState({
    fullName: '',
    phone: '',
    company: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || '',
        phone: user.phone || '',
        company: user.company || '',
      });
    }
  }, [user]);

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleProfileSave = async () => {
    if (!profileForm.fullName || profileForm.fullName.trim().length < 2) {
      showMsg('error', 'Full name must be at least 2 characters');
      return;
    }
    setLoading(true);
    const result = await updateProfile(profileForm);
    setLoading(false);
    if (result.success) {
      showMsg('success', result.message);
      setEditMode(false);
    } else {
      showMsg('error', result.message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      showMsg('error', 'All password fields are required');
      return;
    }
    if (newPassword.length < 6) {
      showMsg('error', 'New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      showMsg('error', 'New passwords do not match');
      return;
    }

    setLoading(true);
    const result = await changePassword(passwordForm);
    setLoading(false);
    if (result.success) {
      showMsg('success', result.message);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordChange(false);
    } else {
      showMsg('error', result.message);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const memberDays = user?.createdAt
    ? Math.max(1, Math.floor((Date.now() - new Date(user.createdAt)) / 86400000))
    : 0;

  return (
    <div className="dashboard-page">
      {/* Animated background */}
      <div className="dash-bg">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />
        <div className="bg-orb orb-3" />
        <div className="bg-grid" />
      </div>

      {/* Top Navigation */}
      <nav className="dash-nav">
        <div className="nav-brand">
          <div className="nav-icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2L37 11V29L20 38L3 29V11L20 2Z" stroke="url(#navGrad)" strokeWidth="2" fill="none" />
              <path d="M20 8L31 14V26L20 32L9 26V14L20 8Z" stroke="url(#navGrad)" strokeWidth="1.5" fill="none" opacity="0.6" />
              <defs>
                <linearGradient id="navGrad" x1="3" y1="2" x2="37" y2="38" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00ffff" />
                  <stop offset="1" stopColor="#ff006e" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="nav-title">DekNek<span>3D</span></span>
        </div>
        <div className="nav-actions">
          <div className="nav-user-chip">
            <div className="user-avatar-small">{getInitials(user?.fullName)}</div>
            <span className="nav-user-name">{user?.fullName}</span>
          </div>
          <button id="logout-btn" className="nav-logout" onClick={handleLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </nav>

      {/* Toast message */}
      {message.text && (
        <div className={`dash-toast ${message.type}`}>
          {message.type === 'success' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          )}
          {message.text}
        </div>
      )}

      <main className="dash-main">
        {/* Welcome Header */}
        <section className="dash-welcome">
          <h1>
            Welcome back, <span className="highlight">{user?.fullName?.split(' ')[0]}</span>
          </h1>
          <p>Manage your DekNek3D account and profile settings</p>
        </section>

        {/* Stats Row */}
        <section className="dash-stats">
          <div className="stat-card">
            <div className="stat-icon member">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            </div>
            <div className="stat-info">
              <span className="stat-value">{memberDays}</span>
              <span className="stat-label">Days as Member</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon login-time">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            </div>
            <div className="stat-info">
              <span className="stat-value small">{formatTime(user?.lastLogin)}</span>
              <span className="stat-label">Last Login</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon role">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <div className="stat-info">
              <span className="stat-value capitalize">{user?.role || 'User'}</span>
              <span className="stat-label">Account Role</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon joined">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
            </div>
            <div className="stat-info">
              <span className="stat-value small">{formatDate(user?.createdAt)}</span>
              <span className="stat-label">Member Since</span>
            </div>
          </div>
        </section>

        {/* Profile Card */}
        <section className="dash-content">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                <span>{getInitials(user?.fullName)}</span>
                <div className="avatar-ring" />
              </div>
              <div className="profile-meta">
                <h2>{user?.fullName}</h2>
                <p className="profile-email">{user?.email}</p>
                <span className={`badge ${user?.isVerified ? 'verified' : 'unverified'}`}>
                  {user?.isVerified ? '✓ Verified' : '○ Unverified'}
                </span>
              </div>
              <div className="profile-actions">
                {!editMode ? (
                  <button id="edit-profile-btn" className="btn-outline" onClick={() => setEditMode(true)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    Edit Profile
                  </button>
                ) : (
                  <div className="edit-btns">
                    <button
                      id="save-profile-btn"
                      className="btn-primary"
                      onClick={handleProfileSave}
                      disabled={loading}
                    >
                      {loading ? <span className="spinner-small" /> : null}
                      Save
                    </button>
                    <button className="btn-ghost" onClick={() => { setEditMode(false); setProfileForm({ fullName: user?.fullName || '', phone: user?.phone || '', company: user?.company || '' }); }}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-row">
                <label>Full Name</label>
                {editMode ? (
                  <input
                    id="edit-fullname"
                    type="text"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm((p) => ({ ...p, fullName: e.target.value }))}
                    disabled={loading}
                  />
                ) : (
                  <span>{user?.fullName || '—'}</span>
                )}
              </div>
              <div className="detail-row">
                <label>Email Address</label>
                <span className="no-edit">{user?.email}</span>
              </div>
              <div className="detail-row">
                <label>Phone</label>
                {editMode ? (
                  <input
                    id="edit-phone"
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="Enter phone number"
                    disabled={loading}
                  />
                ) : (
                  <span>{user?.phone || '—'}</span>
                )}
              </div>
              <div className="detail-row">
                <label>Company</label>
                {editMode ? (
                  <input
                    id="edit-company"
                    type="text"
                    value={profileForm.company}
                    onChange={(e) => setProfileForm((p) => ({ ...p, company: e.target.value }))}
                    placeholder="Enter company name"
                    disabled={loading}
                  />
                ) : (
                  <span>{user?.company || '—'}</span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="actions-grid">
              <button
                id="change-password-btn"
                className="action-card"
                onClick={() => setShowPasswordChange((v) => !v)}
              >
                <div className="action-icon pwd-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                </div>
                <span>Change Password</span>
              </button>
              <button className="action-card" onClick={() => setEditMode(true)}>
                <div className="action-icon edit-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <span>Edit Profile</span>
              </button>
              <div className="action-card disabled-card">
                <div className="action-icon project-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" /></svg>
                </div>
                <span>My Projects</span>
                <span className="coming-soon">Coming Soon</span>
              </div>
              <div className="action-card disabled-card">
                <div className="action-icon settings-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
                </div>
                <span>Settings</span>
                <span className="coming-soon">Coming Soon</span>
              </div>
            </div>
          </div>

          {/* Password Change Section */}
          {showPasswordChange && (
            <div className="password-section">
              <h3>Change Password</h3>
              <form onSubmit={handlePasswordChange} className="password-form">
                <div className="form-group">
                  <label htmlFor="current-pwd">Current Password</label>
                  <input
                    id="current-pwd"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new-pwd">New Password</label>
                  <input
                    id="new-pwd"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                    placeholder="Enter new password (6+ chars)"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirm-new-pwd">Confirm New Password</label>
                  <input
                    id="confirm-new-pwd"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                    disabled={loading}
                  />
                </div>
                <div className="pwd-actions">
                  <button id="submit-password-btn" type="submit" className="btn-primary" disabled={loading}>
                    {loading ? <span className="spinner-small" /> : null}
                    Update Password
                  </button>
                  <button type="button" className="btn-ghost" onClick={() => { setShowPasswordChange(false); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="dash-footer">
        <p>&copy; {new Date().getFullYear()} DekNek3D. All rights reserved.</p>
      </footer>
    </div>
  );
}
