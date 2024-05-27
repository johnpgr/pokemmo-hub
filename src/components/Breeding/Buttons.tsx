
import { PokemonBreedTreeSerializedSchema, useBreedTreeContext } from "./core/ctx/PokemonBreedTreeContext"
import { Try } from "@/utils/results"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import { ClipboardCopy, Import, RotateCcw, Save } from "lucide-react"
import React from "react"
import { useMediaQuery } from "usehooks-ts"
import { generateErrorMessage as generateZodErrorMessage } from "zod-error"
import { Button, buttonVariants } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/utils"

export function JsonImportButton(props: { handleImportJson: (data: string) => void }) {
    const [jsonData, setJsonData] = React.useState("")

    return (
        <Popover>
            <PopoverTrigger className={cn(buttonVariants({ variant: "secondary" }), "gap-2")} type="button">
                <Import size={16} />
                Import
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-4 w-96">
                <pre spellCheck={false}>
                    <code>
                        <Textarea
                            className="w-full resize-none border-none"
                            rows={16}
                            value={jsonData}
                            onChange={(e) => setJsonData(e.currentTarget?.value ?? "")}
                        />
                    </code>
                </pre>
                <Button className="gap-1" onClick={() => props.handleImportJson(jsonData)}>
                    <Save size={16} />
                    Save
                </Button>
            </PopoverContent>
        </Popover>
    )
}

export function ImportExportButton(props: { handleExport: () => string }) {
    const { toast } = useToast()
    const ctx = useBreedTreeContext()
    const [jsonData, setJsonData] = React.useState("")

    function handleSave() {
        const unparsed = JSON.parse(jsonData)

        const res = PokemonBreedTreeSerializedSchema.safeParse(unparsed)
        if (res.error) {
            const errorMsg = generateZodErrorMessage(res.error.issues)

            toast({
                title: "Failed to save the breed tree JSON content.",
                description: errorMsg,
                variant: "destructive",
            })
            return
        }

        const deserialized = Try(() => ctx.deserialize(res.data))
        if (!deserialized.ok) {
            toast({
                title: "Failed to save the breed tree JSON content.",
                description: (deserialized.error as Error).message ?? "",
                variant: "destructive",
            })
        }
    }

    return (
        <Popover>
            <PopoverTrigger
                className={cn(buttonVariants({ variant: "secondary" }), "gap-1")}
                type="button"
                onClick={() => setJsonData(props.handleExport())}>
                <Import size={16} />
                Import/Export
            </PopoverTrigger>
            <PopoverContent className="relative flex flex-col gap-4 w-96">
                <pre spellCheck={false}>
                    <code>
                        <Textarea
                            rows={16}
                            className="w-full resize-none border-none rounded-none"
                            value={jsonData}
                            onChange={(e) => setJsonData(e.currentTarget?.value ?? "")}
                        />
                    </code>
                </pre>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger
                            className={cn(buttonVariants({ variant: "secondary", size: "icon" }), "absolute top-7 right-8 md:right-11 h-8 w-8")}
                            onClick={() => {
                                navigator.clipboard
                                    .writeText(jsonData)
                                    .then(() => {
                                        toast({
                                            title: "Copy success.",
                                            description: "The current breed state was copied to your clipboard.",
                                        })
                                    })
                                    .catch(() => {
                                        toast({
                                            title: "Copy failed.",
                                            description: "Failed to copy breed contents.",
                                        })
                                    })
                            }}
                        >
                            <ClipboardCopy size={16} />
                        </TooltipTrigger>
                        <TooltipContent>Copy to clipboard</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <Button onClick={handleSave} className="gap-1">
                    <Save size={16} />
                    Save
                </Button>
            </PopoverContent>
        </Popover >
    )
}

export function ResetBreedButton(props: { handleRestartBreed: () => void }) {
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog>
                <DialogTrigger
                    className={cn(buttonVariants({ variant: "destructive" }), "gap-1")}
                >
                    <RotateCcw size={16} />
                    Reset
                </DialogTrigger>
                <DialogContent
                    className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Reset current breed</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to reset the current breed?
                            <br />
                            All progress will be lost.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant={"destructive"} onClick={props.handleRestartBreed}>
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer>
            <DrawerTrigger
                className={cn(buttonVariants({ variant: "destructive" }), "gap-1")}
            >
                <RotateCcw size={16} />
                Reset
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Reset current breed</DrawerTitle>
                    <DrawerDescription>
                        Are you sure you want to reset the current breed? All progress will be lost.
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="pt-2">
                    <DrawerClose>
                        Confirm
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
