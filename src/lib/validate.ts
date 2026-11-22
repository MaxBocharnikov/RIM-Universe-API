import type { CharacterGender, CharacterInput, CharacterPatch, CharacterStatus } from '../data/characters';

const STATUSES: CharacterStatus[] = ['alive', 'dead', 'unknown'];
const GENDERS: CharacterGender[] = ['male', 'female', 'genderless', 'unknown'];

function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}

function isStatus(value: unknown): value is CharacterStatus {
    return typeof value === 'string' && STATUSES.includes(value as CharacterStatus);
}

function isGender(value: unknown): value is CharacterGender {
    return typeof value === 'string' && GENDERS.includes(value as CharacterGender);
}

function isAge(value: unknown): value is number {
    return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

export function parseCharacterInput(body: unknown): CharacterInput | null {
    if (typeof body !== 'object' || body === null) return null;

    const payload = body as Record<string, unknown>;

    if (
        !isNonEmptyString(payload.name) ||
        !isStatus(payload.status) ||
        !isNonEmptyString(payload.species) ||
        !isNonEmptyString(payload.location) ||
        !isGender(payload.gender) ||
        !isAge(payload.age)
    ) {
        return null;
    }

    return {
        name: payload.name.trim(),
        status: payload.status,
        species: payload.species.trim(),
        location: payload.location.trim(),
        gender: payload.gender,
        age: payload.age,
    };
}

export function parseCharacterPatch(body: unknown): CharacterPatch | null {
    if (typeof body !== 'object' || body === null) return null;

    const payload = body as Record<string, unknown>;
    if ('id' in payload) return null;

    const patch: CharacterPatch = {};

    if ('name' in payload) {
        if (!isNonEmptyString(payload.name)) return null;
        patch.name = payload.name.trim();
    }

    if ('status' in payload) {
        if (!isStatus(payload.status)) return null;
        patch.status = payload.status;
    }

    if ('species' in payload) {
        if (!isNonEmptyString(payload.species)) return null;
        patch.species = payload.species.trim();
    }

    if ('location' in payload) {
        if (!isNonEmptyString(payload.location)) return null;
        patch.location = payload.location.trim();
    }

    if ('gender' in payload) {
        if (!isGender(payload.gender)) return null;
        patch.gender = payload.gender;
    }

    if ('age' in payload) {
        if (!isAge(payload.age)) return null;
        patch.age = payload.age;
    }

    return Object.keys(patch).length > 0 ? patch : null;
}