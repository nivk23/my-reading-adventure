import { useState, useMemo } from 'react';
import { tts } from '../../lib/tts.js';
import { masteryEngine } from '../../lib/masteryEngine.js';

function segmentWord(word) {
  const digraphs = ['sh','ch','th','wh','ck','ng','ee','ai','oa','oo','ar','or','er','ur','ir','aw','ow'];
  const result = [];
  let i = 0;
  while (i < word.length) {
    const two = word.slice(i, i + 2);
    if (digraphs.includes(two)) { result.push(two); i += 2; }
    else { result.push(word[i]); i++; }
  }
  return result;
}

const VOWEL_COLOUR = '#FF6B6B';
const CONSONANT_COLOUR = '#5BC8F5';
const DIGRAPH_COLOUR = '#C77DFF';
const VOWELS = ['a','e','i','o','u'];

function letterColour(letter) {
  if (letter.length > 1) return DIGRAPH_COLOUR;
  if (VOWELS.includes(letter)) return VOWEL_COLOUR;
  return CONSONANT_COLOUR;
}

export function SoundBoxActivity({ word, onComplete }) {
  const segments = useMemo(() => segmentWord(word.word), [word.word]);
  const [revealed, setRevealed] = useState([]);
  const [done, setDone] = useState(false);

  function tapBox(i) {
    if (revealed.includes(i) || done) return;
    const newRevealed = [...revealed, i];
    setRevealed(newRevealed);
    tts.speakSlow(segments[i]);
    if (newRevealed.length === segments.length) {
      setTimeout(() => {
        tts.speak(word.word);
        setDone(true);
        masteryEngine.recordAnswer('blend', word.word, true);
      }, 600);
    }
  }

  function replay() { tts.speak(word.word); }

  return (
    <div style={{ padding: 24, maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 8, color: '#7c3aed' }}>
        🔲 Sound Boxes
      </div>
      <div style={{ fontSize: 15, color: '#888', fontWeight: 700, marginBottom: 24 }}>
        Tap each box to sound out the word!
      </div>

      <div style={{ fontSize: 72, marginBottom: 8 }}>{word.emoji}</div>
      <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 32, color: '#2D2D2D' }}>
        {word.word}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
        {segments.map((seg, i) => {
          const isRevealed = revealed.includes(i);
          return (
            <button
              key={i}
              onClick={() => tapBox(i)}
              style={{
                width: 72, height: 72,
                border: `4px solid ${isRevealed ? letterColour(seg) : '#d1d5db'}`,
                borderRadius: '1rem',
                background: isRevealed ? `${letterColour(seg)}22` : 'white',
                fontFamily: 'inherit',
                fontWeight: 900,
                fontSize: 28,
                color: isRevealed ? letterColour(seg) : 'transparent',
                cursor: isRevealed ? 'default' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: isRevealed ? `0 4px 0 ${letterColour(seg)}66` : '0 4px 0 #d1d5db',
                transform: isRevealed ? 'translateY(2px)' : 'none',
              }}
            >
              {isRevealed ? seg : '?'}
            </button>
          );
        })}
      </div>

      <div style={{ fontSize: 14, color: '#aaa', fontWeight: 700, marginBottom: 24 }}>
        {revealed.length} / {segments.length} sounds
      </div>

      {done && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
          <div style={{ fontWeight: 900, fontSize: 20, color: '#22c55e', marginBottom: 16 }}>
            Great segmenting!
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={replay}
              style={{
                padding: '14px 24px', background: '#5BC8F5', color: 'white',
                border: 'none', borderRadius: '1.25rem', fontFamily: 'inherit',
                fontWeight: 900, fontSize: 16, cursor: 'pointer', boxShadow: '0 4px 0 #2980b9',
              }}
            >🔊 Again</button>
            <button
              onClick={onComplete}
              style={{
                padding: '14px 32px', background: '#C77DFF', color: 'white',
                border: 'none', borderRadius: '1.25rem', fontFamily: 'inherit',
                fontWeight: 900, fontSize: 16, cursor: 'pointer', boxShadow: '0 4px 0 #9333ea',
              }}
            >Next →</button>
          </div>
        </div>
      )}

      {!done && (
        <button
          onClick={() => tts.speakSlow(word.word)}
          style={{
            padding: '12px 24px', background: 'white', color: '#C77DFF',
            border: '3px solid #C77DFF', borderRadius: '1.25rem', fontFamily: 'inherit',
            fontWeight: 900, fontSize: 15, cursor: 'pointer',
          }}
        >🔊 Hear the word</button>
      )}
    </div>
  );
}
