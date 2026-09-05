import { useState, useMemo } from 'react';
import { tts } from '../../lib/tts.js';
import { masteryEngine } from '../../lib/masteryEngine.js';

const WORD_FAMILIES = [
  { rime: 'at', emoji: '🐱', words: [
    { onset: 'c', word: 'cat', emoji: '🐱' },
    { onset: 'b', word: 'bat', emoji: '🦇' },
    { onset: 'm', word: 'mat', emoji: '🧶' },
    { onset: 'r', word: 'rat', emoji: '🐀' },
    { onset: 'h', word: 'hat', emoji: '🎩' },
    { onset: 'f', word: 'fat', emoji: '🍔' },
    { onset: 's', word: 'sat', emoji: '🪑' },
  ]},
  { rime: 'ig', emoji: '🐷', words: [
    { onset: 'p', word: 'pig', emoji: '🐷' },
    { onset: 'b', word: 'big', emoji: '📦' },
    { onset: 'd', word: 'dig', emoji: '⛏️' },
    { onset: 'j', word: 'jig', emoji: '💃' },
    { onset: 'w', word: 'wig', emoji: '👱' },
    { onset: 'f', word: 'fig', emoji: '🍈' },
  ]},
  { rime: 'op', emoji: '🛑', words: [
    { onset: 't', word: 'top', emoji: '🪀' },
    { onset: 'h', word: 'hop', emoji: '🐇' },
    { onset: 'm', word: 'mop', emoji: '🧹' },
    { onset: 'p', word: 'pop', emoji: '🎈' },
    { onset: 's', word: 'sop', emoji: '🌊' },
  ]},
  { rime: 'en', emoji: '🐔', words: [
    { onset: 'h', word: 'hen', emoji: '🐔' },
    { onset: 't', word: 'ten', emoji: '🔟' },
    { onset: 'p', word: 'pen', emoji: '✏️' },
    { onset: 'm', word: 'men', emoji: '👬' },
    { onset: 'd', word: 'den', emoji: '🦁' },
  ]},
  { rime: 'ug', emoji: '🐛', words: [
    { onset: 'b', word: 'bug', emoji: '🐛' },
    { onset: 'm', word: 'mug', emoji: '☕' },
    { onset: 'r', word: 'rug', emoji: '🟫' },
    { onset: 'h', word: 'hug', emoji: '🤗' },
    { onset: 't', word: 'tug', emoji: '⛵' },
    { onset: 'j', word: 'jug', emoji: '🏺' },
  ]},
  { rime: 'in', emoji: '📌', words: [
    { onset: 'p', word: 'pin', emoji: '📌' },
    { onset: 'f', word: 'fin', emoji: '🐟' },
    { onset: 'b', word: 'bin', emoji: '🗑️' },
    { onset: 't', word: 'tin', emoji: '🥫' },
    { onset: 'w', word: 'win', emoji: '🏆' },
  ]},
];

export function WordFamiliesActivity({ onComplete }) {
  const family = useMemo(() => WORD_FAMILIES[Math.floor(Math.random() * WORD_FAMILIES.length)], []);
  const [step, setStep] = useState('intro');
  const [wordIndex, setWordIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const currentWord = family.words[wordIndex];

  function speakRime() { tts.speakSlow(`-${family.rime}`); }
  function speakWord(w) { tts.speak(w); }

  function revealWord() {
    setRevealed(true);
    speakWord(currentWord.word);
    masteryEngine.recordAnswer('blend', currentWord.word, true);
  }

  function nextWord() {
    if (wordIndex + 1 >= Math.min(family.words.length, 5)) {
      setStep('done');
    } else {
      setWordIndex(i => i + 1);
      setRevealed(false);
    }
  }

  if (step === 'intro') {
    return (
      <div style={{ padding: 24, maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 8, color: '#7c3aed' }}>
          👨‍👩‍👧 Word Families
        </div>
        <div style={{ fontSize: 15, color: '#888', fontWeight: 700, marginBottom: 32 }}>
          Words that rhyme share the same ending!
        </div>

        <div style={{ fontSize: 80, marginBottom: 16 }}>📚</div>

        <div style={{
          background: '#EDE9FE', borderRadius: '1.75rem', padding: '24px 32px',
          marginBottom: 24, display: 'inline-block',
        }}>
          <div style={{ fontSize: 56, fontWeight: 900, color: '#7c3aed' }}>-{family.rime}</div>
          <div style={{ fontSize: 14, color: '#888', fontWeight: 700, marginTop: 8 }}>the &quot;{family.rime}&quot; family</div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 28 }}>
          {family.words.slice(0, 5).map(w => (
            <button
              key={w.word}
              onClick={() => speakWord(w.word)}
              style={{
                padding: '10px 18px', background: 'white', border: '2px solid #EDE9FE',
                borderRadius: '1rem', fontFamily: 'inherit', fontWeight: 900, fontSize: 16,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              {w.emoji} {w.word}
            </button>
          ))}
        </div>

        <button
          onClick={() => { speakRime(); setTimeout(() => setStep('practice'), 400); }}
          style={{
            padding: '18px 40px', background: '#C77DFF', color: 'white',
            border: 'none', borderRadius: '1.25rem', fontFamily: 'inherit',
            fontWeight: 900, fontSize: 18, cursor: 'pointer', boxShadow: '0 4px 0 #9333ea',
          }}
        >Let&apos;s practise! →</button>
      </div>
    );
  }

  if (step === 'practice') {
    return (
      <div style={{ padding: 24, maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 14, color: '#aaa', fontWeight: 700, marginBottom: 24 }}>
          Word {wordIndex + 1} of {Math.min(family.words.length, 5)}
        </div>

        <div style={{ fontSize: 72, marginBottom: 12 }}>{currentWord.emoji}</div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0, marginBottom: 24 }}>
          <div style={{
            fontSize: 52, fontWeight: 900, color: '#5BC8F5',
            background: '#EFF9FF', borderRadius: '1rem 0 0 1rem',
            padding: '12px 20px', border: '3px solid #5BC8F5', borderRight: 'none',
          }}>{currentWord.onset}</div>
          <div style={{
            fontSize: 52, fontWeight: 900, color: '#7c3aed',
            background: '#EDE9FE', borderRadius: '0 1rem 1rem 0',
            padding: '12px 20px', border: '3px solid #7c3aed',
          }}>-{family.rime}</div>
        </div>

        {!revealed ? (
          <>
            <div style={{ fontSize: 15, color: '#888', fontWeight: 700, marginBottom: 20 }}>
              What word does <strong style={{ color: '#5BC8F5' }}>{currentWord.onset}</strong> + <strong style={{ color: '#7c3aed' }}>-{family.rime}</strong> make?
            </div>
            <button
              onClick={revealWord}
              style={{
                padding: '18px 40px', background: '#FF6B6B', color: 'white',
                border: 'none', borderRadius: '1.25rem', fontFamily: 'inherit',
                fontWeight: 900, fontSize: 18, cursor: 'pointer', boxShadow: '0 4px 0 #c0392b',
              }}
            >👆 Tap to reveal!</button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#22c55e', marginBottom: 8 }}>
              {currentWord.word}!
            </div>
            <div style={{ fontSize: 24, marginBottom: 20 }}>🎉</div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => speakWord(currentWord.word)} style={{
                padding: '14px 20px', background: '#5BC8F5', color: 'white',
                border: 'none', borderRadius: '1.25rem', fontFamily: 'inherit',
                fontWeight: 900, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 0 #2980b9',
              }}>🔊 Hear it</button>
              <button onClick={nextWord} style={{
                padding: '14px 32px', background: '#C77DFF', color: 'white',
                border: 'none', borderRadius: '1.25rem', fontFamily: 'inherit',
                fontWeight: 900, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 0 #9333ea',
              }}>Next →</button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 12 }}>🏆</div>
      <div style={{ fontWeight: 900, fontSize: 24, color: '#22c55e', marginBottom: 8 }}>
        Word family done!
      </div>
      <div style={{ fontSize: 16, color: '#888', fontWeight: 700, marginBottom: 32 }}>
        You read the whole -{family.rime} family!
      </div>
      <button onClick={onComplete} style={{
        padding: '18px 40px', background: '#C77DFF', color: 'white',
        border: 'none', borderRadius: '1.25rem', fontFamily: 'inherit',
        fontWeight: 900, fontSize: 18, cursor: 'pointer', boxShadow: '0 4px 0 #9333ea',
      }}>⭐ Done!</button>
    </div>
  );
}
