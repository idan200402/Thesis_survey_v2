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

function byTopicId(questions) {
  const map = new Map();
  for (const q of questions) {
    if (!q.topicId) throw new Error(`Question ${q.id} missing topicId`);
    if (!q.variant) throw new Error(`Question ${q.id} missing variant ('a' or 'b')`);
    if (!map.has(q.topicId)) map.set(q.topicId, []);
    map.get(q.topicId).push(q);
  }
  return map;
}

function getResponseByType(q, type) {
  const entry = Object.entries(q.responses || {}).find(([, r]) => r?.type === type);
  if (!entry) throw new Error(`Question ${q.id} missing response type: ${type}`);
  const [, r] = entry;
  return { type: r.type, text: r.text };
}

function makeTrial({ q, pairType }) {
  // pairType is either "BT_vs_AF" or "AF_vs_AT"
  let leftType, rightType;
  if (pairType === "BT_vs_AF") {
    leftType = "boring_truth";
    rightType = "appealing_false";
  } else if (pairType === "AF_vs_AT") {
    leftType = "appealing_false";
    rightType = "appealing_truth";
  } else {
    throw new Error(`Unknown pairType: ${pairType}`);
  }

  const r1 = getResponseByType(q, leftType);
  const r2 = getResponseByType(q, rightType);

  const typeToOptionId = (type) => {
    if (type === "appealing_truth") return "AT";
    if (type === "appealing_false") return "AF";
    if (type === "boring_truth") return "BT";
    throw new Error(`Unknown response type: ${type}`);
  };

  const options = [
    {
      optionId: typeToOptionId(r1.type),
      label: "Option 1",
      type: r1.type,
      text: r1.text
    },
    {
      optionId: typeToOptionId(r2.type),
      label: "Option 2",
      type: r2.type,
      text: r2.text
    }
  ];

  return {
    // stable + informative
    trialId: `${q.id}__${pairType}`,
    baseId: q.id,              // question id
    topicId: q.topicId,
    variant: q.variant,        // "a" | "b"
    pairType,
    userQuestion: q.userQuestion,
    options
  };
}

/**
 * New logic:
 * - You have 10 base questions total (2 per topic: variant a and b)
 * - Each base question contains 3 responses (BT, AF, AT)
 * - For each topic:
 *   - one variant must be shown as BT vs AF
 *   - the other variant must be shown as AF vs AT
 *   - which variant gets which is randomized (deterministically by seed)
 * - Randomize trial order overall
 * - Randomize left/right option order within each trial
 */
export function buildTrials(seed = Math.floor(Math.random() * 2 ** 31)) {
  const rand = mulberry32(seed);

  const topics = byTopicId(BASE);

  const trials = [];

  for (const [topicId, qs] of topics.entries()) {
    if (qs.length !== 2) {
      throw new Error(`Topic ${topicId} must have exactly 2 questions (found ${qs.length})`);
    }

    const qa = qs.find((q) => q.variant === "a");
    const qb = qs.find((q) => q.variant === "b");
    if (!qa || !qb) {
      throw new Error(`Topic ${topicId} must include variants 'a' and 'b'`);
    }

    // coin flip: which variant gets which pair
    const aGetsBTvsAF = rand() < 0.5;

    const trialA = makeTrial({
      q: qa,
      pairType: aGetsBTvsAF ? "BT_vs_AF" : "AF_vs_AT"
    });

    const trialB = makeTrial({
      q: qb,
      pairType: aGetsBTvsAF ? "AF_vs_AT" : "BT_vs_AF"
    });

    trials.push(trialA, trialB);
  }

  // shuffle option order (left/right) within each trial
  const trialsWithShuffledOptions = trials.map((t) => ({
    ...t,
    options: shuffle(t.options, rand)
  }));

  // shuffle overall trial order
  const randomizedTrials = shuffle(trialsWithShuffledOptions, rand);

  return { seed, trials: randomizedTrials };
}