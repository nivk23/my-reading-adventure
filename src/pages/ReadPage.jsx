import { STORIES } from '../data/stories.js';
import { curriculumEngine } from '../lib/curriculumEngine.js';
import { masteryEngine, STATUS } from '../lib/masteryEngine.js';

export function ReadPage({ onStartActivity }) {
  const availableIds = new Set(curriculumEngine.getAvailableStories().map(s => s.id));

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 4 }}>📚 Stories</div>
      <div style={{ color: '#888', fontWeight: 700, fontSize: 14, marginBottom: 24 }}>
        Read decodable stories — unlock more as you learn
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {STORIES.map(story => {
          const unlocked = availableIds.has(story.id);
          const status = masteryEngine.getStatus('story', story.id + '_q0');
          const completed = status !== STATUS.NOT_STARTED;

          return (
            <button
              key={story.id}
              onClick={() => unlocked && onStartActivity({ type: 'story', story, label: story.title, emoji: '📖' })}
              disabled={!unlocked}
              style={{
                background: completed ? '#F0FDF4' : unlocked ? 'white' : '#f9fafb',
                border: `3px solid ${completed ? '#22c55e' : unlocked ? '#C77DFF' : '#e5e7eb'}`,
                borderRadius: '1.75rem', padding: '20px',
                cursor: unlocked ? 'pointer' : 'default',
                fontFamily: 'inherit', textAlign: 'left',
                boxShadow: unlocked ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                opacity: unlocked ? 1 : 0.6,
                display: 'flex', alignItems: 'center', gap: 16,
              }}
            >
              <div style={{ fontSize: 40 }}>{unlocked ? '📖' : '🔒'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 900, fontSize: 18, color: completed ? '#16a34a' : unlocked ? '#2D2D2D' : '#aaa' }}>
                  {story.title}
                </div>
                <div style={{ fontSize: 13, color: '#888', fontWeight: 700, marginTop: 2 }}>
                  {story.pages.length} pages · {story.questions.length} questions
                </div>
                {!unlocked && (
                  <div style={{ fontSize: 12, color: '#C77DFF', fontWeight: 700, marginTop: 4 }}>
                    Needs: {story.requiredPhonemes.slice(0, 4).map(p => `/${p}/`).join(', ')}
                    {story.requiredPhonemes.length > 4 && ` +${story.requiredPhonemes.length - 4} more`}
                  </div>
                )}
              </div>
              {completed && <div style={{ fontSize: 24 }}>⭐</div>}
              {unlocked && !completed && <div style={{ color: '#C77DFF', fontWeight: 900, fontSize: 20 }}>→</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
