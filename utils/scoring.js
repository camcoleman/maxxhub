const CATEGORY_WEIGHTS = {
  looks: 0.3,
  body: 0.25,
  status: 0.15,
  energy: 0.15,
  social: 0.15,
};

const clampScore = (score) => Math.max(0, Math.min(100, Math.round(score)));

export function getHeightModifier(heightInInches, gender) {
  const height = Number(heightInInches) || 0;

  if (gender === 'female') {
    if (height >= 70) {
      return 1;
    }
    if (height >= 64) {
      return 0;
    }
    if (height >= 61) {
      return -1;
    }
    return -2;
  }

  if (height >= 72) {
    return 2;
  }
  if (height >= 70) {
    return 1;
  }
  if (height >= 68) {
    return 0;
  }
  if (height >= 66) {
    return -2;
  }
  if (height >= 64) {
    return -4;
  }
  return -6;
}

export function getGrade(score) {
  if (score >= 90) {
    return 'S';
  }
  if (score >= 80) {
    return 'A';
  }
  if (score >= 70) {
    return 'B';
  }
  if (score >= 60) {
    return 'C';
  }
  if (score >= 50) {
    return 'D';
  }
  return 'F';
}

const getStrongestAndWeakestAreas = (inputs) => {
  const categoryPairs = [
    ['Looks', Number(inputs.looks) || 0],
    ['Body', Number(inputs.body) || 0],
    ['Status', Number(inputs.status) || 0],
    ['Energy', Number(inputs.energy) || 0],
    ['Social', Number(inputs.social) || 0],
  ];
  const sorted = [...categoryPairs].sort((a, b) => b[1] - a[1]);

  return {
    strongestArea: sorted[0][0],
    weakestArea: sorted[sorted.length - 1][0],
  };
};

export function generateScoringMessage(inputs) {
  const {
    grade,
    rawScore,
    strongestArea,
    weakestArea,
    heightModifier,
  } = calculateMaxxScore(inputs);

  let heightExplanation = '';
  if (heightModifier < 0) {
    heightExplanation =
      'Your height slightly lowers your raw score, so your best leverage is improving physique, style, posture, and social confidence.';
  } else if (heightModifier === 0) {
    heightExplanation =
      'Your height is neutral in the current model, so your gains mostly come from controllable areas.';
  } else {
    heightExplanation = 'Your height gives you a small boost in your overall score.';
  }

  return `Grade ${grade}. Your current Maxx Scale is ${(rawScore / 10).toFixed(1)}/10. Your strongest area is ${strongestArea}, and your biggest opportunity is ${weakestArea}. ${heightExplanation}`;
}

export function calculateMaxxScore(inputs) {
  const looks = Number(inputs.looks) || 0;
  const body = Number(inputs.body) || 0;
  const status = Number(inputs.status) || 0;
  const energy = Number(inputs.energy) || 0;
  const social = Number(inputs.social) || 0;
  const heightInInches = Number(inputs.heightInInches) || 0;
  const gender = inputs.gender === 'female' ? 'female' : 'male';

  const controllableRaw =
    looks * CATEGORY_WEIGHTS.looks +
    body * CATEGORY_WEIGHTS.body +
    status * CATEGORY_WEIGHTS.status +
    energy * CATEGORY_WEIGHTS.energy +
    social * CATEGORY_WEIGHTS.social;

  const heightModifier = getHeightModifier(heightInInches, gender);
  const rawScoreValue = controllableRaw + heightModifier;
  const controllableScore = clampScore(controllableRaw);
  const rawScore = clampScore(rawScoreValue);
  const grade = getGrade(rawScore);

  const { strongestArea, weakestArea } = getStrongestAndWeakestAreas(inputs);
  let heightExplanation = '';
  if (heightModifier < 0) {
    heightExplanation =
      'Your height slightly lowers your raw score, so your best leverage is improving physique, style, posture, and social confidence.';
  } else if (heightModifier === 0) {
    heightExplanation =
      'Your height is neutral in the current model, so your gains mostly come from controllable areas.';
  } else {
    heightExplanation = 'Your height gives you a small boost in your overall score.';
  }

  const personalizedMessage = `Grade ${grade}. Your current Maxx Scale is ${(rawScore / 10).toFixed(1)}/10. Your strongest area is ${strongestArea}, and your biggest opportunity is ${weakestArea}. ${heightExplanation}`;

  return {
    rawScore,
    controllableScore,
    heightModifier,
    grade,
    strongestArea,
    weakestArea,
    personalizedMessage,
  };
}
