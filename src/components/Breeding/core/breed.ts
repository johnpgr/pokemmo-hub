import { assert } from '@/utils/assert'
import { Err, Ok, Result } from '@/utils/results'
import { PokemonGender, PokemonSpecies } from './pokemon'
import type { PokemonBreedTreeLeaf } from './tree/BreedTreeLeaf'
import evolutions from '@/data/evolutions.json'

export namespace PokemonBreed {
    export enum BreedError {
        GenderCompatibility = 'GenderCompatibility',
        EggGroupCompatibility = 'EggGroupCompatibility',
        GenderlessSpeciesCompatibility = 'GenderlessSpeciesCompatibility',
        ChildDidNotChange = 'ChildDidNotChange',
        RootLeafSpeciesMismatch = 'RootLeafSpeciesMismatch',
    }

    export function breed(
        parent1: PokemonBreedTreeLeaf,
        parent2: PokemonBreedTreeLeaf,
        child: PokemonBreedTreeLeaf,
    ): Result<PokemonSpecies, Set<BreedError>> {
        assert(parent1.gender, 'Parent 1 gender should exist')
        assert(parent2.gender, 'Parent 2 gender should exist')
        assert(parent1.species, 'Parent 1 species should exist')
        assert(parent2.species, 'Parent 2 species should exist')

        const errors = new Set<BreedError>()

        const genderlessCheck = checkGenderless(parent1, parent2)
        if (!genderlessCheck.ok) {
            errors.add(genderlessCheck.error)
        }

        const eggGroupCheck = checkEggGroups(parent1, parent2)
        if (!eggGroupCheck.ok) {
            errors.add(eggGroupCheck.error)
        }

        const genderCheck = checkGenders(parent1, parent2)
        if (!genderCheck.ok) {
            errors.add(genderCheck.error)
        }

        const childSpecies = getChildSpecies(parent1, parent2)

        if (!childSpecies.ok) {
            errors.add(childSpecies.error)
            return Err(errors)
        }

        const childCheck = checkChild(child, childSpecies)
        if (!childCheck.ok) {
            errors.add(childCheck.error)
        }

        if (errors.size === 0) {
            return Ok(childSpecies as PokemonSpecies)
        }

        return Err(errors)
    }

    /**
     * Check if the child is a valid child of the parents
     * returns RootLeafSpeciesMismatch if the child is the root leaf and if the childSpecies number is not included in the root leaf evolution tree
     * returns ChildDidNotChange if the childSpecies didn't change
     */
    function checkChild(
        child: PokemonBreedTreeLeaf,
        childSpecies: PokemonSpecies,
    ): Result<{}, BreedError> {
        if (child.isRootLeaf()) {
            const rootEvolutionTree = evolutions.find((ev) =>
                ev.includes(child.species!.number),
            )
            assert(
                rootEvolutionTree !== undefined,
                "Every Pokemon has to have it's evolution tree in evolutions.json",
            )

            if (!rootEvolutionTree.includes(childSpecies.number)) {
                return Err(BreedError.RootLeafSpeciesMismatch)
            }
        } else {
            if (child.species?.number === childSpecies.number) {
                return Err(BreedError.ChildDidNotChange)
            }
        }

        return Ok({})
    }

    function checkEggGroups(
        parent1: PokemonBreedTreeLeaf,
        parent2: PokemonBreedTreeLeaf,
    ): Result<{}, BreedError> {
        if (parent1.isDitto() || parent2.isDitto()) {
            return Ok({})
        }

        const eggGroupsMatch = parent1
            .species!.eggGroups.filter(Boolean)
            .some((eggGroup) =>
                parent2.species!.eggGroups.filter(Boolean).includes(eggGroup),
            )

        if (!eggGroupsMatch) {
            return Err(BreedError.EggGroupCompatibility)
        }

        return Ok({})
    }

    function checkGenders(
        parent1: PokemonBreedTreeLeaf,
        parent2: PokemonBreedTreeLeaf,
    ): Result<{}, BreedError> {
        if (parent1.isGenderless() && parent2.isGenderless()) {
            return Ok({})
        }

        if (parent1.gender === parent2.gender) {
            return Err(BreedError.GenderCompatibility)
        }

        return Ok({})
    }

    function checkGenderless(
        parent1: PokemonBreedTreeLeaf,
        parent2: PokemonBreedTreeLeaf,
    ): Result<{}, BreedError> {
        if (parent1.gender === PokemonGender.Genderless) {
            if (parent1.isDitto()) {
                if (!parent2.isDitto()) {
                    return Ok({})
                }

                return Err(BreedError.GenderlessSpeciesCompatibility)
            }

            const parent1GenderlessEvoTree = evolutions.find((ev) =>
                ev.includes(parent1.species!.number),
            )
            assert(
                parent1GenderlessEvoTree !== undefined,
                "Every Pokemon has to have it's evolution tree in evolutions.json",
            )

            if (!parent1GenderlessEvoTree.includes(parent2.species!.number)) {
                return Err(BreedError.GenderlessSpeciesCompatibility)
            }
        }

        if (parent2.gender === PokemonGender.Genderless) {
            if (parent2.isDitto()) {
                if (!parent1.isDitto()) {
                    return Ok({})
                }

                return Err(BreedError.GenderlessSpeciesCompatibility)
            }

            const parent2GenderlessEvoTree = evolutions.find((ev) =>
                ev.includes(parent2.species!.number),
            )
            assert(
                parent2GenderlessEvoTree !== undefined,
                "Every Pokemon has to have it's evolution tree in evolutions.json",
            )

            if (!parent2GenderlessEvoTree.includes(parent1.species!.number)) {
                return Err(BreedError.GenderlessSpeciesCompatibility)
            }
        }

        return Ok({})
    }

    function getChildSpecies(
        parent1: PokemonBreedTreeLeaf,
        parent2: PokemonBreedTreeLeaf,
    ): Result<PokemonSpecies, BreedError> {
        if (parent1.isDitto()) {
            return Ok(parent2.species!)
        }
        if (parent2.isDitto()) {
            return Ok(parent1.species!)
        }

        if (parent1.isGenderless() && parent2.isGenderless()) {
            //assume that both parents are correctly in the same GenderlessEvolutionTree
            return Ok(parent1.species!)
        }

        const females = [parent1, parent2].filter(
            (p) => p.gender === PokemonGender.Female,
        )

        if (females.length !== 1) {
            return Err(BreedError.GenderCompatibility)
        }

        return Ok(females[0]!.species!)
    }
}
