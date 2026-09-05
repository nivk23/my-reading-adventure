import { useMemo } from 'react';
import { sightWordEngine } from '../../lib/sightWordEngine.js';
import { LEVEL_INFO } from '../../data/sightWordCurriculum.js';

const LEVEL_COLORS = {
  1: '#FF6B6B',
  2: '#FFD93D',
  3: '#5BC8F5',
  4: '#C77DFF',
  5: '#22c55e',
};

const LEVEL_SHADOW = {
  1: '#c0392b',
  2: '#cc9a00',
  3: '#2980b9',
  4: '#9333ea',
  5: '#16a34a',
};

export function SWLHome({ onOpenLevel, onStartPractice, onOpenSearch }) {
  const overall = useMemo(() => sightWordEngine.getOverallStats(), []);
  const dailyWords = useMemo(() => sightWordEngine.getDailyPractice(), []);

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 44, marginBottom: 4 }}>📖</div>
        <div style={{ fontWeight: 900, fontSize: 24, color: '#2D2D2D' }}>My Sight Word Library</div>
        <div style={{ fontSize: 15, color: '#888', fontWeight: 700, marginTop: 4 }}>
          Let&apos;s Read!
        </div>
      </div>

      {/* Overall progress */}
      <div style={{
        background: 'white', borderRadius: '1.25rem', padding: 16, marginBottom: 20,
        border: '3px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        textAlign: 'center',
      }}>
        <div style={{ fontWeight: 900, fontSize: 28, color: '#C77DFF' }}>
          {overall.mastered} <span style={{ fontSize: 16, color: '#aaa' }}>/ {overall.total}</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#888', marginBottom: 8 }}>words mastered</div>
        <div style={{ background: '#f3f4f6', borderRadius: 999, height: 10, overflow: 'hidden' }}>
          <div style={{
            background: 'linear-gradient(90deg, #C77DFF, #5BC8F5)',
            height: '100%', borderRadius: 999,
            width: `${overall.percentage}%`,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* Daily practice card */}
      {dailyWords.length > 0 && (
        <button
          onClick={() => onStartPractice(dailyWords)}
          style={{
            width: '100%', background: 'linear-gradient(135deg, #C77DFF, #5BC8F5)',
            borderRadius: '1.25rem', padding: '20px 24px', marginBottom: 24,
            border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: '0 6px 0 rgba(0,0,0,0.15)', textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 18, color: 'white', marginBottom: 4 }}>
                Today&apos;s Reading
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>
                {dailyWords.length} words ready for you
              </div>
            </div>
            <div style={{ fontSize: 36 }}>📚</div>
          </div>
          <div style={{
            marginTop: 12, background: 'rgba(255,255,255,0.25)',
            borderRadius: '0.75rem', padding: '10px 16px',
            fontWeight: 900, fontSize: 16, color: 'white', textAlign: 'center',
          }}>
            START TODAY&apos;S PRACTICE →
          </div>
        </button>
      )}

      {/* Search button */}
      <button
        onClick={onOpenSearch}
        style={{
          width: '100%', padding: '14px 20px', background: 'white',
          border: '2px solid #e5e7eb', borderRadius: '1.25rem',
          fontFamily: 'inherit', fontWeight: 700, fontSize: 15,
          color: '#aaa', cursor: 'pointer', marginBottom: 24,
          textAlign: 'left',
        }}
      >🔍 Search words...</button>

      {/* Level cards */}
      <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 12, color: '#2D2D2D' }}>
        Levels
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {LEVEL_INFO.map(info => {
          const stats = sightWordEngine.getLevelStats(info.level);
          const color = LEVEL_COLORS[info.level];
          const shadow = LEVEL_SHADOW[info.level];
          return (
            <div key={info.level} style={{
              background: 'white', borderRadius: '1.25rem',
              border: '3px solid #e5e7eb', overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <div style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', background: color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, fontSize: 18, color: 'white', flexShrink: 0,
                  }}>{info.level}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 900, fontSize: 16, color: '#2D2D2D' }}>
                      {info.title}
                    </div>
                    <div style={{ fontSize: 13, color: '#888', fontWeight: 700 }}>
                      {info.stage} · {info.totalWords} words
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 900, fontSize: 18, color }}>
                      {stats.mastered}
                      <span style={{ fontSize: 13, color: '#aaa' }}> / {stats.total}</span>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa' }}>mastered</div>
                  </div>
                </div>

                <div style={{ background: '#f3f4f6', borderRadius: 999, height: 8, overflow: 'hidden', marginBottom: 12 }}>
                  <div style={{
                    background: color, height: '100%', borderRadius: 999,
                    width: `${stats.percentage}%`, transition: 'width 0.4s ease',
                  }} />
                </div>

                <button
                  onClick={() => onOpenLevel(info.level)}
                  style={{
                    width: '100%', padding: '12px', background: color, color: 'white',
                    border: 'none', borderRadius: '1rem', fontFamily: 'inherit',
                    fontWeight: 900, fontSize: 15, cursor: 'pointer',
                    boxShadow: `0 3px 0 ${shadow}`,
                  }}
                >START READING</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
