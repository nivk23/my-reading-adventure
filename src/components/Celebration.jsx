import { useEffect, useState } from 'react';

export function Celebration({ message = 'Amazing! 🌟', onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 1800);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  const stars = Array.from({ length: 12 }, (_, i) => ({
    left: `${10 + Math.random() * 80}%`,
    top: `${10 + Math.random() * 80}%`,
    delay: `${i * 0.1}s`,
    size: 24 + Math.random() * 24,
  }));

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(255,215,0,0.93)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      animation: 'fadeIn 0.2s ease',
    }}>
      {stars.map((s, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: s.left,
            top: s.top,
            fontSize: s.size,
            animationDelay: s.delay,
            animation: 'starPop 0.5s ease both',
          }}
        >⭐</span>
      ))}
      <div style={{
        fontSize: 48,
        fontWeight: 900,
        color: '#2D2D2D',
        textAlign: 'center',
        padding: '0 24px',
        animation: 'bounceIn 0.4s ease 0.2s both',
        position: 'relative',
        zIndex: 1,
      }}>
        {message}
      </div>
    </div>
  );
}
