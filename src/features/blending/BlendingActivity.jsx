import { useState } from 'react';
import { Sunny } from '../../components/Sunny.jsx';
import { Celebration } from '../../components/Celebration.jsx';
import { masteryEngine } from '../../lib/masteryEngine.js';
import { PHONEMES } from '../../data/phonemes.js';

const VOWEL_COLORS = {
  short_vowel: '#FF6B6B',
  long_vowel: '#FF8FAB',
  vowel_team: '#FF9A3C',
  r_controlled: '#FF9A3C',
  diphthong: '#FF9A3C',
};

function getPhonemeObj(ph) {
  return PHONEMES.find(p => p.id === ph);
}

function vowelColor(ph) {
  const p = getPhonemeObj(ph);
  if (!p) return '#5BC8F5';
  return VOWEL_COLORS[p.category] || '#5BC8F5';
}

export function BlendingActivity({ word, onComplete }) {
  const [stage, setStage] = useState('soundout');
  const [built, setBuilt] = useState([]);
  const [wrong, setWrong] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const letters = word.word.split('');
  const [scrambled] = useState(() => [...letters].sort(() => Math.random() - 0.5));

  function addLetter(idx) {
    if (built.includes(idx)) return;
    const newBuilt = [...built, idx];
    setBuilt(newBuilt);
    if (newBuilt.length === letters.length) {
      const builtWord = newBuilt.map(i => scrambled[i]).join('');
      const correct = builtWord === word.word;
      masteryEngine.recordAnswer('blend', word.word, correct);
      if (correct) {
        setShowResult(true);
        setTimeout(() => setStage('celebrate'), 800);
      } else {
        setWrong(true);
        setTimeout(() => { setBuilt([]); setWrong(false); }, 1000);
      }
    }
  }

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', padding: 20, gap: 20 }}>
      {stage === 'celebrate' && (
        <Celebration message={`You blended "${word.word}"! 🎉`} onDone={onComplete} />
      )}

      <button
        onClick={onComplete}
        style={{
          background: '#f3f4f6', border: 'none', borderRadius: '1rem',
          padding: '10px 16px', fontFamily: 'inherit', fontWeight: 900,
          cursor: 'pointer', fontSize: 15, alignSelf: 'flex-start',
        }}
      >← Back</button>

      {stage === 'soundout' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <Sunny expression="happy" message={`Let's sound out: ${word.word}`} size={80} />

          <div style={{ fontSize: 16, fontWeight: 900, color: '#888', textAlign: 'center' }}>
            Parent: say each sound, then blend
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {word.phonemes.map((ph, i) => {
              const p = getPhonemeObj(ph);
              const color = vowelColor(ph);
              return (
                <div
                  key={i}
                  style={{
                    width: 80, height: 80,
                    borderRadius: '1.25rem',
                    background: color,
                    boxShadow: '0 5px 0 rgba(0,0,0,0.2)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 900,
                    animation: `bounceIn 0.4s ease ${i * 0.12}s both`,
                  }}
                >
                  <div style={{ fontSize: 28 }}>{ph}</div>
                  <div style={{ fontSize: 11, opacity: 0.85 }}>{p?.displaySound || ph}</div>
                </div>
              );
            })}
          </div>

          <div style={{
            background: 'white', borderRadius: '1.25rem',
            padding: 16, width: '100%',
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>
              Parent script:
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.7 }}>
              Point to each block and say its sound. Then blend them together to say &quot;{word.word}&quot;.
            </div>
          </div>

          <div style={{ fontSize: 48 }}>{word.emoji}</div>

          <button
            onClick={() => setStage('build')}
            style={{
              width: '100%', padding: '18px',
              background: '#5BC8F5', color: 'white',
              border: 'none', borderRadius: '1.25rem',
              fontFamily: 'inherit', fontWeight: 900,
              fontSize: 18, cursor: 'pointer',
              boxShadow: '0 5px 0 #2980b9',
            }}
          >Now let me build it! ➡️</button>
        </div>
      )}

      {stage === 'build' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Sunny
            expression={wrong ? 'encouraging' : 'thinking'}
            message="Tap the letters in order to spell the word!"
            size={70}
          />

          {/* Answer slots */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {letters.map((_, i) => {
              const filledIdx = built[i];
              const letter = filledIdx !== undefined ? scrambled[filledIdx] : null;
              const ph = word.phonemes[i] || word.phonemes[word.phonemes.length - 1];
              const color = letter ? vowelColor(ph) : '#e5e7eb';
              return (
                <div
                  key={i}
                  style={{
                    width: 64, height: 64,
                    borderRadius: '1rem',
                    background: letter ? color : 'white',
                    border: `3px solid ${letter ? 'transparent' : '#d1d5db'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28, fontWeight: 900, color: 'white',
                    boxShadow: letter ? '0 4px 0 rgba(0,0,0,0.15)' : 'none',
                    animation: wrong ? 'shake 0.4s ease' : 'none',
                  }}
                >{letter?.toUpperCase()}</div>
              );
            })}
          </div>

          {/* Letter tiles */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 12 }}>
            {scrambled.map((letter, idx) => {
              const used = built.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => !used && addLetter(idx)}
                  disabled={used}
                  style={{
                    width: 68, height: 68,
                    borderRadius: '1rem',
                    background: used ? '#f3f4f6' : '#FFD93D',
                    border: 'none',
                    boxShadow: used ? 'none' : '0 5px 0 rgba(0,0,0,0.2)',
                    fontSize: 28, fontWeight: 900,
                    cursor: used ? 'default' : 'pointer',
                    color: used ? '#ccc' : '#2D2D2D',
                    fontFamily: 'inherit',
                    transition: 'all 0.1s',
                  }}
                >{letter.toUpperCase()}</button>
              );
            })}
          </div>

          {showResult && (
            <div style={{
              textAlign: 'center', fontSize: 24, fontWeight: 900,
              color: '#22c55e', animation: 'bounceIn 0.4s ease',
            }}>
              ✅ {word.word}! {word.emoji}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
