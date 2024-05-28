import { z } from 'zod'
import { IVSet } from '../ctx/PokemonBreedTreeContext'
import {
    PokemonEggGroup,
    PokemonGender,
    PokemonGenderSchema,
    PokemonIv,
    PokemonNature,
    PokemonSpecies,
} from '../pokemon'
import { PokemonBreedTreePosition } from './BreedTreePosition'
import type { PokemonBreedTreeMap } from './useBreedTreeMap'

export const PokemonBreedTreeLeafSerializedSchema = z.object({
    species: z.number().optional(),
    gender: PokemonGenderSchema.optional(),
    nickname: z.string().optional(),
    genderCostIgnored: z.boolean().optional(),
})
export type PokemonBreedTreeLeafSerialized = z.infer<
    typeof PokemonBreedTreeLeafSerializedSchema
>

export type IPokemonBreedTreeLeaf = {
    position: PokemonBreedTreePosition
    species?: PokemonSpecies
    gender?: PokemonGender
    nature?: PokemonNature
    ivs?: PokemonIv[]
    nickname?: string
    genderCostIgnored?: boolean
}

export class PokemonBreedTreeLeaf implements IPokemonBreedTreeLeaf {
    position: PokemonBreedTreePosition
    species?: PokemonSpecies | undefined
    gender?: PokemonGender | undefined
    nature?: PokemonNature | undefined
    ivs?: PokemonIv[] | undefined
    nickname?: string | undefined
    genderCostIgnored?: boolean

    constructor(p: IPokemonBreedTreeLeaf) {
        this.position = p.position
        this.species = p.species
        this.gender = p.gender
        this.nature = p.nature
        this.ivs = p.ivs
        this.nickname = p.nickname
    }

    static EMPTY(pos: PokemonBreedTreePosition): PokemonBreedTreeLeaf {
        return new PokemonBreedTreeLeaf({ position: pos })
    }

    static ROOT(breedTarget: {
        species?: PokemonSpecies
        nature?: PokemonNature
        ivs: IVSet
    }): PokemonBreedTreeLeaf {
        return new PokemonBreedTreeLeaf({
            position: new PokemonBreedTreePosition(0, 0),
            species: breedTarget.species,
            ivs: Object.values(breedTarget.ivs).filter(Boolean),
            nature: breedTarget.nature,
        })
    }

    public toSerialized(): PokemonBreedTreeLeafSerialized {
        return {
            species: this.species?.number,
            gender: this.gender,
            nickname: this.nickname,
            genderCostIgnored: this.genderCostIgnored,
        }
    }

    public getChildLeaf(
        map: PokemonBreedTreeMap,
    ): PokemonBreedTreeLeaf | undefined {
        const childRow = this.position.row - 1
        const childCol = Math.floor(this.position.col / 2)
        const childPosition = new PokemonBreedTreePosition(childRow, childCol)

        return map[childPosition.key()]
    }

    public getPartnerLeaf(
        map: PokemonBreedTreeMap,
    ): PokemonBreedTreeLeaf | undefined {
        const partnerCol =
            (this.position.col & 1) === 0
                ? this.position.col + 1
                : this.position.col - 1
        const partnerPos = new PokemonBreedTreePosition(
            this.position.row,
            partnerCol,
        )

        return map[partnerPos.key()]
    }

    public getParentLeaf(
        map: PokemonBreedTreeMap,
    ): [PokemonBreedTreeLeaf, PokemonBreedTreeLeaf] | undefined {
        const parentRow = this.position.row + 1
        const parentCol = this.position.col * 2

        const parent1 =
            map[new PokemonBreedTreePosition(parentRow, parentCol).key()]
        const parent2 =
            map[new PokemonBreedTreePosition(parentRow, parentCol + 1).key()]

        if (!parent1 || !parent2) return undefined

        return [parent1, parent2]
    }

    public isRootLeaf(): boolean {
        return this.position.key() === '0,0'
    }

    public isDitto(): boolean {
        return this.species?.eggGroups[0] === PokemonEggGroup.Ditto
    }

    public isGenderless(): boolean {
        return this.species?.eggGroups[0] === PokemonEggGroup.Genderless
    }

    public setSpecies(species?: PokemonSpecies): PokemonBreedTreeLeaf {
        this.species = species
        return this
    }

    public setNature(nature?: PokemonNature): PokemonBreedTreeLeaf {
        this.nature = nature
        return this
    }

    public setIvs(ivs?: PokemonIv[]): PokemonBreedTreeLeaf {
        this.ivs = ivs
        return this
    }

    public setGender(gender?: PokemonGender): PokemonBreedTreeLeaf {
        this.gender = gender
        return this
    }

    public setNickname(nickname?: string): PokemonBreedTreeLeaf {
        this.nickname = nickname
        return this
    }

    public setGenderCostIgnored(ignored: boolean): PokemonBreedTreeLeaf {
        this.genderCostIgnored = ignored
        return this
    }
}
