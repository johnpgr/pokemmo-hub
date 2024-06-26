import { assert } from '@/utils/assert'

export class PokemonBreedTreePosition {
    constructor(
        public row: number,
        public col: number,
    ) {}

    public key(): string {
        return `${this.row},${this.col}`
    }

    static fromKey(key: string): PokemonBreedTreePosition {
        const [row, col] = key.split(',').map(Number)
        assert(row !== undefined, 'Tried to make a key from invalid string')
        assert(col !== undefined, 'Tried to make a key from invalid string')
        assert(
            !Number.isNaN(row) && !Number.isNaN(col),
            'Invalid BreedTreeLeaf key',
        )

        return new PokemonBreedTreePosition(row, col)
    }
}
