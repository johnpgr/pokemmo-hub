import React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "@/utils"

const PokemonIvRadioGroup: React.FC<React.ComponentProps<typeof RadioGroupPrimitive.Root>> = ({
    className,
    ref,
    ...props
}) => {
    return <RadioGroupPrimitive.Root className={cn("grid gap-2 overflow-hidden", className)} {...props} ref={ref} />
}

const PokemonIvRadioItem: React.FC<React.ComponentProps<typeof RadioGroupPrimitive.Item>> = ({
    className,
    children,
    ref,
    ...props
}) => {
    return (
        <RadioGroupPrimitive.Item
            ref={ref}
            className={cn(
                "aspect-square h-8 relative rounded border border-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className,
            )}
            {...props}
        >
            <RadioGroupPrimitive.Indicator className="flex items-center justify-center bg-accent h-full w-full"></RadioGroupPrimitive.Indicator>
            <div className="absolute inset-0 mt-1">{children}</div>
        </RadioGroupPrimitive.Item>
    )
}

export { PokemonIvRadioGroup, PokemonIvRadioItem }
