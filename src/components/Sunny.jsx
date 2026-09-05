export function Sunny({ expression = 'happy', message = '', size = 80 }) {
  const faces = {
    happy: { eyes: '^ ^', mouth: '‿' },
    excited: { eyes: '◉ ◉', mouth: 'D' },
    thinking: { eyes: '◔ ◔', mouth: '~' },
    encouraging: { eyes: '^ ^', mouth: 'o' },
    celebrating: { eyes: '★ ★', mouth: 'D' },
  };
  const face = faces[expression] || faces.happy;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #FFD93D, #FF9A3C)',
        borderRadius: '50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 0 rgba(0,0,0,0.15)',
        fontSize: size * 0.18,
        fontWeight: 900,
        userSelect: 'none',
        flexShrink: 0,
      }}>
        <div style={{ letterSpacing: size * 0.06 }}>{face.eyes}</div>
        <div style={{ marginTop: 2, fontSize: size * 0.22 }}>{face.mouth}</div>
      </div>
      {message && (
        <div style={{
          background: 'white',
          borderRadius: '1.25rem',
          padding: '10px 16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
          fontSize: 14,
          fontWeight: 700,
          maxWidth: 240,
          textAlign: 'center',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            top: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderBottom: '8px solid white',
          }} />
          {message}
        </div>
      )}
    </div>
  );
}
