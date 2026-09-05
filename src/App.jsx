import { useState } from 'react';
import { HomePage } from './pages/HomePage.jsx';
import { LearnPage } from './pages/LearnPage.jsx';
import { PracticePage } from './pages/PracticePage.jsx';
import { ReadPage } from './pages/ReadPage.jsx';
import { ProgressPage } from './pages/ProgressPage.jsx';
import { ParentDashboard } from './pages/ParentDashboard.jsx';
import { PhonicsLesson } from './features/phonics/PhonicsLesson.jsx';
import { BlendingActivity } from './features/blending/BlendingActivity.jsx';
import { SightWordLesson } from './features/sightWords/SightWordLesson.jsx';
import { StoryReader } from './features/reading/StoryReader.jsx';
import { SoundHunt } from './features/games/SoundHunt.jsx';
import { WordTrain } from './features/games/WordTrain.jsx';
import { FeedSunny } from './features/games/FeedSunny.jsx';
import { storage } from './lib/storage.js';
import { PHONEMES } from './data/phonemes.js';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', emoji: '🏠' },
  { id: 'learn', label: 'Learn', emoji: '🔤' },
  { id: 'practise', label: 'Practise', emoji: '🏋️' },
  { id: 'read', label: 'Read', emoji: '📚' },
  { id: 'progress', label: 'Stars', emoji: '⭐' },
];

export default function App() {
  const [page, setPage] = useState('home');
  const [activity, setActivity] = useState(null);
  const [settings] = useState(() => storage.get('settings') || {});

  const fontSizeMap = { small: 14, medium: 16, large: 18, xlarge: 22 };
  const letterSpacingMap = { tight: '-0.02em', normal: '0', wide: '0.04em', wider: '0.08em' };

  const rootStyle = {
    fontFamily: "'Nunito', system-ui, sans-serif",
    fontSize: fontSizeMap[settings.fontSize] || 16,
    letterSpacing: letterSpacingMap[settings.letterSpacing] || '0',
    background: '#FAFAF8',
    minHeight: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 640,
    margin: '0 auto',
    position: 'relative',
  };

  function startActivity(step) {
    setActivity(step);
  }

  function completeActivity() {
    if (activity) {
      const completed = storage.get('completed_today') || [];
      const mission = storage.get('daily_mission');
      if (mission && mission.steps) {
        const idx = mission.steps.findIndex(s =>
          s.type === activity.type &&
          (activity.type === 'phonics' ? s.phoneme?.id === activity.phoneme?.id :
           activity.type === 'blend' ? s.word?.word === activity.word?.word :
           activity.type === 'sightword' ? s.sightWord?.word === activity.sightWord?.word :
           s.story?.id === activity.story?.id)
        );
        if (idx !== -1 && !completed.includes(idx)) {
          storage.set('completed_today', [...completed, idx]);
        }
      }
    }
    setActivity(null);
  }

  if (activity) {
    return (
      <div style={rootStyle}>
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
          {activity.type === 'phonics' && (
            <PhonicsLesson
              phoneme={activity.phoneme}
              allPhonemes={PHONEMES}
              onComplete={completeActivity}
            />
          )}
          {activity.type === 'blend' && (
            <BlendingActivity word={activity.word} onComplete={completeActivity} />
          )}
          {activity.type === 'sightword' && (
            <SightWordLesson sightWord={activity.sightWord} onComplete={completeActivity} />
          )}
          {activity.type === 'story' && (
            <StoryReader story={activity.story} onComplete={completeActivity} />
          )}
          {activity.type === 'game' && activity.game === 'soundHunt' && (
            <SoundHunt onComplete={completeActivity} />
          )}
          {activity.type === 'game' && activity.game === 'wordTrain' && (
            <WordTrain onComplete={completeActivity} />
          )}
          {activity.type === 'game' && activity.game === 'feedSunny' && (
            <FeedSunny onComplete={completeActivity} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={rootStyle}>
      <div style={{
        padding: '14px 20px 12px',
        background: 'white',
        borderBottom: '2px solid #f3f4f6',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ fontWeight: 900, fontSize: 18 }}>My Reading Adventure 🌟</div>
        <button
          onClick={() => setPage('parent')}
          style={{
            background: '#f3f4f6', border: 'none', borderRadius: '1rem',
            padding: '6px 12px', fontFamily: 'inherit',
            fontWeight: 900, fontSize: 13, cursor: 'pointer',
          }}
        >👨‍👩‍👧</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        {page === 'home' && <HomePage onStartActivity={startActivity} />}
        {page === 'learn' && <LearnPage onStartActivity={startActivity} />}
        {page === 'practise' && <PracticePage onStartActivity={startActivity} />}
        {page === 'read' && <ReadPage onStartActivity={startActivity} />}
        {page === 'progress' && <ProgressPage />}
        {page === 'parent' && <ParentDashboard />}
      </div>

      <nav style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 640,
        background: 'white', borderTop: '2px solid #f3f4f6',
        display: 'flex', zIndex: 20,
        paddingBottom: 'env(safe-area-inset-bottom, 0)',
      }}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            style={{
              flex: 1, padding: '10px 4px 12px',
              background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            }}
          >
            <div style={{ fontSize: 22 }}>{item.emoji}</div>
            <div style={{
              fontSize: 11, fontWeight: 900,
              color: page === item.id ? '#C77DFF' : '#aaa',
            }}>{item.label}</div>
            {page === item.id && (
              <div style={{
                width: 20, height: 3, borderRadius: 2,
                background: '#C77DFF', marginTop: 1,
              }} />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
