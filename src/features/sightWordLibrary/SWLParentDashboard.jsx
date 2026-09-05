import { useState, useMemo } from 'react';
import { sightWordEngine } from '../../lib/sightWordEngine.js';
import { LEVEL_INFO } from '../../data/sightWordCurriculum.js';

const LEVEL_COLORS = {
  1: '#FF6B6B', 2: '#FFD93D', 3: '#5BC8F5', 4: '#C77DFF', 5: '#22c55e',
};

export function SWLParentDashboard({ onBack }) {
  const [confirmReset, setConfirmReset] = useState(false);

  const overall = useMemo(() => sightWordEngine.getOverallStats(), []);
  const dueToday = useMemo(() => sightWordEngine.getWordsDueToday(), []);
  const recentlyMastered = useMemo(() => sightWordEngine.getRecentlyMastered(), []);
  const allWords = useMemo(() => sightWordEngine.getAllWords(), []);
  const needsPractice = useMemo(() =>
    allWords.filter(w => w.status === 'learning' || w.status === 'practising')
      .sort((a, b) => a.correctCount - b.correctCount), [allWords]);

  function handleReset() {
    if (confirmReset) {
      sightWordEngine.resetProgress();
      setConfirmReset(false);
      window.location.reload();
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', fontSize: 22, cursor: 'pointer',
          fontFamily: 'inherit', padding: 0,
        }}>←</button>
        <div style={{ fontWeight: 900, fontSize: 20 }}>🔒 Parent Dashboard</div>
      </div>

      {/* Overall stats */}
      <div style={{
        background: 'white', borderRadius: '1.25rem', padding: 20, marginBottom: 20,
        border: '3px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <div style={{ fontWeight: 900, fontSize: 15, color: '#555', marginBottom: 12 }}>
          Overall Progress
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {[
            { label: 'Total Words', value: overall.total, color: '#2D2D2D' },
            { label: 'Mastered', value: overall.mastered, color: '#22c55e' },
            { label: 'Practising', value: overall.practising, color: '#FFB347' },
            { label: 'Learning', value: overall.learning, color: '#5BC8F5' },
            { label: 'New', value: overall.newCount, color: '#aaa' },
          ].map(s => (
            <div key={s.label} style={{ minWidth: 80, textAlign: 'center' }}>
              <div style={{ fontWeight: 900, fontSize: 22, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#888' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Level progress */}
      <div style={{
        background: 'white', borderRadius: '1.25rem', padding: 16, marginBottom: 20,
        border: '3px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <div style={{ fontWeight: 900, fontSize: 15, color: '#555', marginBottom: 12 }}>
          Level Progress
        </div>
        {LEVEL_INFO.map(info => {
          const stats = sightWordEngine.getLevelStats(info.level);
          const color = LEVEL_COLORS[info.level];
          return (
            <div key={info.level} style={{ marginBottom: info.level < 5 ? 12 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: '#555' }}>Level {info.level}</span>
                <span style={{ fontSize: 13, fontWeight: 900, color }}>{stats.mastered} / {stats.total}</span>
              </div>
              <div style={{ background: '#f3f4f6', borderRadius: 999, height: 8, overflow: 'hidden' }}>
                <div style={{
                  background: color, height: '100%', borderRadius: 999,
                  width: `${stats.percentage}%`,
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Words needing practice */}
      {needsPractice.length > 0 && (
        <div style={{
          background: '#FFF8F0', borderRadius: '1.25rem', padding: 16, marginBottom: 20,
          border: '2px solid #FFD93D',
        }}>
          <div style={{ fontWeight: 900, fontSize: 14, color: '#8B5E3C', marginBottom: 10 }}>
            Words Needing Practice ({needsPractice.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {needsPractice.slice(0, 20).map(w => (
              <span key={w.id} style={{
                background: 'white', borderRadius: '0.5rem', padding: '4px 10px',
                fontWeight: 900, fontSize: 14, color: '#2D2D2D', border: '1px solid #FFD93D',
              }}>{w.word}</span>
            ))}
            {needsPractice.length > 20 && (
              <span style={{ fontSize: 13, color: '#888', fontWeight: 700, padding: '4px 8px' }}>
                +{needsPractice.length - 20} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Recently mastered */}
      {recentlyMastered.length > 0 && (
        <div style={{
          background: '#F0FDF4', borderRadius: '1.25rem', padding: 16, marginBottom: 20,
          border: '2px solid #86efac',
        }}>
          <div style={{ fontWeight: 900, fontSize: 14, color: '#16a34a', marginBottom: 10 }}>
            Recently Mastered
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {recentlyMastered.map(item => {
              const word = allWords.find(w => w.id === item.wordId);
              return word ? (
                <span key={item.wordId} style={{
                  background: 'white', borderRadius: '0.5rem', padding: '4px 10px',
                  fontWeight: 900, fontSize: 14, color: '#22c55e', border: '1px solid #86efac',
                }}>{word.word}</span>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Words due today */}
      {dueToday.length > 0 && (
        <div style={{
          background: '#EDE9FE', borderRadius: '1.25rem', padding: 16, marginBottom: 20,
          border: '2px solid #C77DFF',
        }}>
          <div style={{ fontWeight: 900, fontSize: 14, color: '#7c3aed', marginBottom: 10 }}>
            Words Due Today ({dueToday.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {dueToday.slice(0, 20).map(w => (
              <span key={w.id} style={{
                background: 'white', borderRadius: '0.5rem', padding: '4px 10px',
                fontWeight: 900, fontSize: 14, color: '#7c3aed', border: '1px solid #C77DFF',
              }}>{w.word}</span>
            ))}
          </div>
        </div>
      )}

      {/* Reset button */}
      <button
        onClick={handleReset}
        style={{
          width: '100%', padding: '16px',
          background: confirmReset ? '#ef4444' : '#f3f4f6',
          color: confirmReset ? 'white' : '#888',
          border: 'none', borderRadius: '1.25rem',
          fontFamily: 'inherit', fontWeight: 900, fontSize: 15,
          cursor: 'pointer',
        }}
      >
        {confirmReset ? '⚠️ Tap again to confirm reset' : '🗑️ Reset Sight Word Progress'}
      </button>
    </div>
  );
}
