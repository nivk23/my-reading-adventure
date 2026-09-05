import { useState, useEffect } from 'react';
import { stickerEngine } from '../lib/stickerEngine.js';

export function StickerBookPage() {
  const [earned, setEarned] = useState([]);
  const all = stickerEngine.getAllStickers();

  useEffect(() => { setEarned(stickerEngine.getEarned()); }, []);

  const earnedCount = earned.length;
  const totalCount = all.length;

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>📖</div>
        <div style={{ fontWeight: 900, fontSize: 22 }}>My Sticker Book</div>
        <div style={{ fontSize: 15, color: '#888', fontWeight: 700, marginTop: 4 }}>
          {earnedCount} / {totalCount} stickers collected!
        </div>
        <div style={{ background: '#f3f4f6', borderRadius: 999, height: 12, margin: '12px auto', maxWidth: 280 }}>
          <div style={{
            background: 'linear-gradient(90deg,#C77DFF,#FF6B6B)',
            borderRadius: 999, height: '100%',
            width: `${totalCount > 0 ? (earnedCount / totalCount) * 100 : 0}%`,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {all.map(sticker => {
          const hasIt = earned.includes(sticker.id);
          return (
            <div key={sticker.id} style={{
              background: hasIt ? 'white' : '#f9fafb',
              border: `3px solid ${hasIt ? '#C77DFF' : '#e5e7eb'}`,
              borderRadius: '1.25rem', padding: '16px 8px', textAlign: 'center',
              opacity: hasIt ? 1 : 0.5,
              transition: 'all 0.2s',
              boxShadow: hasIt ? '0 4px 12px rgba(199,125,255,0.2)' : 'none',
            }}>
              <div style={{ fontSize: hasIt ? 36 : 28, marginBottom: 6, filter: hasIt ? 'none' : 'grayscale(1)' }}>
                {hasIt ? sticker.emoji : '🔒'}
              </div>
              <div style={{ fontWeight: 900, fontSize: 12, color: hasIt ? '#2D2D2D' : '#aaa', lineHeight: 1.3 }}>
                {hasIt ? sticker.label : '???'}
              </div>
              {hasIt && (
                <div style={{ fontSize: 11, color: '#888', fontWeight: 700, marginTop: 4, lineHeight: 1.3 }}>
                  {sticker.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
