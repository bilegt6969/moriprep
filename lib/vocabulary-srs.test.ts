import { describe, expect, it } from "vitest";
import {
  buildSrsQueue,
  createSrsSession,
  DAY_MS,
  newSrsCard,
  reviewSrsCard,
} from "./vocabulary-srs";

describe("vocabulary spaced repetition", () => {
  it("graduates a new card and doubles its interval after success", () => {
    const first = reviewSrsCard(
      newSrsCard("word", "front", "back", 0),
      true,
      0,
      {
        fuzz: 0,
      },
    );
    const second = reviewSrsCard(first, true, DAY_MS, { fuzz: 0 });

    expect(first.interval).toBe(1);
    expect(second.interval).toBe(2);
  });

  it("credits overdue time when a card is remembered", () => {
    const card = {
      ...newSrsCard("word", "front", "back", 0),
      interval: 2,
      reps: 1,
      lastReviewed: 0,
    };

    expect(reviewSrsCard(card, true, 4 * DAY_MS, { fuzz: 0 }).interval).toBe(8);
  });

  it("resumes from a reduced interval after a lapse and relearning", () => {
    const mature = {
      ...newSrsCard("word", "front", "back", 0),
      interval: 8,
      reps: 2,
      lastReviewed: 0,
    };
    const forgotten = reviewSrsCard(mature, false, 0, { fuzz: 0 });
    const relearned = reviewSrsCard(forgotten, true, 10 * 60 * 1000, {
      fuzz: 0,
    });

    expect(forgotten.interval).toBe(0);
    expect(forgotten.lastGoodInterval).toBe(4);
    expect(forgotten.due).toBe(10 * 60 * 1000);
    expect(relearned.interval).toBe(4);
    expect(relearned.lastGoodInterval).toBeNull();
    expect(mature.interval).toBe(8);
  });

  it("graduates a new card after it is forgotten on its first review", () => {
    const forgotten = reviewSrsCard(
      newSrsCard("word", "front", "back", 0),
      false,
      0,
      { fuzz: 0 },
    );

    expect(
      reviewSrsCard(forgotten, true, 10 * 60 * 1000, { fuzz: 0 }).interval,
    ).toBe(1);
  });

  it("applies fuzz only to intervals of at least three days", () => {
    const fresh = newSrsCard("fresh", "front", "back", 0);
    const mature = {
      ...fresh,
      id: "mature",
      interval: 2,
      reps: 1,
      lastReviewed: 0,
    };
    const rng = () => 0;

    expect(reviewSrsCard(fresh, true, 0, {}, rng).interval).toBe(1);
    expect(reviewSrsCard(mature, true, 2 * DAY_MS, {}, rng).interval).toBe(3.8);
  });

  it("queues due cards by overdue date before a limited number of new cards", () => {
    const cards = [
      { ...newSrsCard("new-1", "front", "back", 0) },
      {
        ...newSrsCard("due-later", "front", "back", 0),
        interval: 1,
        reps: 1,
        due: 8,
      },
      { ...newSrsCard("new-2", "front", "back", 0) },
      {
        ...newSrsCard("due-first", "front", "back", 0),
        interval: 1,
        reps: 1,
        due: 3,
      },
    ];

    expect(
      buildSrsQueue(cards, 10, { newLimit: 1 }).map((card) => card.id),
    ).toEqual(["due-first", "due-later", "new-1"]);
  });

  it("requeues forgotten cards after the relearning delay", () => {
    let now = 0;
    const session = createSrsSession(
      [newSrsCard("word", "front", "back", now)],
      { fuzz: 0 },
      () => now,
    );

    expect(session.current()?.id).toBe("word");
    session.answer(false);
    expect(session.remaining()).toBe(1);
    expect(session.current()).toBeNull();

    now = 10 * 60 * 1000;
    expect(session.current()?.id).toBe("word");
  });
});
