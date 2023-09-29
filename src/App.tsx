import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import './App.css';
import InputBar from './components/inputBar';
import MessageBox from './components/messageBox';
import { IContent, IMessage } from './types/message';
import Header from './components/header';
import { botDetailsV2, sendMessage, upload } from './actions/sendMessage';
import { getAPIURL } from './helpers';

function App() {
  const [botState, setBotState] = useState({});
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [botName, setBotName] = useState('');
  const [botDetailsLoading, setBotDetailsLoading] = useState(false);
  const [botId, setBotId] = useState<number | null>(1);
  const [botStatus, setBotStatus] = useState('');
  const [fetching, setFetching] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [botError, setBotError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [botInfo, setBotInfo] = useState('Start Conversation with bot');

  useEffect(() => {
    const path = window.location.pathname;
    const pathParts = path.split('/');
    const { url, devMode } = getAPIURL();
    if (pathParts.length === 3) {
      const userName = pathParts[1];
      const botName = pathParts[2];
      if (devMode === 'prod') {
        setBotDetailsLoading(true);
        botDetailsV2(url, botName, userName)
          .then((resp: any) => {
            setBotDetailsLoading(false);
            if (resp.data) {
              if (resp.data.data) {
                setBotName(resp.data.data.name);
                setBotInfo(
                  `Start Conversation with bot - ${resp.data.data.name}`,
                );
                setBotStatus(resp.data.data.state);
                setBotId(resp.data.data.id);
              } else {
                setBotError(resp.data.error);
                setBotStatus('INDETERMINATE');
              }
            } else {
              setBotError('Failed to fetch bot details');
              setBotStatus('INDETERMINATE');
            }
          })
          .catch((e: Error) => {
            setBotDetailsLoading(false);
            setBotError(e.message);
            setBotStatus('INDETERMINATE');
          });
      } else {
        setBotName('Local Test');
      }
    } else if (devMode === 'local') {
      setBotId(123);
    } else {
      // Show Error
      setBotError('Wrong URL');
    }
  }, []);

  const uploadFile = (file: File, fileType: string)=>{
    if(!botId) {
      setError("No Bot Id")
      return null;
    }

    setUploading(true)
    return upload(botId, file, fileType).then(url=>{
      setUploading(false)
      return url
    })
    .catch(e=>{
      setUploading(false)
      setBotError(e.message)
      return null
    })
  }

  const onMessage = (message: IContent) => {
    if (!botId) {
      setError("No Bot Id")
      return;
    }
    const userMessage: IMessage = {
      role: 'user',
      content: [message],
    };

    messages.push(userMessage);
    setMessages([...messages]);

    const { url, devMode } = getAPIURL();

    setFetching(true);
    setError(null);

    sendMessage(url, messages, botState, botId, devMode, sessionId)
      .then((resp: any) => {
        console.log(resp);
        setFetching(false);
        if (resp.data.error) {
          setError(resp.data.error);
        } else {
          if (devMode === 'local') {
            const newMessage: IMessage = {
              role: 'assistant',
              content: resp.data.new_message,
            };
            if(resp.session_id && !sessionId){
              setSessionId(resp.session_id);
            }
            setBotState(resp.data.state)
            setMessages([...messages, newMessage]);
          } else {
            const newMessage: IMessage = {
              role: 'assistant',
              content: resp.data.data.new_message,
            };
            if(resp.data.session_id && !sessionId){
              setSessionId(resp.data.session_id);
            }
            setBotState(resp.data.data.state)
            setMessages([...messages, newMessage]);
          }
        }
      })
      .catch((error: Error) => {
        setError(error.message);
        setFetching(false);
      });
  };

  const restart = () => {
    setMessages([]);
    setError(null);
    setBotState({});
  };

  return (
    <div className="flex justify-center bg-gradient-to-r from-amber-500 to-pink-500">
      {botName && botId && (
        <HelmetProvider>
          <Helmet>
            <title>Bot - {botName}</title>
            <link rel="apple-touch-icon" href={`/avatars/${botId % 5}.png`} />
            <link rel="icon" href={`/favicons/${botId % 5}.ico`} />
          </Helmet>
        </HelmetProvider>
      )}
      <div className="w-full md:max-w-screen-md h-screen py-10 border-[#141414] rounded-2xl justify-between flex flex-col mb-2">
        <Header
          botName={botName}
          status={botStatus}
          restart={restart}
          error={botError}
          botId={botId}
          loading={botDetailsLoading}
        />
        <MessageBox
          messages={messages}
          loading={fetching}
          userLoading={uploading}
          error={error}
          botInfoMessage={botInfo}
        />
        <InputBar onMessage={onMessage} botName={botName} uploadFile={uploadFile} />
      </div>
    </div>
  );
}

export default App;
