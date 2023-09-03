import { useEffect, useRef, useState } from 'react';
import {Helmet, HelmetProvider} from 'react-helmet-async';
import './App.css';
import InputBar from './components/inputBar';
import MessageBox from './components/messageBox';
import { IContent, IMessage } from './types/message';
import Header from './components/header';
import {  botDetailsV2, sendMessageV2 } from './actions/sendMessage';
import { getAPIURL } from './helpers';

export interface BotVoice {
  lang: string;
  source: string;
  allowToSpeak: boolean;
  // ...
}

function App() {
  const [botState, setBotState] = useState({});
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [botName, setBotName] = useState('bot')
  const [username, setUsername] = useState('zero')
  const [botDetailsLoading, setBotDetailsLoading] = useState(false);
  const [botId, setBotId] = useState<number | null>(0)
  const [botStatus, setBotStatus] = useState('')
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [botError, setBotError] = useState<string | null>(null);
  const [botInfo, setBotInfo] = useState('Start Conversation with bot')
  const [botVoice, setBotVoice] = useState<BotVoice>({"lang":"Salli","source":"ttsmp3","allowToSpeak":false});
  const [botAudioUrl, setBotAudioUrl] = useState<string | null>(null);
  
  const botVoiceRef = useRef<BotVoice>({"lang":"Salli","source":"ttsmp3","allowToSpeak":false});

useEffect(() => {
  botVoiceRef.current = botVoice;
}, [botVoice]);

  useEffect(()=>{
    const {url, devMode} = getAPIURL()
    if(devMode === 'prod'){
      setBotDetailsLoading(true);
      botDetailsV2(url,botName, username).then((resp: any)=>{
        setBotDetailsLoading(false);
        if(resp.data){
            setBotName(resp.data.name)
            setBotInfo(`Start Conversation with bot - ${resp.data.name}`)
            setBotStatus(resp.data.state);
            setBotId(resp.data.id);
        }else{
          setBotError('Failed to fetch bot details')
          setBotStatus('INDETERMINATE');
        }
      }).catch((e: Error)=>{
        setBotDetailsLoading(false);
        setBotError(e.message)
        setBotStatus('INDETERMINATE');
      })
    }else if(devMode === 'local'){
      setBotId(123)
    }else{
      // Show Error
      setBotError('Wrong URL');
    }
  }, [])

  const onMessage = (message: IContent)=>{
    const currentBotVoice = botVoiceRef.current;
    console.log(message);
    console.log(botId);
    if(botId==null && botId!=0){
      return
    }
    console.log("test");
    const userMessage: IMessage = {
      role: 'user',
      content: [message]
    }

    messages.push(userMessage);
    setMessages([...messages])

    const {url, devMode} = getAPIURL()
    
    setFetching(true);
    setError(null);
    sendMessageV2(url, messages, botState, botName,currentBotVoice, username,devMode).then((resp: any)=>{
      console.log(resp)
      setFetching(false)
      if(resp.data.error){
        setError(resp.data.error)
      }else{
          const newMessage: IMessage = {
            role: 'assistant',
            content: resp.data.new_message
          }
          console.log("message: "+newMessage.content[0].value);
          // speak({ text: newMessage.content[0].value})
          if (resp.data.new_message[0].botAudio && resp.data.new_message[0].botAudio.URL) {
            const audioUrl = resp.data.new_message[0].botAudio.URL;
            setBotAudioUrl(audioUrl);
          }
          setMessages([...messages, newMessage])
        }
    }).catch((error: Error)=>{
      setError(error.message);
      setFetching(false)
    })
  }

  const restart = ()=>{
    setMessages([])
    setError(null);
    setBotState({})
  }

  return (
    <div className='flex justify-center bg-gradient-to-r from-amber-500 to-pink-500'>
      {botName && botId &&
      
        <HelmetProvider>
          <Helmet>
            <title>Bot - {botName}</title>
            <link rel="apple-touch-icon" href={`/avatars/${botId % 5}.png`} />
            <link rel="icon" href={`/favicons/${botId % 5}.ico`} />
          </Helmet>
        </HelmetProvider>
      }
      <div className='w-full md:max-w-screen-md h-screen py-10 border-[#141414] rounded-2xl justify-between flex flex-col mb-2'>
        <Header updateBotName={setBotName} updateBotId={setBotId} botName={botName} status={botStatus} restart={restart} error={botError} botId={botId} loading={botDetailsLoading} botAudioUrl={botAudioUrl} setBotAudioUrl={setBotAudioUrl} setBotVoice={setBotVoice} botVoice={botVoice}/>
        <MessageBox messages={messages} loading={fetching} error={error} botInfoMessage={botInfo} />
        <InputBar onMessage={onMessage} botName={botName} botVoice={botVoice} />
      </div>
    </div>
  );
}

export default App;
