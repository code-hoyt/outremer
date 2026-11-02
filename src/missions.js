// Outremer — the mission board (FFTA2 pub/quest-board style). Mission DATA only.
// Recruit missions have vague titles, but the brief and the battle show who you're saving (v0.9: no
// hidden identity — story happens in these battles). WIN, then they offer to join (Accept/Decline).
// Winning is the only condition — how you win doesn't matter (yet).
//
// recruit mission: { companion, map, enemy deployment override, npc: [x, y, facing] where the
//   companion stands as an AI-driven ally (they must survive), intro (brief, before battle),
//   outro (their join offer after victory, with portrait) }
// skirmish: a replayable battle on one of the maps, no story.
// v0.11 campaign (Option B): each recruit mission, once won, gives a `clue` (shown on the board and in the finale
//   brief). `clueLines[otherId]` = an extra brief line when that other mission is already won (any order works).
// finale: unlocks after CONFIG.campaign.finaleAfterWins recruit wins; brief lines vary by clues, fielded and
//   missed companions; `ending` / `endingWren` / `endLines` make the ending card.

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
    clue: 'Renaud escorted a sealed reliquary. "They took the coast road with the carts."',
    clueLines: {
      'smoke-at-the-well': 'Yusuf says the Captain wanted the column\'s escort dead first. Renaud was the escort.',
      'thief-in-the-baggage': 'The drovers at the baggage train said one knight stayed behind at the old keep so they could run.',
    },
  },
  {
    id: 'smoke-at-the-well', kind: 'recruit', companion: 'yusuf',
    title: 'Smoke at the Well',
    sub: 'Raiders fighting among themselves on the ridge.',
    map: 'ridge',
    npc: [4, 3, 2], npcHpMul: 1.4, // v0.11: 1.2 → 1.4 (ally fell 14–17% with companions); starts in the thick of his old band: tougher so the rescue is a race, not a coin flip
    enemy: [['knight', 3, 1, 2], ['sergeant', 1, 1, 2], ['archer', 5, 1, 2], ['skirmisher', 6, 2, 3]],
    intro: 'Shepherds report smoke at the old well and raiders cutting down one of their own: Yusuf ibn Qasim, a rider who turned on his band. They want him dead — which is reason enough to keep him alive.',
    outro: 'Yusuf wipes his blade and lowers it. "Those were my brothers until this morning. I know how they think, where they water, whom they strike first. Take me with you and I will show you."',
    clue: 'Yusuf: "He\'ll make for the chapel at the ford. Holy ground. He thinks it\'s needed to open the box."',
    clueLines: {
      'templar-in-need': 'Renaud says the raiders took the coast road with the carts. These are the same riders, come back up the ridge.',
      'thief-in-the-baggage': 'Wren\'s amulet came off a box the raiders wanted badly. Their deserter may know why.',
    },
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
    clue: 'Wren\'s amulet came off the reliquary\'s straps. "It hums louder east. Toward the river."',
    clueLines: {
      'templar-in-need': 'Renaud: "They took the coast road with the carts." This is where.',
      'smoke-at-the-well': 'Yusuf says the Captain ordered the drovers killed "for a box of bones". Find out what was in the carts.',
    },
  },
  {
    id: 'chapel-ford', kind: 'finale',
    title: 'The Chapel Ford',
    sub: 'The Red Captain has the reliquary. End it.',
    map: 'ford',
    intro: 'The Red Captain holds a ruined chapel above the river ford, the stolen reliquary on its altar, waiting for something. Cross the river, take the hill, and bring him down: when he falls, his band breaks.',
    // brief lines: one per fielded companion (their payoff), one per companion not in your company (what it costs)
    fielded: {
      renaud: 'Renaud knows the Captain: a Templar sergeant who broke the Rule. While Renaud stands next to him, the Captain is Shaken (his strikes land less often).',
      yusuf: 'Yusuf knows his old band\'s habits: you will see the Captain\'s next strike from anywhere on the field.',
      wren: 'Wren\'s amulet hums near the chapel. She marks where the reliquary lies, and knows stepping stones across the north shallows.',
    },
    missed: {
      renaud: 'The Captain wears a Templar\'s sword now. Renaud\'s, by the hilt. (+1 ATK)',
      yusuf: 'No deserter ever split this band: there is one more bow on the hill.',
      wren: 'They say a raider scout, a child, knows the chapel\'s side door. (one more raider on round 3)',
    },
    ending: 'The Red Captain falls on the chapel steps and his band scatters into the river. On the altar sits the reliquary, its seal broken. You lift the lid. Nothing. The box is empty, but warm.',
    endingWren: 'Then Wren\'s amulet begins to hum, and from somewhere inside the empty box, something hums back.',
    endLines: {
      renaud: 'Renaud: "He was a brother once. Bury him on the hill, facing east."',
      yusuf: 'Yusuf: "They will not ride under him again. Some of them will ride with no one at all."',
      wren: 'Wren holds the amulet tight. "It wasn\'t empty. It was waiting."',
    },
  },
  { id: 'skirmish-ridge', kind: 'skirmish', map: 'ridge', title: 'Skirmish: The Ridge' },
  { id: 'skirmish-breach', kind: 'skirmish', map: 'breach', title: 'Skirmish: The Breach' },
];

export const missionById = (id) => MISSIONS.find((m) => m.id === id) || null;
