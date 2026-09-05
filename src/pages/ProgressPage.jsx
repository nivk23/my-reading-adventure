import { PHONEMES } from '../data/phonemes.js';
import { masteryEngine, STATUS } from '../lib/masteryEngine.js';

const VOWEL_COLORS = {
  short_vowel: '#FF6B6B',
  long_vowel: '#FF8FAB',
  vowel_team: '#FF9A3C',
  r_controlled: '#FF9A3C',
  diphthong: '#FF9A3C',
};

function getColor(phoneme) {
  return VOWEL_COLORS[phoneme.category] || '#5BC8F5';
}

export function ProgressPage() {
  const stats = masteryEngine.getStats();
  const total = PHONEMES.length;
  const masteredPct = Math.round((stats.mastered / total) * 100);

  const byPhase = {};
  PHONEMES.forEach(p => {
    if (!byPhase[p.curriculumPhase]) byPhase[p.curriculumPhase] = [];
    byPhase[p.curriculumPhase].push(p);
  });

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 20 }}>🌟 My Progress</div>

      <div style={{ background: 'white', borderRadius: '1.75rem', padding: 20, marginBottom: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontWeight: 900, fontSize: 16 }}>Sounds Mastered</div>
          <div style={{ fontWeight: 900, fontSize: 20, color: '#FF9A3C' }}>{stats.mastered} / {total}</div>
        </div>
        <div style={{ background: '#e5e7eb', borderRadius: 8, height: 16 }}>
          <div style={{
            background: 'linear-gradient(90deg,#FFD93D,#FF9A3C)',
            borderRadius: 8, height: 16,
            width: `${masteredPct}%`,
            transition: 'width 0.6s',
          }} />
        </div>
        <div style={{ fontSize: 13, color: '#888', fontWeight: 700, marginTop: 8 }}>{masteredPct}% complete!</div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Mastered', value: stats.mastered, emoji: '⭐', color: '#FF9A3C' },
          { label: 'Practising', value: stats.practising, emoji: '🔄', color: '#5BC8F5' },
          { label: 'Learning', value: stats.learning, emoji: '📚', color: '#C77DFF' },
          { label: 'Review', value: stats.needsReview, emoji: '📣', color: '#ef4444' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: 'white', borderRadius: '1.25rem', padding: '12px 4px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 18 }}>{s.emoji}</div>
            <div style={{ fontWeight: 900, fontSize: 18, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 14 }}>Sounds by Phase</div>
      {Object.entries(byPhase).map(([phase, phonemes]) => (
        <div key={phase} style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 900, fontSize: 13, color: '#888', textTransform: 'uppercase', marginBottom: 8 }}>
            Phase {phase}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {phonemes.map(phoneme => {
              const status = masteryEngine.getStatus('phoneme', phoneme.id);
              const mastered = status === STATUS.MASTERED;
              const practising = status === STATUS.PRACTISING;
              const learning = status === STATUS.LEARNING || status === STATUS.NEEDS_REVIEW;
              const color = getColor(phoneme);
              return (
                <div
                  key={phoneme.id}
                  title={`/${phoneme.phoneme}/ — ${status}`}
                  style={{
                    width: 44, height: 44, borderRadius: '0.75rem',
                    background: mastered ? '#F0FDF4' : practising ? '#EFF6FF' : learning ? '#FEF3E2' : '#f3f4f6',
                    border: `2px solid ${mastered ? '#22c55e' : practising ? '#5BC8F5' : learning ? color : '#e5e7eb'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 900,
                    color: mastered ? '#22c55e' : practising ? '#5BC8F5' : learning ? color : '#ccc',
                  }}
                >
                  {phoneme.grapheme.toUpperCase()}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
