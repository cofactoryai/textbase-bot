interface IProps{
    error: string;
}

export default function ErrorBubble({error}: IProps){
    return (
        <div className="flex justify-start">
            <div className="max-w-md mx-2 my-2">
                <div className="flex justify-start">
                    <div className="bg-[#F5F5F5] text-black font-semi-bold p-3 rounded-2xl">
                        <p className="block">Error: {error}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}