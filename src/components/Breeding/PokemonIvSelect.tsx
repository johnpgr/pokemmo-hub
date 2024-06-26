import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PokemonIv } from "./core/pokemon"
import { Strings } from "@/utils"
import React from "react"
import type { PokemonLeafInSelect } from "./PokemonBreedSelect"
import { PokemonIvRadioGroup, PokemonIvRadioItem } from "./PokemonIvRadio"
import { IV_DROPDOWN_LIST_VALUES } from "./consts"
import { useTranslations } from "@/context/TranslationsContext"

export function PokemonIvSelect(props: {
    desired31IVCount: number
    breederKindCountTable: Record<string, number>
    setDesired31IVCount: React.Dispatch<React.SetStateAction<number>>
    currentIVDropdownValues: PokemonIv[]
    setCurrentIVDropdownValues: React.Dispatch<React.SetStateAction<PokemonIv[]>>
    currentPokemonInSelect: PokemonLeafInSelect
    setCurrentPokemonInSelect: React.Dispatch<React.SetStateAction<PokemonLeafInSelect>>
}) {
    const { t } = useTranslations()

    function handleDesired31IvCountChange(number: string) {
        const value = parseInt(number)
        const ivSet = new Set(props.currentIVDropdownValues.slice(0, value))
        props.setCurrentPokemonInSelect((prev) => ({
            ...prev,
            ivs: ivSet,
        }))
        props.setDesired31IVCount(ivSet.size)
    }

    function handleIvSelectChange(value: PokemonIv, index: number) {
        const newDropDownValues = [...props.currentIVDropdownValues]
        newDropDownValues[index] = value
        props.setCurrentIVDropdownValues(newDropDownValues)
        props.setCurrentPokemonInSelect((prev) => ({
            ...prev,
            ivs: new Set(newDropDownValues.slice(0, props.desired31IVCount)),
        }))
    }

    return (
        <div>
            <p className="text-foreground/70 text-sm m-0 pb-2">{t("How many IV's do you want?")}</p>
            <PokemonIvRadioGroup
                className="border border-dark rounded-md bg-popover w-fit flex"
                defaultValue={"2"}
                onValueChange={handleDesired31IvCountChange}
            >
                <PokemonIvRadioItem className="border-0" value={"2"}>
                    2
                </PokemonIvRadioItem>
                <PokemonIvRadioItem className="border-0" value={"3"}>
                    3
                </PokemonIvRadioItem>
                <PokemonIvRadioItem className="border-0" value={"4"}>
                    4
                </PokemonIvRadioItem>
                <PokemonIvRadioItem className="border-0" value={"5"}>
                    5
                </PokemonIvRadioItem>
            </PokemonIvRadioGroup>
            <div className="flex pt-2 flex-col md:flex-row items-center gap-2">
                {Object.entries(props.breederKindCountTable).map(([_, value], i) => (
                    <div key={`PokemonIvSelect:${i}`} className="w-full">
                        <Label className="text-sm pb-1 text-foreground/70">
                            <strong className="text-lg text-foreground mr-1">{value}</strong> {t("1x31 IV in")}
                        </Label>
                        <Select
                            value={props.currentIVDropdownValues[i]!}
                            onValueChange={(v) => handleIvSelectChange(v as PokemonIv, i)}
                        >
                            <SelectTrigger className="bg-popover hover:bg-popover/90 border-dark">
                                <SelectValue aria-label={props.currentIVDropdownValues[i]}>
                                    {Strings.pascalToSpacedPascal(t(props.currentIVDropdownValues[i]!))}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="border-dark">
                                {IV_DROPDOWN_LIST_VALUES.map((iv) => (
                                    <SelectItem key={`PokemonIvSelect:${i}:${iv}`} value={iv}>
                                        {Strings.pascalToSpacedPascal(t(iv))}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                ))}
            </div>
        </div>
    )
}
