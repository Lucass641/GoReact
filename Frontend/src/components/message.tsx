import { ArrowUp } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { createMessageReaction } from "../http/create-message-reaction";
import { toast } from "sonner";
import { removeMessageReaction } from "../http/remove-message-reaction";

interface MessageProps {
    id: string
    text: string
    amountOfReaction: number
    answered?: boolean
}

export function Message({
    id: messageId,
    text,
    amountOfReaction,
    answered = false,
}: MessageProps) {
    const { roomId } = useParams()
    const [hasReacted, setHasReacted] = useState(false)

    if (!roomId) {
        throw new Error('Messages components must be used within room page')
    }

    async function createMessageReactionAction() {
        if (!roomId) {
            return
        }
        
        try {
            await createMessageReaction({ messageId, roomId })
        } catch {
            toast.error('Falha ao reagir mensagem, tente novamente!')
        }

        setHasReacted(true)
    }

    async function removeMessageReactionAction() {

        if (!roomId) {
            return
        }
        
        try {
            await removeMessageReaction({ messageId, roomId })
        } catch {
            toast.error('Falha ao remover reação mensagem, tente novamente!')
        }
        setHasReacted(false)
    }

    return (
        <li data-answered={answered} className="ml-4 leading-relaxed text-zinc-100 data-[answered=true]:opacity-50 pointer-events-none">
            {text}
            {hasReacted ? (
                <button
                    type="button"
                    onClick={removeMessageReactionAction}
                    className="mt-3 flex items-center gap-2 text-orange-400 text-sm font-medium hover:text-orange-500">
                    <ArrowUp className="size-4" />
                    Curtir pergunta ({amountOfReaction})</button>
            ) : (
                <button
                    type="button"
                    onClick={createMessageReactionAction}
                    className="mt-3 flex items-center gap-2 text-zinc-400 text-sm font-medium hover:text-zinc-300">
                    <ArrowUp className="size-4" />
                    Curtir pergunta ({amountOfReaction})</button>
            )}
        </li>
    )
}