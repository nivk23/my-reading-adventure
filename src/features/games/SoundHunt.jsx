import { useState, useCallback } from 'react';
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
  const ph = phonemes[Math.floor(Math.random() * phonemes.length)];
  const correct = words.filter(w => w.phonemes[0] === ph.id);
  const wrong = words.filter(w => w.phonemes[0] !== ph.id);
  const correctPick = shuffle(correct).slice(0, 2);
  const wrongPick = shuffle(wrong).slice(0, 4);
  const tiles = shuffle([...correctPick, ...wrongPick]);
  return { phoneme: ph, correctIds: correctPick.map(w => w.word), tiles };
}

export function SoundHunt({ onComplete }) {
  const phonemes = curriculumEngine.getAvailablePhonemes();
  const words = curriculumEngine.getAvailableWords();

  const [rounds] = useState(() => {
    const r = [];
    const usedPh = new Set();
    const pool = shuffle(phonemes.filter(p => {
      const wordsForPh = words.filter(w => w.phonemes[0] === p.id);
      return wordsForPh.length >= 2;
    }));
    for (const ph of pool) {
      if (r.length >= 3) break;
      if (!usedPh.has(ph.id)) {
        usedPh.add(ph.id);
        r.push(buildRound([ph], words));
      }
    }
    // fallback if fewer than 3 distinct phonemes available
    while (r.length < 3 && pool.length > 0) {
      r.push(buildRound(pool, words));
    }
    return r;
  });

  const [roundIdx, setRoundIdx] = useState(0);
  const [tapped, setTapped] = useState({}); // word -> 'correct'|'wrong'
  const [roundDone, setRoundDone] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const round = rounds[roundIdx];
  if (!round) return null;

  const { phoneme, correctIds, tiles } = round;

  const vowelColors = ['short_vowel','long_vowel','vowel_team','r_controlled','diphthong'];
  const blockBg = vowelColors.includes(phoneme.category) ? '#FF6B6B' : phoneme.category === 'digraph' ? '#C77DFF' : '#5BC8F5';
  const blockShadow = vowelColors.includes(phoneme.category) ? '#c0392b' : phoneme.category === 'digraph' ? '#7c3aed' : '#2980b9';

  const foundCount = Object.values(tapped).filter(v => v === 'correct').length;
  const totalCorrect = correctIds.length;

  function handleTap(word) {
    if (roundDone || tapped[word]) return;
    const isCorrect = correctIds.includes(word);
    masteryEngine.recordAnswer('phoneme', phoneme.id, isCorrect);

    const newTapped = { ...tapped, [word]: isCorrect ? 'correct' : 'wrong' };
    setTapped(newTapped);

    if (isCorrect) {
      const newFound = Object.values(newTapped).filter(v => v === 'correct').length;
      if (newFound >= totalCorrect) {
        setScore(s => s + 1);
        setRoundDone(true);
      }
    } else {
      setRoundDone(true);
    }
  }

  function nextRound() {
    if (roundIdx + 1 >= rounds.length) {
      if (score >= 2) {
        setShowCelebration(true);
      } else {
        setGameOver(true);
      }
    } else {
      setRoundIdx(r => r + 1);
      setTapped({});
      setRoundDone(false);
    }
  }

  const sunnyMsg = roundDone
    ? Object.values(tapped).includes('wrong')
      ? `The /${phoneme.phoneme}/ words were: ${correctIds.join(', ')}!`
      : `You found them all! 🌟`
    : `Find words that start with /${phoneme.phoneme}/!`;

  const sunnyExpr = roundDone
    ? Object.values(tapped).includes('wrong') ? 'encouraging' : 'celebrating'
    : 'happy';

  if (showCelebration) {
    return <Celebration message={`Sound Hunt complete! ${score}/3 rounds! 🎉`} onDone={onComplete} />;
  }

  if (gameOver) {
    return (
      <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 20 }}>
        <div style={{ fontSize: 64 }}>🔍</div>
        <div style={{ fontWeight: 900, fontSize: 24, textAlign: 'center' }}>Sound Hunt Done!</div>
        <div style={{ fontSize: 18, color: '#888', fontWeight: 700 }}>{score} of 3 rounds found!</div>
        <button onClick={onComplete} style={{ padding: '16px 32px', background: '#C77DFF', color: 'white', border: 'none', borderRadius: '1.25rem', fontFamily: 'inherit', fontWeight: 900, fontSize: 18, cursor: 'pointer', boxShadow: '0 5px 0 #9333ea' }}>Done ✓</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', padding: 20, gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onComplete} style={{ background: '#f3f4f6', border: 'none', borderRadius: '1rem', padding: '10px 16px', fontFamily: 'inherit', fontWeight: 900, cursor: 'pointer', fontSize: 15, minHeight: 44 }}>← Back</button>
        <div style={{ flex: 1, fontWeight: 900, fontSize: 16, color: '#888' }}>Round {roundIdx + 1} of {rounds.length}</div>
        <div style={{ fontWeight: 900, fontSize: 16, color: '#C77DFF' }}>🌟 {score}</div>
      </div>

      {/* Sunny */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Sunny expression={sunnyExpr} message={sunnyMsg} size={70} />
      </div>

      {/* Parent instruction */}
      <div style={{ background: '#FFF8F0', border: '2px solid #FFD93D', borderRadius: '1.25rem', padding: '12px 16px' }}>
        <div style={{ fontWeight: 900, fontSize: 13, color: '#8B5E3C', marginBottom: 2 }}>👨‍👩‍👧 Parent:</div>
        <div style={{ fontSize: 14, color: '#555', lineHeight: 1.6 }}>
          Say the <strong>/{phoneme.phoneme}/</strong> sound ({phoneme.displaySound}). Then ask: "Tap ALL the words that start with that sound!"
        </div>
      </div>

      {/* Big phoneme block */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: 100, height: 100, borderRadius: '1.75rem',
          background: blockBg, boxShadow: `0 6px 0 ${blockShadow}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 900, animation: 'bounceIn 0.4s ease',
        }}>
          <div style={{ fontSize: 48 }}>{phoneme.grapheme.toUpperCase()}</div>
          <div style={{ fontSize: 14, opacity: 0.85 }}>{phoneme.displaySound}</div>
        </div>
      </div>

      {/* 3×2 grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {tiles.map(word => {
          const state = tapped[word.word];
          const revealCorrect = roundDone && !state && correctIds.includes(word.word);
          let bg = 'white', border = '#e5e7eb', overlay = null;
          if (state === 'correct') { bg = '#dcfce7'; border = '#22c55e'; overlay = '✅'; }
          if (state === 'wrong') { bg = '#fee2e2'; border = '#ef4444'; overlay = '❌'; }
          if (revealCorrect) { bg = '#dcfce7'; border = '#22c55e'; overlay = '✅'; }
          return (
            <button
              key={word.word}
              onClick={() => handleTap(word.word)}
              disabled={!!state || roundDone}
              style={{
                background: bg, border: `3px solid ${border}`,
                borderRadius: '1.25rem', padding: '14px 8px',
                cursor: state || roundDone ? 'default' : 'pointer',
                fontFamily: 'inherit', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 4, minHeight: 88,
                boxShadow: state ? 'none' : '0 3px 0 rgba(0,0,0,0.08)',
                animation: state === 'wrong' ? 'shake 0.4s ease' : state === 'correct' ? 'bounceIn 0.3s ease' : 'none',
                position: 'relative',
              }}
            >
              {overlay && <div style={{ position: 'absolute', top: 6, right: 8, fontSize: 16 }}>{overlay}</div>}
              <div style={{ fontSize: 30 }}>{word.emoji}</div>
              <div style={{ fontWeight: 900, fontSize: 15 }}>{word.word}</div>
            </button>
          );
        })}
      </div>

      {/* Round result + Next */}
      {roundDone && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ textAlign: 'center', fontWeight: 900, fontSize: 16, marginBottom: 12, color: Object.values(tapped).includes('wrong') ? '#ef4444' : '#22c55e' }}>
            {Object.values(tapped).includes('wrong')
              ? `Not quite — the /${phoneme.phoneme}/ words were highlighted above`
              : `🌟 You found all ${totalCorrect}!`}
          </div>
          <button onClick={nextRound} style={{
            width: '100%', padding: '16px', background: '#6BCFA5', color: 'white',
            border: 'none', borderRadius: '1.25rem', fontFamily: 'inherit',
            fontWeight: 900, fontSize: 18, cursor: 'pointer', boxShadow: '0 5px 0 #2ecc71',
          }}>
            {roundIdx + 1 >= rounds.length ? 'Finish! 🏁' : 'Next Round ➡️'}
          </button>
        </div>
      )}
    </div>
  );
}
