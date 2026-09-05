import { useState } from 'react';
import { Sunny } from '../../components/Sunny.jsx';
import { Celebration } from '../../components/Celebration.jsx';
import { masteryEngine } from '../../lib/masteryEngine.js';
import { SIGHT_WORDS } from '../../data/sightWords.js';

function highlightTricky(word, trickyPart) {
  if (!trickyPart) {
    return <span style={{ fontSize: 56, fontWeight: 900, color: '#7c3aed' }}>{word}</span>;
  }
  const idx = word.indexOf(trickyPart);
  if (idx === -1) {
    return <span style={{ fontSize: 56, fontWeight: 900, color: '#7c3aed' }}>{word}</span>;
  }
  return (
    <span style={{ fontSize: 56, fontWeight: 900, color: '#7c3aed' }}>
      {word.slice(0, idx)}
      <span style={{ color: '#FF6B6B', textDecoration: 'underline wavy #FF6B6B' }}>
        {trickyPart}
      </span>
      {word.slice(idx + trickyPart.length)}
    </span>
  );
}

export function SightWordLesson({ sightWord, onComplete }) {
  const [stage, setStage] = useState('learn');
  const [options] = useState(() => {
    const others = SIGHT_WORDS
      .filter(sw => sw.word !== sightWord.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    return [...others, sightWord].sort(() => Math.random() - 0.5);
  });
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  function handleFind(sw) {
    if (selected) return;
    const correct = sw.word === sightWord.word;
    setSelected(sw.word);
    setIsCorrect(correct);
    masteryEngine.recordAnswer('sight', sightWord.word, correct);
    setTimeout(() => {
      if (correct) setStage('celebrate');
      else { setSelected(null); setIsCorrect(null); }
    }, 1200);
  }

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', padding: 20, gap: 20 }}>
      {stage === 'celebrate' && (
        <Celebration message={`You know "${sightWord.word}"! 👁️`} onDone={onComplete} />
      )}

      <button
        onClick={onComplete}
        style={{
          background: '#f3f4f6', border: 'none', borderRadius: '1rem',
          padding: '10px 16px', fontFamily: 'inherit', fontWeight: 900,
          cursor: 'pointer', fontSize: 15, alignSelf: 'flex-start',
        }}
      >← Back</button>

      {stage === 'learn' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <Sunny expression="excited" message="Let's learn this word!" size={80} />

          <div style={{
            background: 'white', borderRadius: '1.75rem',
            padding: '32px 24px', width: '100%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            textAlign: 'center',
          }}>
            {highlightTricky(sightWord.word, sightWord.trickyPart)}
            {sightWord.emoji && (
              <div style={{ fontSize: 40, marginTop: 12 }}>{sightWord.emoji}</div>
            )}
            {sightWord.note && (
              <div style={{
                marginTop: 12, background: '#FEF3E2',
                borderRadius: '1rem', padding: '10px 16px',
                fontSize: 14, color: '#8B5E3C', fontWeight: 700,
              }}>{sightWord.note}</div>
            )}
          </div>

          {sightWord.type === 'tricky' && (
            <div style={{
              background: '#FFF8F0', border: '2px solid #FFD93D',
              borderRadius: '1.25rem', padding: 16, width: '100%',
            }}>
              <div style={{ fontWeight: 900, color: '#8B5E3C', marginBottom: 4 }}>👨‍👩‍👧 Parent:</div>
              <div style={{ fontSize: 14, lineHeight: 1.7 }}>
                The{' '}
                <span style={{ color: '#FF6B6B', fontWeight: 900 }}>underlined part</span>
                {' '}is tricky — it doesn&apos;t follow the usual rules. Say:{' '}
                &ldquo;In this word,{' '}
                <span style={{ fontWeight: 900 }}>{sightWord.trickyPart || sightWord.word}</span>
                {' '}is a tricky bit. We just have to remember it!&rdquo;
              </div>
            </div>
          )}

          <button
            onClick={() => setStage('find')}
            style={{
              width: '100%', padding: '18px',
              background: '#C77DFF', color: 'white',
              border: 'none', borderRadius: '1.25rem',
              fontFamily: 'inherit', fontWeight: 900,
              fontSize: 18, cursor: 'pointer',
              boxShadow: '0 5px 0 #9333ea',
            }}
          >Can you find it? ➡️</button>
        </div>
      )}

      {stage === 'find' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Sunny
            expression="thinking"
            message={`Find the word: "${sightWord.word}"`}
            size={70}
          />

          <div style={{
            background: 'white', borderRadius: '1.25rem',
            padding: 16, textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Parent: ask your child to tap
            </div>
            <div style={{ fontSize: 40, fontWeight: 900, color: '#7c3aed', marginTop: 4 }}>
              &ldquo;{sightWord.word}&rdquo;
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {options.map(opt => {
              const isSelected = selected === opt.word;
              const correct = opt.word === sightWord.word;
              let bg = 'white', border = '#e5e7eb';
              if (isSelected && isCorrect) { bg = '#dcfce7'; border = '#22c55e'; }
              else if (isSelected && !isCorrect) { bg = '#fee2e2'; border = '#ef4444'; }
              else if (!isSelected && selected && correct) { bg = '#dcfce7'; border = '#22c55e'; }

              return (
                <button
                  key={opt.word}
                  onClick={() => handleFind(opt)}
                  disabled={!!selected}
                  style={{
                    padding: '24px 12px',
                    background: bg,
                    border: `3px solid ${border}`,
                    borderRadius: '1.25rem',
                    fontFamily: 'inherit', fontWeight: 900,
                    fontSize: 32,
                    cursor: selected ? 'default' : 'pointer',
                    color: '#7c3aed',
                    boxShadow: '0 3px 0 rgba(0,0,0,0.08)',
                    animation: isSelected
                      ? (isCorrect ? 'bounceIn 0.3s ease' : 'shake 0.4s ease')
                      : 'none',
                    minHeight: 88,
                  }}
                >{opt.word}</button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
