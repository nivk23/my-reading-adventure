import { useState, useRef, useEffect } from 'react';
import { curriculumEngine } from '../../lib/curriculumEngine.js';

export function VoiceRecorder({ onClose }) {
  const availablePhonemes = curriculumEngine.getAvailablePhonemes();
  const [selectedPhoneme, setSelectedPhoneme] = useState(availablePhonemes[0] || null);
  const [recording, setRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    if (selectedPhoneme) {
      const stored = localStorage.getItem(`mra_recording_${selectedPhoneme.id}`);
      setHasRecording(!!stored);
    }
  }, [selectedPhoneme]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = () => {
          localStorage.setItem(`mra_recording_${selectedPhoneme.id}`, reader.result);
          setHasRecording(true);
          stream.getTracks().forEach(t => t.stop());
        };
        reader.readAsDataURL(blob);
      };
      mediaRecorderRef.current = mr;
      mr.start();
      setRecording(true);
    } catch {
      alert('Microphone not available. Please allow microphone access.');
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  function playRecording() {
    const stored = localStorage.getItem(`mra_recording_${selectedPhoneme.id}`);
    if (stored) { new Audio(stored).play(); }
  }

  function deleteRecording() {
    localStorage.removeItem(`mra_recording_${selectedPhoneme.id}`);
    setHasRecording(false);
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100 }} />
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'white', borderRadius: '1.75rem 1.75rem 0 0',
        padding: '28px 24px', zIndex: 101, maxHeight: '85vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontWeight: 900, fontSize: 20 }}>🎙️ Record Your Voice</div>
          <button onClick={onClose} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: 36, height: 36, fontSize: 18, cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
        </div>
        <div style={{ fontSize: 14, color: '#888', fontWeight: 700, marginBottom: 20 }}>
          Record each sound in your own voice — your child will hear you instead of the computer.
        </div>

        <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 10 }}>Choose a sound:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
          {availablePhonemes.map(ph => {
            const hasRec = !!localStorage.getItem(`mra_recording_${ph.id}`);
            return (
              <button key={ph.id} onClick={() => setSelectedPhoneme(ph)} style={{
                padding: '10px 16px', fontFamily: 'inherit', fontWeight: 900, fontSize: 18,
                border: `3px solid ${selectedPhoneme?.id === ph.id ? '#C77DFF' : hasRec ? '#22c55e' : '#e5e7eb'}`,
                background: selectedPhoneme?.id === ph.id ? '#EDE9FE' : hasRec ? '#F0FDF4' : 'white',
                borderRadius: '1rem', cursor: 'pointer',
              }}>
                {ph.grapheme} {hasRec ? '✅' : ''}
              </button>
            );
          })}
        </div>

        {selectedPhoneme && (
          <div style={{ background: '#FFF8F0', borderRadius: '1.25rem', padding: 20, marginBottom: 20 }}>
            <div style={{ fontWeight: 900, fontSize: 28, color: '#C77DFF', marginBottom: 4 }}>/{selectedPhoneme.phoneme}/</div>
            <div style={{ fontSize: 14, color: '#555', marginBottom: 4 }}>{selectedPhoneme.exampleEmoji} {selectedPhoneme.exampleWord}</div>
            <div style={{ fontSize: 13, color: '#888', fontStyle: 'italic' }}>Say: &ldquo;{selectedPhoneme.teachingTip}&rdquo;</div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {!recording ? (
            <button onClick={startRecording} style={{
              flex: 1, padding: 16, background: '#FF6B6B', color: 'white',
              border: 'none', borderRadius: '1.25rem', fontFamily: 'inherit',
              fontWeight: 900, fontSize: 16, cursor: 'pointer', boxShadow: '0 4px 0 #c0392b',
            }}>🔴 Record</button>
          ) : (
            <button onClick={stopRecording} style={{
              flex: 1, padding: 16, background: '#6BCFA5', color: 'white',
              border: 'none', borderRadius: '1.25rem', fontFamily: 'inherit',
              fontWeight: 900, fontSize: 16, cursor: 'pointer', boxShadow: '0 4px 0 #27ae60',
            }}>⏹ Stop Recording</button>
          )}
          {hasRecording && (
            <>
              <button onClick={playRecording} style={{
                padding: '16px 20px', background: '#5BC8F5', color: 'white',
                border: 'none', borderRadius: '1.25rem', fontFamily: 'inherit',
                fontWeight: 900, fontSize: 16, cursor: 'pointer', boxShadow: '0 4px 0 #2980b9',
              }}>▶️ Play</button>
              <button onClick={deleteRecording} style={{
                padding: '16px 20px', background: '#f3f4f6', color: '#888',
                border: '2px solid #e5e7eb', borderRadius: '1.25rem', fontFamily: 'inherit',
                fontWeight: 700, fontSize: 14, cursor: 'pointer',
              }}>🗑️</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
