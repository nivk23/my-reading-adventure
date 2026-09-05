import { useState } from 'react';
import { Sunny } from '../../components/Sunny.jsx';
import { masteryEngine } from '../../lib/masteryEngine.js';
import { curriculumEngine } from '../../lib/curriculumEngine.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Assign each tile a stable scrambled index
function makeCarriages(word) {
  const letters = word.split('');
  // Give each position a unique id
  const indexed = letters.map((l, i) => ({ letter: l, origIdx: i, id: i }));
  return shuffle(indexed);
}

export function WordTrain({ onComplete }) {
  const allWords = curriculumEngine.getAvailableWords();
  const [words] = useState(() => shuffle(allWords).slice(0, 4));
  const [wordIdx, setWordIdx] = useState(0);
  const [placed, setPlaced] = useState([]); // origIdx values placed so far
  const [hadMistake, setHadMistake] = useState(false);
  const [shakeId, setShakeId] = useState(null);
  const [wordDone, setWordDone] = useState(false);
  const [score, setScore] = useState(0); // cleanly completed count

  if (words.length === 0) {
    return (
      <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ fontWeight: 900, fontSize: 20, textAlign: 'center', color: '#888' }}>Learn more sounds to unlock Word Train!</div>
        <button onClick={onComplete} style={{ marginTop: 24, padding: '14px 28px', background: '#5BC8F5', color: 'white', border: 'none', borderRadius: '1.25rem', fontFamily: 'inherit', fontWeight: 900, fontSize: 16, cursor: 'pointer' }}>← Back</button>
      </div>
    );
  }

  const word = words[wordIdx];
  const letters = word.word.split('');

  const [carriages] = useState(() => makeCarriages(word.word));
  // We need to re-create carriages per word. Use a key-based approach by resetting state.

  const nextCorrectIdx = placed.length; // the next origIdx we need is placed.length (0,1,2...)

  function handleCarriage(origIdx, carriageId) {
    if (wordDone || placed.includes(origIdx)) return;
    if (origIdx === nextCorrectIdx) {
      const newPlaced = [...placed, origIdx];
      setPlaced(newPlaced);
      if (newPlaced.length === letters.length) {
        masteryEngine.recordAnswer('blend', word.word, !hadMistake);
        if (!hadMistake) setScore(s => s + 1);
        setWordDone(true);
      }
    } else {
      setHadMistake(true);
      setShakeId(carriageId);
      setTimeout(() => setShakeId(null), 500);
    }
  }

  function goNextWord() {
    if (wordIdx + 1 >= words.length) {
      onComplete();
    } else {
      setWordIdx(i => i + 1);
      setPlaced([]);
      setHadMistake(false);
      setWordDone(false);
    }
  }

  // Placed letters to show in slots
  const slotLetters = letters.map((l, i) => placed.includes(i) ? l : null);

  const sunnyMsg = wordDone
    ? `${word.emoji} ${word.word}! Well done!`
    : hadMistake
      ? `Try tapping the letters in order!`
      : `Tap the letters in order to spell: ${word.word}`;

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', padding: 20, gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onComplete} style={{ background: '#f3f4f6', border: 'none', borderRadius: '1rem', padding: '10px 16px', fontFamily: 'inherit', fontWeight: 900, cursor: 'pointer', fontSize: 15, minHeight: 44 }}>← Back</button>
        <div style={{ flex: 1, fontWeight: 900, fontSize: 16, color: '#888' }}>Word {wordIdx + 1} of {words.length}</div>
        <div style={{ fontWeight: 900, fontSize: 16, color: '#6BCFA5' }}>✅ {score}</div>
      </div>

      {/* Sunny */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Sunny expression={wordDone ? 'celebrating' : hadMistake ? 'encouraging' : 'thinking'} message={sunnyMsg} size={70} />
      </div>

      {/* Parent instruction */}
      <div style={{ background: '#FFF8F0', border: '2px solid #FFD93D', borderRadius: '1.25rem', padding: '12px 16px' }}>
        <div style={{ fontWeight: 900, fontSize: 13, color: '#8B5E3C', marginBottom: 2 }}>👨‍👩‍👧 Parent:</div>
        <div style={{ fontSize: 14, color: '#555', lineHeight: 1.6 }}>
          Say each letter sound as your child taps it. Then blend them: <strong>"{word.word}"</strong>.
        </div>
      </div>

      {/* Track slots */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {letters.map((_, i) => {
          const filled = slotLetters[i];
          return (
            <div key={i} style={{
              width: 64, height: 64, borderRadius: '1rem',
              background: filled ? '#6BCFA5' : 'white',
              border: `3px solid ${filled ? '#2ecc71' : '#d1d5db'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 30, fontWeight: 900, color: 'white',
              boxShadow: filled ? '0 4px 0 rgba(0,0,0,0.15)' : '0 2px 0 rgba(0,0,0,0.06)',
              animation: filled ? 'bounceIn 0.3s ease' : 'none',
            }}>
              {filled?.toUpperCase()}
            </div>
          );
        })}
      </div>

      {/* Emoji when done */}
      {wordDone && (
        <div style={{ textAlign: 'center', fontSize: 64, animation: 'bounceIn 0.5s ease' }}>
          {word.emoji}
        </div>
      )}

      {/* Train carriages */}
      {!wordDone && (
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
          {carriages.map(c => {
            const used = placed.includes(c.origIdx);
            const isShaking = shakeId === c.id;
            return (
              <button
                key={c.id}
                onClick={() => handleCarriage(c.origIdx, c.id)}
                disabled={used}
                style={{
                  width: 68, height: 68, borderRadius: '1rem',
                  background: used ? '#f3f4f6' : '#FFD93D',
                  border: 'none',
                  boxShadow: used ? 'none' : '0 5px 0 rgba(0,0,0,0.18)',
                  fontSize: 28, fontWeight: 900,
                  cursor: used ? 'default' : 'pointer',
                  color: used ? '#ccc' : '#2D2D2D',
                  fontFamily: 'inherit',
                  minHeight: 44, minWidth: 44,
                  animation: isShaking ? 'shake 0.4s ease' : 'none',
                  position: 'relative',
                }}
              >
                {c.letter.toUpperCase()}
                {/* Little train wheels */}
                {!used && (
                  <div style={{ position: 'absolute', bottom: -2, left: 8, right: 8, display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#8B5E3C' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#8B5E3C' }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Next word button */}
      {wordDone && (
        <button onClick={goNextWord} style={{
          width: '100%', padding: '16px', background: wordIdx + 1 >= words.length ? '#6BCFA5' : '#5BC8F5',
          color: 'white', border: 'none', borderRadius: '1.25rem',
          fontFamily: 'inherit', fontWeight: 900, fontSize: 18,
          cursor: 'pointer', boxShadow: '0 5px 0 rgba(0,0,0,0.2)',
          animation: 'fadeIn 0.3s ease',
        }}>
          {wordIdx + 1 >= words.length ? '🏁 Finished!' : 'Next Word ➡️'}
        </button>
      )}
    </div>
  );
}
