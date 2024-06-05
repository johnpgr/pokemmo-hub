import React from 'react'
import { buttonVariants } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Strings, cn } from "@/utils"
import { getEvItemSpriteUrl } from "@/utils/sprites"
import { PokemonIv } from "./core/pokemon"
import { PokemonBreedTreeLeaf } from "./core/tree/BreedTreeLeaf"
import { PokemonBreedTreeMap } from "./core/tree/useBreedTreeMap"
import { useTranslations } from '@/context/TranslationsContext'

export function PokemonLeafHeldItem(props: { item: HeldItem }) {
    const { t } = useTranslations()
    return (
        <TooltipProvider delayDuration={250}>
            <Tooltip>
                <TooltipTrigger className={cn(buttonVariants({ variant: 'outline' }), "w-fit h-fit p-0 rounded-full border-dark")}>
                    <img
                        src={getEvItemSpriteUrl(props.item)}
                        alt={`Held item: ${props.item}`}
                        style={{
                            imageRendering: "pixelated",
                        }}
                    />
                </TooltipTrigger>
                <TooltipContent className='border-dark shadow'>
                    <p className='m-0'>{Strings.kebabToSpacedPascal(t(props.item))}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export enum HeldItem {
    HP = "power-weight",
    Attack = "power-bracer",
    Defense = "power-belt",
    SpecialAttack = "power-lens",
    SpecialDefense = "power-band",
    Speed = "power-anklet",
    Nature = "everstone",
}

export function getHeldItemForLeaf(leaf: PokemonBreedTreeLeaf, breedTree: PokemonBreedTreeMap): HeldItem | null {
    const breedPartner = leaf.getPartnerLeaf(breedTree)

    if (!breedPartner) {
        return null
    }

    const ivThatDoesntExistOnBreedPartner = leaf.ivs?.filter((iv) => !breedPartner.ivs?.includes(iv)) ?? []
    if (ivThatDoesntExistOnBreedPartner.length === 0) {
        return null
    }

    switch (ivThatDoesntExistOnBreedPartner[0]) {
        case PokemonIv.HP:
            return HeldItem.HP
        case PokemonIv.Attack:
            return HeldItem.Attack
        case PokemonIv.Defense:
            return HeldItem.Defense
        case PokemonIv.SpecialAttack:
            return HeldItem.SpecialAttack
        case PokemonIv.SpecialDefense:
            return HeldItem.SpecialDefense
        case PokemonIv.Speed:
            return HeldItem.Speed
        default:
            return null
    }
}
