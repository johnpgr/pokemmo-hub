import React from 'react'
import { HelpCircle } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PokemonGender } from "./core/pokemon"
import { Female } from "@/components/ui/icons/Female"
import { Male } from "@/components/ui/icons/Male"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE } from "./consts"
import { PokemonBreedTreeLeaf } from "./core/tree/BreedTreeLeaf"
import { PokemonBreedTreeMap } from "./core/tree/useBreedTreeMap"
import { Checkbox } from "@/components/ui/checkbox"
import { useBreedTreeContext } from "./core/ctx/PokemonBreedTreeContext"
import { Label } from "@/components/ui/label"
import { cn } from "@/utils"

export function PokemonLeafGender(props: {
    desired31IvCount: number
    currentLeaf: PokemonBreedTreeLeaf
    breedTree: PokemonBreedTreeMap
    updateBreedTree: () => void
}) {
    const ctx = useBreedTreeContext()
    const gender = props.currentLeaf.gender
    const percentageMale = props.currentLeaf.species?.percentageMale
    const isLastRow = ctx.breedTarget.nature
        ? props.currentLeaf.position.row === props.desired31IvCount
        : props.currentLeaf.position.row === props.desired31IvCount - 1
    const canHaveGenderCost = !props.currentLeaf.isGenderless() && !props.currentLeaf.isDitto() && !isLastRow

    function handleToggleGenderCostIgnored() {
        props.currentLeaf.setGenderCostIgnored(!props.currentLeaf.genderCostIgnored)
        props.updateBreedTree()
        ctx.saveToLocalStorage()
    }

    function handleToggleGender(value: string) {
        props.currentLeaf.setGender(value as PokemonGender)
        props.updateBreedTree()
        ctx.saveToLocalStorage()
    }

    return (
        <Popover>
            <PopoverTrigger className={cn(buttonVariants({ variant: "outline" }), "rounded-full border border-dark p-[6px] h-fit w-fit")}>
                {!gender || props.currentLeaf.isGenderless() || props.currentLeaf.isDitto() ? (
                    <HelpCircle size={20} />
                ) : gender === PokemonGender.Female ? (
                    <Female className="h-5 w-5 fill-pink-500 antialiased" />
                ) : (
                    <Male className="h-5 w-5 fill-blue-500 antialiased" />
                )}
            </PopoverTrigger>
            <PopoverContent className="max-w-xs w-full shadow border border-dark">
                <div className="flex flex-col items-center gap-6">
                    {props.currentLeaf.isGenderless() || props.currentLeaf.isDitto() ? (
                        <i className="text-sm text-foreground/70">This Pokemon species can&apos;t have a gender</i>
                    ) : (
                        <>
                            <ToggleGroup
                                type="single"
                                value={gender}
                                disabled={percentageMale === 100 || percentageMale === 0}
                                onValueChange={handleToggleGender}
                            >
                                <ToggleGroupItem
                                    value="Female"
                                    aria-label="Toggle Female"
                                    className="bg-popover data-[state=on]:bg-pink-100 hover:bg-pink-100"
                                >
                                    <Female className="h-6 w-6 fill-pink-500 antialiased" />
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                    value="Male"
                                    aria-label="Toggle Male"
                                    className="bg-popover data-[state=on]:bg-blue-100 hover:bg-blue-100"
                                >
                                    <Male className="fill-blue-500 h-6 w-6 antialiased" />
                                </ToggleGroupItem>
                            </ToggleGroup>
                            {props.currentLeaf.species ? (
                                <>
                                    <div
                                        className={`space-y-2 ${percentageMale === 100 || percentageMale === 0 ? "opacity-50" : ""}`}
                                    >
                                        <i className="text-sm text-foreground/70 flex">
                                            <Female className="h-4 w-4 fill-pink-500 antialiased" />:{" $"}
                                            {
                                                GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE[
                                                (100 -
                                                    props.currentLeaf.species
                                                        .percentageMale) as keyof typeof GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE
                                                ]
                                            }
                                        </i>
                                        <i className="text-sm text-foreground/70 flex">
                                            <Male className="fill-blue-500 h-4 w-4 antialiased" />:{" $"}
                                            {
                                                GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE[
                                                props.currentLeaf.species
                                                    .percentageMale as keyof typeof GENDER_GUARANTEE_COST_BY_PERCENTAGE_MALE
                                                ]
                                            }
                                        </i>
                                    </div>
                                    {canHaveGenderCost ? (
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                className="border-foreground/50"
                                                id="ignore-g"
                                                checked={props.currentLeaf.genderCostIgnored}
                                                onCheckedChange={handleToggleGenderCostIgnored}
                                            />
                                            <Label htmlFor="ignore-g" className="text-foreground/70">
                                                Ignore cost
                                            </Label>
                                        </div>
                                    ) : null}
                                </>
                            ) : null}
                        </>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
