const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const toNumberOrDefault = (value, fallback) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }
  return numeric;
};

const sanitizeFeatureScore = (value) => clamp(toNumberOrDefault(value, 5), 0, 10);

export function getHeightModifier(heightInInches, gender) {
  const height = toNumberOrDefault(heightInInches, 68);
  const normalizedGender = gender === 'female' ? 'female' : 'male';

  if (normalizedGender === 'female') {
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

export function generatePSLMessage(result) {
  const { grade, rawPSL, strongestArea, weakestArea, heightModifier } = result;

  let heightLine = '';
  if (heightModifier < 0) {
    heightLine =
      'Height slightly lowers your raw score, so the best move is to improve face framing, physique, posture, and style.';
  } else if (heightModifier === 0) {
    heightLine = 'Height is neutral in this model, so most gains come from controllable areas.';
  } else {
    heightLine =
      'Height gives a small boost, but your score is still driven mostly by face, grooming, and presentation.';
  }

  return `Grade ${grade}. Your current Maxx Scale is ${(rawPSL / 10).toFixed(1)}/10. Strongest area: ${strongestArea}. Weakest area: ${weakestArea}. Your fastest improvement path is ${weakestArea} plus grooming, posture, and style consistency. ${heightLine}`;
}

export function calculatePSLScore(inputs) {
  const safeInputs = {
    canthalTilt: sanitizeFeatureScore(inputs?.canthalTilt),
    eyeSpacing: sanitizeFeatureScore(inputs?.eyeSpacing),
    browArea: sanitizeFeatureScore(inputs?.browArea),
    underEye: sanitizeFeatureScore(inputs?.underEye),
    eyeOpenness: sanitizeFeatureScore(inputs?.eyeOpenness),
    jawline: sanitizeFeatureScore(inputs?.jawline),
    chinProjection: sanitizeFeatureScore(inputs?.chinProjection),
    cheekbones: sanitizeFeatureScore(inputs?.cheekbones),
    profileBalance: sanitizeFeatureScore(inputs?.profileBalance),
    skinClarity: sanitizeFeatureScore(inputs?.skinClarity),
    acneTexture: sanitizeFeatureScore(inputs?.acneTexture),
    grooming: sanitizeFeatureScore(inputs?.grooming),
    haircutFit: sanitizeFeatureScore(inputs?.haircutFit),
    hairDensity: sanitizeFeatureScore(inputs?.hairDensity),
    hairline: sanitizeFeatureScore(inputs?.hairline),
    hairstyleFit: sanitizeFeatureScore(inputs?.hairstyleFit),
    symmetry: sanitizeFeatureScore(inputs?.symmetry),
    facialHarmony: sanitizeFeatureScore(inputs?.facialHarmony),
    physique: sanitizeFeatureScore(inputs?.physique),
    bodyFatScore: sanitizeFeatureScore(inputs?.bodyFatScore),
    posture: sanitizeFeatureScore(inputs?.posture),
    style: sanitizeFeatureScore(inputs?.style),
    heightInInches: toNumberOrDefault(inputs?.heightInInches, 68),
    gender: inputs?.gender === 'female' ? 'female' : 'male',
  };

  const eyeArea =
    safeInputs.canthalTilt * 0.25 +
    safeInputs.eyeSpacing * 0.2 +
    safeInputs.browArea * 0.2 +
    safeInputs.underEye * 0.2 +
    safeInputs.eyeOpenness * 0.15;

  const lowerThird =
    safeInputs.jawline * 0.4 +
    safeInputs.chinProjection * 0.3 +
    safeInputs.cheekbones * 0.15 +
    safeInputs.profileBalance * 0.15;

  const skinGrooming =
    safeInputs.skinClarity * 0.4 +
    safeInputs.acneTexture * 0.2 +
    safeInputs.grooming * 0.2 +
    safeInputs.haircutFit * 0.2;

  const hair =
    safeInputs.hairDensity * 0.35 +
    safeInputs.hairline * 0.35 +
    safeInputs.hairstyleFit * 0.3;

  const harmonySymmetry = safeInputs.symmetry * 0.5 + safeInputs.facialHarmony * 0.5;

  const bodyPresentation =
    safeInputs.physique * 0.5 + safeInputs.bodyFatScore * 0.3 + safeInputs.posture * 0.2;

  const stylePosture = safeInputs.style * 0.6 + safeInputs.posture * 0.4;

  const PSLBase =
    eyeArea * 0.2 +
    lowerThird * 0.18 +
    skinGrooming * 0.15 +
    hair * 0.12 +
    harmonySymmetry * 0.18 +
    bodyPresentation * 0.12 +
    stylePosture * 0.05;

  // Inputs are 0-10; convert model output to 0-100 range.
  const normalizedBase = PSLBase * 10;
  const heightModifier = getHeightModifier(safeInputs.heightInInches, safeInputs.gender);
  const controllablePSL = clamp(Math.round(normalizedBase), 0, 100);
  const rawPSL = clamp(Math.round(normalizedBase + heightModifier), 0, 100);
  const grade = getGrade(rawPSL);

  const categoryScores = [
    ['Eye Area', eyeArea],
    ['Lower Third', lowerThird],
    ['Skin and Grooming', skinGrooming],
    ['Hair', hair],
    ['Harmony and Symmetry', harmonySymmetry],
    ['Body Presentation', bodyPresentation],
    ['Style and Posture', stylePosture],
  ];
  const sortedCategories = [...categoryScores].sort((a, b) => b[1] - a[1]);
  const strongestArea = sortedCategories[0][0];
  const weakestArea = sortedCategories[sortedCategories.length - 1][0];

  const result = {
    rawPSL,
    controllablePSL,
    heightModifier,
    grade,
    strongestArea,
    weakestArea,
  };

  return {
    ...result,
    personalizedMessage: generatePSLMessage(result),
  };
}
