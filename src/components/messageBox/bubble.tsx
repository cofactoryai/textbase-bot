import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm';
interface IProps{
    role: string;
    messageType: string;
    message: string;
}

export default function Bubble({role, message, messageType}: IProps){
    return (
        <div className={`flex ${role === 'user' ? 'justify-end': 'justify-start'}`}>
            <div className="max-w-md mx-2 my-2">
                <div className={`flex ${role === 'user' ? 'justify-end': 'justify-start'}`}>
                    <div className={`${role === 'user' ? 'bg-blue-500': 'bg-gray-500'} text-white p-3 rounded-2xl`}>
                        <ReactMarkdown children={message} remarkPlugins={[remarkGfm]} />
                    </div>
                </div>
            </div>
        </div>
    )
}