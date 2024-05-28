import { assert } from '@/utils/assert'
import { z } from 'zod'

export enum PokemonNature {
    Hardy = 'Hardy',
    Lonely = 'Lonely',
    Brave = 'Brave',
    Adamant = 'Adamant',
    Naughty = 'Naughty',
    Bold = 'Bold',
    Docile = 'Docile',
    Relaxed = 'Relaxed',
    Impish = 'Impish',
    Lax = 'Lax',
    Timid = 'Timid',
    Hasty = 'Hasty',
    Serious = 'Serious',
    Jolly = 'Jolly',
    Naive = 'Naive',
    Modest = 'Modest',
    Mild = 'Mild',
    Quiet = 'Quiet',
    Bashful = 'Bashful',
    Rash = 'Rash',
    Calm = 'Calm',
    Gentle = 'Gentle',
    Sassy = 'Sassy',
    Careful = 'Careful',
    Quirky = 'Quirky',
}
export const PokemonNatureSchema = z.nativeEnum(PokemonNature)

export enum PokemonEggGroup {
    Monster = 'Monster',
    WaterA = 'WaterA',
    WaterB = 'WaterB',
    WaterC = 'WaterC',
    Bug = 'Bug',
    Flying = 'Flying',
    Field = 'Field',
    Fairy = 'Fairy',
    Plant = 'Plant',
    Humanoid = 'Humanoid',
    Mineral = 'Mineral',
    Chaos = 'Chaos',
    Ditto = 'Ditto',
    Dragon = 'Dragon',
    CannotBreed = 'CannotBreed',
    Genderless = 'Genderless',
}

export enum PokemonIv {
    HP = 'Hp',
    Attack = 'Attack',
    Defense = 'Defense',
    SpecialAttack = 'SpecialAttack',
    SpecialDefense = 'SpecialDefense',
    Speed = 'Speed',
}
export const PokemonIvSchema = z.nativeEnum(PokemonIv)

export enum PokemonGender {
    Female = 'Female',
    Male = 'Male',
    Genderless = 'Genderless',
}
export const PokemonGenderSchema = z.nativeEnum(PokemonGender)

export type PokemonSpeciesUnparsed = {
    number: number
    name: string
    eggGroups: string[]
    percentageMale: number
}

export class PokemonSpecies {
    constructor(
        public number: number,
        public name: string,
        public eggGroups: [PokemonEggGroup, PokemonEggGroup?],
        public percentageMale: number,
    ) {}

    static parse(data: PokemonSpeciesUnparsed): PokemonSpecies {
        const eggGroups = Object.values(PokemonEggGroup)

        assert(
            eggGroups.includes(data.eggGroups[0]!),
            `[PokemonSpecies.parse] Invalid egg group ${data.eggGroups[0]}`,
        )
        if (data.eggGroups[1]) {
            assert(
                eggGroups.includes(data.eggGroups[1]),
                `[PokemonSpecies.parse] Invalid egg group ${data.eggGroups[1]}`,
            )
        }

        return new PokemonSpecies(
            data.number,
            data.name,
            [
                data.eggGroups[0] as PokemonEggGroup,
                data.eggGroups[1] as PokemonEggGroup | undefined,
            ],
            data.percentageMale,
        )
    }
}

/** In Pokemmo breeding, you can only breed a pokemon couple once.
 * You lose the parents on a breed, and receive the offspring.
 * That's why we need a certain number of pokemon kind, grouped here by a, b, c, d, e & nature.
 * https://pokemmo.shoutwiki.com/wiki/Breeding
 */
export enum PokemonBreederKind {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
    E = 'E',
    Nature = 'Nature',
}
