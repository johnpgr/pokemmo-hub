import { assert } from '@/utils/assert'
import { PokemonBreederKind } from './pokemon'
import { PokemonBreedTreePosition } from './tree/BreedTreePosition'

/// This type represents what the last row of pokemon iv's should be, depending on the nr of generations
export const POKEMON_BREEDTREE_LASTROW_MAPPING = {
    2: {
        natured: new Map([
            [
                new PokemonBreedTreePosition(2, 0).key(),
                PokemonBreederKind.Nature,
            ],
            [new PokemonBreedTreePosition(2, 1).key(), PokemonBreederKind.A],
            [new PokemonBreedTreePosition(2, 2).key(), PokemonBreederKind.A],
            [new PokemonBreedTreePosition(2, 3).key(), PokemonBreederKind.B],
        ]),
        natureless: new Map([
            [new PokemonBreedTreePosition(1, 0).key(), PokemonBreederKind.A],
            [new PokemonBreedTreePosition(1, 1).key(), PokemonBreederKind.B],
        ]),
    },
    3: {
        natured: new Map([
            [
                new PokemonBreedTreePosition(3, 0).key(),
                PokemonBreederKind.Nature,
            ],
            [new PokemonBreedTreePosition(3, 1).key(), PokemonBreederKind.A],
            [new PokemonBreedTreePosition(3, 2).key(), PokemonBreederKind.A],
            [new PokemonBreedTreePosition(3, 3).key(), PokemonBreederKind.B],
            [new PokemonBreedTreePosition(3, 4).key(), PokemonBreederKind.A],
            [new PokemonBreedTreePosition(3, 5).key(), PokemonBreederKind.B],
            [new PokemonBreedTreePosition(3, 6).key(), PokemonBreederKind.A],
            [new PokemonBreedTreePosition(3, 7).key(), PokemonBreederKind.B],
        ]),
        natureless: new Map([
            [new PokemonBreedTreePosition(2, 0).key(), PokemonBreederKind.A],
            [new PokemonBreedTreePosition(2, 1).key(), PokemonBreederKind.B],
            [new PokemonBreedTreePosition(2, 2).key(), PokemonBreederKind.A],
            [new PokemonBreedTreePosition(2, 3).key(), PokemonBreederKind.C],
        ]),
    },
    4: {
        natured: new Map([
            [
                new PokemonBreedTreePosition(4, 0).key(),
                PokemonBreederKind.Nature,
            ],
            [new PokemonBreedTreePosition(4, 1).key(), PokemonBreederKind.A],
            [new PokemonBreedTreePosition(4, 2).key(), PokemonBreederKind.A],
            [new PokemonBreedTreePosition(4, 3).key(), PokemonBreederKind.B],
            [new PokemonBreedTreePosition(4, 4).key(), PokemonBreederKind.A],
            [new PokemonBreedTreePosition(4, 5).key(), PokemonBreederKind.B],
            [new PokemonBreedTreePosition(4, 6).key(), PokemonBreederKind.A],
            [new PokemonBreedTreePosition(4, 7).key(), PokemonBreederKind.C],
            [new PokemonBreedTreePosition(4, 8).key(), PokemonBreederKind.A],
            [new PokemonBreedTreePosition(4, 9).key(), PokemonBreederKind.B],
            [new PokemonBreedTreePosition(4, 10).key(), PokemonBreederKind.A],
            [new PokemonBreedTreePosition(4, 11).key(), PokemonBreederKind.C],
            [new PokemonBreedTreePosition(4, 12).key(), PokemonBreederKind.B],
            [new PokemonBreedTreePosition(4, 13).key(), PokemonBreederKind.C],
            [new PokemonBreedTreePosition(4, 14).key(), PokemonBreederKind.B],
            [new PokemonBreedTreePosition(4, 15).key(), PokemonBreederKind.D],
        ]),
        natureless: new Map([
            [new PokemonBreedTreePosition(3, 0).key(), PokemonBreederKind.A],
            [new PokemonBreedTreePosition(3, 1).key(), PokemonBreederKind.B],
            [new PokemonBreedTreePosition(3, 2).key(), PokemonBreederKind.A],
            [new PokemonBreedTreePosition(3, 3).key(), PokemonBreederKind.C],
            [new PokemonBreedTreePosition(3, 4).key(), PokemonBreederKind.B],
            [new PokemonBreedTreePosition(3, 5).key(), PokemonBreederKind.C],
            [new PokemonBreedTreePosition(3, 6).key(), PokemonBreederKind.B],
            [new PokemonBreedTreePosition(3, 7).key(), PokemonBreederKind.D],
        ]),
    },
    5: {
        natured: new Map([
            [new PokemonBreedTreePosition(5, 0).key(), PokemonBreederKind.A],
            [new PokemonBreedTreePosition(5, 1).key(), PokemonBreederKind.B],
            [new PokemonBreedTreePosition(5, 2).key(), PokemonBreederKind.A],
            [new PokemonBreedTreePosition(5, 3).key(), PokemonBreederKind.C],
            [new PokemonBreedTreePosition(5, 4).key(), PokemonBreederKind.B],
            [new PokemonBreedTreePosition(5, 5).key(), PokemonBreederKind.C],
            [new PokemonBreedTreePosition(5, 6).key(), PokemonBreederKind.B],
            [new PokemonBreedTreePosition(5, 7).key(), PokemonBreederKind.D],
            [new PokemonBreedTreePosition(5, 8).key(), PokemonBreederKind.B],
            [new PokemonBreedTreePosition(5, 9).key(), PokemonBreederKind.C],
            [new PokemonBreedTreePosition(5, 10).key(), PokemonBreederKind.B],
            [new PokemonBreedTreePosition(5, 11).key(), PokemonBreederKind.D],
            [new PokemonBreedTreePosition(5, 12).key(), PokemonBreederKind.C],
            [new PokemonBreedTreePosition(5, 13).key(), PokemonBreederKind.D],
            [new PokemonBreedTreePosition(5, 14).key(), PokemonBreederKind.C],
            [new PokemonBreedTreePosition(5, 15).key(), PokemonBreederKind.E],
            [
                new PokemonBreedTreePosition(5, 16).key(),
                PokemonBreederKind.Nature,
            ],
            [new PokemonBreedTreePosition(5, 17).key(), PokemonBreederKind.B],
            [new PokemonBreedTreePosition(5, 18).key(), PokemonBreederKind.B],
            [new PokemonBreedTreePosition(5, 19).key(), PokemonBreederKind.C],
            [new PokemonBreedTreePosition(5, 20).key(), PokemonBreederKind.B],
            [new PokemonBreedTreePosition(5, 21).key(), PokemonBreederKind.C],
            [new PokemonBreedTreePosition(5, 22).key(), PokemonBreederKind.B],
            [new PokemonBreedTreePosition(5, 23).key(), PokemonBreederKind.D],
            [new PokemonBreedTreePosition(5, 24).key(), PokemonBreederKind.B],
            [new PokemonBreedTreePosition(5, 25).key(), PokemonBreederKind.C],
            [new PokemonBreedTreePosition(5, 26).key(), PokemonBreederKind.B],
            [new PokemonBreedTreePosition(5, 27).key(), PokemonBreederKind.D],
            [new PokemonBreedTreePosition(5, 28).key(), PokemonBreederKind.C],
            [new PokemonBreedTreePosition(5, 29).key(), PokemonBreederKind.D],
            [new PokemonBreedTreePosition(5, 30).key(), PokemonBreederKind.C],
            [new PokemonBreedTreePosition(5, 31).key(), PokemonBreederKind.E],
        ]),
        natureless: new Map([
            [new PokemonBreedTreePosition(4, 0).key(), PokemonBreederKind.A],
            [new PokemonBreedTreePosition(4, 1).key(), PokemonBreederKind.B],
            [new PokemonBreedTreePosition(4, 2).key(), PokemonBreederKind.A],
            [new PokemonBreedTreePosition(4, 3).key(), PokemonBreederKind.C],
            [new PokemonBreedTreePosition(4, 4).key(), PokemonBreederKind.B],
            [new PokemonBreedTreePosition(4, 5).key(), PokemonBreederKind.C],
            [new PokemonBreedTreePosition(4, 6).key(), PokemonBreederKind.B],
            [new PokemonBreedTreePosition(4, 7).key(), PokemonBreederKind.D],
            [new PokemonBreedTreePosition(4, 8).key(), PokemonBreederKind.B],
            [new PokemonBreedTreePosition(4, 9).key(), PokemonBreederKind.C],
            [new PokemonBreedTreePosition(4, 10).key(), PokemonBreederKind.B],
            [new PokemonBreedTreePosition(4, 11).key(), PokemonBreederKind.D],
            [new PokemonBreedTreePosition(4, 12).key(), PokemonBreederKind.C],
            [new PokemonBreedTreePosition(4, 13).key(), PokemonBreederKind.D],
            [new PokemonBreedTreePosition(4, 14).key(), PokemonBreederKind.C],
            [new PokemonBreedTreePosition(4, 15).key(), PokemonBreederKind.E],
        ]),
    },
} as const

export type PokemonCountByBreederKind = {
    kind: PokemonBreederKind
    count: { natured: number; natureless: number }
}[]

/**
 * Returns a list of pokemon counts grouped by breeder kind
 * This list is used to render the pokemon breed tree depending on the number of generations that is selected
 */
export function getPokemonCountByBreederKind(
    generations: number,
): PokemonCountByBreederKind {
    assert(generations >= 2 && generations <= 5, 'Invalid generations number')
    const lastRowPositions =
        POKEMON_BREEDTREE_LASTROW_MAPPING[
            generations as keyof typeof POKEMON_BREEDTREE_LASTROW_MAPPING
        ]

    const natured = Array.from(lastRowPositions.natured.values()).filter(
        (kind) => kind !== PokemonBreederKind.Nature,
    )
    const natureless = Array.from(lastRowPositions.natureless.values())

    return [
        {
            kind: PokemonBreederKind.A,
            count: {
                natured: natured.filter((k) => k === PokemonBreederKind.A)
                    .length,
                natureless: natureless.filter((k) => k === PokemonBreederKind.A)
                    .length,
            },
        },
        {
            kind: PokemonBreederKind.B,
            count: {
                natured: natured.filter((k) => k === PokemonBreederKind.B)
                    .length,
                natureless: natureless.filter((k) => k === PokemonBreederKind.B)
                    .length,
            },
        },
        {
            kind: PokemonBreederKind.C,
            count: {
                natured: natured.filter((k) => k === PokemonBreederKind.C)
                    .length,
                natureless: natureless.filter((k) => k === PokemonBreederKind.C)
                    .length,
            },
        },
        {
            kind: PokemonBreederKind.D,
            count: {
                natured: natured.filter((k) => k === PokemonBreederKind.D)
                    .length,
                natureless: natureless.filter((k) => k === PokemonBreederKind.D)
                    .length,
            },
        },
        {
            kind: PokemonBreederKind.E,
            count: {
                natured: natured.filter((k) => k === PokemonBreederKind.E)
                    .length,
                natureless: natureless.filter((k) => k === PokemonBreederKind.E)
                    .length,
            },
        },
    ]
}
