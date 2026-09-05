import { useState, useEffect, useMemo } from 'react';

const PRAISE = ['Great reading!', 'You knew that one!', 'Well done!', 'Wonderful!', 'Fantastic!'];
const ENCOURAGE = ['Good try!', "Let's practise this one.", 'You can do it!', 'Keep going!'];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export function WordReader({ word, onResult, onNext, onDone, counter }) {
  const [phase, setPhase] = useState('read');
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [knew, setKnew] = useState(null);

  const praise = useMemo(() => pick(PRAISE), [word?.id]);
  const encourage = useMemo(() => pick(ENCOURAGE), [word?.id]);

  useEffect(() => {
    setPhase('read');
    setButtonsVisible(false);
    setKnew(null);
    const timer = setTimeout(() => setButtonsVisible(true), 1200);
    return () => clearTimeout(timer);
  }, [word?.id]);

  function handleKnow() {
    setKnew(true);
    setPhase('result');
    onResult(word.id, true);
  }

  function handlePractice() {
    setKnew(false);
    setPhase('result');
    onResult(word.id, false);
  }

  if (!word) return null;

  return (
    <div style={{
      padding: 24, maxWidth: 560, margin: '0 auto', textAlign: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: 'calc(100dvh - 120px)',
    }}>
      {counter && (
        <div style={{ fontSize: 14, color: '#aaa', fontWeight: 700, marginBottom: 32 }}>
          {counter}
        </div>
      )}

      {phase === 'read' && (
        <>
          <div style={{
            fontSize: 56, fontWeight: 900, color: '#2D2D2D', marginBottom: 20,
            letterSpacing: '0.02em', lineHeight: 1.2,
          }}>
            {word.word}
          </div>

          <div style={{ fontSize: 16, color: '#999', fontWeight: 700, marginBottom: 40 }}>
            Can you read this word?
          </div>

          <div style={{
            display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 340,
            opacity: buttonsVisible ? 1 : 0,
            transform: buttonsVisible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            pointerEvents: buttonsVisible ? 'auto' : 'none',
          }}>
            <button
              onClick={handleKnow}
              style={{
                padding: '20px 32px', background: '#22c55e', color: 'white',
                border: 'none', borderRadius: '1.25rem', fontFamily: 'inherit',
                fontWeight: 900, fontSize: 18, cursor: 'pointer',
                boxShadow: '0 4px 0 #16a34a',
              }}
            >I Know It ✓</button>
            <button
              onClick={handlePractice}
              style={{
                padding: '20px 32px', background: '#FFB347', color: 'white',
                border: 'none', borderRadius: '1.25rem', fontFamily: 'inherit',
                fontWeight: 900, fontSize: 18, cursor: 'pointer',
                boxShadow: '0 4px 0 #e89520',
              }}
            >I Need Practice</button>
          </div>
        </>
      )}

      {phase === 'result' && (
        <>
          <div style={{
            fontSize: 56, fontWeight: 900,
            color: knew ? '#22c55e' : '#FFB347',
            marginBottom: 12,
          }}>
            {word.word}
          </div>

          <div style={{
            fontSize: 20, fontWeight: 900, marginBottom: 8,
            color: knew ? '#22c55e' : '#FFB347',
          }}>
            {knew ? praise : encourage}
          </div>

          <div style={{
            background: '#f9fafb', borderRadius: '1.25rem',
            padding: '16px 24px', marginBottom: 32, maxWidth: 400,
            border: '2px solid #e5e7eb',
          }}>
            <div style={{ fontSize: 13, color: '#aaa', fontWeight: 700, marginBottom: 4 }}>
              Example
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#555', lineHeight: 1.5 }}>
              {word.exampleSentence}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            {onNext && (
              <button
                onClick={onNext}
                style={{
                  padding: '18px 40px', background: '#C77DFF', color: 'white',
                  border: 'none', borderRadius: '1.25rem', fontFamily: 'inherit',
                  fontWeight: 900, fontSize: 17, cursor: 'pointer',
                  boxShadow: '0 4px 0 #9333ea',
                }}
              >Next Word →</button>
            )}
            {onDone && !onNext && (
              <button
                onClick={onDone}
                style={{
                  padding: '18px 40px', background: '#C77DFF', color: 'white',
                  border: 'none', borderRadius: '1.25rem', fontFamily: 'inherit',
                  fontWeight: 900, fontSize: 17, cursor: 'pointer',
                  boxShadow: '0 4px 0 #9333ea',
                }}
              >Done</button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
