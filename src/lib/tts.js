const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

export const tts = {
  speak(text, { rate = 0.85, pitch = 1.1, volume = 1 } = {}) {
    if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(String(text));
    u.rate = rate;
    u.pitch = pitch;
    u.volume = volume;
    synth.speak(u);
  },
  speakSlow(text) {
    this.speak(text, { rate: 0.65, pitch: 1.15 });
  },
  cancel() {
    synth?.cancel();
  },
};
