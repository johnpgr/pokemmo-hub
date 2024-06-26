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
import { useTranslations } from '@/context/TranslationsContext'

export function PokemonLeafGender(props: {
    desired31IvCount: number
    currentLeaf: PokemonBreedTreeLeaf
    breedTree: PokemonBreedTreeMap
    updateBreedTree: () => void
}) {
    const ctx = useBreedTreeContext()
    const [open, setOpen] = React.useState(false)
    const { t } = useTranslations()
    const gender = props.currentLeaf.gender
    const percentageMale = props.currentLeaf.species?.percentageMale
    const isLastRow = ctx.breedTarget.nature
        ? props.currentLeaf.position.row === props.desired31IvCount
        : props.currentLeaf.position.row === props.desired31IvCount - 1
    const canHaveGenderCost = !props.currentLeaf.isGenderless() && !props.currentLeaf.isDitto() && !isLastRow

    function handlePopoverTrigger() {
        setOpen((prev) => !prev)
        ctx.setUserHasUsedLeafGenderButton(true)
    }

    function handleToggleGenderCostIgnored() {
        props.currentLeaf.setGenderCostIgnored(!props.currentLeaf.genderCostIgnored)
        props.updateBreedTree()
        ctx.saveToLocalStorage()
    }

    function handleToggleGender(value: string) {
        ctx.setUserHasSelectedLeafGender(true)
        props.currentLeaf.setGender(value as PokemonGender)
        props.updateBreedTree()
        ctx.saveToLocalStorage()
    }

    return (
        <Popover open={open}>
            <PopoverTrigger className="relative" onClick={handlePopoverTrigger}>
                {!ctx.userHasUsedLeafGenderButton ? <span className="animate-ping absolute inline-flex h-5 w-5 mt-[7px] ml-[7px] rounded-full bg-primary opacity-100"></span> : null}
                <span className={cn(buttonVariants({ variant: "outline" }), "relative rounded-full border border-dark p-[6px] h-fit w-fit")}>
                    {!gender || props.currentLeaf.isGenderless() || props.currentLeaf.isDitto() ? (
                        <HelpCircle size={20} />
                    ) : gender === PokemonGender.Female ? (
                        <Female className="h-5 w-5 fill-pink-500 antialiased" />
                    ) : (
                        <Male className="h-5 w-5 fill-blue-500 antialiased" />
                    )}
                </span>
            </PopoverTrigger>
            <PopoverContent
                onInteractOutside={() => setOpen(false)}
                className="max-w-48 w-full shadow" style={{ border: "1px solid rgba(0,0,0,0.2)" }}>
                <div className="flex flex-col items-center gap-4">
                    {props.currentLeaf.isGenderless() || props.currentLeaf.isDitto() ? (
                        <i className="text-sm text-foreground/70">{t("This Pokemon species can't have a gender")}</i>
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
                                    <Female className={`h-6 w-6 fill-pink-500 antialiased ${!ctx.userHasSelectedLeafGender ? "animate-bounce" : ""}`} />
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                    value="Male"
                                    aria-label="Toggle Male"
                                    className="bg-popover data-[state=on]:bg-blue-100 hover:bg-blue-100"
                                >
                                    <Male className={`fill-blue-500 h-6 w-6 antialiased ${!ctx.userHasSelectedLeafGender ? "animate-bounce" : ""}`} />
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
                                                {t("Ignore cost")}
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
