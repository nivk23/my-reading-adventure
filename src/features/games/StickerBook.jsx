import { useState, useMemo } from 'react';
import { masteryEngine, STATUS } from '../../lib/masteryEngine.js';
import { PHONEMES } from '../../data/phonemes.js';
import { storage } from '../../lib/storage.js';
import { haptic } from '../../lib/tts.js';

const STICKER_DEFS = [
  { id: 'first_phoneme', emoji: '🔤', label: 'First Sound!', desc: 'Mastered your first phoneme' },
  { id: 'five_phonemes', emoji: '🌟', label: 'Sound Star', desc: 'Mastered 5 phonemes' },
  { id: 'ten_phonemes', emoji: '🏆', label: 'Champion', desc: 'Mastered 10 phonemes' },
  { id: 'streak_3', emoji: '🔥', label: 'On Fire!', desc: '3-day learning streak' },
  { id: 'streak_7', emoji: '🚀', label: 'Rocket Reader', desc: '7-day learning streak' },
  { id: 'first_story', emoji: '📖', label: 'Story Time', desc: 'Completed your first story' },
  { id: 'blending', emoji: '🧩', label: 'Blender', desc: 'Mastered blending words' },
  { id: 'sight_words', emoji: '👁️', label: 'Sight Master', desc: 'Mastered 5 sight words' },
  { id: 'perfect_game', emoji: '💫', label: 'Perfect!', desc: 'Got a perfect score in a game' },
  { id: 'explorer', emoji: '🗺️', label: 'Explorer', desc: 'Tried all 3 mini-games' },
];

function countMastered(prefix) {
  let n = 0;
  try {
    Object.keys(localStorage)
      .filter(k => k.startsWith(`mra_${prefix}_`))
      .forEach(k => {
        try {
          const v = JSON.parse(localStorage.getItem(k));
          if (v?.status === STATUS.MASTERED) n++;
        } catch {}
      });
  } catch {}
  return n;
}

function computeEarned() {
  const stats = masteryEngine.getStats();
  const streak = storage.get('streak_days');
  const streakCount = streak?.count || 0;
  const gamesPlayed = storage.get('games_played') || {};
  const storiesMastered = countMastered('story');
  const blendsMastered = countMastered('blend');
  const sightMastered = countMastered('sight');

  const earned = new Set();
  if (stats.mastered >= 1) earned.add('first_phoneme');
  if (stats.mastered >= 5) earned.add('five_phonemes');
  if (stats.mastered >= 10) earned.add('ten_phonemes');
  if (streakCount >= 3) earned.add('streak_3');
  if (streakCount >= 7) earned.add('streak_7');
  if (storiesMastered >= 1) earned.add('first_story');
  if (blendsMastered >= 3) earned.add('blending');
  if (sightMastered >= 5) earned.add('sight_words');
  if (Object.keys(gamesPlayed).length >= 3) earned.add('explorer');
  if (storage.get('perfect_game')) earned.add('perfect_game');
  return earned;
}

export function StickerBook({ onClose }) {
  const earned = useMemo(() => computeEarned(), []);
  const [tapped, setTapped] = useState(null);

  function handleTap(id) {
    if (!earned.has(id)) return;
    setTapped(id);
    haptic(30);
    setTimeout(() => setTapped(null), 600);
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontWeight: 900, fontSize: 22 }}>🌟 My Sticker Book</div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: '#f3f4f6', border: 'none', borderRadius: '1rem',
              padding: '8px 14px', fontFamily: 'inherit', fontWeight: 900,
              cursor: 'pointer', fontSize: 14,
            }}
          >✕ Close</button>
        )}
      </div>

      <div style={{
        background: '#FFF8F0', borderRadius: '1.25rem', padding: 14, marginBottom: 20,
        border: '2px solid #FFD93D', textAlign: 'center',
      }}>
        <div style={{ fontWeight: 900, fontSize: 18, color: '#FF9A3C' }}>
          {earned.size} / {STICKER_DEFS.length} stickers collected!
        </div>
        <div style={{ fontSize: 13, color: '#888', fontWeight: 700, marginTop: 4 }}>
          Keep learning to earn more! ⭐
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {STICKER_DEFS.map(s => {
          const isEarned = earned.has(s.id);
          const isTapped = tapped === s.id;
          return (
            <button
              key={s.id}
              onClick={() => handleTap(s.id)}
              style={{
                background: isEarned ? (isTapped ? '#FFD93D' : 'white') : '#f9fafb',
                border: `3px solid ${isEarned ? '#FFD93D' : '#e5e7eb'}`,
                borderRadius: '1.25rem',
                padding: '16px 12px',
                textAlign: 'center',
                fontFamily: 'inherit',
                cursor: isEarned ? 'pointer' : 'default',
                opacity: isEarned ? 1 : 0.45,
                transform: isTapped ? 'scale(1.06)' : 'scale(1)',
                transition: 'transform 0.15s',
              }}
            >
              <div style={{ fontSize: isEarned ? 40 : 36, marginBottom: 6, filter: isEarned ? 'none' : 'grayscale(1)' }}>
                {isEarned ? s.emoji : '🔒'}
              </div>
              <div style={{ fontWeight: 900, fontSize: 13, color: isEarned ? '#2D2D2D' : '#aaa' }}>
                {isEarned ? s.label : '???'}
              </div>
              <div style={{ fontSize: 11, color: isEarned ? '#888' : '#ccc', fontWeight: 700, marginTop: 3 }}>
                {isEarned ? s.desc : 'Keep learning to unlock'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
