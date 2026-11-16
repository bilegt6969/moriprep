export interface VocabularyTerm {
  id: string;
  word: string;
  definition: string;
}

export interface VocabularyDeck {
  id: string;
  name: string;
  description: string;
  cards: VocabularyTerm[];
}

const makeTerms = (entries: [string, string][], prefix: string) =>
  entries.map(([word, definition], index) => ({
    id: `${prefix}-${index + 1}`,
    word,
    definition,
  }));

export const VOCABULARY_DECKS: VocabularyDeck[] = [
  {
    id: "sat-vocab-nov",
    name: "November SAT Vocabulary",
    description: "Words and concepts collected from November SAT practice.",
    cards: makeTerms(
      [
        [
          "Uncharacteristic of",
          "Not typical or usual for someone or something.",
        ],
        ["Immaterial to", "Not relevant or important to something."],
        [
          "Pathological",
          "Caused by disease, or extreme and unhealthy in behavior or feeling.",
        ],
        ["Monetize", "To make money from something."],
        [
          "Precipitate",
          "To cause an event, especially a sudden or negative one, to happen.",
        ],
        [
          "Precipitation",
          "Rain, snow, sleet, or hail that falls from the sky.",
        ],
        [
          "Precipitate (chemistry)",
          "To cause a dissolved substance to form a solid; also, the solid that forms.",
        ],
        [
          "Synthesis",
          "The combining of different ideas or things into a new whole.",
        ],
        ["Enhance", "To improve or increase something."],
        ["Feasible", "Possible and practical to do."],
        [
          "Malign",
          "To speak about someone or something in a harmful or unfairly negative way.",
        ],
        [
          "Belie",
          "To give a false impression of something or hide the truth about it.",
        ],
        ["Convoluted", "Extremely complicated and difficult to follow."],
        ["Contrived", "Artificial or too obviously planned."],
        ["Condensed", "Made shorter, smaller, or more concentrated."],
        ["Dearth", "A lack or shortage of something."],
        ["Thwart", "To prevent someone from achieving something."],
        ["Optimal", "Best or most favorable for a particular situation."],
        ["Forage", "To search widely for food or supplies."],
        ["Abate", "To become less strong or severe."],
        [
          "Abatement",
          "A reduction in the strength, amount, or severity of something.",
        ],
        [
          "Aggregate",
          "To combine separate things into a whole; also, the total formed.",
        ],
        [
          "Impart",
          "To give or communicate information, knowledge, or a quality.",
        ],
        ["Ameliorate", "To make a bad situation less bad."],
        [
          "Rigor",
          "Great care, thoroughness, and strictness in thinking or work.",
        ],
        [
          "Inequitable",
          "Unfair or unjust, especially in the distribution of resources or opportunities.",
        ],
        ["Resurgence", "A return or increase after a period of decline."],
        ["Credible", "Believable or worthy of trust."],
        [
          "Inconsistencies",
          "Differences or contradictions between things that should agree.",
        ],
        [
          "Parasocial",
          "Involving a one-sided emotional relationship with a public figure or media personality.",
        ],
        ["Pretense", "A false appearance or claim intended to deceive."],
        [
          "Portend",
          "To be a sign that something important or bad is about to happen.",
        ],
      ],
      "nov",
    ),
  },
  {
    id: "sat-vocab-oct",
    name: "October SAT Vocabulary",
    description: "Words and concepts collected from October SAT practice.",
    cards: makeTerms(
      [
        [
          "Veneration",
          "Deep respect or admiration, sometimes bordering on worship.",
        ],
        ["Admonitions", "Warnings or firm advice about how to behave."],
        [
          "Obfuscation",
          "The act of making something unclear or difficult to understand.",
        ],
        [
          "Exonerations",
          "Official findings that people are not responsible or guilty.",
        ],
        ["Parameters", "Limits, rules, or conditions that shape something."],
        [
          "Anomalies",
          "Things that are unusual or different from what is expected.",
        ],
        [
          "Optimization",
          "The process of making something as effective or efficient as possible.",
        ],
        [
          "Predictions",
          "Statements about what is expected to happen in the future.",
        ],
        [
          "Isolating",
          "Separating something for examination or control; also, making someone feel lonely.",
        ],
        ["Regulate", "To control something through rules or adjustments."],
        ["Innovate", "To introduce new ideas, methods, or products."],
        ["Sufficient", "Enough for a particular purpose."],
        [
          "Austere",
          "Plain and without comfort or decoration; also, strict or severe.",
        ],
        ["Skeptically", "In a way that shows doubt or disbelief."],
        ["Satiate", "To completely satisfy a desire or appetite."],
        ["Interplay", "The way two or more things affect each other."],
        [
          "Throughput",
          "The amount of work, material, or data processed in a given period.",
        ],
        ["Abstain", "To choose not to do or take part in something."],
        ["Incipient", "Just beginning to develop or appear."],
        ["Deviate", "To move away from an expected path, rule, or standard."],
        ["Ambivalent", "Having mixed or conflicting feelings about something."],
        ["Ambiguous", "Unclear because it can have more than one meaning."],
        ["Attenuate", "To weaken or reduce in strength or intensity."],
        ["Impede", "To block, slow down, or make something more difficult."],
      ],
      "oct",
    ),
  },
  {
    id: "sat-vocab-sep",
    name: "September SAT Vocabulary",
    description: "Words and concepts collected from September SAT practice.",
    cards: makeTerms(
      [
        ["Enigmatic", "Mysterious or difficult to understand."],
        ["Pragmatic", "Focused on what is practical and likely to work."],
        [
          "The former and the latter",
          "The former means the first of two things mentioned; the latter means the second.",
        ],
        ["Ambivalent", "Having mixed or conflicting feelings about something."],
        ["Abundant", "Existing in large amounts; plentiful."],
        ["Enumerate", "To list or number things one by one; to count."],
        ["Lament", "To express sadness or regret about something."],
        ["Contest", "To challenge or argue against something."],
        ["Rescind", "To officially cancel or withdraw something."],
        ["Impartial", "Fair and not favoring one side over another."],
        ["Ample", "More than enough; plentiful."],
        ["Fraudulent", "Dishonest or fake, especially to deceive someone."],
        [
          "Guardedness",
          "Caution about revealing thoughts, feelings, or information.",
        ],
        ["Resolve", "Firm determination to do something."],
        [
          "Discretion",
          "Freedom to make a judgment; also, care in keeping something private.",
        ],
        ["Rudimentary", "Basic and not fully developed."],
        ["Obviate", "To remove the need for something or prevent a problem."],
        ["Byzantine", "Extremely complicated and difficult to understand."],
        [
          "Tolerance for",
          "Willingness or ability to accept or endure something.",
        ],
      ],
      "sep",
    ),
  },
  {
    id: "sat-vocab-aug",
    name: "August SAT Vocabulary",
    description: "Words and concepts collected from August SAT practice.",
    cards: makeTerms(
      [
        ["Impertinent", "Rude or disrespectful, especially by being too bold."],
        [
          "Pertinent",
          "Relevant and directly related to the subject being discussed.",
        ],
        ["Amenable", "Willing to agree, cooperate, or accept something."],
        ["Detrimental", "Harmful or damaging."],
        [
          "Entitled",
          "Having a right to something; also, believing oneself to deserve special treatment.",
        ],
        [
          "Upended",
          "Turned upside down, literally or figuratively; completely disrupted.",
        ],
        [
          "Vulnerability",
          "A weakness that makes someone or something open to harm.",
        ],
        [
          "Redundancy",
          "Unnecessary repetition; in engineering, useful backup systems.",
        ],
        ["Discrepancy", "A difference between things that should match."],
        ["Insolvency", "Being unable to pay debts."],
        ["Considerable", "Large, or important enough to be noticeable."],
        ["Subordinate", "Lower in rank, importance, or power."],
        [
          "Indication",
          "A sign or piece of evidence that something is true or likely.",
        ],
        ["Incongruous", "Out of place or not fitting with the surroundings."],
        ["Invariable", "Always the same; never changing."],
        ["Ambiguous", "Unclear because it can have more than one meaning."],
        ["Malicious", "Intending to harm someone or cause damage."],
        ["Imperceptible", "Impossible or very difficult to notice."],
        [
          "Nominal",
          "Very small or symbolic; existing in name but not necessarily in reality.",
        ],
      ],
      "aug",
    ),
  },
  {
    id: "sat-vocab-jul",
    name: "July SAT Vocabulary",
    description: "Words and concepts collected from July SAT practice.",
    cards: makeTerms(
      [
        ["Itemize", "To list things one by one."],
        ["Activate", "To make something start working or become active."],
        ["Deter", "To discourage someone from doing something."],
        [
          "Deterrence",
          "The prevention of an action by making its consequences seem serious.",
        ],
        [
          "Encryption",
          "The process of changing information into a secret code.",
        ],
        ["Proxy", "A person or thing that acts in place of another."],
        ["Simulation", "An imitation of a real situation or process."],
        ["Auxiliary", "Giving extra help or support."],
        [
          "Parameters",
          "Limits, rules, or measurable conditions that shape something.",
        ],
        ["Indispensable", "Absolutely necessary."],
        ["Resolute", "Firm and determined."],
        [
          "Discrepancy",
          "A difference or mismatch between things that should agree.",
        ],
        [
          "Perfunctory",
          "Done with little care or effort, often as a formality.",
        ],
        ["Discontinuous", "Not connected; having gaps or breaks."],
        ["Meticulously", "In a very careful and detailed way."],
        ["Anachronistic", "Out of its proper historical time."],
        ["Paradoxically", "Surprisingly, in a way that seems contradictory."],
        [
          "Refurbish",
          "To repair, renovate, or improve something to make it look new again.",
        ],
      ],
      "jul",
    ),
  },
];

export const VOCABULARY_SRS_STORAGE_KEY = "vocabulary-srs-v1";

export type VocabularyProgress = Record<string, SrsCard[]>;

export function loadVocabularyProgress(): VocabularyProgress {
  const raw = localStorage.getItem(VOCABULARY_SRS_STORAGE_KEY);
  if (!raw) return {};

  const progress: unknown = JSON.parse(raw);
  if (!progress || typeof progress !== "object" || Array.isArray(progress)) {
    throw new Error("Saved vocabulary progress has an invalid format.");
  }
  for (const [deckId, cards] of Object.entries(progress)) {
    if (!Array.isArray(cards) || !cards.every(isSrsCard)) {
      throw new Error(`Saved vocabulary progress for ${deckId} is invalid.`);
    }
  }
  return progress as VocabularyProgress;
}

export function saveVocabularyProgress(progress: VocabularyProgress): void {
  localStorage.setItem(VOCABULARY_SRS_STORAGE_KEY, JSON.stringify(progress));
}
import { isSrsCard, type SrsCard } from "@/lib/vocabulary-srs";
