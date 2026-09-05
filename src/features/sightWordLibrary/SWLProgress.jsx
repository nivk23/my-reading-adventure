import { useMemo } from 'react';
import { sightWordEngine } from '../../lib/sightWordEngine.js';
import { LEVEL_INFO } from '../../data/sightWordCurriculum.js';

const LEVEL_COLORS = {
  1: '#FF6B6B', 2: '#FFD93D', 3: '#5BC8F5', 4: '#C77DFF', 5: '#22c55e',
};

function getEncouragement(pct) {
  if (pct === 0) return 'Your reading journey begins! Open a level and start reading.';
  if (pct < 10) return 'Great start! Every word you learn is progress.';
  if (pct < 25) return 'You\'re building a strong foundation!';
  if (pct < 50) return 'Halfway there — amazing work!';
  if (pct < 75) return 'You\'re becoming a super reader!';
  if (pct < 100) return 'Nearly there — keep going!';
  return 'You\'ve mastered all 250 words! Incredible!';
}

export function SWLProgress() {
  const overall = useMemo(() => sightWordEngine.getOverallStats(), []);
  const recentlyMastered = useMemo(() => sightWordEngine.getRecentlyMastered(), []);
  const allWords = useMemo(() => sightWordEngine.getAllWords(), []);

  const encouragement = getEncouragement(overall.percentage);

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 44, marginBottom: 8 }}>📊</div>
        <div style={{ fontWeight: 900, fontSize: 22, color: '#2D2D2D' }}>My Progress</div>
      </div>

      {/* Overall progress ring (simplified as bar) */}
      <div style={{
        background: 'white', borderRadius: '1.5rem', padding: 24, marginBottom: 20,
        border: '3px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, fontWeight: 900, color: '#C77DFF', lineHeight: 1 }}>
          {overall.mastered}
        </div>
        <div style={{ fontSize: 15, color: '#888', fontWeight: 700, marginBottom: 12 }}>
          of {overall.total} words mastered
        </div>
        <div style={{ background: '#f3f4f6', borderRadius: 999, height: 14, overflow: 'hidden', marginBottom: 8 }}>
          <div style={{
            background: 'linear-gradient(90deg, #C77DFF, #5BC8F5)',
            height: '100%', borderRadius: 999,
            width: `${overall.percentage}%`, transition: 'width 0.4s ease',
          }} />
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#C77DFF' }}>
          {overall.percentage}%
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'center' }}>
          {[
            { label: 'Learning', value: overall.learning, color: '#5BC8F5' },
            { label: 'Practising', value: overall.practising, color: '#FFB347' },
            { label: 'New', value: overall.newCount, color: '#aaa' },
          ].map(s => (
            <div key={s.label} style={{
              background: '#f9fafb', borderRadius: '1rem', padding: '10px 16px', textAlign: 'center',
            }}>
              <div style={{ fontWeight: 900, fontSize: 18, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#888' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Encouragement */}
      <div style={{
        background: '#EDE9FE', borderRadius: '1.25rem', padding: 16, marginBottom: 20,
        textAlign: 'center', border: '2px solid #C77DFF',
      }}>
        <div style={{ fontWeight: 900, fontSize: 15, color: '#7c3aed', lineHeight: 1.5 }}>
          {encouragement}
        </div>
      </div>

      {/* Level breakdown */}
      <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 12, color: '#2D2D2D' }}>
        Level Progress
      </div>
      <div style={{
        background: 'white', borderRadius: '1.25rem', padding: 16, marginBottom: 20,
        border: '3px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        {LEVEL_INFO.map(info => {
          const stats = sightWordEngine.getLevelStats(info.level);
          const color = LEVEL_COLORS[info.level];
          return (
            <div key={info.level} style={{
              marginBottom: info.level < 5 ? 16 : 0,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ fontWeight: 900, fontSize: 14, color: '#555' }}>
                  Level {info.level} — {info.title}
                </div>
                <div style={{ fontWeight: 900, fontSize: 14, color }}>
                  {stats.mastered} / {stats.total}
                </div>
              </div>
              <div style={{ background: '#f3f4f6', borderRadius: 999, height: 8, overflow: 'hidden' }}>
                <div style={{
                  background: color, height: '100%', borderRadius: 999,
                  width: `${stats.percentage}%`, transition: 'width 0.4s ease',
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recently mastered */}
      {recentlyMastered.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 12, color: '#2D2D2D' }}>
            Recently Mastered ⭐
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {recentlyMastered.map(item => {
              const word = allWords.find(w => w.id === item.wordId);
              if (!word) return null;
              return (
                <span key={item.wordId} style={{
                  background: '#F0FDF4', color: '#22c55e', padding: '6px 14px',
                  borderRadius: '0.75rem', fontWeight: 900, fontSize: 15,
                  border: '2px solid #86efac',
                }}>{word.word}</span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
