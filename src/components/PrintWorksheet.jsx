import { masteryEngine, STATUS } from '../lib/masteryEngine.js';
import { PHONEMES } from '../data/phonemes.js';
import { SIGHT_WORDS } from '../data/sightWords.js';
import { curriculumEngine } from '../lib/curriculumEngine.js';
import { storage } from '../lib/storage.js';

export function PrintWorksheet({ onClose }) {
  const childName = storage.get('child_name') || 'Reader';
  const phase = curriculumEngine.getCurrentPhase();
  const masteredPhonemes = PHONEMES.filter(p => masteryEngine.getStatus('phoneme', p.id) === STATUS.MASTERED);
  const learningPhonemes = PHONEMES.filter(p => {
    const s = masteryEngine.getStatus('phoneme', p.id);
    return s === STATUS.LEARNING || s === STATUS.PRACTISING;
  }).slice(0, 6);
  const sightWordsDue = SIGHT_WORDS.filter(sw => {
    const s = masteryEngine.getStatus('sight', sw.word);
    return s === STATUS.LEARNING || s === STATUS.PRACTISING || s === STATUS.NEEDS_REVIEW;
  }).slice(0, 8);

  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; font-family: 'Nunito', sans-serif; }
        }
      `}</style>

      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontWeight: 900, fontSize: 18 }}>🖨️ Print Worksheet</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => window.print()}
            style={{
              background: '#C77DFF', color: 'white', border: 'none', borderRadius: '1rem',
              padding: '10px 20px', fontFamily: 'inherit', fontWeight: 900, fontSize: 14,
              cursor: 'pointer',
            }}
          >🖨️ Print</button>
          <button
            onClick={onClose}
            style={{
              background: '#f3f4f6', border: 'none', borderRadius: '1rem',
              padding: '10px 16px', fontFamily: 'inherit', fontWeight: 900, fontSize: 14,
              cursor: 'pointer',
            }}
          >✕ Close</button>
        </div>
      </div>

      <div style={{
        background: 'white', borderRadius: '1.25rem', padding: 24,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        fontFamily: "'Nunito', sans-serif",
      }}>
        <div style={{ textAlign: 'center', marginBottom: 20, borderBottom: '3px solid #C77DFF', paddingBottom: 16 }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#C77DFF' }}>⭐ My Reading Adventure</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#555' }}>
            {childName}&apos;s Worksheet — Phase {phase} — {today}
          </div>
        </div>

        {learningPhonemes.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 10, color: '#7c3aed' }}>
              📚 Practise These Sounds
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
              {learningPhonemes.map(p => (
                <div key={p.id} style={{
                  width: 56, height: 56, border: '3px solid #C77DFF', borderRadius: '1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: 20, color: '#7c3aed',
                }}>{p.phoneme}</div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: '#888', fontWeight: 700 }}>
              Say each sound out loud. Say the sound, not the letter name!
            </div>
          </div>
        )}

        {learningPhonemes.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 10, color: '#7c3aed' }}>
              ✏️ Trace the Sounds
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {learningPhonemes.map(p => (
                <div key={p.id} style={{ textAlign: 'center', width: 76 }}>
                  <div style={{
                    height: 48, border: '2px dashed #C77DFF', borderRadius: '0.75rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, color: '#d8b4fe', marginBottom: 4, fontWeight: 900,
                  }}>{p.phoneme}</div>
                  <div style={{ height: 48, border: '2px solid #e5e7eb', borderRadius: '0.75rem' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {sightWordsDue.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 10, color: '#F97316' }}>
              👁️ Sight Words — Read and Cover
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {sightWordsDue.map(sw => (
                <div key={sw.word} style={{
                  padding: '6px 14px', background: '#FFF8F0',
                  border: '2px solid #FFD93D', borderRadius: '0.75rem',
                  fontWeight: 900, fontSize: 15, color: '#92400e',
                }}>{sw.word}</div>
              ))}
            </div>
            <div>
              {sightWordsDue.map(sw => (
                <div key={sw.word} style={{
                  display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8,
                }}>
                  <div style={{ fontWeight: 900, minWidth: 60, fontSize: 14 }}>{sw.word}</div>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ flex: 1, borderBottom: '2px solid #e5e7eb' }} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {masteredPhonemes.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 8, color: '#16a34a' }}>
              🌟 Sounds I Know!
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {masteredPhonemes.map(p => (
                <div key={p.id} style={{
                  padding: '3px 10px', background: '#F0FDF4',
                  border: '2px solid #86efac', borderRadius: '0.5rem',
                  fontWeight: 900, fontSize: 13, color: '#16a34a',
                }}>/{p.phoneme}/</div>
              ))}
            </div>
          </div>
        )}

        <div style={{
          background: '#F5F0FF', borderRadius: '1rem', padding: 14,
          border: '2px solid #C77DFF',
        }}>
          <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 8, color: '#7c3aed' }}>
            📝 My Reading Journal — Write a sentence or draw a picture!
          </div>
          <div style={{ height: 80, border: '2px solid #e5e7eb', borderRadius: '0.75rem', background: 'white' }} />
        </div>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: '#bbb', fontWeight: 700 }}>
          My Reading Adventure — {today}
        </div>
      </div>
    </div>
  );
}
