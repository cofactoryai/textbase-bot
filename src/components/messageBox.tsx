import { useEffect, useRef } from "react"
import { IMessage } from "../types/message"
import Bubble from "./messageBox/bubble"
import Loader from "./messageBox/loader"
import ErrorBubble from "./messageBox/errorBubble"

interface IProps {
    messages:IMessage[]
    loading: boolean
    error: string | null
}

function Message(message: IMessage){
    return message.content.map((content, index)=>{
            return <Bubble key={index} role={message.role} messageType={content.data_type} message={content.value} />
    })
}

export default function MessageBox({messages, loading, error}: IProps){
    const elementRef = useRef<null | HTMLDivElement>(null);

    useEffect(()=>{
        elementRef?.current?.scrollIntoView({ behavior: 'smooth' });
    },[messages])

    return (
        <div className="h-full border-y bg-gray-100 overflow-scroll">
            {
                messages.map((message)=>{
                    return Message(message)
                })
            }
            {loading && <Loader />}
            {error && <ErrorBubble error={error} />}
            <div ref={elementRef} />
        </div>
    )
}