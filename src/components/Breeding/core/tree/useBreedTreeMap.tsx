import { assert } from "@/utils/assert"
import React from "react"
import { POKEMON_BREEDTREE_LASTROW_MAPPING } from "../consts"
import type { IVSet } from "../ctx/PokemonBreedTreeContext"
import { PokemonBreederKind, PokemonSpecies, PokemonSpeciesUnparsed } from "../pokemon"
import { PokemonBreedTreeLeaf, PokemonBreedTreeLeafSerialized } from "./BreedTreeLeaf"
import { PokemonBreedTreePosition } from "./BreedTreePosition"

export type PokemonBreedTreePositionKey = string
export type PokemonBreedTreeMap = Record<PokemonBreedTreePositionKey, PokemonBreedTreeLeaf>
export type PokemonBreedTreeMapSerialized = Record<PokemonBreedTreePositionKey, PokemonBreedTreeLeafSerialized>

export function useBreedTreeMap(props: {
    finalPokemonLeaf: PokemonBreedTreeLeaf
    finalPokemonIvSet: IVSet
    pokemonSpeciesUnparsed: PokemonSpeciesUnparsed[]
    breedTreeMapInLocalStorage: PokemonBreedTreeMapSerialized | undefined
    init: boolean
    setInit: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const desired31IvCount = React.useMemo(
        () => Object.values(props.finalPokemonIvSet).filter(Boolean).length,
        [props.finalPokemonIvSet],
    )
    const [map, setMap] = React.useState<PokemonBreedTreeMap>({})

    function init(
        finalPokemonLeaf: PokemonBreedTreeLeaf,
        finalPokemonIvSet: IVSet,
        desired31Ivcount: number,
        breedTreeMapInLocalStorage?: PokemonBreedTreeMapSerialized,
    ) {
        const _map: PokemonBreedTreeMap = {}
        _map[finalPokemonLeaf.position.key()] = finalPokemonLeaf

        const natured = Boolean(finalPokemonLeaf.nature)

        assert(finalPokemonLeaf.ivs, "finalPokemonLeaf.ivs should exist")
        assert([2, 3, 4, 5].includes(desired31Ivcount), "Invalid generations number")

        const lastRowBreeders =
            POKEMON_BREEDTREE_LASTROW_MAPPING[desired31Ivcount as keyof typeof POKEMON_BREEDTREE_LASTROW_MAPPING]
        const lastRowBreedersPositions = natured ? lastRowBreeders.natured : lastRowBreeders.natureless

        // initialize last row
        for (const [k, v] of lastRowBreedersPositions.entries()) {
            switch (v) {
                case PokemonBreederKind.Nature: {
                    const position = PokemonBreedTreePosition.fromKey(k)

                    _map[position.key()] = new PokemonBreedTreeLeaf({ nature: finalPokemonLeaf.nature, position })
                    break
                }
                default: {
                    const position = PokemonBreedTreePosition.fromKey(k)
                    const ivs = finalPokemonIvSet.get(v)
                    assert(ivs, "Ivs should exist for last row breeders")

                    _map[position.key()] = new PokemonBreedTreeLeaf({ position, ivs: [ivs] })
                    break
                }
            }
        }

        // initialize the rest of the tree
        // start from the second to last row
        // stops on the first row where the final pokemon node is already set
        // -1 for natured because of the way POKEMON_BREEDTREE_LASTROW_MAPPING is defined
        let row = natured ? desired31Ivcount - 1 : desired31Ivcount - 2
        while (row > 0) {
            let col = 0
            while (col < Math.pow(2, row)) {
                const position = new PokemonBreedTreePosition(row, col)
                const leaf = new PokemonBreedTreeLeaf({ position })

                const parentLeafs = leaf.getParentLeaf(_map)
                assert(parentLeafs !== undefined, `Parent leafs should exist for leaf: ${leaf.position.key()}`)

                const p1Leaf = parentLeafs[0]
                const p2Leaf = parentLeafs[1]

                const ivs = [...new Set([...(p1Leaf.ivs ?? []), ...(p2Leaf.ivs ?? [])])]
                const nature = p1Leaf.nature ?? p2Leaf.nature ?? undefined

                leaf.setNature(nature).setIvs(ivs)
                _map[position.key()] = leaf

                col = col + 1
            }
            row = row - 1
        }

        if (breedTreeMapInLocalStorage) {
            deserialize(breedTreeMapInLocalStorage, _map)
        }

        setMap(_map)
    }

    function serialize(): PokemonBreedTreeMapSerialized {
        const exported: PokemonBreedTreeMapSerialized = {}
        for (const [key, leaf] of Object.entries(map)) {
            exported[key] = leaf.toSerialized()
        }
        return exported
    }

    function deserialize(serializedTreeMap: PokemonBreedTreeMapSerialized, breedTreeMapCopy: PokemonBreedTreeMap) {
        if (Object.keys(breedTreeMapCopy).length < 1) {
            return
        }

        for (const [pos, value] of Object.entries(serializedTreeMap)) {
            const leaf = breedTreeMapCopy[pos]
            assert(leaf, `Failed to import breed tree. Exported tree contains invalid position. (${pos})`)

            const unparsedSpecies = props.pokemonSpeciesUnparsed.find((p) => p.number === value.species)
            if (unparsedSpecies) {
                const species = PokemonSpecies.parse(unparsedSpecies)
                leaf.setSpecies(species)
            }

            leaf.setNickname(value.nickname).setGender(value.gender)
        }

        setMap(breedTreeMapCopy)
    }

    React.useEffect(() => {
        if (!props.finalPokemonLeaf.species) {
            return
        }

        if (!props.init) {
            return
        }

        init(props.finalPokemonLeaf, props.finalPokemonIvSet, desired31IvCount, props.breedTreeMapInLocalStorage)
        props.setInit(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.finalPokemonLeaf, props.finalPokemonIvSet, desired31IvCount, map, props.breedTreeMapInLocalStorage])

    return {
        map,
        setMap,
        serialize,
        deserialize,
    } as const
}

export type UseBreedTreeMap = ReturnType<typeof useBreedTreeMap>
