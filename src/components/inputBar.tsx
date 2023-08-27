import { useState } from "react";
import { IContent } from "../types/message";

interface IProps {
    onMessage: (message: IContent)=>void;
    botName: string
}

export default function InputBar({onMessage, botName}: IProps){

    const [value, setValue] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setValue(e.target.value)
    }

    const handleSubmit = ()=>{
        if(value === ''){
            return
        }
        const message = {
            'data_type': 'string',
            'value': value
        }
        onMessage(message)
        setValue('')
    }

    return(
        <div className="w-full flex justify-center">
            <div className="w-full">
                <input autoFocus onChange={handleChange} value={value} className="appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-bl-2xl" id="message" type="text" placeholder={`Chat with ${botName}`}/>
            </div>
            <div className="flex align-center px-2 ">
                <button disabled={value === ''} onClick={handleSubmit}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${value === ''? 'text-gray-400': 'text-blue-700'} w-6 h-6`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                </button>
            </div>
        </div>
    )
}