import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useBreedTreeContext } from "./core/ctx/PokemonBreedTreeContext"
import type { PokemonBreedTreeLeaf } from "./core/tree/BreedTreeLeaf"
import type { PokemonBreedTreeMap } from "./core/tree/useBreedTreeMap"
import { getPokemonSpriteUrl } from "@/utils/sprites"
import { Strings } from "@/utils"
import { PokemonLeafGender } from "./PokemonLeafGender"
import { HeldItem, PokemonLeafHeldItem, getHeldItemForLeaf } from "./PokemonLeafHeldItem"
import { PokemonLeafNickname } from "./PokemonLeafNickname"
import { Button } from "@/components/ui/button"
import { useTranslations } from '@/context/TranslationsContext'

export function PokemonLeafInfo(props: {
    desired31IvCount: number
    currentLeaf: PokemonBreedTreeLeaf
    breedTree: PokemonBreedTreeMap
    updateBreedTree: () => void
}) {
    const { t } = useTranslations()
    const ctx = useBreedTreeContext()
    const heldItem = getHeldItemForLeaf(props.currentLeaf, props.breedTree)

    function resetLeaf() {
        props.currentLeaf.setGender(undefined)
        props.currentLeaf.setSpecies(undefined)
        props.updateBreedTree()
        ctx.saveToLocalStorage()
    }

    return (
        <Card className="w-full md:max-w-64 md:ml-4 h-fit relative shadow" style={{ border: "1px solid rgba(0,0,0,0.2)" }}>
            <CardHeader>
                <CardTitle className="flex items-center">
                    {props.currentLeaf && props.currentLeaf.species ? (
                        <div className="flex items-center">
                            <img
                                src={getPokemonSpriteUrl(props.currentLeaf.species.name)}
                                style={{
                                    imageRendering: "pixelated",
                                }}
                                alt={props.currentLeaf.species.name}
                                className="mb-1"
                            />
                            <PokemonLeafNickname
                                currentLeaf={props.currentLeaf}
                                updateBreedTree={props.updateBreedTree}
                            />
                        </div>
                    ) : null}
                </CardTitle>
                {!props.currentLeaf.isRootLeaf() ? (
                    <div className="absolute -top-4 -left-3 flex flex-col-reverse gap-1 items-center">
                        <PokemonLeafGender
                            desired31IvCount={props.desired31IvCount}
                            currentLeaf={props.currentLeaf}
                            breedTree={props.breedTree}
                            updateBreedTree={props.updateBreedTree}
                        />
                        <PokemonLeafHeldItem
                            item={props.currentLeaf.nature ? HeldItem.Nature : heldItem!}
                        />
                    </div>
                ) : null}
            </CardHeader>
            <CardContent className="gap-1 flex flex-col pl-9">
                {props.currentLeaf.ivs ? (
                    <>
                        <p className="font-bold -mb-1">Ivs</p>
                        {props.currentLeaf.ivs.map((iv) => (
                            <span className="text-sm" key={Strings.random(4)}>
                                31 {Strings.pascalToSpacedPascal(t(iv))}
                            </span>
                        ))}
                    </>
                ) : null}
                {props.currentLeaf.nature ? (
                    <>
                        <p className="font-bold -mb-1">{t("Nature")}</p>
                        <span className="text-sm">{t(props.currentLeaf.nature)}</span>
                    </>
                ) : null}
                {props.currentLeaf.species ? (
                    <>
                        <p className="font-bold -mb-1">{t("Egg Groups")}</p>
                        <p>
                            <span className="text-sm">
                                {t(props.currentLeaf.species!.eggGroups[0])}
                                {props.currentLeaf.species?.eggGroups[1]
                                    ? `, ${t(props.currentLeaf.species.eggGroups[1])}`
                                    : null}
                            </span>
                        </p>
                        {!props.currentLeaf.isRootLeaf() ? (
                            <Button onClick={resetLeaf} className="mt-2" variant={"destructive"} size={"sm"}>
                                {t("Reset")}
                            </Button>
                        ) : null}
                    </>
                ) : null}
            </CardContent>
        </Card>
    )
}
