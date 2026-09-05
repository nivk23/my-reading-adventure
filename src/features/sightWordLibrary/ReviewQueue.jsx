import { useMemo } from 'react';
import { sightWordEngine } from '../../lib/sightWordEngine.js';

const STATUS_BADGE = {
  new: { bg: '#f3f4f6', color: '#888', label: 'New' },
  learning: { bg: '#EFF9FF', color: '#5BC8F5', label: 'Learning' },
  practising: { bg: '#FFF8F0', color: '#FFB347', label: 'Practising' },
  mastered: { bg: '#F0FDF4', color: '#22c55e', label: 'Mastered' },
};

export function ReviewQueue({ onStartPractice, onSelectWord, onBack }) {
  const dueToday = useMemo(() => sightWordEngine.getWordsDueToday(), []);
  const reviewQueue = useMemo(() => sightWordEngine.getReviewQueue(), []);

  const needsPractice = useMemo(() =>
    reviewQueue.filter(w => w.status === 'learning' || w.status === 'practising'), [reviewQueue]);
  const tryAgain = useMemo(() =>
    reviewQueue.filter(w => w.practiceCount > 0 && w.correctCount < w.practiceCount && w.status !== 'mastered'),
    [reviewQueue]);

  const allReviewWords = useMemo(() => {
    const ids = new Set();
    const merged = [];
    [...dueToday, ...needsPractice, ...tryAgain].forEach(w => {
      if (!ids.has(w.id)) { ids.add(w.id); merged.push(w); }
    });
    return merged;
  }, [dueToday, needsPractice, tryAgain]);

  function renderSection(title, words, emoji) {
    if (words.length === 0) return null;
    return (
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 10, color: '#555' }}>
          {emoji} {title} ({words.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {words.slice(0, 15).map(word => {
            const badge = STATUS_BADGE[word.status] || STATUS_BADGE.new;
            return (
              <button
                key={word.id}
                onClick={() => onSelectWord(word)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'white', borderRadius: '1rem', padding: '14px 18px',
                  border: '2px solid #e5e7eb', cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ fontWeight: 900, fontSize: 20, color: '#2D2D2D' }}>{word.word}</div>
                <span style={{
                  background: badge.bg, color: badge.color, padding: '3px 10px',
                  borderRadius: 999, fontSize: 11, fontWeight: 900,
                }}>{badge.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ fontSize: 36 }}>📝</div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 20 }}>Words to Practise</div>
          <div style={{ fontSize: 14, color: '#888', fontWeight: 700 }}>
            {allReviewWords.length} words need your attention
          </div>
        </div>
      </div>

      {allReviewWords.length > 0 && (
        <button
          onClick={() => onStartPractice(allReviewWords.slice(0, 10))}
          style={{
            width: '100%', padding: '18px', marginBottom: 24,
            background: '#FFB347', color: 'white', border: 'none',
            borderRadius: '1.25rem', fontFamily: 'inherit',
            fontWeight: 900, fontSize: 17, cursor: 'pointer',
            boxShadow: '0 4px 0 #e89520',
          }}
        >START PRACTICE ({Math.min(allReviewWords.length, 10)} words)</button>
      )}

      {renderSection('Due Today', dueToday, '📅')}
      {renderSection('Needs More Practice', needsPractice, '📖')}
      {renderSection('Try Again', tryAgain, '🔄')}

      {allReviewWords.length === 0 && (
        <div style={{
          textAlign: 'center', padding: 40, color: '#aaa', fontWeight: 700,
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✨</div>
          <div style={{ fontSize: 16 }}>No words to review right now!</div>
          <div style={{ fontSize: 14, marginTop: 4 }}>Start reading to build your word list.</div>
        </div>
      )}
    </div>
  );
}
