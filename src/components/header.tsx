import { useEffect, useState } from "react";
import { getAPIURL } from "../helpers";
import { getBotList } from "../actions/sendMessage";
import { BotVoice } from "../App";

interface IProps {
    botName: string
    botId: number | null
    status: string
    restart: ()=>void
    updateBotName: (name:string)=>void
    updateBotId: (id:number)=>void
    error: string | null
    loading: boolean
    botAudioUrl: string | null
    setBotAudioUrl: (url:null|string)=>void
    botVoice: BotVoice
    setBotVoice: (botVoice:BotVoice)=>void
}

export default function Header({botName, status, restart, error, botId, loading, updateBotName, updateBotId, botAudioUrl, setBotAudioUrl, setBotVoice, botVoice}: IProps){
    const {devMode} = getAPIURL()
    const [showSettings, setShowSettings] = useState(false);
    const [online, setOnline] = useState(false);
    const [botsList, setBotList] = useState([]);
    const [selectedBot, setselectedBot] = useState({});

    useEffect(()=>{
        const {url} = getAPIURL()
        getBotList(url).then((resp:any)=>{
            if(!resp.data.error){
                if(resp.data.data){
                    setBotList(resp.data.data);
                }
            }
        })
    },[])

    
    useEffect(()=>{
        if(status.toUpperCase() === 'DEPLOYED' || status.toUpperCase() === 'ACTIVE'){
            setOnline(true)
        }else{
            setOnline(false)
        }
    }, [status])

    const handleBotItemClick = (bot:any,id:number) => {
        console.log(bot);
        updateBotName(bot.name);
        updateBotId(id);
        setselectedBot(bot);
        setShowSettings(false); // Close the dropdown after selecting a bot
        restart();
    };

    return (
        <div className="h-20 bg-[#141414] rounded-t-2xl py-4 px-2">
            <div className="flex justify-between align-center">
                <div className="w-90">
                    <div className="flex items-center">
                        <div className="relative">
                            <img alt="" src={`/avatars/${(botId || 10)%5}.png`} className="rounded-full border border-red-700" width='40px' height='40px' />
                            {devMode !== 'local' && <div className={`border rounded-full h-2 w-2 absolute bottom-0 right-0 ${online ? 'border-green-500 bg-green-500': 'border-red-500 bg-red-500'}`} />}
                        </div>
                        {error && <span className="font-bold text-base text-white mx-2">{error}</span>}
                        {loading && <div><span className="font-bold text-base text-white mx-2">Loading Bot...</span></div>}
                        {!error && <span className="font-bold text-base text-white mx-2">{botName.toUpperCase()}</span>}
                        <div className="bg-white rounded-full">
                            <button className={`px-4 py-2 font-bold  ${botVoice.allowToSpeak? 'text-black':'text-gray-300'}`} onClick={()=>{setBotVoice({...botVoice, allowToSpeak: !botVoice.allowToSpeak})}}>
                                <span>Bot Voice</span>
                            </button>
                        </div>
                        
                        {botAudioUrl && (
                            <audio controls autoPlay onEnded={() => setBotAudioUrl(null)}>
                                <source src={botAudioUrl} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        )}
                    </div>
                </div>
                <div className="items-center flex relative">
                {showSettings && (
                        <div
                            id="dropdown"
                            className="z-8 absolute top-8 right-2 w-auto list-none divide-y divide-gray-100 rounded-lg bg-white text-base shadow bg-black"
                        >
                            <ul className="py-2" aria-labelledby="dropdownButton">
                                {botsList.map((bot:any,idx:number) => (
                                <li key={bot.id}>
                                    <button
                                    className={`block px-4 py-2 text-sm text-gray-200 hover:bg-[#141414] ${
                                        selectedBot === bot.id ? "bg-black text-white" : "bg-white"
                                    } hover:text-white`}
                                    onClick={() => handleBotItemClick(bot,idx)}
                                    >
                                    {bot.name}
                                    </button>
                                </li>
                                ))}
                            </ul>
                            <ul className="py-2" aria-labelledby="dropdownButton">
                                <li>
                                    <button
                                    className="block px-4 py-2 text-sm  text-gray-200 hover:bg-[#141414] bg-black hover:text-white"
                                    onClick={()=>{restart(); setShowSettings(false)}}
                                    >
                                    Restart
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                    <button
                        onClick={() => {
                            setShowSettings(!showSettings);
                        }}
                        id="dropdownButton"
                        data-dropdown-toggle="dropdown"
                        className="text-white  inline-block p-1.5 text-sm"
                        type="button"
                        >
                            <span className="sr-only">Open dropdown</span>
                            <svg
                                className="h-5 w-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="white"
                                viewBox="0 0 16 3"
                            >
                                <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                            </svg>
                    </button>
                    
                </div>
            </div>
        </div>
    )
}