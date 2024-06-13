import pokemons from "@/data/pokemmo/monster-breeding-sim.json"
import { assert } from "@/utils/assert"
import React from "react"
import { useLocalStorage } from "usehooks-ts"
import { z } from "zod"
import { PokemonBreederKind, PokemonIv, PokemonIvSchema, PokemonNature, PokemonNatureSchema, PokemonSpecies } from "../pokemon"
import { PokemonBreedTreeLeaf, PokemonBreedTreeLeafSerializedSchema } from "../tree/BreedTreeLeaf"
import { UseBreedTreeMap, useBreedTreeMap } from "../tree/useBreedTreeMap"

export const PokemonBreedTreeSerializedSchema = z.object({
    breedTarget: z.object({
        ivs: z.object({
            A: PokemonIvSchema,
            B: PokemonIvSchema,
            C: PokemonIvSchema.optional(),
            D: PokemonIvSchema.optional(),
            E: PokemonIvSchema.optional(),
        }),
        nature: PokemonNatureSchema.optional(),
    }),
    breedTree: z.record(z.string(), PokemonBreedTreeLeafSerializedSchema),
})
export type PokemonBreedTreeSerialized = z.infer<typeof PokemonBreedTreeSerializedSchema>

export type BreedTargetSerialized = {
    ivs: IVSet
    nature?: PokemonNature
}

export type BreedTarget = {
    species: PokemonSpecies | undefined
    setSpecies: React.Dispatch<React.SetStateAction<PokemonSpecies | undefined>>
    ivs: IVSet
    setIvs: React.Dispatch<React.SetStateAction<IVSet>>
    nature: PokemonNature | undefined
    setNature: React.Dispatch<React.SetStateAction<PokemonNature | undefined>>
}

export interface BreedTreeContext {
    breedTarget: BreedTarget
    breedTree: UseBreedTreeMap
    serialize: () => PokemonBreedTreeSerialized
    deserialize: (serialized: PokemonBreedTreeSerialized) => void
    saveToLocalStorage: () => void
    loadFromLocalStorage: () => void
    resetLocalStorage: () => void
    userHasUsedLeafGenderButton: boolean
    setUserHasUsedLeafGenderButton: React.Dispatch<React.SetStateAction<boolean>>
    userHasSelectedLeafGender: boolean
    setUserHasSelectedLeafGender: React.Dispatch<React.SetStateAction<boolean>>
    userHasUsedLeafButton: boolean
    setUserHasUsedLeafButton: React.Dispatch<React.SetStateAction<boolean>>
}

export const BreedTreeContextPrimitive = React.createContext<BreedTreeContext | null>(null)

export function BreedTreeContext(props: {
    children: React.ReactNode
}) {
    const [localStorageTree, setLocalStorageTree] = useLocalStorage<PokemonBreedTreeSerialized | undefined>(
        "last-tree",
        undefined,
    )
    const [userHasUsedLeafGenderButton, setUserHasUsedLeafGenderButton] = useLocalStorage("user-has-used-leaf-gender-button", false)
    const [userHasSelectedLeafGender, setUserHasSelectedLeafGender] = useLocalStorage("user-has-selected-leaf-gender", false)
    const [userHasUsedLeafButton, setUserHasUsedLeafButton] = useLocalStorage('user-has-used-leaf-button', false)
    const [species, setSpecies] = React.useState<PokemonSpecies>()
    const [nature, setNature] = React.useState<PokemonNature>()
    const [ivs, setIvs] = React.useState<IVSet>(IVSet.DEFAULT)
    const [initMap, setInitMap] = React.useState(true)
    const breedTree = useBreedTreeMap({
        finalPokemonLeaf: PokemonBreedTreeLeaf.ROOT({
            ivs: ivs,
            nature: nature,
            species: species,
        }),
        finalPokemonIvSet: ivs,
        breedTreeMapInLocalStorage: localStorageTree?.breedTree,
        init: initMap,
        setInit: setInitMap,
    })

    function serialize(): PokemonBreedTreeSerialized {
        assert(species, "Attempted to serialize target Pokemon before initializing context.")
        const breedTargetSerialized: BreedTargetSerialized = { ivs, nature }
        const breedTreeSerialized = breedTree.serialize()

        return {
            breedTarget: breedTargetSerialized,
            breedTree: breedTreeSerialized,
        }
    }

    function deserialize(serialized: PokemonBreedTreeSerialized) {
        const rootLeaf = serialized.breedTree["0,0"]
        assert(rootLeaf, "Deserialize failed. Root node not found.")

        const speciesUnparsed = pokemons.find((p) => p.number === rootLeaf.species)
        assert(speciesUnparsed, "Failed to import Pokemon to breed target species. Invalid Pokemon number")

        const species = PokemonSpecies.parse(speciesUnparsed)
        const ivs = new IVSet(
            serialized.breedTarget.ivs.A,
            serialized.breedTarget.ivs.B,
            serialized.breedTarget.ivs.C,
            serialized.breedTarget.ivs.D,
            serialized.breedTarget.ivs.E,
        )

        setIvs(ivs)
        setSpecies(species)
        setNature(serialized.breedTarget.nature)
        setLocalStorageTree(serialized)
        setInitMap(true)
    }

    function saveToLocalStorage() {
        setLocalStorageTree(serialize())
    }

    function loadFromLocalStorage() {
        if (localStorageTree) {
            deserialize(localStorageTree)
        }
    }

    function resetLocalStorage() {
        setLocalStorageTree(undefined)
    }

    return (
        <BreedTreeContextPrimitive.Provider
            value={{
                breedTree,
                breedTarget: {
                    species,
                    setSpecies,
                    nature,
                    setNature,
                    ivs,
                    setIvs,
                },
                serialize,
                deserialize,
                saveToLocalStorage,
                loadFromLocalStorage,
                resetLocalStorage,
                userHasUsedLeafGenderButton,
                setUserHasUsedLeafGenderButton,
                userHasSelectedLeafGender,
                setUserHasSelectedLeafGender,
                userHasUsedLeafButton,
                setUserHasUsedLeafButton,
            }}
        >
            {props.children}
        </BreedTreeContextPrimitive.Provider>
    )
}

export function useBreedTreeContext() {
    const ctx = React.useContext(BreedTreeContextPrimitive)
    assert(ctx, "usePokemonToBreed must be used within a PokemonToBreedContextProvider")

    return ctx
}

export class IVSet {
    constructor(
        public A: PokemonIv,
        public B: PokemonIv,
        public C?: PokemonIv,
        public D?: PokemonIv,
        public E?: PokemonIv,
    ) { }

    public get(kind: PokemonBreederKind): PokemonIv | undefined {
        switch (kind) {
            case PokemonBreederKind.A:
                return this.A
            case PokemonBreederKind.B:
                return this.B
            case PokemonBreederKind.C:
                return this.C
            case PokemonBreederKind.D:
                return this.D
            case PokemonBreederKind.E:
                return this.E
            default:
                return undefined
        }
    }

    static DEFAULT = new IVSet(PokemonIv.HP, PokemonIv.Attack)
}
