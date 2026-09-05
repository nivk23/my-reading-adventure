import { useState, useMemo } from 'react';
import { tts } from '../../lib/tts.js';
import { masteryEngine } from '../../lib/masteryEngine.js';

const PUZZLES = [
  { original: 'cat', originalEmoji: '🐱', changePhoneme: 'c', newPhoneme: 'b', newWord: 'bat', newEmoji: '🦇', position: 'start' },
  { original: 'bat', originalEmoji: '🦇', changePhoneme: 'b', newPhoneme: 'm', newWord: 'mat', newEmoji: '🧶', position: 'start' },
  { original: 'mat', originalEmoji: '🧶', changePhoneme: 'm', newPhoneme: 'h', newWord: 'hat', newEmoji: '🎩', position: 'start' },
  { original: 'pig', originalEmoji: '🐷', changePhoneme: 'p', newPhoneme: 'd', newWord: 'dig', newEmoji: '⛏️', position: 'start' },
  { original: 'sit', originalEmoji: '🪑', changePhoneme: 's', newPhoneme: 'h', newWord: 'hit', newEmoji: '🥊', position: 'start' },
  { original: 'top', originalEmoji: '🪀', changePhoneme: 't', newPhoneme: 'h', newWord: 'hop', newEmoji: '🐇', position: 'start' },
  { original: 'pin', originalEmoji: '📌', changePhoneme: 'p', newPhoneme: 't', newWord: 'tin', newEmoji: '🥫', position: 'start' },
  { original: 'bug', originalEmoji: '🐛', changePhoneme: 'b', newPhoneme: 'm', newWord: 'mug', newEmoji: '☕', position: 'start' },
  { original: 'cat', originalEmoji: '🐱', changePhoneme: 'a', newPhoneme: 'u', newWord: 'cut', newEmoji: '✂️', position: 'middle' },
  { original: 'pet', originalEmoji: '🐾', changePhoneme: 'e', newPhoneme: 'a', newWord: 'pat', newEmoji: '👋', position: 'middle' },
  { original: 'bag', originalEmoji: '👜', changePhoneme: 'g', newPhoneme: 'd', newWord: 'bad', newEmoji: '😠', position: 'end' },
  { original: 'tip', originalEmoji: '☝️', changePhoneme: 'p', newPhoneme: 'n', newWord: 'tin', newEmoji: '🥫', position: 'end' },
];

const POOL = ['cat','bat','mat','rat','hat','sat','pat','pig','big','dig','jig','sit','hit','bit','fit','top','hop','mop','pop','pin','tin','bin','win','bug','mug','rug','hug','jug','pet','net','set','wet','bag','bad','map','nap','tap','lap'];

function makeChoices(correct) {
  const wrong = POOL.filter(w => w !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
  return [...wrong, correct].sort(() => Math.random() - 0.5);
}

export function PhonemeSubstitution({ onComplete }) {
  const puzzles = useMemo(() => [...PUZZLES].sort(() => Math.random() - 0.5).slice(0, 4), []);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const puzzle = puzzles[index];
  const choices = useMemo(() => makeChoices(puzzle.newWord), [puzzle]);

  function handleChoice(word) {
    if (selected) return;
    setSelected(word);
    const correct = word === puzzle.newWord;
    if (correct) {
      tts.speak('Yes! ' + puzzle.newWord);
      setScore(s => s + 1);
      masteryEngine.recordAnswer('phonics', puzzle.changePhoneme, true);
    } else {
      tts.speak('Try again. ' + puzzle.newWord);
    }
    setTimeout(() => {
      if (index + 1 >= puzzles.length) setDone(true);
      else { setIndex(i => i + 1); setSelected(null); }
    }, 1400);
  }

  function speakPuzzle() {
    tts.speak(`Change ${puzzle.changePhoneme} in ${puzzle.original} to ${puzzle.newPhoneme}`);
  }

  if (done) {
    return (
      <div style={{ padding: 24, maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
        <div style={{ fontWeight: 900, fontSize: 24, color: '#22c55e', marginBottom: 8 }}>
          {score}/{puzzles.length} correct!
        </div>
        <div style={{ fontSize: 15, color: '#888', fontWeight: 700, marginBottom: 28 }}>
          {score === puzzles.length ? 'Perfect phoneme ninja! 🥷' : 'Great thinking! Keep practising.'}
        </div>
        <button onClick={onComplete} style={{
          padding: '18px 40px', background: '#C77DFF', color: 'white',
          border: 'none', borderRadius: '1.25rem', fontFamily: 'inherit',
          fontWeight: 900, fontSize: 18, cursor: 'pointer', boxShadow: '0 4px 0 #9333ea',
        }}>⭐ Done!</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 8, color: '#7c3aed' }}>
        🔄 Swap the Sound
      </div>
      <div style={{ fontSize: 13, color: '#aaa', fontWeight: 700, marginBottom: 24 }}>
        Question {index + 1} of {puzzles.length}
      </div>

      <div style={{ background: '#FFF8F0', borderRadius: '1.5rem', padding: '20px 24px', marginBottom: 20 }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>{puzzle.originalEmoji}</div>
        <div style={{ fontSize: 40, fontWeight: 900, color: '#2D2D2D', marginBottom: 8 }}>{puzzle.original}</div>
        <div style={{ fontSize: 16, fontWeight: 900, color: '#555' }}>
          Change <span style={{ color: '#FF6B6B', fontSize: 20 }}>/{puzzle.changePhoneme}/</span> to <span style={{ color: '#5BC8F5', fontSize: 20 }}>/{puzzle.newPhoneme}/</span>
        </div>
      </div>

      <button onClick={speakPuzzle} style={{
        padding: '10px 20px', background: 'white', color: '#C77DFF',
        border: '2px solid #C77DFF', borderRadius: '1rem', fontFamily: 'inherit',
        fontWeight: 900, fontSize: 14, cursor: 'pointer', marginBottom: 24,
      }}>🔊 Hear the question</button>

      <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 16, color: '#555' }}>What is the new word?</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {choices.map(word => {
          const isCorrect = word === puzzle.newWord;
          const isSelected = word === selected;
          let bg = 'white';
          let border = '#e5e7eb';
          if (isSelected && isCorrect) { bg = '#F0FDF4'; border = '#22c55e'; }
          if (isSelected && !isCorrect) { bg = '#FEF2F2'; border = '#ef4444'; }
          if (selected && isCorrect && !isSelected) { bg = '#F0FDF4'; border = '#22c55e'; }
          return (
            <button key={word} onClick={() => handleChoice(word)} style={{
              padding: '18px 12px', background: bg,
              border: `3px solid ${border}`, borderRadius: '1.25rem',
              fontFamily: 'inherit', fontWeight: 900, fontSize: 20,
              cursor: selected ? 'default' : 'pointer',
              transition: 'all 0.2s',
            }}>{word}</button>
          );
        })}
      </div>
    </div>
  );
}
