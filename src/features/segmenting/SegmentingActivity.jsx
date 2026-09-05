import { useState, useEffect, useMemo } from 'react';
import { tts, haptic } from '../../lib/tts.js';
import { masteryEngine } from '../../lib/masteryEngine.js';

const WORDS = [
  { word: 'cat', phonemes: ['c', 'a', 't'], emoji: '🐱' },
  { word: 'dog', phonemes: ['d', 'o', 'g'], emoji: '🐶' },
  { word: 'sun', phonemes: ['s', 'u', 'n'], emoji: '☀️' },
  { word: 'map', phonemes: ['m', 'a', 'p'], emoji: '🗺️' },
  { word: 'pin', phonemes: ['p', 'i', 'n'], emoji: '📌' },
  { word: 'bat', phonemes: ['b', 'a', 't'], emoji: '🦇' },
  { word: 'hen', phonemes: ['h', 'e', 'n'], emoji: '🐔' },
  { word: 'bus', phonemes: ['b', 'u', 's'], emoji: '🚌' },
  { word: 'lip', phonemes: ['l', 'i', 'p'], emoji: '💋' },
  { word: 'top', phonemes: ['t', 'o', 'p'], emoji: '🌀' },
  { word: 'red', phonemes: ['r', 'e', 'd'], emoji: '🔴' },
  { word: 'fun', phonemes: ['f', 'u', 'n'], emoji: '🎉' },
];

export function SegmentingActivity({ onComplete }) {
  const roundWords = useMemo(() => {
    const shuffled = [...WORDS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }, []);

  const [round, setRound] = useState(0);
  const [tapped, setTapped] = useState([]);
  const [phase, setPhase] = useState('intro'); // intro | segment | done
  const [score, setScore] = useState(0);

  const current = roundWords[round];

  useEffect(() => {
    if (phase === 'intro') {
      tts.speak(current.word);
    }
  }, [round, phase, current.word]);

  function handlePhoneme(idx) {
    if (tapped.includes(idx)) return;
    const newTapped = [...tapped, idx];
    setTapped(newTapped);
    tts.speak(current.phonemes[idx]);
    haptic(20);

    if (newTapped.length === current.phonemes.length) {
      const allCorrect = newTapped.every((t, i) => t === i);
      if (allCorrect) {
        setScore(s => s + 1);
        masteryEngine.recordAnswer('phoneme', current.phonemes[0], true);
        haptic([30, 50, 30]);
        tts.speak('Great job!');
      }
      setTimeout(() => {
        if (round + 1 < roundWords.length) {
          setRound(r => r + 1);
          setTapped([]);
          setPhase('intro');
        } else {
          setPhase('done');
        }
      }, 1200);
    }
  }

  function handleSayWord() {
    tts.speak(current.word);
    haptic(15);
    setPhase('segment');
  }

  if (phase === 'done') {
    return (
      <div style={{ padding: 24, textAlign: 'center', maxWidth: 500, margin: '0 auto' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <div style={{ fontWeight: 900, fontSize: 26, marginBottom: 8 }}>
          Sound Master!
        </div>
        <div style={{ fontSize: 16, color: '#888', fontWeight: 700, marginBottom: 24 }}>
          {score} out of {roundWords.length} words segmented perfectly!
        </div>
        <button
          onClick={onComplete}
          style={{
            background: 'linear-gradient(135deg,#C77DFF,#5BC8F5)',
            color: 'white', border: 'none', borderRadius: '1.25rem',
            padding: '16px 40px', fontFamily: 'inherit',
            fontWeight: 900, fontSize: 18, cursor: 'pointer',
          }}
        >Keep Going! 🚀</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 500, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontWeight: 900, fontSize: 16, color: '#888' }}>
          Word {round + 1} of {roundWords.length}
        </div>
        <div style={{
          background: '#EDE9FE', borderRadius: '1rem',
          padding: '6px 14px', fontWeight: 900, fontSize: 14, color: '#7c3aed',
        }}>⭐ {score}</div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 72, marginBottom: 12 }}>{current.emoji}</div>
        <div style={{ fontWeight: 900, fontSize: 32, marginBottom: 8 }}>{current.word}</div>
        <div style={{ fontSize: 14, color: '#888', fontWeight: 700 }}>
          {phase === 'intro'
            ? 'Listen to the word, then tap each sound'
            : `Tap the ${current.phonemes.length} sounds in order`}
        </div>
      </div>

      {phase === 'intro' ? (
        <button
          onClick={handleSayWord}
          style={{
            width: '100%', padding: '20px',
            background: 'linear-gradient(135deg,#C77DFF,#5BC8F5)',
            color: 'white', border: 'none', borderRadius: '1.25rem',
            fontFamily: 'inherit', fontWeight: 900, fontSize: 20,
            cursor: 'pointer',
          }}
        >🔊 Hear It — Then Tap the Sounds!</button>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
            {current.phonemes.map((ph, idx) => {
              const isTapped = tapped.includes(idx);
              const isNext = idx === tapped.length;
              return (
                <button
                  key={idx}
                  onClick={() => isNext && handlePhoneme(idx)}
                  style={{
                    width: 72, height: 72,
                    background: isTapped ? '#C77DFF' : isNext ? 'white' : '#f9fafb',
                    border: `3px solid ${isTapped ? '#9333ea' : isNext ? '#C77DFF' : '#e5e7eb'}`,
                    borderRadius: '1.25rem',
                    fontWeight: 900, fontSize: isTapped ? 22 : 16,
                    color: isTapped ? 'white' : isNext ? '#C77DFF' : '#ccc',
                    cursor: isNext ? 'pointer' : 'default',
                    fontFamily: 'inherit',
                    boxShadow: isNext ? '0 4px 12px rgba(199,125,255,0.3)' : 'none',
                    transform: isTapped ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.15s',
                  }}
                >
                  {isTapped ? ph : '?'}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            {current.phonemes.map((_, idx) => (
              <div key={idx} style={{
                width: 12, height: 12, borderRadius: '50%',
                background: tapped.includes(idx) ? '#C77DFF' : '#e5e7eb',
                transition: 'background 0.2s',
              }} />
            ))}
          </div>

          <button
            onClick={() => { tts.speak(current.word); haptic(15); }}
            style={{
              marginTop: 20, width: '100%', padding: '12px',
              background: '#f3f4f6', border: 'none', borderRadius: '1rem',
              fontFamily: 'inherit', fontWeight: 700, fontSize: 15, cursor: 'pointer',
            }}
          >🔊 Hear the word again</button>
        </>
      )}
    </div>
  );
}
