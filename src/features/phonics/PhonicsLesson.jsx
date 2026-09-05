import { useState } from 'react';
import { Sunny } from '../../components/Sunny.jsx';
import { Celebration } from '../../components/Celebration.jsx';
import { ParentHelp } from '../../components/ParentHelp.jsx';
import { masteryEngine } from '../../lib/masteryEngine.js';
import { PHONEMES } from '../../data/phonemes.js';

const VOWEL_COLORS = {
  short_vowel: '#FF6B6B',
  long_vowel: '#FF8FAB',
  vowel_team: '#FF9A3C',
  r_controlled: '#FF9A3C',
  diphthong: '#FF9A3C',
};

function getBlockColor(phoneme) {
  return VOWEL_COLORS[phoneme.category] || '#5BC8F5';
}

function getBlockShadow(phoneme) {
  return phoneme.category.includes('vowel') || ['r_controlled','diphthong'].includes(phoneme.category)
    ? '#c0392b'
    : '#2980b9';
}

export function PhonicsLesson({ phoneme, allPhonemes, onComplete }) {
  const [stage, setStage] = useState('introduce');
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  const pool = allPhonemes || PHONEMES;
  const otherPhonemes = pool.filter(p => p.id !== phoneme.id);

  const [options] = useState(() => {
    const shuffled = [...otherPhonemes].sort(() => Math.random() - 0.5).slice(0, 3);
    return [...shuffled, phoneme].sort(() => Math.random() - 0.5);
  });

  function handleQuizAnswer(choice) {
    if (selected) return;
    const correct = choice.id === phoneme.id;
    setSelected(choice.id);
    setIsCorrect(correct);
    masteryEngine.recordAnswer('phoneme', phoneme.id, correct);
    setTimeout(() => {
      const next = questionCount + 1;
      setQuestionCount(next);
      if (next >= 2) {
        setStage('celebrate');
      } else {
        setSelected(null);
        setIsCorrect(null);
      }
    }, 1200);
  }

  const blockColor = getBlockColor(phoneme);
  const blockShadow = getBlockShadow(phoneme);

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', padding: 20, gap: 20 }}>
      {stage === 'celebrate' && (
        <Celebration message={`You learned /${phoneme.phoneme}/! 🌟`} onDone={onComplete} />
      )}
      {showHelp && (
        <ParentHelp phoneme={phoneme} onClose={() => setShowHelp(false)} />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={onComplete}
          style={{
            background: '#f3f4f6', border: 'none', borderRadius: '1rem',
            padding: '10px 16px', fontFamily: 'inherit', fontWeight: 900,
            cursor: 'pointer', fontSize: 15,
          }}
        >← Back</button>
        <button
          onClick={() => setShowHelp(true)}
          style={{
            background: '#FFF8F0', border: '2px solid #FFD93D', borderRadius: '1rem',
            padding: '8px 14px', fontFamily: 'inherit', fontWeight: 900,
            cursor: 'pointer', fontSize: 13, color: '#8B5E3C',
          }}
        >👨‍👩‍👧 Help</button>
      </div>

      {stage === 'introduce' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, paddingTop: 8 }}>
          <Sunny expression="excited" message={`Meet the /${phoneme.phoneme}/ sound!`} size={90} />

          <div style={{
            width: 140, height: 140,
            borderRadius: '2.25rem',
            background: blockColor,
            boxShadow: `0 8px 0 ${blockShadow}`,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            color: 'white',
            animation: 'bounceIn 0.4s ease',
          }}>
            <div style={{ fontSize: 64, fontWeight: 900 }}>{phoneme.grapheme.toUpperCase()}</div>
            <div style={{ fontSize: 16, opacity: 0.85 }}>{phoneme.displaySound}</div>
          </div>

          <div style={{
            background: 'white', borderRadius: '1.75rem',
            padding: '20px 24px', width: '100%',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          }}>
            <div style={{
              fontSize: 13, fontWeight: 900, color: '#888',
              marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>Parent: say the /{phoneme.phoneme}/ sound</div>
            <div style={{ fontSize: 32, fontWeight: 900 }}>{phoneme.exampleEmoji} {phoneme.exampleWord}</div>
            <div style={{ marginTop: 10, fontSize: 15, color: '#555', lineHeight: 1.6 }}>{phoneme.mouthCue}</div>
          </div>

          <button
            onClick={() => setStage('quiz')}
            style={{
              width: '100%', padding: '18px',
              background: '#6BCFA5', color: 'white',
              border: 'none', borderRadius: '1.25rem',
              fontFamily: 'inherit', fontWeight: 900,
              fontSize: 18, cursor: 'pointer',
              boxShadow: '0 5px 0 #27ae60',
            }}
          >{"I'm ready! Let's practise ➡️"}</button>
        </div>
      )}

      {stage === 'quiz' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Sunny
            expression={isCorrect === null ? 'thinking' : isCorrect ? 'celebrating' : 'encouraging'}
            message={
              isCorrect === null
                ? `Which one makes the /${phoneme.phoneme}/ sound?`
                : isCorrect
                ? 'Yes! 🌟'
                : `It's "${phoneme.grapheme}" — /${phoneme.phoneme}/`
            }
            size={70}
          />

          <div style={{
            background: 'white', borderRadius: '1.25rem',
            padding: 16, textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          }}>
            <div style={{
              fontSize: 13, fontWeight: 900, color: '#888',
              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4,
            }}>Parent: point to the letter that says</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#7c3aed' }}>/{phoneme.phoneme}/</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {options.map(opt => {
              const isSelected = selected === opt.id;
              const correct = opt.id === phoneme.id;
              const optColor = VOWEL_COLORS[opt.category] || '#5BC8F5';
              let borderColor = '#e5e7eb';
              if (isSelected && isCorrect) borderColor = '#22c55e';
              else if (isSelected && !isCorrect) borderColor = '#ef4444';
              else if (!isSelected && selected && correct) borderColor = '#22c55e';

              return (
                <button
                  key={opt.id}
                  onClick={() => handleQuizAnswer(opt)}
                  disabled={!!selected}
                  style={{
                    padding: '20px 12px',
                    background: isSelected ? (isCorrect ? '#dcfce7' : '#fee2e2') : 'white',
                    border: `3px solid ${borderColor}`,
                    borderRadius: '1.25rem',
                    fontFamily: 'inherit', fontWeight: 900,
                    fontSize: 36,
                    cursor: selected ? 'default' : 'pointer',
                    color: optColor,
                    boxShadow: '0 3px 0 rgba(0,0,0,0.08)',
                    animation: isSelected
                      ? (isCorrect ? 'bounceIn 0.3s ease' : 'shake 0.4s ease')
                      : 'none',
                    minHeight: 88,
                  }}
                >{opt.grapheme.toUpperCase()}</button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
