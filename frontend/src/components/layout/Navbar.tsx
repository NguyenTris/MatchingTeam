import React from 'react';

export const Navbar: React.FC = () => {
  return (
    <nav style={{
      borderBottom: '1px solid var(--border-color)',
      padding: '1rem 0',
      background: 'rgba(10, 13, 20, 0.8)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            color: '#fff',
            fontSize: '1.1rem'
          }}>
            M
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.5px' }}>
            Matching<span style={{ color: 'var(--accent-cyan)' }}>Team</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a href="#teams" style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>Khám phá Đội</a>
          <a href="#matching" style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>Ghép Đội AI</a>
          <button style={{
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: '#fff',
            padding: '0.55rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            fontSize: '0.9rem',
            boxShadow: '0 4px 14px var(--primary-glow)',
            transition: 'transform var(--transition-fast)'
          }}>
            Đăng nhập
          </button>
        </div>
      </div>
    </nav>
  );
};
