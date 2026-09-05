export function ParentHelp({ phoneme, onClose }) {
  if (!phoneme) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 100,
        }}
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
        maxHeight: '80vh',
        overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 900 }}>
            👨‍👩‍👧 Parent Help: /{phoneme.phoneme}/
          </div>
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
        <div style={{ background: '#FFF8F0', borderRadius: '1.25rem', padding: 16, marginBottom: 12 }}>
          <div style={{ fontWeight: 900, color: '#FF6B6B', marginBottom: 6 }}>👄 Mouth position</div>
          <div style={{ lineHeight: 1.6 }}>{phoneme.mouthCue}</div>
        </div>
        <div style={{ background: '#F0FDF4', borderRadius: '1.25rem', padding: 16, marginBottom: 12 }}>
          <div style={{ fontWeight: 900, color: '#16a34a', marginBottom: 6 }}>💬 Say to your child:</div>
          <div style={{ lineHeight: 1.6, fontStyle: 'italic' }}>"{phoneme.teachingTip}"</div>
        </div>
        <div style={{ background: '#EDE9FE', borderRadius: '1.25rem', padding: 16 }}>
          <div style={{ fontWeight: 900, color: '#7c3aed', marginBottom: 4 }}>Example word</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>{phoneme.exampleEmoji} {phoneme.exampleWord}</div>
        </div>
      </div>
    </>
  );
}
