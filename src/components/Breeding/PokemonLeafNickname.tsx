
import React from "react"
import { Save, SquarePen } from "lucide-react"
import { PokemonBreedTreeLeaf } from "./core/tree/BreedTreeLeaf"
import { useBreedTreeContext } from "./core/ctx/PokemonBreedTreeContext"

export function PokemonLeafNickname(props: { currentLeaf: PokemonBreedTreeLeaf; updateBreedTree: () => void }) {
    const ctx = useBreedTreeContext()
    const [isEditing, setIsEditing] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)

    function setNickname(nick: string) {
        props.currentLeaf.setNickname(nick)
        props.updateBreedTree()
        ctx.saveToLocalStorage()
    }

    function handleEditButton() {
        if (isEditing) {
            const nameInput = inputRef.current?.value
            //If the name in the input is the current node species name, it means there is no change, so don't set a nickname
            if (nameInput !== props.currentLeaf.species?.name) {
                setNickname(nameInput ?? "")
            }
            setIsEditing(false)
            return
        }

        setIsEditing(true)
        setTimeout(() => {
            inputRef.current?.focus()
        }, 0)
    }

    return (
        <div className="relative">
            <input
                ref={inputRef}
                className="focus:outline-none border-b w-full bg-transparent pb-1"
                defaultValue={props.currentLeaf.nickname ?? props.currentLeaf.species!.name}
                disabled={!isEditing}
                maxLength={16}
            />
            <button className="absolute -right-3 scale-75 -top-1" onClick={handleEditButton}>
                {isEditing ? <Save /> : <SquarePen />}
            </button>
        </div>
    )
}
