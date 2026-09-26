// data/levels.ts
//
// Mock data for the level-path strip on the lesson completion screen
// (Story 7). Only Level 1 has real content in this exercise — the rest
// exist purely to show a locked "more content coming" visual, matching
// a Candy Crush/Duolingo-style level map. No navigation is wired to
// locked levels; they're decorative, not functional.

export type LevelStatus = 'complete' | 'locked';

export type Level = {
    id: number;
    label: string;
    status: LevelStatus;
};

export const levels: Level[] = [
    { id: 1, label: 'Level 1', status: 'complete' },
    { id: 2, label: 'Level 2', status: 'locked' },
    { id: 3, label: 'Level 3', status: 'locked' },
    { id: 4, label: 'Level 4', status: 'locked' },
];