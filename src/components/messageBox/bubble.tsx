import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DataType } from '../../types/message';
interface IProps {
  role: string;
  messageType: DataType;
  message: string;
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
          {messageType == DataType.image_url ? (
            <img
              src={message}
              alt="Image"
              className="rounded-xl h-[240px] w-[240px]"
            />
          ) : (
            <div
              className={`${
                role === 'user'
                  ? 'bg-[#F5F5F5] text-black'
                  : 'bg-[#141414] text-white'
              } p-3 rounded-2xl`}
            >
              <ReactMarkdown children={message} remarkPlugins={[remarkGfm]} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
