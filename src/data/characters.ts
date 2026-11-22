export type CharacterStatus = 'alive' | 'dead' | 'unknown';
export type CharacterGender = 'male' | 'female' | 'genderless' | 'unknown';

export type Character = {
    id: string;
    name: string;
    status: CharacterStatus;
    species: string;
    location: string;
    gender: CharacterGender;
    age: number;
};

export type CharacterInput = Omit<Character, 'id'>;
export type CharacterPatch = Partial<CharacterInput>;

export const characters: Character[] = [
    {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Rick Sanchez',
        status: 'alive',
        species: 'Human',
        location: 'Earth (C-137)',
        gender: 'male',
        age: 70,
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Morty Smith',
        status: 'alive',
        species: 'Human',
        location: 'Earth (C-137)',
        gender: 'male',
        age: 14,
    },
];