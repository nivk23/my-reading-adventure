import { useState } from 'react';
import { PHONEMES } from '../data/phonemes.js';
import { masteryEngine, STATUS } from '../lib/masteryEngine.js';

const STATUS_ICON = {
  [STATUS.NOT_STARTED]: '',
  [STATUS.LEARNING]: '📚',
  [STATUS.PRACTISING]: '🔄',
  [STATUS.MASTERED]: '⭐',
  [STATUS.NEEDS_REVIEW]: '🔄',
};

const PHASE_NAMES = {
  1: 'First Sounds',
  2: 'Short Vowels',
  3: 'More Consonants',
  4: 'Digraphs',
  5: 'Blends',
  6: 'Vowel Teams',
  7: 'Long Vowels',
  8: 'Advanced',
};

const VOWEL_COLORS = {
  short_vowel: '#FF6B6B',
  long_vowel: '#FF8FAB',
  vowel_team: '#FF9A3C',
  r_controlled: '#FF9A3C',
  diphthong: '#FF9A3C',
};

function getColor(phoneme) {
  return VOWEL_COLORS[phoneme.category] || '#5BC8F5';
}

export function LearnPage({ onStartActivity }) {
  const [selectedPhase, setSelectedPhase] = useState(1);

  const phases = [...new Set(PHONEMES.map(p => p.curriculumPhase))].sort((a, b) => a - b);
  const phonemesInPhase = PHONEMES.filter(p => p.curriculumPhase === selectedPhase);

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 4 }}>📖 Learn Sounds</div>
      <div style={{ color: '#888', fontWeight: 700, fontSize: 14, marginBottom: 20 }}>
        Tap a sound to practise it
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {phases.map(ph => (
          <button
            key={ph}
            onClick={() => setSelectedPhase(ph)}
            style={{
              padding: '8px 16px',
              background: selectedPhase === ph ? '#C77DFF' : '#f3f4f6',
              color: selectedPhase === ph ? 'white' : '#555',
              border: 'none', borderRadius: '2rem',
              fontFamily: 'inherit', fontWeight: 900, fontSize: 14,
              cursor: 'pointer',
            }}
          >Phase {ph}</button>
        ))}
      </div>

      <div style={{ fontWeight: 900, fontSize: 16, color: '#555', marginBottom: 14 }}>
        Phase {selectedPhase}: {PHASE_NAMES[selectedPhase] || ''}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 12 }}>
        {phonemesInPhase.map(phoneme => {
          const status = masteryEngine.getStatus('phoneme', phoneme.id);
          const mastered = status === STATUS.MASTERED;
          const color = getColor(phoneme);
          return (
            <button
              key={phoneme.id}
              onClick={() => onStartActivity({ type: 'phonics', phoneme, label: `/${phoneme.phoneme}/`, emoji: '🔤' })}
              style={{
                background: mastered ? '#F0FDF4' : 'white',
                border: `3px solid ${mastered ? '#22c55e' : color}`,
                borderRadius: '1.25rem', padding: '14px 8px',
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                boxShadow: '0 3px 0 rgba(0,0,0,0.08)',
                position: 'relative',
              }}
            >
              <div style={{ fontSize: 32, fontWeight: 900, color: mastered ? '#22c55e' : color }}>
                {phoneme.grapheme.toUpperCase()}
              </div>
              <div style={{ fontSize: 11, color: '#888', fontWeight: 700 }}>
                /{phoneme.phoneme}/
              </div>
              {status !== STATUS.NOT_STARTED && (
                <div style={{ fontSize: 13, position: 'absolute', top: 4, right: 6 }}>
                  {STATUS_ICON[status]}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {[
          { icon: '📚', label: 'Learning', status: STATUS.LEARNING },
          { icon: '🔄', label: 'Practising', status: STATUS.PRACTISING },
          { icon: '⭐', label: 'Mastered', status: STATUS.MASTERED },
        ].map(({ icon, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#888', fontWeight: 700 }}>
            <span>{icon}</span><span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
