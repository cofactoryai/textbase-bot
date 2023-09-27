import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
interface IProps {
  role: string;
  messageType: string;
  message: string;
}

function Document({message}: {message: string}){
  return <div className='flex gap-2'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p>Document</p>
            <a href={message} rel='noreferrer' target='_blank'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
            </a>
          </div>
}

export default function Bubble({ role, message, messageType }: IProps) {
  return (
    <div
      className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className="max-w-md mx-2 my-2">
        <div
          className={`flex ${
            role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`${
              role === 'user'
                ? 'bg-[#F5F5F5] text-black'
                : 'bg-[#141414] text-white'
            } p-3 rounded-2xl`}
          >
            {messageType === 'IMAGE_URL' && <img src={message} alt={message} />}
            {messageType === 'FILE_URL' && <Document message={message} />
            }
            {messageType === 'AUDIO_URL' && <audio controls={true} src={message} />}
            {messageType === 'VIDEO_URL' && <video autoPlay={true} controls={true} src={message} />}
            {messageType === 'STRING' && <ReactMarkdown children={message} remarkPlugins={[remarkGfm]} />}
          </div>
        </div>
      </div>
    </div>
  );
}
