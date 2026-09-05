import { storage } from './storage.js';

export const STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  LEARNING: 'LEARNING',
  PRACTISING: 'PRACTISING',
  MASTERED: 'MASTERED',
  NEEDS_REVIEW: 'NEEDS_REVIEW',
};

const THRESHOLDS = {
  PRACTISING: 3,
  MASTERED: 6,
  NEEDS_REVIEW_WRONG: 2,
  REVIEW_DAYS: 3,
};

function recordKey(type, id) {
  return `${type}_${id}`;
}

export const masteryEngine = {
  getRecord(type, id) {
    return storage.get(recordKey(type, id)) || {
      status: STATUS.NOT_STARTED,
      correctCount: 0,
      wrongCount: 0,
      totalAttempts: 0,
      lastPracticed: null,
      masteredDate: null,
      errors: [],
      streak: 0,
    };
  },

  recordAnswer(type, id, correct) {
    const rec = this.getRecord(type, id);
    rec.totalAttempts++;
    rec.lastPracticed = Date.now();
    if (correct) {
      rec.correctCount++;
      rec.streak++;
    } else {
      rec.wrongCount++;
      rec.streak = 0;
      rec.errors.push({ timestamp: Date.now() });
      if (rec.errors.length > 10) rec.errors.shift();
    }
    if (rec.status === STATUS.NOT_STARTED) rec.status = STATUS.LEARNING;
    if (rec.correctCount >= THRESHOLDS.MASTERED && rec.status !== STATUS.MASTERED) {
      rec.status = STATUS.MASTERED;
      rec.masteredDate = Date.now();
    } else if (rec.correctCount >= THRESHOLDS.PRACTISING && rec.status === STATUS.LEARNING) {
      rec.status = STATUS.PRACTISING;
    }
    if (rec.status === STATUS.MASTERED && !correct && rec.wrongCount >= THRESHOLDS.NEEDS_REVIEW_WRONG) {
      rec.status = STATUS.NEEDS_REVIEW;
    }
    storage.set(recordKey(type, id), rec);
    return rec;
  },

  getStatus(type, id) {
    return this.getRecord(type, id).status;
  },

  isUnlocked(type, id) {
    return this.getStatus(type, id) !== STATUS.NOT_STARTED;
  },

  needsReview(type, id) {
    const rec = this.getRecord(type, id);
    if (rec.status === STATUS.NEEDS_REVIEW) return true;
    if (rec.status === STATUS.MASTERED && rec.lastPracticed) {
      const daysSince = (Date.now() - rec.lastPracticed) / 86400000;
      return daysSince > THRESHOLDS.REVIEW_DAYS;
    }
    return false;
  },

  getStats() {
    const keys = [];
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith('mra_'))
        .forEach(k => keys.push(k.slice(4)));
    } catch {}
    const stats = { mastered: 0, learning: 0, practising: 0, needsReview: 0, total: keys.length };
    keys.forEach(k => {
      const rec = storage.get(k);
      if (!rec) return;
      if (rec.status === STATUS.MASTERED) stats.mastered++;
      else if (rec.status === STATUS.LEARNING) stats.learning++;
      else if (rec.status === STATUS.PRACTISING) stats.practising++;
      else if (rec.status === STATUS.NEEDS_REVIEW) stats.needsReview++;
    });
    return stats;
  },

  reset() {
    storage.clear();
  },
};
