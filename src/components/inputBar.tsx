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
            'data_type': 'STRING',
            'value': value
        }
        onMessage(message)
        setValue('')
    }

    return(
        <div className="w-full flex justify-center bg-[#141414] rounded-b-2xl py-4">
            <div className="w-5/6">
                <form onSubmit={(e)=>{
                    e.preventDefault()
                    handleSubmit()
                }}>
                    <input type="text" autoFocus onChange={handleChange} value={value} className="appearance-none bg-black w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline rounded-2xl" id="message" placeholder={`Chat with ${botName}`}/>
                </form>
            </div>
            <div className="flex align-center mx-2 px-2 bg-white rounded-full">
                <button className={`px-4 py-2 font-bold  ${value === '' ? 'text-gray-300': 'text-black'}`} disabled={value === ''} onClick={handleSubmit}>
                    {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${value === ''? 'text-gray-400': 'text-white'} w-6 h-6`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg> */}
                    <span>Send</span>
                </button>
            </div>
        </div>
    )
}