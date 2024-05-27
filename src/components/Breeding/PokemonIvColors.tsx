import React from 'react'
import { useBreedTreeContext } from "./core/ctx/PokemonBreedTreeContext"
import type { PokemonIv } from "./core/pokemon"
import { Strings } from "@/utils"
import { IvColor, IV_COLOR_DICT } from "./consts"

export function PokemonIvColors() {
    const ctx = useBreedTreeContext()

    return (
        <div className="flex flex-wrap justify-center gap-4 mb-4 mx-auto">
            <div className="flex items-center gap-2">
                <div
                    className="rounded-full p-2 h-2 w-2"
                    style={{
                        backgroundColor: IV_COLOR_DICT[ctx.breedTarget.ivs.A],
                    }}
                />
                <span >{Strings.pascalToSpacedPascal(ctx.breedTarget.ivs.A)}</span>
            </div>
            <div className="flex items-center gap-2">
                <div
                    className="rounded-full p-2 h-2 w-2"
                    style={{
                        backgroundColor: IV_COLOR_DICT[ctx.breedTarget.ivs.B],
                    }}
                />
                <span >{Strings.pascalToSpacedPascal(ctx.breedTarget.ivs.B)}</span>
            </div>
            {ctx.breedTarget.ivs.C ? (
                <div className="flex items-center gap-2">
                    <div
                        className="rounded-full p-2 h-2 w-2"
                        style={{
                            backgroundColor: IV_COLOR_DICT[ctx.breedTarget.ivs.C],
                        }}
                    />
                    <span >{Strings.pascalToSpacedPascal(ctx.breedTarget.ivs.C)}</span>
                </div>
            ) : null}
            {ctx.breedTarget.ivs.D ? (
                <div className="flex items-center gap-2">
                    <div
                        className="rounded-full p-2 h-2 w-2"
                        style={{
                            backgroundColor: IV_COLOR_DICT[ctx.breedTarget.ivs.D],
                        }}
                    />
                    <span >{Strings.pascalToSpacedPascal(ctx.breedTarget.ivs.D)}</span>
                </div>
            ) : null}
            {ctx.breedTarget.ivs.E ? (
                <div className="flex items-center gap-2">
                    <div
                        className="rounded-full p-2 h-2 w-2"
                        style={{
                            backgroundColor: IV_COLOR_DICT[ctx.breedTarget.ivs.E],
                        }}
                    />
                    <span >{Strings.pascalToSpacedPascal(ctx.breedTarget.ivs.E)}</span>
                </div>
            ) : null}
            {ctx.breedTarget.nature ? (
                <div className="flex items-center gap-2">
                    <div
                        className="rounded-full p-2 h-2 w-2"
                        style={{
                            backgroundColor: IV_COLOR_DICT["Nature"],
                        }}
                    />
                    <span >{ctx.breedTarget.nature}</span>
                </div>
            ) : null}
        </div>
    )
}

export function getColorsByIvs(ivs: PokemonIv[]): IvColor[] {
    return ivs.map((iv) => IV_COLOR_DICT[iv])
}
