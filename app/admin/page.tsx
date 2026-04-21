'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/contexts/AdminContext';

export default function AdminPage() {
  const { isAdmin, openLogin } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (isAdmin) {
      // Already logged in — redirect to homepage in admin mode
      router.push('/');
    } else {
      // Open the login modal
      openLogin();
    }
  }, [isAdmin, openLogin, router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      paddingTop: 'calc(var(--nav-height) + 2rem)',
      background: 'var(--color-bg)',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.5rem',
          fontWeight: 500,
          marginBottom: '0.75rem',
        }}>
          Admin přístup
        </h1>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
          {isAdmin
            ? 'Přesměrovávám…'
            : 'Otevírám přihlašovací dialog…'}
        </p>
      </div>
    </div>
  );
}
