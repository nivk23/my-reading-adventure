import { useState } from 'react';
import { storage } from '../lib/storage.js';

export function SettingsPanel({ onClose }) {
  const [fontSize, setFontSize] = useState(() => storage.get('settings_fontSize') || 'medium');
  const [spacing, setSpacing] = useState(() => storage.get('settings_spacing') || 'normal');
  const [reducedMotion, setReducedMotion] = useState(() => storage.get('settings_reducedMotion') || false);
  const [childName, setChildName] = useState(() => storage.get('child_name') || '');

  function save(key, val) {
    storage.set('settings_' + key, val);
    if (key === 'fontSize') {
      setFontSize(val);
      document.documentElement.style.setProperty(
        '--font-size-scale',
        { small: 0.9, medium: 1, large: 1.15, xlarge: 1.3 }[val]
      );
    }
    if (key === 'spacing') {
      setSpacing(val);
      document.documentElement.style.setProperty(
        '--letter-spacing',
        { tight: 0, normal: '0.02em', wide: '0.06em', wider: '0.1em' }[val]
      );
    }
    if (key === 'reducedMotion') {
      setReducedMotion(val);
    }
  }

  function saveChildName(name) {
    setChildName(name);
    storage.set('child_name', name.trim());
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100 }}
      />
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'white',
        borderRadius: '1.75rem 1.75rem 0 0',
        padding: '28px 24px',
        zIndex: 101,
        animation: 'slideUp 0.35s ease',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 900 }}>⚙️ Settings</div>
          <button
            onClick={onClose}
            style={{
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '50%',
              width: 36,
              height: 36,
              fontSize: 18,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >✕</button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 900, marginBottom: 8 }}>Child&apos;s Name</div>
          <input
            type="text"
            value={childName}
            onChange={e => saveChildName(e.target.value)}
            placeholder="e.g. Mia"
            maxLength={20}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '3px solid #C77DFF',
              borderRadius: '1rem',
              fontFamily: 'inherit',
              fontWeight: 700,
              fontSize: 16,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 900, marginBottom: 8 }}>Text Size</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['small', 'medium', 'large', 'xlarge'].map(s => (
              <button
                key={s}
                onClick={() => save('fontSize', s)}
                style={{
                  flex: 1,
                  padding: '10px 4px',
                  border: `3px solid ${fontSize === s ? '#C77DFF' : '#e5e7eb'}`,
                  borderRadius: '1rem',
                  fontFamily: 'inherit',
                  fontWeight: 900,
                  fontSize: { small: 12, medium: 14, large: 16, xlarge: 18 }[s],
                  background: fontSize === s ? '#EDE9FE' : 'white',
                  cursor: 'pointer',
                }}
              >{s}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 900, marginBottom: 8 }}>Letter Spacing</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['tight', 'normal', 'wide', 'wider'].map(s => (
              <button
                key={s}
                onClick={() => save('spacing', s)}
                style={{
                  flex: 1,
                  padding: '10px 4px',
                  border: `3px solid ${spacing === s ? '#5BC8F5' : '#e5e7eb'}`,
                  borderRadius: '1rem',
                  fontFamily: 'inherit',
                  fontWeight: 700,
                  fontSize: 13,
                  background: spacing === s ? '#E0F7FF' : 'white',
                  cursor: 'pointer',
                }}
              >{s}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontWeight: 900, flex: 1 }}>Reduced Motion</div>
          <button
            onClick={() => save('reducedMotion', !reducedMotion)}
            style={{
              width: 52,
              height: 28,
              borderRadius: 14,
              background: reducedMotion ? '#6BCFA5' : '#e5e7eb',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
              position: 'relative',
              flexShrink: 0,
            }}
          >
            <div style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: 'white',
              position: 'absolute',
              top: 4,
              left: reducedMotion ? 28 : 4,
              transition: 'left 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }} />
          </button>
        </div>
      </div>
    </>
  );
}
