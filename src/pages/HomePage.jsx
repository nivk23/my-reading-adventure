import { useState } from 'react';
import { Sunny } from '../components/Sunny.jsx';
import { masteryEngine } from '../lib/masteryEngine.js';
import { curriculumEngine } from '../lib/curriculumEngine.js';
import { storage } from '../lib/storage.js';

export function HomePage({ onStartActivity }) {
  const [mission] = useState(() => {
    const saved = storage.get('daily_mission');
    const today = new Date().toDateString();
    if (saved && saved.date === today) return saved.steps;
    const steps = curriculumEngine.buildDailyMission();
    storage.set('daily_mission', { date: today, steps });
    return steps;
  });
  const [completedToday] = useState(() => storage.get('completed_today') || []);
  const stats = masteryEngine.getStats();

  const nextStep = mission.find((_, i) => !completedToday.includes(i));

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Sunny expression={stats.mastered > 5 ? 'celebrating' : 'happy'} size={70} />
        <div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>Hi, Superstar! 🌟</div>
          <div style={{ fontSize: 15, color: '#888', fontWeight: 700 }}>Ready for today&apos;s adventure?</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Mastered', value: stats.mastered, emoji: '⭐', bg: '#FFF8F0', color: '#FF9A3C' },
          { label: 'Learning', value: stats.learning, emoji: '📚', bg: '#EDE9FE', color: '#7c3aed' },
          { label: 'Practice!', value: stats.needsReview, emoji: '🔄', bg: '#FEF2F2', color: '#ef4444' },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, background: s.bg, borderRadius: '1.25rem',
            padding: '12px 8px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 22 }}>{s.emoji}</div>
            <div style={{ fontWeight: 900, fontSize: 20, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#888' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 12 }}>📋 Today&apos;s Mission</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {mission.map((step, i) => {
          const done = completedToday.includes(i);
          const active = !done && mission.slice(0, i).every((_, j) => completedToday.includes(j));
          return (
            <button
              key={i}
              onClick={() => !done && onStartActivity(step)}
              disabled={done}
              style={{
                background: done ? '#F0FDF4' : active ? 'white' : '#f9fafb',
                borderRadius: '1.25rem', padding: '16px 20px',
                border: `3px solid ${done ? '#22c55e' : active ? '#C77DFF' : '#e5e7eb'}`,
                display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: active ? '0 4px 16px rgba(199,125,255,0.15)' : 'none',
                width: '100%', fontFamily: 'inherit', cursor: done ? 'default' : 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ fontSize: 28 }}>{done ? '✅' : step.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 900, fontSize: 15, color: done ? '#16a34a' : '#2D2D2D' }}>
                  {step.label}
                </div>
                <div style={{ fontSize: 13, color: '#888', fontWeight: 700 }}>
                  {step.type === 'phonics' && step.phoneme && `/${step.phoneme.phoneme}/ sound`}
                  {step.type === 'blend' && step.word && step.word.word}
                  {step.type === 'sightword' && step.sightWord && `"${step.sightWord.word}"`}
                  {step.type === 'story' && step.story && step.story.title}
                </div>
              </div>
              {active && <div style={{ color: '#C77DFF', fontWeight: 900, fontSize: 20 }}>→</div>}
            </button>
          );
        })}
        {mission.length === 0 && (
          <div style={{ color: '#888', fontWeight: 700, textAlign: 'center', padding: 20 }}>
            No mission yet — keep practising to unlock more!
          </div>
        )}
      </div>

      {nextStep && (
        <button
          onClick={() => onStartActivity(nextStep)}
          style={{
            width: '100%', padding: '20px',
            background: 'linear-gradient(135deg,#C77DFF,#5BC8F5)',
            color: 'white', border: 'none', borderRadius: '1.25rem',
            fontFamily: 'inherit', fontWeight: 900, fontSize: 20,
            cursor: 'pointer', boxShadow: '0 6px 0 rgba(0,0,0,0.2)',
          }}
        >
          {nextStep.emoji} Start: {nextStep.label}!
        </button>
      )}

      {!nextStep && mission.length > 0 && (
        <div style={{
          textAlign: 'center', padding: 24,
          background: '#F0FDF4', borderRadius: '1.75rem',
          border: '3px solid #22c55e',
        }}>
          <div style={{ fontSize: 40 }}>🏆</div>
          <div style={{ fontWeight: 900, fontSize: 20, color: '#16a34a' }}>Mission Complete!</div>
          <div style={{ color: '#888', fontWeight: 700 }}>Come back tomorrow for more!</div>
        </div>
      )}
    </div>
  );
}
