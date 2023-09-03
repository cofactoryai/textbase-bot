import { useEffect, useRef, useState } from "react";
import { IContent } from "../types/message";
import { BotVoice } from "../App";
interface IProps {
    onMessage: (message: IContent)=>void;
    botName: string
    botVoice: BotVoice
}

export default function InputBar({onMessage, botName, botVoice}: IProps){

    const [value, setValue] = useState('');
    const [recognizing, setRecognizing] = useState(false);
    const [ignoreOnEnd, setIgnoreOnEnd] = useState(false);
    // const [startTimestamp, setStartTimestamp] = useState(0);
    const [recognition, setRecognition] = useState<any>(null);
    // const [selectedLanguage, setSelectedLanguage] = useState(langs[6][1][0]);
    const [selectedDialect, setSelectedDialect] = useState('');
    // const [llmResponse, setLlmResponse] = useState('');

    const finalTranscriptRef = useRef(''); // Add this line
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setValue(e.target.value)
    }

    const messages:any = {
        "start": {
          msg: 'Click on the microphone icon and begin speaking.',
          class: 'alert-success'},
        "speak_now": {
          msg: 'Speak now.',
          class: 'alert-success'},
        "no_speech": {
          msg: 'No speech was detected. You may need to adjust your <a href="//support.google.com/chrome/answer/2693767" target="_blank">microphone settings</a>.',
          class: 'alert-danger'},
        "no_microphone": {
          msg: 'No microphone was found. Ensure that a microphone is installed and that <a href="//support.google.com/chrome/answer/2693767" target="_blank">microphone settings</a> are configured correctly.',
          class: 'alert-danger'},
        "allow": {
          msg: 'Click the "Allow" button above to enable your microphone.',
          class: 'alert-warning'},
        "denied": {
          msg: 'Permission to use microphone was denied.',
          class: 'alert-danger'},
        "blocked": {
          msg: 'Permission to use microphone is blocked. To change, go to chrome://settings/content/microphone',
          class: 'alert-danger'},
        "upgrade": {
          msg: 'Web Speech API is not supported by this browser. It is only supported by <a href="//www.google.com/chrome">Chrome</a> version 25 or later on desktop and Android mobile.',
          class: 'alert-danger'},
        "stop": {
            msg: 'Stop listening, click on the microphone icon to restart',
            class: 'alert-success'},
        "copy": {
          msg: 'Content copy to clipboard successfully.',
          class: 'alert-success'},
      }
    
    
      const showInfo = (messageKey:any) => {
        if (messageKey) {
          const message = messages[messageKey];
          // Todo: Update UI or state to display the message...
          console.log(message.msg);
        } else {
          // Todo: Update UI or state to display the message...
          console.log('No message to display.');
        }
      };
    
      const startRecognition = (event:any) => {
        if (recognizing) {
          recognition.stop();
          return;
        }
        recognition.lang = selectedDialect;
        recognition.start();
        setIgnoreOnEnd(false);
        //Todo: used timestamp to manage auto start/stop voice recognition
        // setStartTimestamp(event.timeStamp);
      };
      
      const copyToClipboard = () => {
        // Todo : Add functionality to Copy Bot Response
      };
    
    
      useEffect(() => {
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
    
        recognition.onstart = () => {
          setRecognizing(true);
          showInfo('speak_now');
          // Todo: Update UI or state to display the message...
        };
    
        recognition.onerror = (event:any) => {
            // Todo: Handel Error while voice recognition
        };
    
        recognition.onend = async () => {
          sendMessage(finalTranscriptRef.current);
          finalTranscriptRef.current = '';
          setRecognizing(false);
          if (!ignoreOnEnd) {
            // Todo:Update UI or state as needed...
          }
        };
        recognition.onresult = (event:any) => {
          var final_transcript =''
          var interim_transcript = '';
          for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final_transcript += event.results[i][0].transcript;
            } else {
              interim_transcript += event.results[i][0].transcript;
            }
            if(interim_transcript.length>0)
            setValue(interim_transcript);
          }
          if(final_transcript.length>0){
            finalTranscriptRef.current = final_transcript; // Update the ref
          }
        };
    
        setRecognition(recognition);
      }, [ignoreOnEnd]);
    

    const handleSubmit = ()=>{
        sendMessage(value);
        setValue('')
    }

    const sendMessage = (value:string)=>{
        if(value === ''){
            return
        }
        const message = {
            'data_type': 'STRING',
            'value': value
        }
        onMessage(message)
    }

    return(
        <div className="w-full flex justify-center bg-[#141414] rounded-b-2xl py-4">
            <div className="w-5/6">
                <form onSubmit={(e)=>{
                    e.preventDefault()
                    handleSubmit()
                }}>
                    <input type="text" autoFocus onChange={handleChange} value={value} className="appearance-none bg-black w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline rounded-2xl" id="message" placeholder={`Chat with ${botName}`}/>
                </form>
            </div>
            <div className="flex align-center mx-2 px-2 bg-white rounded-full">
                <button className={`px-4 py-2 font-bold  ${value === '' ? 'text-gray-300': 'text-black'}`} disabled={value === ''} onClick={handleSubmit}>
                    {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${value === ''? 'text-gray-400': 'text-white'} w-6 h-6`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg> */}
                    <span>Send</span>
                </button>
                <button className={`px-4 py-2 font-bold  ${recognizing ? 'text-gray-300': 'text-black'}`} disabled={recognizing} onClick={(event:any)=>{startRecognition(event)}}>
                    <span>Mic</span>
                </button>
            </div>
        </div>
    )
}