import { useState } from 'react';
import { Sunny } from '../../components/Sunny.jsx';
import { Celebration } from '../../components/Celebration.jsx';
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

function buildRound(phonemes, words) {
  // Pick a phoneme that has at least one word starting with it
  const eligible = shuffle(phonemes).filter(p => words.some(w => w.phonemes[0] === p.id));
  if (eligible.length === 0) return null;
  const ph = eligible[0];
  const correctWords = words.filter(w => w.phonemes[0] === ph.id);
  const wrongWords = words.filter(w => w.phonemes[0] !== ph.id);
  const answer = correctWords[Math.floor(Math.random() * correctWords.length)];
  const distractors = shuffle(wrongWords).slice(0, 3);
  const options = shuffle([answer, ...distractors]);
  return { phoneme: ph, answer, options };
}

const TOTAL_ROUNDS = 6;

export function FeedSunny({ onComplete }) {
  const phonemes = curriculumEngine.getAvailablePhonemes();
  const words = curriculumEngine.getAvailableWords();

  const [rounds] = useState(() => {
    const r = [];
    const usedPh = new Set();
    for (let i = 0; i < TOTAL_ROUNDS; i++) {
      const remaining = phonemes.filter(p => !usedPh.has(p.id) && words.some(w => w.phonemes[0] === p.id));
      const pool = remaining.length > 0 ? remaining : phonemes;
      const round = buildRound(pool, words);
      if (round) {
        usedPh.add(round.phoneme.id);
        r.push(round);
      }
    }
    return r;
  });

  const [roundIdx, setRoundIdx] = useState(0);
  const [selected, setSelected] = useState(null); // word string
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]); // per-round correctness
  const [showCelebration, setShowCelebration] = useState(false);

  if (rounds.length === 0) {
    return (
      <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ fontWeight: 900, fontSize: 20, textAlign: 'center', color: '#888' }}>Learn more sounds to play Feed Sunny!</div>
        <button onClick={onComplete} style={{ marginTop: 24, padding: '14px 28px', background: '#5BC8F5', color: 'white', border: 'none', borderRadius: '1.25rem', fontFamily: 'inherit', fontWeight: 900, fontSize: 16, cursor: 'pointer' }}>← Back</button>
      </div>
    );
  }

  const round = rounds[Math.min(roundIdx, rounds.length - 1)];
  const { phoneme, answer, options } = round;

  const vowelColors = ['short_vowel','long_vowel','vowel_team','r_controlled','diphthong'];
  const blockBg = vowelColors.includes(phoneme.category) ? '#FF6B6B' : phoneme.category === 'digraph' ? '#C77DFF' : '#5BC8F5';

  function handleChoice(word) {
    if (selected) return;
    const correct = word === answer.word;
    setSelected(word);
    setIsCorrect(correct);
    setResults(prev => [...prev, correct]);
    masteryEngine.recordAnswer('phoneme', phoneme.id, correct);
    if (correct) setScore(s => s + 1);

    setTimeout(() => {
      const next = roundIdx + 1;
      if (next >= TOTAL_ROUNDS) {
        if (score + (correct ? 1 : 0) >= 4) {
          setShowCelebration(true);
        } else {
          // Just complete
          onComplete();
        }
      } else {
        setRoundIdx(next);
        setSelected(null);
        setIsCorrect(null);
      }
    }, 1300);
  }

  const sunnyExpr = selected === null ? 'happy' : isCorrect ? 'celebrating' : 'encouraging';
  const sunnyMsg = selected === null
    ? `I'm hungry for /${phoneme.phoneme}/ words! 🍽️`
    : isCorrect
      ? `Yum! ${answer.emoji} ${answer.word}! Delicious!`
      : `Hmm, that doesn't start with /${phoneme.phoneme}/... try again next time!`;

  if (showCelebration) {
    return <Celebration message={`Sunny is full! ${score}/${TOTAL_ROUNDS} correct! 🌟`} onDone={onComplete} />;
  }

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', padding: 20, gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onComplete} style={{ background: '#f3f4f6', border: 'none', borderRadius: '1rem', padding: '10px 16px', fontFamily: 'inherit', fontWeight: 900, cursor: 'pointer', fontSize: 15, minHeight: 44 }}>← Back</button>
        <div style={{ flex: 1, fontWeight: 900, fontSize: 16 }}>🍽️ Feed Sunny</div>
        <div style={{ fontWeight: 900, fontSize: 15, color: '#888' }}>{roundIdx + 1}/{TOTAL_ROUNDS}</div>
      </div>

      {/* Big Sunny */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 4 }}>
        <Sunny expression={sunnyExpr} message={sunnyMsg} size={120} />
      </div>

      {/* Phoneme badge */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{
          background: blockBg, color: 'white', borderRadius: '1.25rem',
          padding: '10px 28px', fontWeight: 900, fontSize: 28,
          boxShadow: '0 4px 0 rgba(0,0,0,0.15)',
        }}>
          {phoneme.grapheme.toUpperCase()} · /{phoneme.phoneme}/
        </div>
      </div>

      {/* Parent instruction */}
      <div style={{ background: '#FFF8F0', border: '2px solid #FFD93D', borderRadius: '1.25rem', padding: '12px 16px' }}>
        <div style={{ fontWeight: 900, fontSize: 13, color: '#8B5E3C', marginBottom: 2 }}>👨‍👩‍👧 Parent:</div>
        <div style={{ fontSize: 14, color: '#555', lineHeight: 1.6 }}>
          Say the <strong>/{phoneme.phoneme}/</strong> sound ({phoneme.displaySound}). Ask: "Which word starts with /{phoneme.phoneme}/? Feed Sunny!"
        </div>
      </div>

      {/* 2×2 word cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {options.map(opt => {
          const isSelected = selected === opt.word;
          const correct = opt.word === answer.word;
          let bg = 'white', border = '#e5e7eb';
          if (isSelected && isCorrect) { bg = '#dcfce7'; border = '#22c55e'; }
          if (isSelected && !isCorrect) { bg = '#fee2e2'; border = '#ef4444'; }
          if (!isSelected && selected && correct) { bg = '#dcfce7'; border = '#22c55e'; }
          return (
            <button
              key={opt.word}
              onClick={() => handleChoice(opt.word)}
              disabled={!!selected}
              style={{
                background: bg, border: `3px solid ${border}`,
                borderRadius: '1.25rem', padding: '20px 12px',
                cursor: selected ? 'default' : 'pointer',
                fontFamily: 'inherit', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 6, minHeight: 100,
                boxShadow: selected ? 'none' : '0 4px 0 rgba(0,0,0,0.1)',
                animation: isSelected ? (isCorrect ? 'bounceIn 0.3s ease' : 'shake 0.4s ease') : 'none',
              }}
            >
              <div style={{ fontSize: 36 }}>{opt.emoji}</div>
              <div style={{ fontWeight: 900, fontSize: 20 }}>{opt.word}</div>
            </button>
          );
        })}
      </div>

      {/* Score dots */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 4 }}>
        {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: '50%',
            background: i < results.length
              ? (results[i] ? '#22c55e' : '#ef4444')
              : i === roundIdx ? '#C77DFF' : '#e5e7eb',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
    </div>
  );
}
