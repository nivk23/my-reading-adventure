import { useState, useCallback } from 'react';
import { SWLHome } from './SWLHome.jsx';
import { LevelPage } from './LevelPage.jsx';
import { WordReader } from './WordReader.jsx';
import { PracticeSession } from './PracticeSession.jsx';
import { ReviewQueue } from './ReviewQueue.jsx';
import { SWLProgress } from './SWLProgress.jsx';
import { SWLParentDashboard } from './SWLParentDashboard.jsx';
import { WordSearch } from './WordSearch.jsx';
import { sightWordEngine } from '../../lib/sightWordEngine.js';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', emoji: '🏠' },
  { id: 'search', label: 'Words', emoji: '📖' },
  { id: 'review', label: 'Practise', emoji: '✏️' },
  { id: 'progress', label: 'Progress', emoji: '📊' },
];

const FULLSCREEN_VIEWS = ['reader', 'practice', 'parent'];

export function SightWordLibrary({ onBack }) {
  const [view, setView] = useState('home');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const [practiceWords, setPracticeWords] = useState(null);
  const [practiceTitle, setPracticeTitle] = useState(null);
  const [returnView, setReturnView] = useState('home');
  const [, setTick] = useState(0);

  const refresh = useCallback(() => setTick(t => t + 1), []);

  const goHome = useCallback(() => { setView('home'); refresh(); }, [refresh]);

  const openLevel = useCallback((level) => {
    setSelectedLevel(level);
    setView('level');
  }, []);

  const openWord = useCallback((word, from) => {
    setSelectedWord(word);
    setReturnView(from || view);
    setView('reader');
  }, [view]);

  const startPractice = useCallback((words, title, from) => {
    setPracticeWords(words);
    setPracticeTitle(title || null);
    setReturnView(from || view);
    setView('practice');
  }, [view]);

  const handleReaderResult = useCallback((wordId, knew) => {
    sightWordEngine.recordResult(wordId, knew);
  }, []);

  const handleReaderDone = useCallback(() => {
    setView(returnView);
    setSelectedWord(null);
    refresh();
  }, [returnView, refresh]);

  const handlePracticeComplete = useCallback(() => {
    setView(returnView);
    setPracticeWords(null);
    refresh();
  }, [returnView, refresh]);

  const showNav = !FULLSCREEN_VIEWS.includes(view);

  return (
    <div style={{
      fontFamily: "'Nunito', system-ui, sans-serif",
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: 640,
      margin: '0 auto',
      position: 'relative',
    }}>
      {/* Header - always visible except in reader/practice */}
      {showNav && (
        <div style={{
          padding: '14px 20px 12px',
          background: 'white',
          borderBottom: '2px solid #f3f4f6',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={onBack} style={{
              background: 'none', border: 'none', fontSize: 20, cursor: 'pointer',
              fontFamily: 'inherit', padding: 0, color: '#C77DFF',
            }}>←</button>
            <div style={{ fontWeight: 900, fontSize: 17 }}>Sight Word Library 📖</div>
          </div>
          <button
            onClick={() => setView('parent')}
            style={{
              background: '#f3f4f6', border: 'none', borderRadius: '1rem',
              padding: '6px 12px', fontFamily: 'inherit',
              fontWeight: 900, fontSize: 13, cursor: 'pointer',
            }}
          >🔒</button>
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: showNav ? 80 : 0 }}>
        {view === 'home' && (
          <SWLHome
            onOpenLevel={openLevel}
            onStartPractice={(words) => startPractice(words, "Today's Reading", 'home')}
            onOpenSearch={() => setView('search')}
          />
        )}

        {view === 'level' && selectedLevel && (
          <LevelPage
            level={selectedLevel}
            onSelectWord={(w) => openWord(w, 'level')}
            onBack={() => { setView('home'); refresh(); }}
            onStartPractice={(words) => startPractice(words, `Level ${selectedLevel} Practice`, 'level')}
          />
        )}

        {view === 'reader' && selectedWord && (
          <div>
            <div style={{
              padding: '12px 20px', background: 'white', borderBottom: '2px solid #f3f4f6',
              display: 'flex', alignItems: 'center',
            }}>
              <button onClick={handleReaderDone} style={{
                background: 'none', border: 'none', fontSize: 20, cursor: 'pointer',
                fontFamily: 'inherit', padding: 0,
              }}>←</button>
              <div style={{ fontWeight: 900, fontSize: 16, marginLeft: 10 }}>Reading</div>
            </div>
            <WordReader
              word={selectedWord}
              onResult={handleReaderResult}
              onDone={handleReaderDone}
            />
          </div>
        )}

        {view === 'practice' && practiceWords && (
          <PracticeSession
            words={practiceWords}
            onComplete={handlePracticeComplete}
            title={practiceTitle}
          />
        )}

        {view === 'review' && (
          <ReviewQueue
            onStartPractice={(words) => startPractice(words, 'Practice Session', 'review')}
            onSelectWord={(w) => openWord(w, 'review')}
            onBack={goHome}
          />
        )}

        {view === 'progress' && <SWLProgress />}

        {view === 'parent' && (
          <SWLParentDashboard onBack={goHome} />
        )}

        {view === 'search' && (
          <WordSearch
            onSelectWord={(w) => openWord(w, 'search')}
            onBack={() => { setView('home'); refresh(); }}
          />
        )}
      </div>

      {/* Bottom nav */}
      {showNav && (
        <nav style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 640,
          background: 'white', borderTop: '2px solid #f3f4f6',
          display: 'flex', zIndex: 20,
          paddingBottom: 'env(safe-area-inset-bottom, 0)',
        }}>
          {NAV_ITEMS.map(item => {
            const active = view === item.id || (item.id === 'home' && view === 'level');
            return (
              <button
                key={item.id}
                onClick={() => { setView(item.id); refresh(); }}
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
                  color: active ? '#C77DFF' : '#aaa',
                }}>{item.label}</div>
                {active && (
                  <div style={{
                    width: 24, height: 3, borderRadius: 2,
                    background: '#C77DFF', marginTop: 1,
                  }} />
                )}
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
