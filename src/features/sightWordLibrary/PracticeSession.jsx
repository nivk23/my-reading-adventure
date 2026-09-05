import { useState, useCallback } from 'react';
import { WordReader } from './WordReader.jsx';
import { sightWordEngine } from '../../lib/sightWordEngine.js';

export function PracticeSession({ words, onComplete, title }) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [retryWords, setRetryWords] = useState(null);
  const [done, setDone] = useState(false);

  const currentWords = retryWords || words;
  const currentWord = currentWords[index];
  const isLast = index >= currentWords.length - 1;
  const sessionTitle = retryWords ? 'Let\'s Try Again' : (title || 'Practice Session');

  const handleResult = useCallback((wordId, knew) => {
    sightWordEngine.recordResult(wordId, knew);
    setResults(prev => [...prev, { wordId, word: currentWord.word, knew }]);
  }, [currentWord]);

  const handleNext = useCallback(() => {
    setIndex(i => i + 1);
  }, []);

  const handleDone = useCallback(() => {
    setDone(true);
  }, []);

  function startRetry() {
    const missed = results.filter(r => !r.knew);
    const missedWords = missed.map(r => currentWords.find(w => w.id === r.wordId)).filter(Boolean);
    if (missedWords.length > 0) {
      setRetryWords(missedWords);
      setIndex(0);
      setResults([]);
      setDone(false);
    }
  }

  if (done || (results.length > 0 && results.length >= currentWords.length && !currentWord)) {
    const knew = results.filter(r => r.knew).length;
    const missed = results.filter(r => !r.knew);
    const total = results.length;
    const allCorrect = missed.length === 0;

    return (
      <div style={{ padding: 24, maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>
          {allCorrect ? '🏆' : '📖'}
        </div>
        <div style={{ fontWeight: 900, fontSize: 24, color: '#2D2D2D', marginBottom: 8 }}>
          {allCorrect ? 'Amazing Reading!' : 'Great Reading!'}
        </div>

        <div style={{
          background: 'white', borderRadius: '1.25rem', padding: 20,
          border: '3px solid #e5e7eb', marginBottom: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <div style={{ fontSize: 15, color: '#888', fontWeight: 700, marginBottom: 12 }}>
            You practised: <strong style={{ color: '#2D2D2D' }}>{total} words</strong>
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#22c55e' }}>{knew}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#888' }}>Words you know</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#FFB347' }}>{missed.length}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#888' }}>To practise</div>
            </div>
          </div>
        </div>

        {missed.length > 0 && !retryWords && (
          <>
            <div style={{
              background: '#FFF8F0', borderRadius: '1.25rem', padding: 16,
              border: '2px solid #FFD93D', marginBottom: 20,
            }}>
              <div style={{ fontWeight: 900, fontSize: 14, color: '#8B5E3C', marginBottom: 8 }}>
                Words to practise
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                {missed.map(r => (
                  <span key={r.wordId} style={{
                    background: 'white', borderRadius: '0.75rem', padding: '6px 14px',
                    fontWeight: 900, fontSize: 16, color: '#2D2D2D',
                    border: '2px solid #FFD93D',
                  }}>{r.word}</span>
                ))}
              </div>
            </div>
            <button
              onClick={startRetry}
              style={{
                width: '100%', padding: '18px 32px',
                background: '#FFB347', color: 'white',
                border: 'none', borderRadius: '1.25rem', fontFamily: 'inherit',
                fontWeight: 900, fontSize: 17, cursor: 'pointer',
                boxShadow: '0 4px 0 #e89520', marginBottom: 12,
              }}
            >Practise These Words</button>
          </>
        )}

        <button
          onClick={onComplete}
          style={{
            width: '100%', padding: '18px 32px',
            background: '#C77DFF', color: 'white',
            border: 'none', borderRadius: '1.25rem', fontFamily: 'inherit',
            fontWeight: 900, fontSize: 17, cursor: 'pointer',
            boxShadow: '0 4px 0 #9333ea',
          }}
        >Done</button>
      </div>
    );
  }

  if (!currentWord) return null;

  return (
    <div>
      <div style={{
        padding: '12px 20px', background: 'white', borderBottom: '2px solid #f3f4f6',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontWeight: 900, fontSize: 15, color: '#7c3aed' }}>{sessionTitle}</div>
        <div style={{
          background: '#EDE9FE', borderRadius: 999, padding: '4px 12px',
          fontSize: 13, fontWeight: 900, color: '#7c3aed',
        }}>
          {index + 1} / {currentWords.length}
        </div>
      </div>
      <div style={{
        background: '#f3f4f6', borderRadius: 999, height: 4, margin: '0 20px',
      }}>
        <div style={{
          background: '#C77DFF', height: '100%', borderRadius: 999,
          width: `${((index + 1) / currentWords.length) * 100}%`,
          transition: 'width 0.3s ease',
        }} />
      </div>
      <WordReader
        word={currentWord}
        onResult={handleResult}
        onNext={!isLast ? handleNext : null}
        onDone={isLast ? handleDone : null}
        counter={`Word ${index + 1} of ${currentWords.length}`}
      />
    </div>
  );
}
