import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { IVSet, PokemonBreedTreeSerializedSchema, useBreedTreeContext } from "@/components/Breeding/core/ctx/PokemonBreedTreeContext"
import type { PokemonIv, PokemonNature, PokemonSpecies } from "@/components/Breeding/core/pokemon"
import { assert } from "@/utils/assert"
import { Try } from "@/utils/results"
import { run } from "@/utils"
import { Info, PlayIcon, RotateCcw } from "lucide-react"
import React from "react"
import { generateErrorMessage } from "zod-error"
import { PokemonIvSelect } from "./PokemonIvSelect"
import { PokemonNatureSelect } from "./PokemonNatureSelect"
import { PokemonSpeciesSelect } from "./PokemonSpeciesSelect"
import { BREED_EXPECTED_COSTS, DEFAULT_IV_DROPDOWN_VALUES, POKEMON_BREEDER_KIND_COUNT_BY_GENERATIONS } from "./consts"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { JsonImportButton } from "./Buttons"

/**
 * This type is used to represent the state of the full Pokemon node that is going to be used in the PokemonToBreedContext
 * It is a state object that will change as the user changes the select fields
 */
export type PokemonNodeInSelect = {
    species?: PokemonSpecies
    nature?: PokemonNature
    ivs: Set<PokemonIv>
}

export function PokemonToBreedSelect() {
    const { toast } = useToast()
    const ctx = useBreedTreeContext()
    const [desired31IVCount, setDesired31IVCount] = React.useState(2)
    const [currentIVDropdownValues, setCurrentIVDropdownValues] = React.useState(DEFAULT_IV_DROPDOWN_VALUES)
    const [currentPokemonInSelect, setCurrentPokemonInSelect] = React.useState<PokemonNodeInSelect>({
        ivs: new Set(DEFAULT_IV_DROPDOWN_VALUES.slice(0, desired31IVCount)),
    })
    const expectedCost = getExpectedBreedCost(desired31IVCount, Boolean(currentPokemonInSelect.nature))
    const breederKindCountTable = run(() => {
        const table = POKEMON_BREEDER_KIND_COUNT_BY_GENERATIONS[desired31IVCount]
        assert(table !== undefined, "POKEMON_BREEDER_KIND_COUNT_BY_GENERATIONS accessed with an invalid key.")

        if (currentPokemonInSelect.nature) {
            return table.natured
        }

        return table.natureless
    })
    const totalBreedPokemonCount = Object.values(breederKindCountTable).reduce((acc, val) => acc + val, 0)

    function validateIvFieldsUniqueness(): boolean {
        const selectedValues = currentIVDropdownValues.slice(0, desired31IVCount)
        const uniques = new Set(selectedValues)
        return uniques.size === selectedValues.length
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!currentPokemonInSelect.species) {
            toast({
                title: "No Pokemon was selected",
                description: "You must select a Pokemon to breed.",
                variant: "destructive",
            })
            return
        }

        if (!validateIvFieldsUniqueness()) {
            toast({
                title: "Invalid IVs",
                description: "You can't have the same stats in multiple IVs field.",
                variant: "destructive",
            })
            return
        }

        const finalIvs = Array.from(currentPokemonInSelect.ivs)

        assert(finalIvs[0], "At least 2 IV fields must be selected")
        assert(finalIvs[1], "At least 2 IV fields must be selected")

        ctx.breedTarget.setIvs(new IVSet(finalIvs[0], finalIvs[1], finalIvs[2], finalIvs[3], finalIvs[4]))
        ctx.breedTarget.setNature(currentPokemonInSelect.nature)
        ctx.breedTarget.setSpecies(currentPokemonInSelect.species)
    }

    function handleResetFields() {
        setCurrentPokemonInSelect({
            ivs: new Set(DEFAULT_IV_DROPDOWN_VALUES.slice(0, desired31IVCount)),
        })
        setDesired31IVCount(2)
        setCurrentIVDropdownValues(DEFAULT_IV_DROPDOWN_VALUES)
    }

    function handleImportJson(json: string) {
        const dataUnparsed = Try(() => JSON.parse(json))

        if (!dataUnparsed.ok) {
            toast({
                title: "Failed to import the breed tree JSON content.",
                description: (dataUnparsed.error as Error).message,
                variant: "destructive",
            })
            return
        }

        const res = PokemonBreedTreeSerializedSchema.safeParse(dataUnparsed)

        if (res.error) {
            const errorMsg = generateErrorMessage(res.error.issues)

            toast({
                title: "Failed to import the breed tree JSON content.",
                description: errorMsg,
                variant: "destructive",
            })
            return
        }

        ctx.deserialize(res.data)
    }

    if (ctx.breedTarget.species) {
        return null
    }

    return (
        <form
            className="flex flex-col items-center gap-2"
            onSubmit={handleSubmit}
        >
            <div className="flex w-full flex-col items-center gap-4">
                <div className="flex w-full flex-col gap-2">
                    <div className="flex justify-between items-end">
                        <PokemonSpeciesSelect
                            currentSelectedNode={currentPokemonInSelect}
                            setCurrentSelectedNode={setCurrentPokemonInSelect}
                        />
                        <JsonImportButton handleImportJson={handleImportJson} />
                    </div>
                    <PokemonNatureSelect
                        currentPokemonInSelect={currentPokemonInSelect}
                        setCurrentPokemonInSelect={setCurrentPokemonInSelect}
                    />
                    <PokemonIvSelect
                        breederKindCountTable={breederKindCountTable}
                        desired31IVCount={desired31IVCount}
                        setDesired31IVCount={setDesired31IVCount}
                        currentPokemonInSelect={currentPokemonInSelect}
                        setCurrentPokemonInSelect={setCurrentPokemonInSelect}
                        currentIVDropdownValues={currentIVDropdownValues}
                        setCurrentIVDropdownValues={setCurrentIVDropdownValues}
                    />
                </div>
            </div>
            <Alert className="w-full space-y-4 mt-4">
                <AlertTitle className="text-base">
                    For this Pokémon breed you will spend <b> ≈ ${expectedCost} </b> and you may need <b>{totalBreedPokemonCount}</b>{" "}
                    Pokémon.
                    <br />
                    Price calculations are based only on the breeding items cost, gender choice and everstone. Keep in consideration that some Pokémon has a higher cost for gender choices.
                </AlertTitle>
                <AlertDescription className="flex items-center justify-center gap-2">
                    <Button className="gap-2" type="submit">
                        <PlayIcon size={16} />
                        Start Breeding
                    </Button>
                    <Button className="gap-2" type="reset" variant={"destructive"} onClick={handleResetFields}>
                        <RotateCcw size={16} />
                        Reset
                    </Button>
                </AlertDescription>
            </Alert>
        </form>
    )
}

export function getExpectedBreedCost(desired31IVCount: number, natured: boolean) {
    const costsTable = BREED_EXPECTED_COSTS[desired31IVCount]
    assert(costsTable, "Expected cost must be defined")

    if (natured) {
        return costsTable.natured
    }

    return costsTable.natureless
}
