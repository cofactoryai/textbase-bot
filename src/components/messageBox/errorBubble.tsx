interface IProps{
    error: string;
}

export default function ErrorBubble({error}: IProps){
    return (
        <div className="flex justify-start">
            <div className="max-w-md mx-2 my-2">
                <div className="flex justify-start">
                    <div className="text-red-500 font-semi-bold p-2">
                        <p className="block">{error}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}