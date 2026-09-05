import { curriculumEngine } from '../lib/curriculumEngine.js';
import { masteryEngine, STATUS } from '../lib/masteryEngine.js';

const GAMES = [
  { key: 'soundHunt', emoji: '🔍', title: 'Sound Hunt', desc: 'Find words that start with a sound' },
  { key: 'wordTrain', emoji: '🚂', title: 'Word Train', desc: 'Tap letters to build words' },
  { key: 'feedSunny', emoji: '🍽️', title: 'Feed Sunny', desc: 'Feed Sunny the right words' },
  { key: 'segmenting', emoji: '🔊', title: 'Sound Boxes', desc: 'Tap each sound in a word' },
];

export function PracticePage({ onStartActivity }) {
  const words = curriculumEngine.getAvailableWords();
  const sightWords = curriculumEngine.getAvailableSightWords();

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 4 }}>🏋️ Practise</div>
      <div style={{ color: '#888', fontWeight: 700, fontSize: 14, marginBottom: 20 }}>
        Build words and learn sight words
      </div>

      <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 12 }}>🎮 Mini-Games</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
        {GAMES.map(game => (
          <button
            key={game.key}
            onClick={() => onStartActivity({ type: 'game', game: game.key, label: game.title, emoji: game.emoji })}
            style={{
              background: 'white', border: '3px solid #e5e7eb',
              borderRadius: '1.25rem', padding: '14px 8px',
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              boxShadow: '0 3px 0 rgba(0,0,0,0.08)', textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 28 }}>{game.emoji}</div>
            <div style={{ fontWeight: 900, fontSize: 13 }}>{game.title}</div>
            <div style={{ fontSize: 11, color: '#888', lineHeight: 1.4 }}>{game.desc}</div>
          </button>
        ))}
      </div>

      <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 12 }}>🧩 Word Building</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {words.slice(0, 10).map(word => {
          const status = masteryEngine.getStatus('blend', word.word);
          const mastered = status === STATUS.MASTERED;
          return (
            <button
              key={word.word}
              onClick={() => onStartActivity({ type: 'blend', word, label: word.word, emoji: '🧩' })}
              style={{
                background: mastered ? '#F0FDF4' : 'white',
                border: `3px solid ${mastered ? '#22c55e' : '#e5e7eb'}`,
                borderRadius: '1.25rem', padding: '14px 20px',
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: '0 2px 0 rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ fontSize: 32 }}>{word.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 900, fontSize: 20, color: mastered ? '#22c55e' : '#2D2D2D' }}>
                  {word.word}
                </div>
                <div style={{ fontSize: 13, color: '#888', fontWeight: 700 }}>
                  /{word.phonemes.join(' · ')}/
                </div>
              </div>
              {mastered && <div style={{ fontSize: 20 }}>⭐</div>}
            </button>
          );
        })}
        {words.length === 0 && (
          <div style={{ color: '#888', fontWeight: 700, textAlign: 'center', padding: 20 }}>
            Learn more sounds to unlock words!
          </div>
        )}
      </div>

      <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 12 }}>👁️ Sight Words</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {sightWords.slice(0, 16).map(sw => {
          const status = masteryEngine.getStatus('sight', sw.word);
          const mastered = status === STATUS.MASTERED;
          return (
            <button
              key={sw.word}
              onClick={() => onStartActivity({ type: 'sightword', sightWord: sw, label: sw.word, emoji: '👁️' })}
              style={{
                background: mastered ? '#F0FDF4' : 'white',
                border: `3px solid ${mastered ? '#22c55e' : '#e5e7eb'}`,
                borderRadius: '1.25rem', padding: '16px 12px',
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                boxShadow: '0 2px 0 rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ fontWeight: 900, fontSize: 22, color: mastered ? '#22c55e' : '#7c3aed' }}>
                {sw.word}
              </div>
              {mastered && <div style={{ fontSize: 14 }}>⭐</div>}
            </button>
          );
        })}
        {sightWords.length === 0 && (
          <div style={{ color: '#888', fontWeight: 700, gridColumn: '1/-1', textAlign: 'center', padding: 20 }}>
            Complete Phase 1 to unlock sight words!
          </div>
        )}
      </div>
    </div>
  );
}
