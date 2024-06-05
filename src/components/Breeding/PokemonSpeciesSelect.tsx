import pokemons from "@/data/pokemmo/monster-breeding-sim.json"
import { buttonVariants } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PokemonSpecies, PokemonSpeciesUnparsed } from "./core/pokemon"
import { getPokemonSpriteUrl } from "@/utils/sprites"
import { Check, ChevronsUpDown } from "lucide-react"
import React from "react"
import type { PokemonLeafInSelect } from "./PokemonBreedSelect"
import { cn } from "@/utils"
import { useTranslations } from "@/context/TranslationsContext"

export function PokemonSpeciesSelect(props: {
    currentSelectedLeaf: PokemonLeafInSelect
    setCurrentSelectedLeaf: React.Dispatch<React.SetStateAction<PokemonLeafInSelect>>
}) {
    const { t } = useTranslations()
    const [isOpen, setIsOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")

    function handleSpeciesSelect(pokemon: PokemonSpeciesUnparsed) {
        props.setCurrentSelectedLeaf((prev) => ({
            ...prev,
            species: PokemonSpecies.parse(pokemon),
        }))
        setIsOpen(false)
    }

    return (
        <div>
            <p className="text-foreground/70 text-sm m-0 pb-2">What Pokémon species?</p>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger type='button' className={cn(buttonVariants({ variant: 'popover' }), `border border-dark ${props.currentSelectedLeaf.species ? "pl-2" : "pl-4"}`)}>
                    {props.currentSelectedLeaf?.species ? (
                        <img
                            className="top-[1px] left-0"
                            src={getPokemonSpriteUrl(props.currentSelectedLeaf.species?.name)}
                            style={{ imageRendering: "pixelated" }}
                            alt={props.currentSelectedLeaf.species.name}
                        />
                    ) : null}
                    {props.currentSelectedLeaf?.species
                        ? props.currentSelectedLeaf.species.name
                        : "Select a Pokemon"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </PopoverTrigger>
                <PopoverContent className="p-0 border border-dark">
                    <Command>
                        <CommandInput
                            placeholder={t("Search pokemon...")}
                            value={search}
                            onValueChange={setSearch}
                            data-cy="search-pokemon-input"
                        />
                        <CommandEmpty>No results</CommandEmpty>
                        <CommandGroup>
                            <ScrollArea className="h-72">
                                {pokemons
                                    .filter((pokemon) => t(pokemon.name).toLowerCase().includes(search.toLowerCase()))
                                    .map((pokemon) => (
                                        <CommandItem
                                            key={`pokemon_to_breed:${pokemon.name}`}
                                            value={pokemon.name}
                                            onSelect={() => handleSpeciesSelect(pokemon)}
                                            data-cy={`${pokemon.name}-value`}
                                            className="relative"
                                        >
                                            {props.currentSelectedLeaf.species?.name === pokemon.name ? (
                                                <Check className="h-4 w-4 absolute top-1/2 -translate-y-1/2 left-2" />
                                            ) : null}
                                            <span className="pl-6">
                                                {t(pokemon.name)}
                                            </span>
                                        </CommandItem>
                                    ))}
                            </ScrollArea>
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
