const BASE_LEADERBOARD = [
  {
    handle: 'AstraBuilt',
    maxxScale: 9.3,
    rankTitle: 'Prime Tier',
    stats: { Looks: 93, Body: 90, Money: 84, Energy: 88, Social: 86, Identity: 89 },
  },
  {
    handle: 'SteelSigma',
    maxxScale: 8.9,
    rankTitle: 'Apex Tier',
    stats: { Looks: 87, Body: 91, Money: 79, Energy: 82, Social: 80, Identity: 83 },
  },
  {
    handle: 'NeonMonk',
    maxxScale: 8.5,
    rankTitle: 'Apex Tier',
    stats: { Looks: 84, Body: 81, Money: 78, Energy: 87, Social: 76, Identity: 80 },
  },
  {
    handle: 'FrameTheory',
    maxxScale: 8.0,
    rankTitle: 'Builder Tier',
    stats: { Looks: 79, Body: 76, Money: 73, Energy: 82, Social: 71, Identity: 75 },
  },
  {
    handle: 'LiftLogic',
    maxxScale: 7.6,
    rankTitle: 'Builder Tier',
    stats: { Looks: 72, Body: 82, Money: 68, Energy: 74, Social: 69, Identity: 70 },
  },
  {
    handle: 'QuietWeapon',
    maxxScale: 7.2,
    rankTitle: 'Contender Tier',
    stats: { Looks: 70, Body: 73, Money: 66, Energy: 72, Social: 68, Identity: 69 },
  },
];

const getComposite = (entry) => Number(entry.maxxScale) || 0;

export function getGlobalLeaderboard(userEntry) {
  const merged = [...BASE_LEADERBOARD, userEntry].map((entry) => ({
    ...entry,
    composite: getComposite(entry),
  }));

  const sorted = merged.sort((a, b) => b.composite - a.composite);
  return sorted.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}
