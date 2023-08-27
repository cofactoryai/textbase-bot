import { useState } from "react";

interface IProps {
    botName: string
    status: string
    restart: ()=>void
    error: string | null
}
export default function Header({botName, status, restart, error}: IProps){
    const [showSettings, setShowSettings] = useState(false);
    console.log(showSettings)
    return (
        <div className="h-20 rounded-t-2xl py-4 px-2">
            <div className="flex justify-between">
                <div className="w-90">
                    <div>
                        <p className="font-bold text-base text-red-700">{error}</p>
                    </div>
                    {!error && <div>
                        <p className="font-bold text-base">{botName}</p>
                    </div>}
                    <div>
                        <p className="text-sm text-gray-500">Status: {status}</p>
                    </div>
                </div>
                <div className="items-center flex">
                {showSettings && (
                        <div
                            id="dropdown"
                            className="z-8 relative top-8 left-10 w-auto list-none divide-y divide-gray-100 rounded-lg bg-white text-base shadow dark:bg-gray-700"
                        >
                            <ul className="py-2" aria-labelledby="dropdownButton">
                                <li>
                                    <button
                                    className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
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
                        className="text-black-500  inline-block p-1.5 text-sm dark:text-gray-400"
                        type="button"
                        >
                            <span className="sr-only">Open dropdown</span>
                            <svg
                                className="h-5 w-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="gray"
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