import { useState } from 'react';
import { PHONEMES } from '../data/phonemes.js';
import { SIGHT_WORDS } from '../data/sightWords.js';
import { masteryEngine, STATUS } from '../lib/masteryEngine.js';
import { SettingsPanel } from '../components/SettingsPanel.jsx';
import { PrintWorksheet } from '../components/PrintWorksheet.jsx';
import { VoiceRecorder } from '../features/voiceRecording/VoiceRecorder.jsx';
import { sessionHistory } from '../lib/sessionHistory.js';
import { storage } from '../lib/storage.js';

export function ParentDashboard() {
  const [showSettings, setShowSettings] = useState(false);
  const [showWorksheet, setShowWorksheet] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const stats = masteryEngine.getStats();
  const todayStats = sessionHistory.getTodayStats();
  const history = sessionHistory.getHistory();
  const childName = storage.get('child_name') || 'your child';

  const masteredPhonemes = PHONEMES.filter(p => masteryEngine.getStatus('phoneme', p.id) === STATUS.MASTERED);
  const reviewPhonemes = PHONEMES.filter(p => masteryEngine.getStatus('phoneme', p.id) === STATUS.NEEDS_REVIEW);
  const masteredSight = SIGHT_WORDS.filter(sw => masteryEngine.getStatus('sight', sw.word) === STATUS.MASTERED);

  function handleReset() {
    if (confirmReset) {
      masteryEngine.reset();
      storage.remove('daily_mission');
      storage.remove('completed_today');
      setConfirmReset(false);
      window.location.reload();
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
    }
  }

  if (showWorksheet) {
    return <PrintWorksheet onClose={() => setShowWorksheet(false)} />;
  }

  return (
    <>
    {showVoiceRecorder && <VoiceRecorder onClose={() => setShowVoiceRecorder(false)} />}
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontWeight: 900, fontSize: 22 }}>👨‍👩‍👧 Parent Dashboard</div>
        <button
          onClick={() => setShowSettings(true)}
          style={{
            background: '#f3f4f6', border: 'none', borderRadius: '1rem',
            padding: '10px 16px', fontFamily: 'inherit', fontWeight: 900,
            cursor: 'pointer', fontSize: 14,
          }}
        >⚙️ Settings</button>
      </div>

      {todayStats.total > 0 && (
        <div style={{
          background: 'linear-gradient(135deg,#EDE9FE,#E0F7FF)',
          borderRadius: '1.25rem', padding: 16, marginBottom: 20,
          border: '2px solid #C77DFF',
        }}>
          <div style={{ fontWeight: 900, fontSize: 14, color: '#7c3aed', marginBottom: 8 }}>
            🌟 Today — {childName}
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 22 }}>{todayStats.total}</div>
              <div style={{ fontSize: 12, color: '#7c3aed', fontWeight: 700 }}>activities</div>
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 22 }}>{todayStats.correct}</div>
              <div style={{ fontSize: 12, color: '#7c3aed', fontWeight: 700 }}>correct</div>
            </div>
            {todayStats.total > 0 && (
              <div>
                <div style={{ fontWeight: 900, fontSize: 22 }}>
                  {Math.round(todayStats.correct / todayStats.total * 100)}%
                </div>
                <div style={{ fontSize: 12, color: '#7c3aed', fontWeight: 700 }}>accuracy</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{
        background: '#FFF8F0', borderRadius: '1.25rem',
        padding: 16, marginBottom: 20,
        border: '2px solid #FFD93D',
      }}>
        <div style={{ fontWeight: 900, fontSize: 14, color: '#8B5E3C', marginBottom: 8 }}>📊 Overall Progress</div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {[
            { label: 'Mastered sounds', value: stats.mastered },
            { label: 'Currently learning', value: stats.learning },
            { label: 'Practising', value: stats.practising },
            { label: 'Need review', value: stats.needsReview },
            { label: 'Sight words', value: masteredSight.length },
          ].map(s => (
            <div key={s.label} style={{ minWidth: 80 }}>
              <div style={{ fontWeight: 900, fontSize: 22 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#8B5E3C', fontWeight: 700 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {reviewPhonemes.length > 0 && (
        <div style={{
          background: '#FEF2F2', borderRadius: '1.25rem',
          padding: 16, marginBottom: 20,
          border: '2px solid #fca5a5',
        }}>
          <div style={{ fontWeight: 900, fontSize: 14, color: '#dc2626', marginBottom: 8 }}>
            🔄 Needs Review ({reviewPhonemes.length})
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.7 }}>
            Say these sounds with your child:{' '}
            <strong>{reviewPhonemes.map(p => `/${p.phoneme}/`).join(', ')}</strong>
          </div>
        </div>
      )}

      {masteredPhonemes.length > 0 && (
        <div style={{
          background: '#F0FDF4', borderRadius: '1.25rem',
          padding: 16, marginBottom: 20,
          border: '2px solid #86efac',
        }}>
          <div style={{ fontWeight: 900, fontSize: 14, color: '#16a34a', marginBottom: 8 }}>
            ⭐ Mastered Sounds
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {masteredPhonemes.map(p => (
              <span key={p.id} style={{
                background: '#dcfce7', borderRadius: '0.5rem',
                padding: '3px 10px', fontWeight: 900, fontSize: 14, color: '#16a34a',
              }}>/{p.phoneme}/</span>
            ))}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div style={{
          background: 'white', borderRadius: '1.25rem',
          padding: 16, marginBottom: 20,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <div style={{ fontWeight: 900, fontSize: 14, marginBottom: 10 }}>📅 Recent Sessions</div>
          {history.slice(0, 7).map((session, i) => {
            const correct = session.activities.filter(a => a.correct).length;
            const total = session.activities.length;
            const pct = total > 0 ? Math.round(correct / total * 100) : 0;
            const date = new Date(session.date);
            const label = date.toDateString() === new Date().toDateString()
              ? 'Today'
              : date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '8px 0',
                borderBottom: i < Math.min(history.length, 7) - 1 ? '1px solid #f3f4f6' : 'none',
              }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#555', minWidth: 70 }}>{label}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 8, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: '#6BCFA5', borderRadius: 4 }} />
                  </div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 900, color: '#888', minWidth: 50, textAlign: 'right' }}>
                  {correct}/{total}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{
        background: 'white', borderRadius: '1.25rem',
        padding: 16, marginBottom: 20,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <div style={{ fontWeight: 900, fontSize: 14, marginBottom: 10 }}>🧠 Teaching Tips</div>
        <div style={{ fontSize: 14, lineHeight: 1.8, color: '#555' }}>
          <div>• Always say the <strong>sound</strong>, never the letter name (say /m/ not "em").</div>
          <div>• Blend slowly: hold each sound, then speed up to merge them.</div>
          <div>• Tricky words: just say them — there&apos;s no rule to decode them.</div>
          <div>• Celebrate every attempt — errors are part of learning!</div>
        </div>
      </div>

      <button
        onClick={() => setShowVoiceRecorder(true)}
        style={{
          width: '100%', padding: '16px',
          background: '#FFF8F0', color: '#FF6B6B',
          border: '2px solid #FF6B6B', borderRadius: '1.25rem',
          fontFamily: 'inherit', fontWeight: 900, fontSize: 15,
          cursor: 'pointer', marginBottom: 12,
        }}
      >🎙️ Record Your Voice</button>

      <button
        onClick={() => setShowWorksheet(true)}
        style={{
          width: '100%', padding: '16px',
          background: '#EDE9FE', color: '#7c3aed',
          border: '2px solid #C77DFF', borderRadius: '1.25rem',
          fontFamily: 'inherit', fontWeight: 900, fontSize: 15,
          cursor: 'pointer', marginBottom: 12,
        }}
      >🖨️ Print Worksheet</button>

      <button
        onClick={handleReset}
        style={{
          width: '100%', padding: '16px',
          background: confirmReset ? '#ef4444' : '#f3f4f6',
          color: confirmReset ? 'white' : '#888',
          border: 'none', borderRadius: '1.25rem',
          fontFamily: 'inherit', fontWeight: 900, fontSize: 15,
          cursor: 'pointer',
        }}
      >
        {confirmReset ? '⚠️ Tap again to confirm reset' : '🗑️ Reset all progress (dev)'}
      </button>
    </div>
    </>
  );
}
