import { useState, useMemo } from 'react';
import { sightWordEngine } from '../../lib/sightWordEngine.js';

const LEVEL_COLORS = {
  1: '#FF6B6B', 2: '#FFD93D', 3: '#5BC8F5', 4: '#C77DFF', 5: '#22c55e',
};

const DIFFICULTY_LABEL = { 1: 'Easy', 2: 'Developing', 3: 'Challenging' };
const STATUS_LABEL = {
  new: 'New', learning: 'Learning', practising: 'Practising', mastered: 'Mastered',
};
const STATUS_COLOR = {
  new: '#aaa', learning: '#5BC8F5', practising: '#FFB347', mastered: '#22c55e',
};

export function WordSearch({ onSelectWord, onBack }) {
  const [query, setQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);

  const results = useMemo(() => {
    let words;
    if (query.trim()) {
      words = sightWordEngine.searchWords(query.trim());
    } else {
      words = sightWordEngine.getAllWords();
    }
    if (levelFilter) words = words.filter(w => w.level === levelFilter);
    if (statusFilter) words = words.filter(w => w.status === statusFilter);
    return words;
  }, [query, levelFilter, statusFilter]);

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      {/* Search input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', fontSize: 22, cursor: 'pointer',
          fontFamily: 'inherit', padding: 0,
        }}>←</button>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search words..."
            style={{
              width: '100%', padding: '14px 16px 14px 40px',
              border: '3px solid #e5e7eb', borderRadius: '1.25rem',
              fontFamily: 'inherit', fontWeight: 700, fontSize: 16,
              outline: 'none', boxSizing: 'border-box',
            }}
            onFocus={e => { e.target.style.borderColor = '#C77DFF'; }}
            onBlur={e => { e.target.style.borderColor = '#e5e7eb'; }}
            autoFocus
          />
          <span style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            fontSize: 18, pointerEvents: 'none',
          }}>🔍</span>
        </div>
      </div>

      {/* Level filter pills */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 8, overflowX: 'auto', paddingBottom: 4 }}>
        <button
          onClick={() => setLevelFilter(null)}
          style={{
            padding: '6px 14px', borderRadius: 999, fontFamily: 'inherit',
            fontWeight: 900, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap',
            background: !levelFilter ? '#2D2D2D' : 'white',
            color: !levelFilter ? 'white' : '#888',
            border: `2px solid ${!levelFilter ? '#2D2D2D' : '#e5e7eb'}`,
          }}
        >All Levels</button>
        {[1, 2, 3, 4, 5].map(l => (
          <button
            key={l}
            onClick={() => setLevelFilter(levelFilter === l ? null : l)}
            style={{
              padding: '6px 14px', borderRadius: 999, fontFamily: 'inherit',
              fontWeight: 900, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap',
              background: levelFilter === l ? LEVEL_COLORS[l] : 'white',
              color: levelFilter === l ? 'white' : '#888',
              border: `2px solid ${levelFilter === l ? LEVEL_COLORS[l] : '#e5e7eb'}`,
            }}
          >L{l}</button>
        ))}
      </div>

      {/* Status filter pills */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
        {['new', 'learning', 'practising', 'mastered'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? null : s)}
            style={{
              padding: '6px 14px', borderRadius: 999, fontFamily: 'inherit',
              fontWeight: 900, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap',
              background: statusFilter === s ? STATUS_COLOR[s] : 'white',
              color: statusFilter === s ? 'white' : '#888',
              border: `2px solid ${statusFilter === s ? STATUS_COLOR[s] : '#e5e7eb'}`,
            }}
          >{STATUS_LABEL[s]}</button>
        ))}
      </div>

      {/* Result count */}
      <div style={{ fontSize: 13, color: '#aaa', fontWeight: 700, marginBottom: 12 }}>
        {results.length} word{results.length !== 1 ? 's' : ''} found
      </div>

      {/* Results */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {results.slice(0, 50).map(word => {
          const levelColor = LEVEL_COLORS[word.level];
          return (
            <button
              key={word.id}
              onClick={() => onSelectWord(word)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
                background: 'white', borderRadius: '1.25rem',
                border: '2px solid #e5e7eb', cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)', textAlign: 'left',
              }}
            >
              <div style={{ fontWeight: 900, fontSize: 22, color: '#2D2D2D', minWidth: 80 }}>
                {word.word}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{
                    background: levelColor, color: 'white', padding: '2px 8px',
                    borderRadius: 999, fontSize: 11, fontWeight: 900,
                  }}>L{word.level}</span>
                  <span style={{
                    background: `${STATUS_COLOR[word.status]}22`,
                    color: STATUS_COLOR[word.status],
                    padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 900,
                  }}>{STATUS_LABEL[word.status]}</span>
                </div>
                <div style={{ fontSize: 12, color: '#aaa', fontWeight: 700, marginTop: 2 }}>
                  {DIFFICULTY_LABEL[word.difficulty] || 'Easy'}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {results.length === 0 && (
        <div style={{ textAlign: 'center', padding: 32, color: '#aaa', fontWeight: 700 }}>
          No words found.
        </div>
      )}
    </div>
  );
}
