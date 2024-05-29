import { buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/utils"
import { assert } from "@/utils/assert"
import { getPokemonSpriteUrl } from "@/utils/sprites"
import { Check } from "lucide-react"
import React from "react"
import { useMediaQuery } from "usehooks-ts"
import { getColorsByIvs } from "./PokemonIvColors"
import { PokemonLeafInfo } from "./PokemonLeafInfo"
import { IV_COLOR_DICT, IvColor, LEAF_SCALE_BY_COLOR_AMOUNT, SPRITE_SCALE_BY_COLOR_AMOUNT } from "./consts"
import { useBreedTreeContext } from "./core/ctx/PokemonBreedTreeContext"
import { PokemonEggGroup, PokemonGender, PokemonSpecies, PokemonSpeciesUnparsed } from "./core/pokemon"
import type { PokemonBreedTreePosition } from "./core/tree/BreedTreePosition"
import type { PokemonBreedTreeMap } from "./core/tree/useBreedTreeMap"
import evolutions from "@/data/evolutions.json"
import pokemons from "@/data/pokemmo/monster-breeding-sim.json"

enum SearchMode {
    All,
    EggGroupMatches,
}

export function PokemonLeafSelect(props: {
    desired31IvCount: number
    position: PokemonBreedTreePosition
    breedTree: PokemonBreedTreeMap
    updateBreedTree: () => void
}) {
    const id = React.useId()
    const ctx = useBreedTreeContext()
    const [pending, startTransition] = React.useTransition()
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const [searchMode, setSearchMode] = React.useState(SearchMode.All)
    const [search, setSearch] = React.useState("")
    const [colors, setColors] = React.useState<IvColor[]>([])
    const isPokemonToBreed = props.position.col === 0 && props.position.row === 0
    const currentLeaf = props.breedTree[props.position.key()]
    assert(currentLeaf, "Current leaf should exist in PokemonLeafSelect")

    function setPokemonSpecies(species: PokemonSpeciesUnparsed) {
        assert(currentLeaf, `Leaf at ${props.position} should exist`)
        currentLeaf.setSpecies(PokemonSpecies.parse(species))

        switch (true) {
            case currentLeaf.isDitto():
                currentLeaf.setGender(PokemonGender.Genderless)
                break
            case currentLeaf.isGenderless():
                currentLeaf.setGender(PokemonGender.Genderless)
                break
            case currentLeaf.species!.percentageMale === 0:
                currentLeaf.setGender(PokemonGender.Female)
                break
            case currentLeaf.species!.percentageMale === 100:
                currentLeaf.setGender(PokemonGender.Male)
                break
            case currentLeaf.gender === PokemonGender.Genderless:
                //this means that previously at this leaf there was a Genderless Pokemon
                currentLeaf.setGender(undefined)
                break
        }

        props.updateBreedTree()
        ctx.saveToLocalStorage()
    }

    function handleSearchModeChange() {
        startTransition(() => {
            setSearchMode((prev) => (prev === SearchMode.All ? SearchMode.EggGroupMatches : SearchMode.All))
        })
    }

    const filterPokemonByEggGroups = React.useCallback((): PokemonSpeciesUnparsed[] => {
        assert(ctx.breedTarget.species !== undefined, "Pokemon in context should exist")
        const newList: PokemonSpeciesUnparsed[] = []

        const ditto = pokemons.find((poke) => poke.number === 132)
        assert(ditto !== undefined, "Ditto should exist")
        newList.push(ditto)

        if (ctx.breedTarget.species.eggGroups.includes(PokemonEggGroup.Genderless)) {
            const evolutionTree = evolutions.find((e) => e.includes(ctx.breedTarget.species!.number))
            assert(evolutionTree !== undefined, "Every pokemon has to have it's evolution tree in evolutions.json")

            return newList.concat(pokemons.filter((poke) => evolutionTree.includes(poke.number)))
        }

        for (const poke of pokemons) {
            if (!poke.eggGroups.some((e) => ctx.breedTarget.species!.eggGroups.includes(e))) {
                continue
            }

            newList.push(poke)
        }

        return newList
    }, [ctx.breedTarget.species, pokemons])

    const pokemonList = React.useMemo(() => {
        return searchMode === SearchMode.All ? pokemons : filterPokemonByEggGroups()
    }, [filterPokemonByEggGroups, searchMode, pokemons])

    React.useEffect(() => {
        if (!currentLeaf || colors.length > 0) return

        const newColors: IvColor[] = []

        if (currentLeaf.nature) {
            newColors.push(IV_COLOR_DICT["Nature"])
        }

        if (currentLeaf.ivs) {
            newColors.push(...getColorsByIvs(currentLeaf.ivs))
        }

        setColors(newColors)
    }, [colors.length, currentLeaf])

    if (isDesktop) {
        return (
            <Popover>
                <PopoverTrigger className={cn(buttonVariants({ size: 'icon' }), "z-10 relative rounded-full bg-neutral-300 dark:bg-neutral-800 overflow-hidden")}
                    style={{
                        scale: LEAF_SCALE_BY_COLOR_AMOUNT[colors?.length ?? 1],
                    }}
                >
                    {colors?.map((color) => (
                        <div
                            key={`PokemonLeafSelect:${id}:${color}`}
                            style={{
                                height: "100%",
                                backgroundColor: color,
                                width: 100 / colors.length,
                            }}
                        />
                    ))}
                    {currentLeaf?.species ? (
                        <img
                            src={getPokemonSpriteUrl(currentLeaf.species.name)}
                            style={{
                                imageRendering: "pixelated",
                                scale: SPRITE_SCALE_BY_COLOR_AMOUNT[colors?.length ?? 1],
                            }}
                            alt={currentLeaf.species.name}
                            className="mb-1 absolute"
                        />
                    ) : null}
                </PopoverTrigger>
                <PopoverContent className="p-0 flex gap-4 w-full max-w-2xl bg-transparent shadow-none">
                    {currentLeaf ? (
                        <PokemonLeafInfo
                            desired31IvCount={props.desired31IvCount}
                            breedTree={props.breedTree}
                            updateBreedTree={props.updateBreedTree}
                            currentLeaf={currentLeaf}
                        />
                    ) : null}
                    {!isPokemonToBreed ? (
                        <Command className="w-full max-w-lg border border-dark shadow">
                            <CommandInput
                                placeholder="Search pokemon..."
                                value={search}
                                onValueChange={setSearch}
                                data-cy="search-pokemon-input"
                            />
                            <div className="flex items-center pl-3 gap-2 text-xs text-foreground/80 p-2 border-b border-dark">
                                <Checkbox
                                    className="border-foreground/50"
                                    checked={searchMode === SearchMode.EggGroupMatches}
                                    onCheckedChange={handleSearchModeChange}
                                />
                                Show only {ctx.breedTarget.species?.name}&apos;s egg groups
                            </div>
                            <CommandEmpty>{!pending ? "No results" : ""}</CommandEmpty>
                            <CommandGroup>
                                <ScrollArea className="h-72 w-full">
                                    {pending
                                        ? Array.from({ length: 9 }).map((_, i) => (
                                            <CommandItem
                                                key={`PokemonLeafSelectCommandItemPending${id}:${i}`}
                                                value={""}
                                                onSelect={() => { }}
                                            />
                                        ))
                                        : pokemonList
                                            .filter((pokemon) =>
                                                pokemon.name.toLowerCase().includes(search.toLowerCase()),
                                            )
                                            .map((pokemon) => (
                                                <CommandItem
                                                    key={`PokemonLeafSelectCommandItem${id}:${pokemon.name}`}
                                                    value={pokemon.name}
                                                    onSelect={() => setPokemonSpecies(pokemon)}
                                                    data-cy={`${pokemon.name}-value`}
                                                    className="relative"
                                                >
                                                    {currentLeaf.species?.name === pokemon.name ? (
                                                        <Check className="h-4 w-4 absolute top-1/2 -translate-y-1/2 left-2" />
                                                    ) : null}
                                                    <span className="pl-6">
                                                        {pokemon.name}
                                                    </span>
                                                </CommandItem>
                                            ))}
                                </ScrollArea>
                            </CommandGroup>
                        </Command>
                    ) : null}
                </PopoverContent>
            </Popover>
        )
    }

    return (
        <Drawer>
            <DrawerTrigger
                style={{
                    scale: LEAF_SCALE_BY_COLOR_AMOUNT[colors?.length ?? 1],
                }}
                className={cn(buttonVariants({ size: "icon" }), "z-10 relative rounded-full bg-neutral-300 dark:bg-neutral-800 overflow-hidden")}>
                {colors?.map((color) => (
                    <div
                        key={`PokemonLeafSelect:${id}:${color}`}
                        style={{
                            height: "100%",
                            backgroundColor: color,
                            width: 100 / colors.length,
                        }}
                    />
                ))}
                {currentLeaf?.species ? (
                    <img
                        src={getPokemonSpriteUrl(currentLeaf.species.name)}
                        style={{
                            imageRendering: "pixelated",
                            scale: SPRITE_SCALE_BY_COLOR_AMOUNT[colors?.length ?? 1],
                        }}
                        alt={currentLeaf.species.name}
                        className="mb-1 absolute"
                    />
                ) : null}
            </DrawerTrigger>
            <DrawerContent className="p-4 pt-0 flex flex-col gap-4">
                {!isPokemonToBreed ? (
                    <Command className="w-full border">
                        <CommandInput
                            placeholder="Search pokemon..."
                            value={search}
                            onValueChange={setSearch}
                            data-cy="search-pokemon-input"
                        />
                        <div className="flex items-center pl-3 gap-2 text-xs text-foreground/80 p-2 border-b">
                            <Checkbox
                                className="border-foreground/50"
                                checked={searchMode === SearchMode.EggGroupMatches}
                                onCheckedChange={handleSearchModeChange}
                            />
                            Show only {ctx.breedTarget.species?.name}&apos;s egg groups
                        </div>
                        <CommandEmpty>{!pending ? "No results" : ""}</CommandEmpty>
                        <CommandGroup>
                            <ScrollArea className="h-52 w-full">
                                {pending
                                    ? Array.from({ length: 9 }).map((_, i) => (
                                        <CommandItem
                                            key={`PokemonLeafSelectCommandItemPending${id}:${i}`}
                                            value={""}
                                            onSelect={() => { }}
                                        />
                                    ))
                                    : pokemonList
                                        .filter((pokemon) =>
                                            pokemon.name.toLowerCase().includes(search.toLowerCase()),
                                        )
                                        .map((pokemon) => (
                                            <CommandItem
                                                key={`PokemonLeafSelectCommandItem${id}:${pokemon.name}`}
                                                value={pokemon.name}
                                                onSelect={() => setPokemonSpecies(pokemon)}
                                                data-cy={`${pokemon.name}-value`}
                                                className="relative"
                                            >
                                                {currentLeaf.species?.name === pokemon.name ? (
                                                    <Check className="h-4 w-4 absolute top-1/2 -translate-y-1/2 left-2" />
                                                ) : null}
                                                <span className="pl-6">
                                                    {pokemon.name}
                                                </span>
                                            </CommandItem>
                                        ))}
                            </ScrollArea>
                        </CommandGroup>
                    </Command>
                ) : null}
                {currentLeaf ? (
                    <PokemonLeafInfo
                        desired31IvCount={props.desired31IvCount}
                        breedTree={props.breedTree}
                        updateBreedTree={props.updateBreedTree}
                        currentLeaf={currentLeaf}
                    />
                ) : null}
            </DrawerContent>
        </Drawer>
    )
}
