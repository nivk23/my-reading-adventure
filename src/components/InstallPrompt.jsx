import { useState, useEffect } from 'react';

export function InstallPrompt() {
  const [prompt, setPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem('mra_install_dismissed') === '1'; } catch { return false; }
  });
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const standalone = window.navigator.standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches;
    setIsIOS(ios);
    setIsStandalone(standalone);

    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  function dismiss() {
    try { localStorage.setItem('mra_install_dismissed', '1'); } catch {}
    setDismissed(true);
    setPrompt(null);
  }

  async function install() {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setPrompt(null);
    dismiss();
  }

  // Don't show if: already installed, dismissed, or not eligible
  if (isStandalone || dismissed) return null;
  // On Android/Chrome: show native install prompt banner
  if (!prompt && !isIOS) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 80, left: 8, right: 8, zIndex: 50,
      background: 'white', borderRadius: '1.25rem',
      boxShadow: '0 8px 32px rgba(199,125,255,0.25)',
      border: '2px solid #C77DFF',
      padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: 12,
      animation: 'slideUp 0.3s ease',
      maxWidth: 600, margin: '0 auto',
    }}>
      <div style={{ fontSize: 36, flexShrink: 0 }}>📲</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 900, fontSize: 14, color: '#2D2D2D', marginBottom: 2 }}>
          Add to Home Screen
        </div>
        <div style={{ fontSize: 12, color: '#888', fontWeight: 700 }}>
          {isIOS
            ? "Tap Share → 'Add to Home Screen' for the full app"
            : 'Install for offline use & a better experience'}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        {!isIOS && (
          <button onClick={install} style={{
            padding: '8px 14px', background: '#C77DFF', color: 'white',
            border: 'none', borderRadius: '0.875rem', fontFamily: 'inherit',
            fontWeight: 900, fontSize: 13, cursor: 'pointer',
            boxShadow: '0 3px 0 #9333ea',
          }}>Install</button>
        )}
        <button onClick={dismiss} style={{
          padding: '8px 10px', background: '#f3f4f6', color: '#888',
          border: 'none', borderRadius: '0.875rem', fontFamily: 'inherit',
          fontWeight: 900, fontSize: 13, cursor: 'pointer',
        }}>✕</button>
      </div>
    </div>
  );
}
