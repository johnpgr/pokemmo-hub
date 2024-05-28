import { PokemonBreed } from "./core/breed"
import { useBreedTreeContext } from "./core/ctx/PokemonBreedTreeContext"
import { PokemonGender } from "./core/pokemon"
import { PokemonBreedTreePosition } from "./core/tree/BreedTreePosition"
import { PokemonBreedTreePositionKey } from "./core/tree/useBreedTreeMap"
import { assert } from "@/utils/assert"
import { run } from "@/utils"
import { Info } from "lucide-react"
import React from "react"
import { toast } from "sonner"
import { getExpectedBreedCost } from "./PokemonBreedSelect"
import { PokemonIvColors } from "./PokemonIvColors"
import { HeldItem, getHeldItemForLeaf } from "./PokemonLeafHeldItem"
import { PokemonLeafLines } from "./PokemonLeafLines"
import { PokemonLeafSelect } from "./PokemonLeafSelect"
import { BREED_ITEM_COSTS, GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE } from "./consts"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ImportExportButton, ResetBreedButton } from "./Buttons"

export function PokemonBreedTree() {
    const loadedFromLocal = React.useRef(false)
    const ctx = useBreedTreeContext()

    React.useEffect(() => {
        if (loadedFromLocal.current) {
            return
        }

        ctx.loadFromLocalStorage()
        loadedFromLocal.current = true
    }, [ctx])

    if (!ctx.breedTarget.species || !ctx.breedTree.map["0,0"]) {
        return null
    }

    return <PokemonBreedTreeFinal />
}

export type BreedErrors = Record<PokemonBreedTreePositionKey, Set<PokemonBreed.BreedError> | undefined>

function PokemonBreedTreeFinal() {
    const updateFromBreedEffect = React.useRef(false)
    const ctx = useBreedTreeContext()
    assert(ctx.breedTarget.species, "PokemonSpecies must be defined in useBreedMap")

    const desired31IvCount = Object.values(ctx.breedTarget.ivs).filter(Boolean).length
    const [breedErrors, setBreedErrors] = React.useState<BreedErrors>({})
    const expectedCost = getExpectedBreedCost(desired31IvCount, Boolean(ctx.breedTarget.nature))
    const currentBreedCost = run(() => {
        let cost = 0
        const nodes = Object.values(ctx.breedTree.map)

        for (const node of nodes) {
            if (!node.species) {
                continue
            }

            const isLastRow = ctx.breedTarget.nature
                ? node.position.row === desired31IvCount
                : node.position.row === desired31IvCount - 1

            if (node.gender && !node.genderCostIgnored && !isLastRow) {
                if (node.gender === PokemonGender.Male) {
                    const newCost = GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE[node.species.percentageMale]
                    assert(newCost !== undefined, "tried to get cost in GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE with invalid key")
                    cost += newCost
                } else if (node.gender === PokemonGender.Female) {
                    const newCost = GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE[100 - node.species.percentageMale]
                    assert(newCost !== undefined, "tried to get cost in GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE with invalid key")
                    cost += newCost
                }
            }

            const heldItem = getHeldItemForLeaf(node, ctx.breedTree.map)
            if (!heldItem) {
                continue
            }

            if (heldItem === HeldItem.Nature) {
                cost += BREED_ITEM_COSTS.nature
                continue
            }

            cost += BREED_ITEM_COSTS.iv
        }

        return cost
    })

    function updateBreedTree(fromBreedEffect = false) {
        ctx.breedTree.setMap((prev) => ({ ...prev }))
        updateFromBreedEffect.current = fromBreedEffect
    }

    function deleteErrors(pos: PokemonBreedTreePositionKey) {
        setBreedErrors((prev) => {
            delete prev[pos]
            return { ...prev }
        })
    }

    function addErrors(pos: PokemonBreedTreePositionKey, errors: Set<PokemonBreed.BreedError>) {
        setBreedErrors((prev) => {
            prev[pos] = errors
            return { ...prev }
        })
    }

    function handleExport(): string {
        const serialized = ctx.serialize()
        return JSON.stringify(serialized, null, 4)
    }

    function handleRestartBreed() {
        ctx.resetLocalStorage()
        window.location.reload()
    }

    // Show toast notifications for breed errors
    React.useEffect(() => {
        Object.entries(breedErrors).map(([key, errorKind]) => {
            if (!errorKind) {
                return
            }

            const node = ctx.breedTree.map[key]
            if (!node?.species) {
                return
            }

            const partner = node.getPartnerLeaf(ctx.breedTree.map)
            if (!partner?.species) {
                return
            }

            let errorMsg = ""
            for (const error of errorKind.values()) {
                if (error === PokemonBreed.BreedError.ChildDidNotChange) {
                    continue
                }
                errorMsg += error
                errorMsg += ", "
            }

            if (errorMsg.endsWith(", ")) {
                errorMsg = errorMsg.slice(0, -2)
            }

            toast.error(`${node.species.name} cannot breed with ${partner.species.name}.`, {
                description: `Error codes: ${errorMsg}`,
                action: {
                    label: "Dismiss",
                    onClick: () => { },
                },
            })
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [breedErrors])

    // Iterate through the breed tree and breed() the nodes
    React.useEffect(() => {
        if (updateFromBreedEffect.current) {
            return
        }

        const lastRow = ctx.breedTarget.nature ? desired31IvCount : desired31IvCount - 1
        const rowLength = Math.pow(2, lastRow)
        let changed = false

        //inc by 2 because we only want to breed() on one parent
        for (let col = 0; col < rowLength; col += 2) {
            const pos = new PokemonBreedTreePosition(lastRow, col)
            let leaf = ctx.breedTree.map[pos.key()]
            let partnerLeaf = leaf?.getPartnerLeaf(ctx.breedTree.map)

            function next() {
                leaf = leaf?.getChildLeaf(ctx.breedTree.map)
                partnerLeaf = leaf?.getPartnerLeaf(ctx.breedTree.map)
            }

            while (leaf && partnerLeaf) {
                // bind the current node position because next() will move the node pointer before the errors are set
                const currentLeafPos = leaf.position.key()

                if (!leaf.gender || !partnerLeaf.gender || !leaf.species || !partnerLeaf.species) {
                    deleteErrors(currentLeafPos)
                    next()
                    continue
                }

                const childLeaf = leaf.getChildLeaf(ctx.breedTree.map)
                if (!childLeaf) {
                    break
                }

                const breedResult = PokemonBreed.breed(leaf, partnerLeaf, childLeaf)

                if (!breedResult.ok) {
                    if (
                        breedResult.error.size === 1 &&
                        breedResult.error.has(PokemonBreed.BreedError.ChildDidNotChange)
                    ) {
                        deleteErrors(currentLeafPos)
                        next()
                        continue
                    }

                    addErrors(currentLeafPos, breedResult.error)
                    next()
                    continue
                }

                if (childLeaf.isRootLeaf()) {
                    deleteErrors(currentLeafPos)
                    next()
                    continue
                }

                changed = true
                childLeaf.setSpecies(breedResult)

                if (childLeaf.species?.percentageMale === 0) {
                    childLeaf.setGender(PokemonGender.Female)
                } else if (childLeaf.species?.percentageMale === 100) {
                    childLeaf.setGender(PokemonGender.Male)
                } else if (childLeaf.isGenderless()) {
                    childLeaf.setGender(PokemonGender.Genderless)
                }

                deleteErrors(currentLeafPos)
                next()
            }
        }

        if (changed) {
            updateBreedTree(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ctx.breedTree.map, ctx.breedTarget.nature, desired31IvCount, ctx.breedTree.setMap, setBreedErrors])

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center gap-2 mx-auto">
                {process.env.DEBUG_BUTTONS ? (
                    <div className="space-x-4">
                        <Button variant={"secondary"} size={"sm"} onClick={() => console.log(ctx.breedTree.map)}>
                            Debug (Breed Tree)
                        </Button>
                        <Button variant={"secondary"} size={"sm"} onClick={() => console.log(breedErrors)}>
                            Debug (Breed Errors)
                        </Button>
                        <Button variant={"secondary"} size={"sm"} onClick={() => console.log(ctx)}>
                            Debug (Context)
                        </Button>
                    </div>
                ) : null}
                <ImportExportButton handleExport={handleExport} />
                <ResetBreedButton handleRestartBreed={handleRestartBreed} />
            </div>
            <Alert style={{ border: "1px solid #1B1E22" }}>
                <AlertTitle className="flex items-center gap-2">
                    Current breed cost: ${currentBreedCost} / Expected cost: ${expectedCost}
                </AlertTitle>
            </Alert>
            <ScrollArea className="bg-popover p-4 rounded-md" style={{ border: '1px solid #1B1E22' }}>
                <PokemonIvColors />
                <div className="w-full flex flex-col-reverse items-center gap-8">
                    {Array.from({
                        length: ctx.breedTarget.nature ? desired31IvCount + 1 : desired31IvCount,
                    }).map((_, row) => {
                        const rowLength = Math.pow(2, row)

                        return (
                            <div key={`row:${row}`} className="flex w-full items-center justify-center">
                                {Array.from({ length: rowLength }).map((_, col) => {
                                    const position = new PokemonBreedTreePosition(row, col)

                                    return (
                                        <PokemonLeafLines
                                            key={`node:${position.key()}`}
                                            position={position}
                                            rowLength={rowLength}
                                            breedTree={ctx.breedTree.map}
                                            breedErrors={breedErrors}
                                        >
                                            <PokemonLeafSelect
                                                desired31IvCount={desired31IvCount}
                                                position={position}
                                                breedTree={ctx.breedTree.map}
                                                updateBreedTree={updateBreedTree}
                                            />
                                        </PokemonLeafLines>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
}
