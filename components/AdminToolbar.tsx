'use client';

import { useState, useCallback } from 'react';
import { useAdmin } from '@/contexts/AdminContext';

function LoginModal() {
  const { isLoginOpen, closeLogin, login } = useAdmin();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const ok = login(password);
      if (!ok) {
        setError(true);
        setTimeout(() => setError(false), 2000);
      }
      setPassword('');
    },
    [password, login]
  );

  if (!isLoginOpen) return null;

  return (
    <div className="cms-login-backdrop" onClick={closeLogin}>
      <div className="cms-login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="cms-login-close" onClick={closeLogin}>✕</button>
        <div className="cms-login-icon">🔐</div>
        <h3 className="cms-login-title">Admin přístup</h3>
        <p className="cms-login-desc">Zadejte heslo pro vstup do editačního režimu</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className={`cms-login-input ${error ? 'cms-login-input-error' : ''}`}
            placeholder="Heslo…"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          {error && <p className="cms-login-error">❌ Nesprávné heslo</p>}
          <button type="submit" className="cms-login-submit">
            Přihlásit se →
          </button>
        </form>
      </div>
    </div>
  );
}

export function AdminToolbar() {
  const { isAdmin, openLogin, logout, hasDirtyDrafts, publishAll, isPublishing } =
    useAdmin();

  return (
    <>
      {/* Login modal */}
      <LoginModal />

      {/* Floating toggle button – always visible at bottom-right */}
      <button
        className="cms-admin-toggle"
        onClick={isAdmin ? logout : openLogin}
        title="Admin mód (Ctrl+Shift+E)"
        aria-label="Toggle admin mode"
      >
        {isAdmin ? '🔓' : '🔒'}
      </button>

      {/* Toolbar – shown only in admin mode */}
      {isAdmin && (
        <div className="cms-toolbar">
          <div className="cms-toolbar-inner">
            <div className="cms-toolbar-status">
              <span className="cms-toolbar-dot" />
              <span>
                Admin mód{' '}
                {hasDirtyDrafts && (
                  <span className="cms-toolbar-badge">
                    neuložené změny
                  </span>
                )}
              </span>
            </div>
            <div className="cms-toolbar-actions">
              <button
                className="cms-btn-publish"
                onClick={publishAll}
                disabled={!hasDirtyDrafts || isPublishing}
              >
                {isPublishing ? '⏳ Publikuji…' : '🚀 Publikovat změny'}
              </button>
              <button className="cms-btn-close" onClick={logout}>
                ✕ Odhlásit se
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
