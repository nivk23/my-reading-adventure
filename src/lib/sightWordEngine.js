import { storage } from './storage.js';
import { SIGHT_WORD_CURRICULUM, LEVEL_INFO } from '../data/sightWordCurriculum.js';

const PROGRESS_KEY = 'sw_progress';
const DAILY_KEY = 'sw_daily_session';
const MASTERED_KEY = 'sw_recently_mastered';

const REVIEW_SCHEDULES = {
  R1: [1, 2, 4],
  R2: [1, 2, 4, 7],
  R3: [1, 2, 4, 7, 14],
  R4: [1, 3, 7, 14, 30],
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getProgress() {
  return storage.get(PROGRESS_KEY) || {};
}

function saveProgress(progress) {
  storage.set(PROGRESS_KEY, progress);
}

function defaultProgress() {
  return {
    status: 'new',
    masteryCount: 0,
    correctCount: 0,
    practiceCount: 0,
    lastReviewed: null,
    nextReview: null,
  };
}

function statusFromMastery(masteryCount) {
  if (masteryCount >= 3) return 'mastered';
  if (masteryCount >= 2) return 'practising';
  if (masteryCount >= 1) return 'learning';
  return 'new';
}

function computeNextReview(schedule, practiceCount, dateStr) {
  const intervals = REVIEW_SCHEDULES[schedule] || REVIEW_SCHEDULES.R2;
  const idx = Math.min(practiceCount - 1, intervals.length - 1);
  const days = intervals[Math.max(0, idx)];
  return addDays(dateStr, days);
}

function mergeWord(currWord) {
  const progress = getProgress();
  const p = progress[currWord.id] || defaultProgress();
  return { ...currWord, ...p };
}

export const sightWordEngine = {
  getWord(wordId) {
    const curr = SIGHT_WORD_CURRICULUM.find(w => w.id === wordId);
    if (!curr) return null;
    return mergeWord(curr);
  },

  getAllWords() {
    return SIGHT_WORD_CURRICULUM.map(mergeWord);
  },

  getLevelWords(level) {
    return SIGHT_WORD_CURRICULUM.filter(w => w.level === level).map(mergeWord);
  },

  recordResult(wordId, knew) {
    const progress = getProgress();
    const curr = SIGHT_WORD_CURRICULUM.find(w => w.id === wordId);
    if (!curr) return null;

    const p = progress[wordId] || defaultProgress();
    const todayStr = today();
    const isNewSession = p.lastReviewed !== todayStr;

    p.practiceCount++;
    p.lastReviewed = todayStr;

    if (knew) {
      p.correctCount++;
      if (isNewSession) {
        p.masteryCount++;
      }
      p.status = statusFromMastery(p.masteryCount);
      p.nextReview = computeNextReview(curr.reviewSchedule, p.practiceCount, todayStr);

      const justMastered = p.masteryCount === 3 && isNewSession;
      if (justMastered) {
        const recent = storage.get(MASTERED_KEY) || [];
        recent.push({ wordId, date: todayStr });
        if (recent.length > 10) recent.shift();
        storage.set(MASTERED_KEY, recent);
      }

      progress[wordId] = p;
      saveProgress(progress);
      return { newStatus: p.status, masteryCount: p.masteryCount, justMastered: justMastered || false };
    }

    p.masteryCount = Math.max(0, p.masteryCount - 1);
    p.status = p.practiceCount > 0 && p.masteryCount === 0 ? 'learning' : statusFromMastery(p.masteryCount);
    if (p.status === 'new' && p.practiceCount > 0) p.status = 'learning';
    p.nextReview = addDays(todayStr, 1);

    progress[wordId] = p;
    saveProgress(progress);
    return { newStatus: p.status, masteryCount: p.masteryCount, justMastered: false };
  },

  getLevelStats(level) {
    const words = this.getLevelWords(level);
    const total = words.length;
    const mastered = words.filter(w => w.status === 'mastered').length;
    const learning = words.filter(w => w.status === 'learning').length;
    const practising = words.filter(w => w.status === 'practising').length;
    const newCount = words.filter(w => w.status === 'new').length;
    return { total, mastered, learning, practising, newCount, percentage: total > 0 ? Math.round((mastered / total) * 100) : 0 };
  },

  getOverallStats() {
    const words = this.getAllWords();
    const total = words.length;
    const mastered = words.filter(w => w.status === 'mastered').length;
    const learning = words.filter(w => w.status === 'learning').length;
    const practising = words.filter(w => w.status === 'practising').length;
    const newCount = words.filter(w => w.status === 'new').length;
    return { total, mastered, learning, practising, newCount, percentage: total > 0 ? Math.round((mastered / total) * 100) : 0 };
  },

  getDailyPractice() {
    const todayStr = today();
    const all = this.getAllWords();
    const result = [];

    const due = shuffle(all.filter(w => w.nextReview && w.nextReview <= todayStr && w.status !== 'new'));
    result.push(...due);

    if (result.length < 10) {
      const active = shuffle(all.filter(w =>
        (w.status === 'learning' || w.status === 'practising') &&
        !result.find(r => r.id === w.id)
      ));
      result.push(...active);
    }

    if (result.length < 10) {
      const difficult = shuffle(
        all.filter(w => w.difficulty >= 2 && w.status !== 'mastered' && !result.find(r => r.id === w.id))
      ).sort((a, b) => b.difficulty - a.difficulty);
      result.push(...difficult);
    }

    if (result.length < 10) {
      const fresh = shuffle(all.filter(w => w.status === 'new' && !result.find(r => r.id === w.id)));
      result.push(...fresh);
    }

    if (result.length < 10) {
      const mastered = shuffle(all.filter(w => w.status === 'mastered' && !result.find(r => r.id === w.id)));
      result.push(...mastered);
    }

    return result.slice(0, 10);
  },

  getReviewQueue() {
    const todayStr = today();
    const all = this.getAllWords();
    return all.filter(w =>
      (w.nextReview && w.nextReview <= todayStr) ||
      w.status === 'learning' ||
      (w.status === 'practising' && w.masteryCount < 3) ||
      (w.practiceCount > 0 && w.correctCount < w.practiceCount * 0.5)
    ).sort((a, b) => a.masteryCount - b.masteryCount);
  },

  getWordsDueToday() {
    const todayStr = today();
    return this.getAllWords().filter(w => w.nextReview && w.nextReview <= todayStr);
  },

  getRecentlyMastered() {
    const recent = storage.get(MASTERED_KEY) || [];
    return recent.map(r => {
      const word = this.getWord(r.wordId);
      return word ? { ...word, masteredDate: r.date } : null;
    }).filter(Boolean);
  },

  searchWords(query) {
    if (!query || !query.trim()) return [];
    const q = query.trim().toLowerCase();
    return this.getAllWords().filter(w => w.word.toLowerCase().includes(q));
  },

  filterWords({ status, level } = {}) {
    let words = this.getAllWords();
    if (status) words = words.filter(w => w.status === status);
    if (level) words = words.filter(w => w.level === level);
    return words;
  },

  getDailySession() {
    return storage.get(DAILY_KEY);
  },

  saveDailySession(session) {
    storage.set(DAILY_KEY, session);
  },

  resetProgress() {
    storage.remove(PROGRESS_KEY);
    storage.remove(DAILY_KEY);
    storage.remove(MASTERED_KEY);
  },
};
