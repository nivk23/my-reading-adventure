import { useState } from 'react';
import { Sunny } from '../../components/Sunny.jsx';
import { Celebration } from '../../components/Celebration.jsx';
import { masteryEngine } from '../../lib/masteryEngine.js';

export function StoryReader({ story, onComplete }) {
  const [pageIdx, setPageIdx] = useState(0);
  const [stage, setStage] = useState('reading');
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const page = story.pages[pageIdx];
  const question = story.questions[qIdx];

  function nextPage() {
    if (pageIdx < story.pages.length - 1) {
      setPageIdx(pageIdx + 1);
    } else {
      setStage('quiz');
    }
  }

  function handleAnswer(idx) {
    if (selected !== null) return;
    const correct = idx === question.correct;
    setSelected(idx);
    setIsCorrect(correct);
    masteryEngine.recordAnswer('story', story.id + '_q' + qIdx, correct);
    setTimeout(() => {
      if (qIdx < story.questions.length - 1) {
        setQIdx(qIdx + 1);
        setSelected(null);
        setIsCorrect(null);
      } else {
        setStage('celebrate');
      }
    }, 1200);
  }

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', padding: 20, gap: 16 }}>
      {stage === 'celebrate' && (
        <Celebration message="You read a whole story! 📖🌟" onDone={onComplete} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={onComplete}
          style={{
            background: '#f3f4f6', border: 'none', borderRadius: '1rem',
            padding: '10px 16px', fontFamily: 'inherit', fontWeight: 900,
            cursor: 'pointer', fontSize: 15,
          }}
        >← Back</button>
        <div style={{ flex: 1, fontWeight: 900, fontSize: 17 }}>{story.title}</div>
        {stage === 'reading' && (
          <div style={{ color: '#888', fontWeight: 900, fontSize: 15 }}>
            {pageIdx + 1} / {story.pages.length}
          </div>
        )}
      </div>

      {stage === 'reading' && (
        <div style={{ background: '#e5e7eb', borderRadius: 8, height: 10 }}>
          <div style={{
            background: 'linear-gradient(90deg,#6BCFA5,#5BC8F5)',
            borderRadius: 8, height: 10,
            width: `${((pageIdx + 1) / story.pages.length) * 100}%`,
            transition: 'width 0.4s',
          }} />
        </div>
      )}

      {stage === 'reading' && page && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{ fontSize: 80, textAlign: 'center' }}>
            {page.illustration}
          </div>

          <div style={{
            background: 'white', borderRadius: '1.75rem',
            padding: '28px 24px', width: '100%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: 28, fontWeight: 900, lineHeight: 1.6,
              color: '#2D2D2D', letterSpacing: '0.03em',
            }}>{page.text}</div>
          </div>

          <button
            onClick={nextPage}
            style={{
              width: '100%', padding: '18px',
              background: pageIdx < story.pages.length - 1 ? '#5BC8F5' : '#6BCFA5',
              color: 'white', border: 'none', borderRadius: '1.25rem',
              fontFamily: 'inherit', fontWeight: 900,
              fontSize: 18, cursor: 'pointer',
              boxShadow: `0 5px 0 ${pageIdx < story.pages.length - 1 ? '#2980b9' : '#27ae60'}`,
            }}
          >
            {pageIdx < story.pages.length - 1 ? 'Next ➡️' : 'Answer some questions! 🤔'}
          </button>
        </div>
      )}

      {stage === 'quiz' && question && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Sunny expression="thinking" message="Can you answer this?" size={70} />

          <div style={{
            background: 'white', borderRadius: '1.25rem',
            padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          }}>
            <div style={{ fontSize: 18, fontWeight: 900, lineHeight: 1.5 }}>
              {question.question}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {question.answers.map((ans, idx) => {
              const isSelected = selected === idx;
              const correct = idx === question.correct;
              let bg = 'white', border = '#e5e7eb';
              if (isSelected && isCorrect) { bg = '#dcfce7'; border = '#22c55e'; }
              else if (isSelected && !isCorrect) { bg = '#fee2e2'; border = '#ef4444'; }
              else if (!isSelected && selected !== null && correct) { bg = '#dcfce7'; border = '#22c55e'; }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={selected !== null}
                  style={{
                    width: '100%', padding: '16px 20px',
                    background: bg, border: `3px solid ${border}`,
                    borderRadius: '1.25rem', fontFamily: 'inherit',
                    fontWeight: 700, fontSize: 16,
                    cursor: selected !== null ? 'default' : 'pointer',
                    textAlign: 'left',
                    boxShadow: '0 2px 0 rgba(0,0,0,0.08)',
                    animation: isSelected
                      ? (isCorrect ? 'bounceIn 0.3s ease' : 'shake 0.4s ease')
                      : 'none',
                  }}
                >{ans}</button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
