export type Character = {
    id: string;
    name: string;
    status: 'alive' | 'dead' | 'unknown';
};

export const characters: Character[] = [
    { id: '1', name: 'Rick Sanchez', status: 'alive' },
    { id: '2', name: 'Morty Smith', status: 'alive' },
];