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
import { SegmentingActivity } from './features/segmenting/SegmentingActivity.jsx';
import { WordFamiliesActivity } from './features/wordFamilies/WordFamiliesActivity.jsx';
import { PhonemeSubstitution } from './features/phonemeSubstitution/PhonemeSubstitution.jsx';
import { StickerBookPage } from './pages/StickerBookPage.jsx';
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
  const [showStickerBook, setShowStickerBook] = useState(false);
  const [settings] = useState(() => storage.get('settings') || {});

  const fontSizeMap = { small: 14, medium: 16, large: 18, xlarge: 22 };
  const letterSpacingMap = { tight: '-0.02em', normal: '0', wide: '0.04em', wider: '0.08em' };

  const rootStyle = {
    fontFamily: "'Nunito', system-ui, sans-serif",
    fontSize: fontSizeMap[settings.fontSize] || 16,
    letterSpacing: letterSpacingMap[settings.letterSpacing] || '0',
    background: 'linear-gradient(160deg,#FFF8F0 0%,#F5F0FF 50%,#F0FDF4 100%)',
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

  if (showStickerBook) {
    return (
      <div style={rootStyle}>
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', borderBottom: '2px solid #f3f4f6', background: 'white' }}>
            <button onClick={() => setShowStickerBook(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', marginRight: 8 }}>←</button>
            <div style={{ fontWeight: 900, fontSize: 18 }}>My Sticker Book</div>
          </div>
          <StickerBookPage />
        </div>
      </div>
    );
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
          {activity.type === 'game' && activity.game === 'segmenting' && (
            <SegmentingActivity onComplete={completeActivity} />
          )}
          {activity.type === 'game' && activity.game === 'wordFamilies' && (
            <WordFamiliesActivity onComplete={completeActivity} />
          )}
          {activity.type === 'game' && activity.game === 'phonemeSubstitution' && (
            <PhonemeSubstitution onComplete={completeActivity} />
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
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setShowStickerBook(true)}
            style={{
              background: '#FFF8F0', border: '2px solid #FFD93D', borderRadius: '1rem',
              padding: '6px 12px', fontFamily: 'inherit',
              fontWeight: 900, fontSize: 13, cursor: 'pointer',
            }}
          >🌟 Stickers</button>
          <button
            onClick={() => setPage('parent')}
            style={{
              background: '#f3f4f6', border: 'none', borderRadius: '1rem',
              padding: '6px 12px', fontFamily: 'inherit',
              fontWeight: 900, fontSize: 13, cursor: 'pointer',
            }}
          >👨‍👩‍👧</button>
        </div>
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
              flex: 1, padding: '10px 4px 14px',
              background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              minHeight: 64,
            }}
          >
            <div style={{ fontSize: 26 }}>{item.emoji}</div>
            <div style={{
              fontSize: 12, fontWeight: 900,
              color: page === item.id ? '#C77DFF' : '#aaa',
            }}>{item.label}</div>
            {page === item.id && (
              <div style={{
                width: 24, height: 3, borderRadius: 2,
                background: '#C77DFF', marginTop: 1,
              }} />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
