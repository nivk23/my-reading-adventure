import { PHONEMES } from '../data/phonemes.js';
import { CVC_WORDS } from '../data/words.js';
import { SIGHT_WORDS } from '../data/sightWords.js';
import { STORIES } from '../data/stories.js';
import { masteryEngine, STATUS } from './masteryEngine.js';

export const curriculumEngine = {
  getCurrentPhase() {
    for (let phase = 1; phase <= 8; phase++) {
      const phasePhonemes = PHONEMES.filter(p => p.curriculumPhase === phase);
      const allPractising = phasePhonemes.every(p =>
        [STATUS.PRACTISING, STATUS.MASTERED, STATUS.NEEDS_REVIEW].includes(
          masteryEngine.getStatus('phoneme', p.id)
        )
      );
      if (!allPractising) return phase;
    }
    return 8;
  },

  getAvailablePhonemes() {
    const phase = this.getCurrentPhase();
    return PHONEMES.filter(p => p.curriculumPhase <= phase);
  },

  getNextPhonemes(count = 3) {
    const phase = this.getCurrentPhase();
    return PHONEMES
      .filter(p => p.curriculumPhase === phase)
      .filter(p => ![STATUS.MASTERED].includes(masteryEngine.getStatus('phoneme', p.id)))
      .slice(0, count);
  },

  getAvailableWords() {
    const available = this.getAvailablePhonemes().map(p => p.id);
    return CVC_WORDS.filter(w => w.prerequisitePhonemes.every(ph => available.includes(ph)));
  },

  getAvailableSightWords() {
    const phase = this.getCurrentPhase();
    return SIGHT_WORDS.filter(sw => sw.level <= phase);
  },

  getAvailableStories() {
    const available = this.getAvailablePhonemes().map(p => p.id);
    const availableSW = this.getAvailableSightWords().map(sw => sw.word);
    return STORIES.filter(s =>
      s.requiredPhonemes.every(ph => available.includes(ph)) &&
      s.requiredSightWords.every(sw => availableSW.includes(sw))
    );
  },

  buildDailyMission() {
    const nextPhonemes = this.getNextPhonemes(2);
    const availableWords = this.getAvailableWords();
    const needsReviewPhonemes = PHONEMES.filter(p => masteryEngine.needsReview('phoneme', p.id)).slice(0, 2);
    const needsReviewSW = this.getAvailableSightWords().filter(sw => masteryEngine.needsReview('sight', sw.word)).slice(0, 2);
    const availableStories = this.getAvailableStories();

    const steps = [];

    if (needsReviewPhonemes.length) {
      steps.push({ type: 'phonics', phoneme: needsReviewPhonemes[0], label: 'Warmup', emoji: '🔥' });
    } else if (nextPhonemes.length) {
      steps.push({ type: 'phonics', phoneme: nextPhonemes[0], label: 'New Sound', emoji: '✨' });
    }

    if (nextPhonemes.length > 1) {
      steps.push({ type: 'phonics', phoneme: nextPhonemes[1], label: 'Phonics', emoji: '🔤' });
    } else if (nextPhonemes.length === 1) {
      steps.push({ type: 'phonics', phoneme: nextPhonemes[0], label: 'Phonics', emoji: '🔤' });
    }

    if (availableWords.length) {
      const word = availableWords[Math.floor(Math.random() * Math.min(availableWords.length, 10))];
      steps.push({ type: 'blend', word, label: 'Blending', emoji: '🔗' });
    }

    const swTodo = needsReviewSW.length ? needsReviewSW : this.getAvailableSightWords().slice(0, 2);
    if (swTodo.length) {
      steps.push({ type: 'sightword', sightWord: swTodo[0], label: 'Sight Word', emoji: '👁️' });
    }

    if (availableStories.length) {
      steps.push({ type: 'story', story: availableStories[0], label: 'Reading', emoji: '📖' });
    }

    return steps.slice(0, 5);
  },
};
