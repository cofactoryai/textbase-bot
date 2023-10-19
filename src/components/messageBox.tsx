import { useEffect, useRef } from 'react';
import { IMessage } from '../types/message';
import Bubble from './messageBox/bubble';
import Loader from './messageBox/loader';
import ErrorBubble from './messageBox/errorBubble';
import BotInfo from './messageBox/botInfo';

interface IProps {
  messages: IMessage[];
  loading: boolean;
  userLoading: boolean;
  error: string | null;
  botInfoMessage: string;
}

function Message(message: IMessage) {
  return message.content.map((content, index) => {
    return (
      <Bubble
        key={index}
        role={message.role}
        messageType={content.data_type}
        message={content.value}
      />
    );
  });
}

export default function MessageBox({
  messages,
  loading,
  userLoading,
  error,
  botInfoMessage,
}: IProps) {
  const elementRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    elementRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-full border-[#141414] border-y bg-black overflow-scroll  container">
      {messages.map(message => {
        return Message(message);
      })}
      {messages.length === 0 && <BotInfo infoMessage={botInfoMessage} />}
      {loading && <Loader role='bot' />}
      {userLoading && <Loader role='user' />}
      {error && <ErrorBubble error={error} />}
      <div ref={elementRef} />
    </div>
  );
}
