import React from 'react'
import { buttonVariants } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Strings, cn } from "@/utils"
import { getEvItemSpriteUrl } from "@/utils/sprites"
import { PokemonIv } from "./core/pokemon"
import { PokemonBreedTreeNode } from "./core/tree/BreedTreeNode"
import { PokemonBreedTreeMap } from "./core/tree/useBreedTreeMap"

export function PokemonNodeHeldItem(props: { item: HeldItem }) {
    return (
        <TooltipProvider delayDuration={250}>
            <Tooltip>
                <TooltipTrigger className={cn(buttonVariants({ variant: 'outline' }), "w-fit h-fit p-0 rounded-full")}>
                    <img
                        src={getEvItemSpriteUrl(props.item)}
                        alt={`Held item: ${props.item}`}
                        style={{
                            imageRendering: "pixelated",
                        }}
                    />
                </TooltipTrigger>
                <TooltipContent>
                    <p className='m-0'>{Strings.kebabToSpacedPascal(props.item)}</p>
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

export function getHeldItemForNode(node: PokemonBreedTreeNode, breedTree: PokemonBreedTreeMap): HeldItem | null {
    const breedPartner = node.getPartnerNode(breedTree)

    if (!breedPartner) {
        return null
    }

    const ivThatDoesntExistOnBreedPartner = node.ivs?.filter((iv) => !breedPartner.ivs?.includes(iv)) ?? []
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
