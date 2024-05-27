
import { Button, buttonVariants } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PokemonNature } from "./core/pokemon"
import { Check, ChevronsUpDown } from "lucide-react"
import React from "react"
import type { PokemonNodeInSelect } from "./PokemonBreedSelect"
import { cn } from "@/utils"

export function PokemonNatureSelect(props: {
    currentPokemonInSelect: PokemonNodeInSelect
    setCurrentPokemonInSelect: React.Dispatch<React.SetStateAction<PokemonNodeInSelect>>
}) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")
    const natured = Boolean(props.currentPokemonInSelect.nature)

    function handleNatureSelect(value?: PokemonNature) {
        props.setCurrentPokemonInSelect((prev) => ({ ...prev, nature: value }))
        setIsOpen(false)
    }

    return (
        <div>
            <p className="text-sm text-foreground/70 pb-2 m-0">Consider nature in breeding project?</p>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger className={cn(buttonVariants({ variant: "popover" }), "border")}>
                    {!natured ? "Select a nature" : props.currentPokemonInSelect.nature!}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </PopoverTrigger>
                <PopoverContent className="p-0 border">
                    <Command>
                        <CommandInput
                            placeholder="Search nature..."
                            value={search}
                            onValueChange={setSearch}
                            data-cy="search-nature-input"
                        />
                        <CommandEmpty>No results.</CommandEmpty>
                        <CommandGroup>
                            <ScrollArea className="h-72">
                                <CommandItem
                                    onSelect={() => {
                                        handleNatureSelect(undefined)
                                    }}
                                    className="pl-8 relative"
                                >
                                    {!natured ? (
                                        <Check className="h-4 w-4 absolute top-1/2 -translate-y-1/2 left-2" />
                                    ) : null}
                                    <span className="pl-6">
                                        No nature
                                    </span>
                                </CommandItem>
                                {Object.values(PokemonNature).map((nature) => (
                                    <React.Fragment key={`PokemonNatureSelect:${nature}`}>
                                        <CommandItem
                                            value={nature}
                                            onSelect={() => {
                                                handleNatureSelect(nature)
                                            }}
                                            data-cy={`${nature}-value`}
                                            className="relative"
                                        >
                                            {props.currentPokemonInSelect.nature === nature ? (
                                                <Check className="h-4 w-4 absolute top-1/2 -translate-y-1/2 left-2" />
                                            ) : null}
                                            <span className="pl-6">
                                                {nature}
                                            </span>
                                        </CommandItem>
                                    </React.Fragment>
                                ))}
                            </ScrollArea>
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}