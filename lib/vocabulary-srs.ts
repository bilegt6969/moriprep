export const DAY_MS = 24 * 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

export const DEFAULT_SRS_CONFIG = {
  firstInterval: 1,
  multiplier: 2,
  lapseMultiplier: 0.5,
  minInterval: 1,
  maxInterval: 365,
  relearnDelayMs: 10 * MINUTE_MS,
  fuzz: 0.05,
  overdueCredit: 1,
} as const;

export interface SrsConfig {
  firstInterval?: number;
  multiplier?: number;
  lapseMultiplier?: number;
  minInterval?: number;
  maxInterval?: number;
  relearnDelayMs?: number;
  fuzz?: number;
  overdueCredit?: number;
}

type ResolvedSrsConfig = Required<SrsConfig>;

export interface ReviewRecord {
  at: number;
  remembered: boolean;
  intervalBefore: number;
  intervalAfter: number;
}

export interface SrsCard {
  id: string;
  front: string;
  back: string;
  interval: number;
  due: number;
  lapses: number;
  reps: number;
  lastReviewed: number | null;
  lastGoodInterval: number | null;
  history: ReviewRecord[];
}

export interface SrsSession {
  current: () => SrsCard | null;
  remaining: () => number;
  nextAvailableAt: () => number | null;
  done: () => boolean;
  answer: (remembered: boolean) => SrsCard | null;
  cards: () => SrsCard[];
}

function getConfig(config: SrsConfig): ResolvedSrsConfig {
  const resolved: ResolvedSrsConfig = { ...DEFAULT_SRS_CONFIG, ...config };
  if (
    resolved.firstInterval <= 0 ||
    resolved.multiplier <= 0 ||
    resolved.lapseMultiplier <= 0 ||
    resolved.minInterval <= 0 ||
    resolved.maxInterval < resolved.minInterval ||
    resolved.relearnDelayMs < 0 ||
    resolved.fuzz < 0 ||
    resolved.fuzz >= 1 ||
    resolved.overdueCredit < 0 ||
    resolved.overdueCredit > 1
  ) {
    throw new RangeError("Invalid spaced-repetition configuration.");
  }
  return resolved;
}

export function newSrsCard(
  id: string,
  front: string,
  back: string,
  now = Date.now(),
): SrsCard {
  return {
    id,
    front,
    back,
    interval: 0,
    due: now,
    lapses: 0,
    reps: 0,
    lastReviewed: null,
    lastGoodInterval: null,
    history: [],
  };
}

export function isNew(card: SrsCard): boolean {
  return card.reps === 0;
}

export function isDue(card: SrsCard, now = Date.now()): boolean {
  return card.due <= now;
}

export function isRelearning(card: SrsCard): boolean {
  return card.interval === 0 && card.reps > 0;
}

function applyFuzz(days: number, fuzz: number, rng: () => number): number {
  if (days < 3 || fuzz === 0) return days;
  return days * (1 + (rng() * 2 - 1) * fuzz);
}

export function reviewSrsCard(
  card: SrsCard,
  remembered: boolean,
  now = Date.now(),
  config: SrsConfig = {},
  rng: () => number = Math.random,
): SrsCard {
  const cfg = getConfig(config);
  const intervalBefore = card.interval;
  let intervalAfter: number;
  let due: number;
  let lapses = card.lapses;
  let lastGoodInterval = card.lastGoodInterval;

  if (remembered) {
    if (card.interval === 0) {
      intervalAfter =
        card.lastGoodInterval !== null
          ? Math.max(cfg.minInterval, card.lastGoodInterval)
          : cfg.firstInterval;
      lastGoodInterval = null;
    } else {
      const elapsedDays =
        card.lastReviewed === null
          ? card.interval
          : Math.max(0, (now - card.lastReviewed) / DAY_MS);
      const overdue = Math.max(0, elapsedDays - card.interval);
      const effectiveInterval = card.interval + overdue * cfg.overdueCredit;
      intervalAfter = effectiveInterval * cfg.multiplier;
    }

    intervalAfter = Math.min(
      cfg.maxInterval,
      Math.max(cfg.minInterval, intervalAfter),
    );
    intervalAfter = Math.min(
      cfg.maxInterval,
      Math.max(
        cfg.minInterval,
        Math.round(applyFuzz(intervalAfter, cfg.fuzz, rng) * 100) / 100,
      ),
    );
    due = now + intervalAfter * DAY_MS;
  } else {
    lapses += 1;
    if (card.interval > 0) {
      lastGoodInterval = Math.max(
        cfg.minInterval,
        card.interval * cfg.lapseMultiplier,
      );
    }
    intervalAfter = 0;
    due = now + cfg.relearnDelayMs;
  }

  return {
    ...card,
    interval: intervalAfter,
    due,
    lapses,
    reps: card.reps + 1,
    lastReviewed: now,
    lastGoodInterval,
    history: [
      ...card.history,
      { at: now, remembered, intervalBefore, intervalAfter },
    ],
  };
}

export function formatDelay(ms: number): string {
  if (ms < 60 * MINUTE_MS) {
    return `${Math.max(1, Math.round(ms / MINUTE_MS))}m`;
  }
  if (ms < DAY_MS) return `${Math.round(ms / (60 * MINUTE_MS))}h`;
  const days = ms / DAY_MS;
  if (days < 30) return `${Math.round(days)}d`;
  if (days < 365) return `${(days / 30).toFixed(1).replace(/\.0$/, "")}mo`;
  return `${(days / 365).toFixed(1).replace(/\.0$/, "")}y`;
}

export function previewSrsCard(
  card: SrsCard,
  now = Date.now(),
  config: SrsConfig = {},
): { remembered: string; forgot: string } {
  const noFuzz = { ...config, fuzz: 0 };
  const remembered = reviewSrsCard(card, true, now, noFuzz, () => 0.5);
  const forgot = reviewSrsCard(card, false, now, noFuzz, () => 0.5);
  return {
    remembered: formatDelay(remembered.due - now),
    forgot: formatDelay(forgot.due - now),
  };
}

export function buildSrsQueue(
  cards: SrsCard[],
  now = Date.now(),
  { newLimit = 20 }: { newLimit?: number } = {},
): SrsCard[] {
  if (!Number.isInteger(newLimit) || newLimit < 0) {
    throw new RangeError("newLimit must be a non-negative integer.");
  }

  const due = cards
    .filter((card) => !isNew(card) && isDue(card, now))
    .sort((a, b) => a.due - b.due);
  const fresh = cards.filter(isNew).slice(0, newLimit);
  return [...due, ...fresh];
}

export function createSrsSession(
  cards: SrsCard[],
  config: SrsConfig = {},
  now: () => number = Date.now,
  { newLimit = 20 }: { newLimit?: number } = {},
): SrsSession {
  const byId = new Map(cards.map((card) => [card.id, { ...card }]));
  const queue = buildSrsQueue([...byId.values()], now(), { newLimit }).map(
    (card) => ({ id: card.id, availableAt: now() }),
  );

  const currentIndex = () => {
    const time = now();
    return queue.findIndex((entry) => entry.availableAt <= time);
  };

  const answer = (remembered: boolean): SrsCard | null => {
    const index = currentIndex();
    if (index < 0) return null;

    const [entry] = queue.splice(index, 1);
    const card = byId.get(entry.id);
    if (!card)
      throw new Error(`Card ${entry.id} is missing from this session.`);

    const updated = reviewSrsCard(card, remembered, now(), config);
    byId.set(updated.id, updated);
    if (!remembered) queue.push({ id: updated.id, availableAt: updated.due });
    return updated;
  };

  return {
    current: () => {
      const index = currentIndex();
      return index < 0 ? null : (byId.get(queue[index].id) ?? null);
    },
    remaining: () => queue.length,
    nextAvailableAt: () =>
      queue.length === 0
        ? null
        : Math.min(...queue.map((entry) => entry.availableAt)),
    done: () => queue.length === 0,
    answer,
    cards: () => [...byId.values()],
  };
}

export function isSrsCard(value: unknown): value is SrsCard {
  if (!value || typeof value !== "object") return false;
  const card = value as Partial<SrsCard>;
  return (
    typeof card.id === "string" &&
    typeof card.front === "string" &&
    typeof card.back === "string" &&
    typeof card.interval === "number" &&
    Number.isFinite(card.interval) &&
    typeof card.due === "number" &&
    Number.isFinite(card.due) &&
    Number.isInteger(card.lapses) &&
    Number.isInteger(card.reps) &&
    (card.lastReviewed === null ||
      (typeof card.lastReviewed === "number" &&
        Number.isFinite(card.lastReviewed))) &&
    (card.lastGoodInterval === null ||
      (typeof card.lastGoodInterval === "number" &&
        Number.isFinite(card.lastGoodInterval))) &&
    Array.isArray(card.history) &&
    card.history.every(
      (entry) =>
        entry &&
        Number.isFinite(entry.at) &&
        typeof entry.remembered === "boolean" &&
        Number.isFinite(entry.intervalBefore) &&
        Number.isFinite(entry.intervalAfter),
    )
  );
}
