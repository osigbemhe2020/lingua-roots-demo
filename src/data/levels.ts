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