import { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import './App.css';
import InputBar from './components/inputBar';
import MessageBox from './components/messageBox';
import { IContent, IMessage } from './types/message';
import Header from './components/header';
import { botDetails, sendMessage } from './actions/sendMessage';
import { getAPIURL } from './helpers';

function generateRandomMessage(n:number): IMessage[]{
  const messages = []
  for(let i=0; i<n; i++){
    messages.push({
      role: i%2 === 0 ? 'user': 'assistant',
      content: [
        {
          'data_type':'string',
          'value': "How are you?How are you?How are you?How are you?How are you?How are you?How are you?How are you?How are you?How are you?"
        }
      ]
    })
  }

  return messages
}

function App() {
  const [botState, setBotState] = useState({});
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [botName, setBotName] = useState('Textbase')
  const [botId, setBotId] = useState<number>(146)
  const [botStatus, setBotStatus] = useState('ACTIVE')
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [botError, setBotError] = useState<string | null>(null);
  const [botInfo, setBotInfo] = useState('Start Conversation with bot')

  useEffect(()=>{
    const path = window.location.pathname
    const pathParts = path.split('/')
    console.log(pathParts)
    if(pathParts[1] !== ""){
      const botId = Number(atob(pathParts[1]))
      if(!isNaN(botId)){
        setBotId(botId);

        const {url, devMode} = getAPIURL()
        if(devMode === 'prod'){

          botDetails(url, botId).then(resp=>{
            if(resp.data){
              if(resp.data.data){
                setBotName(resp.data.data.name)
                setBotStatus(resp.data.data.status);
              }else{
                setBotError(resp.data.error)
                setBotStatus('INDETERMINATE');
              }
            }else{
              setBotError('Failed to fetch bot details')
              setBotStatus('INDETERMINATE');
            }
          }).catch(e=>{
            setBotError(e.message)
            setBotStatus('INDETERMINATE');
          })
        }else{
          setBotName('Local Test')
        }
      }
    }else{
      // Show Error
    }
  }, [])

  const onMessage = (message: IContent)=>{
    if(!botId){
      return
    }
    const userMessage: IMessage = {
      role: 'user',
      content: [message]
    }

    messages.push(userMessage);
    setMessages([...messages])

    const {url, devMode} = getAPIURL()
    
    setFetching(true);
    setError(null);
    
    sendMessage(url, messages, botState, botId, devMode).then(resp=>{
      console.log(resp)
      setFetching(false)
      if(resp.data.error){
        setError(resp.data.error)
      }else{
        // setMessages(resp.data)
      }
    }).catch(error=>{
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
    <div className='flex justify-center'>
      <Helmet>
        <title>Bot - {botName}</title>
        <link rel="apple-touch-icon" href={`%PUBLIC_URL%/${botId % 5}.png`} />
        <link rel="icon" href={`%PUBLIC_URL%/${botId % 5}.ico`} />
      </Helmet>
      <div className='w-full md:max-w-screen-md h-screen border rounded-2xl justify-between flex flex-col mb-2'>
        <Header botName={botName} status={botStatus} restart={restart} error={botError} />
        <MessageBox messages={messages} loading={fetching} error={error} botInfoMessage={botInfo} />
        <InputBar onMessage={onMessage} botName={botName} />
      </div>
    </div>
  );
}

export default App;
