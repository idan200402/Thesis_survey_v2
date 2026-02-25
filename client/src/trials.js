import BASE from "./data/questions.json";

// deterministic PRNG (Mulberry32)
function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(arr, rand) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function typeToOptionId(type) {
  if (type === "appealing_truth") return "AT";
  if (type === "appealing_false") return "AF";
  if (type === "boring_truth") return "BT";
  throw new Error(`Unknown response type: ${type}`);
}

function questionToTrial(q) {
  const entries = Object.entries(q.responses); // expect A/B only
  if (entries.length !== 2) {
    throw new Error(`Question ${q.id} must have exactly 2 responses (found ${entries.length}).`);
  }

  const options = entries.map(([key, r], idx) => ({
    optionId: typeToOptionId(r.type),
    label: `Option ${idx + 1}`,
    type: r.type,
    text: r.text,
    sourceKey: key
  }));

  return {
    trialId: q.id,       // keep it simple: one question = one trial
    baseId: q.id,
    pairType: q.pairType,
    userQuestion: q.userQuestion,
    options
  };
}

/**
 * Build trials directly from the 10 questions in questions.json:
 * - randomize trial order
 * - randomize option order (left/right) within each trial
 */
export function buildTrials(seed = Math.floor(Math.random() * 2 ** 31)) {
  const rand = mulberry32(seed);

  const trials = BASE.map(questionToTrial);

  const trialsWithShuffledOptions = trials.map((t) => ({
    ...t,
    options: shuffle(t.options, rand)
  }));

  const randomizedTrials = shuffle(trialsWithShuffledOptions, rand);

  return { seed, trials: randomizedTrials };
}