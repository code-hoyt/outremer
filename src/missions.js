// Outremer — the mission board (FFTA2 pub/quest-board style). Mission DATA only.
// Recruit missions have vague titles, but the brief and the battle show who you're saving (v0.9: no
// hidden identity — story happens in these battles). WIN, then they offer to join (Accept/Decline).
// Winning is the only condition — how you win doesn't matter (yet).
//
// recruit mission: { companion, map, enemy deployment override, npc: [x, y, facing] where the
//   companion stands as an AI-driven ally (they must survive), intro (brief, before battle),
//   outro (their join offer after victory, with portrait) }
// skirmish: a replayable battle on one of the maps, no story.

export const MISSIONS = [
  {
    id: 'templar-in-need', kind: 'recruit', companion: 'renaud',
    title: 'A Templar in Need',
    sub: 'A brother cut off past the breach. Raiders closing.',
    map: 'breach',
    npc: [4, 4, 3], // holding the rubble of the breach
    enemy: [['knight', 6, 3, 3], ['skirmisher', 5, 1, 2], ['archer', 7, 4, 3]],
    intro: 'Word from the castle road: Brother Renaud, an old knight of the Temple, is holding the breach of the old keep alone, a raiding party pressing him. Reach him before they do. He must not fall.',
    outro: 'The old knight leans on his shield and looks you over. "Brother of the Temple these forty years. You keep the Rule badly, I expect — but you came. I will ride with you, if you will have me."',
  },
  {
    id: 'smoke-at-the-well', kind: 'recruit', companion: 'yusuf',
    title: 'Smoke at the Well',
    sub: 'Raiders fighting among themselves on the ridge.',
    map: 'ridge',
    npc: [4, 3, 2],
    enemy: [['knight', 3, 1, 2], ['sergeant', 1, 1, 2], ['archer', 5, 1, 2], ['skirmisher', 6, 2, 3]],
    intro: 'Shepherds report smoke at the old well and raiders cutting down one of their own: Yusuf ibn Qasim, a rider who turned on his band. They want him dead — which is reason enough to keep him alive.',
    outro: 'Yusuf wipes his blade and lowers it. "Those were my brothers until this morning. I know how they think, where they water, whom they strike first. Take me with you and I will show you."',
  },
  {
    id: 'thief-in-the-baggage', kind: 'recruit', companion: 'wren',
    title: 'Thief in the Baggage Train',
    sub: 'The supply column was raided. Something small is still moving.',
    map: 'baggage',
    npc: [4, 3, 3],
    enemy: [['knight', 7, 4, 3], ['skirmisher', 6, 1, 3], ['archer', 7, 6, 3]],
    intro: 'The baggage train was hit on the coast road. The drovers are fled, the raiders are picking the carts — and a girl called Wren is picking them first. Drive the raiders off. Keep the little thief alive.',
    outro: 'Wren, fifteen or so, arms full of somebody else\'s silver, an amulet humming at her throat. "I wasn\'t stealing, I was saving it. ...Fine. Feed me and I\'ll scout for you. I\'m quick."',
  },
  { id: 'skirmish-ridge', kind: 'skirmish', map: 'ridge', title: 'Skirmish: The Ridge' },
  { id: 'skirmish-breach', kind: 'skirmish', map: 'breach', title: 'Skirmish: The Breach' },
];

export const missionById = (id) => MISSIONS.find((m) => m.id === id) || null;
