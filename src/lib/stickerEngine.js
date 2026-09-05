import { storage } from './storage.js';

const STICKERS = [
  { id: 'first_lesson', label: 'First Lesson!', emoji: '🌟', description: 'Complete your first phonics lesson' },
  { id: 'three_mastered', label: '3 Sounds!', emoji: '🎯', description: 'Master 3 phonemes' },
  { id: 'five_mastered', label: 'Star Learner', emoji: '⭐', description: 'Master 5 phonemes' },
  { id: 'ten_mastered', label: 'Reading Hero', emoji: '🦸', description: 'Master 10 phonemes' },
  { id: 'first_story', label: 'Bookworm', emoji: '📚', description: 'Read your first story' },
  { id: 'three_stories', label: 'Story Master', emoji: '🏰', description: 'Read 3 stories' },
  { id: 'streak_3', label: '3 Day Streak!', emoji: '🔥', description: '3 days in a row' },
  { id: 'streak_7', label: 'Week Wonder', emoji: '🌈', description: '7 days in a row' },
  { id: 'all_games', label: 'Game Champion', emoji: '🎮', description: 'Play all 3 mini-games' },
  { id: 'perfect_quiz', label: 'Perfect!', emoji: '💯', description: 'Get full marks in a lesson quiz' },
  { id: 'word_family', label: 'Word Family', emoji: '👨‍👩‍👧', description: 'Complete a word family' },
  { id: 'sound_box', label: 'Sound Sorter', emoji: '🔲', description: 'Segment 5 words' },
];

export const stickerEngine = {
  getEarned() { return storage.get('stickers_earned') || []; },

  award(id) {
    const earned = this.getEarned();
    if (earned.includes(id)) return false;
    storage.set('stickers_earned', [...earned, id]);
    return true;
  },

  checkAndAward(stats, streak) {
    const awarded = [];
    if (stats.mastered >= 1) if (this.award('first_lesson')) awarded.push('first_lesson');
    if (stats.mastered >= 3) if (this.award('three_mastered')) awarded.push('three_mastered');
    if (stats.mastered >= 5) if (this.award('five_mastered')) awarded.push('five_mastered');
    if (stats.mastered >= 10) if (this.award('ten_mastered')) awarded.push('ten_mastered');
    if (streak >= 3) if (this.award('streak_3')) awarded.push('streak_3');
    if (streak >= 7) if (this.award('streak_7')) awarded.push('streak_7');
    return awarded.map(id => STICKERS.find(s => s.id === id)).filter(Boolean);
  },

  getAllStickers() { return STICKERS; },
};
