import { useState, useMemo } from 'react';
import { sightWordEngine } from '../../lib/sightWordEngine.js';
import { LEVEL_INFO } from '../../data/sightWordCurriculum.js';

const LEVEL_COLORS = {
  1: '#FF6B6B', 2: '#FFD93D', 3: '#5BC8F5', 4: '#C77DFF', 5: '#22c55e',
};

const STATUS_ICON = {
  new: '🌱',
  learning: '📖',
  practising: '🔄',
  mastered: '⭐',
};

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'learning', label: 'Learning' },
  { key: 'practising', label: 'Practising' },
  { key: 'mastered', label: 'Mastered' },
];

export function LevelPage({ level, onSelectWord, onBack, onStartPractice }) {
  const [filter, setFilter] = useState('all');
  const info = LEVEL_INFO.find(l => l.level === level);
  const color = LEVEL_COLORS[level] || '#C77DFF';

  const allWords = useMemo(() => sightWordEngine.getLevelWords(level), [level]);
  const stats = useMemo(() => sightWordEngine.getLevelStats(level), [level]);

  const filtered = useMemo(() => {
    if (filter === 'all') return allWords;
    return allWords.filter(w => w.status === filter);
  }, [allWords, filter]);

  function handlePracticeLevel() {
    const practiceSet = allWords.filter(w => w.status !== 'mastered').slice(0, 10);
    if (practiceSet.length === 0) {
      onStartPractice(allWords.slice(0, 10));
    } else {
      onStartPractice(practiceSet);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', fontSize: 22, cursor: 'pointer',
          fontFamily: 'inherit', padding: 0,
        }}>←</button>
        <div style={{
          width: 36, height: 36, borderRadius: '50%', background: color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, fontSize: 16, color: 'white', flexShrink: 0,
        }}>{level}</div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 18 }}>Level {level} — {info?.title || ''}</div>
          <div style={{ fontSize: 13, color: '#888', fontWeight: 700 }}>
            {stats.mastered} / {stats.total} mastered · {stats.percentage}%
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: '#f3f4f6', borderRadius: 999, height: 8, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{
          background: color, height: '100%', borderRadius: 999,
          width: `${stats.percentage}%`, transition: 'width 0.4s ease',
        }} />
      </div>

      {/* Filter pills */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto',
        paddingBottom: 4,
      }}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '8px 16px', borderRadius: 999, fontFamily: 'inherit',
              fontWeight: 900, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
              background: filter === f.key ? color : 'white',
              color: filter === f.key ? 'white' : '#888',
              border: `2px solid ${filter === f.key ? color : '#e5e7eb'}`,
            }}
          >{f.label}</button>
        ))}
      </div>

      {/* Word grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
        marginBottom: 24,
      }}>
        {filtered.map(word => {
          const statusColor = word.status === 'mastered' ? '#22c55e'
            : word.status === 'practising' ? '#FFB347'
            : word.status === 'learning' ? '#5BC8F5'
            : '#e5e7eb';
          return (
            <button
              key={word.id}
              onClick={() => onSelectWord(word)}
              style={{
                background: 'white', borderRadius: '1.25rem',
                border: `3px solid ${word.status === 'mastered' ? '#22c55e' : '#e5e7eb'}`,
                padding: '20px 8px 14px', cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 6, boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                minHeight: 88,
              }}
            >
              <div style={{ fontWeight: 900, fontSize: 22, color: '#2D2D2D', lineHeight: 1 }}>
                {word.word}
              </div>
              <div style={{ fontSize: 14 }}>
                {STATUS_ICON[word.status] || '🌱'}
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 32, color: '#aaa', fontWeight: 700 }}>
          No words match this filter.
        </div>
      )}

      {/* Practice this level button */}
      <button
        onClick={handlePracticeLevel}
        style={{
          width: '100%', padding: '18px', background: color, color: 'white',
          border: 'none', borderRadius: '1.25rem', fontFamily: 'inherit',
          fontWeight: 900, fontSize: 17, cursor: 'pointer',
          boxShadow: `0 4px 0 ${color}88`,
        }}
      >Practise This Level</button>
    </div>
  );
}
