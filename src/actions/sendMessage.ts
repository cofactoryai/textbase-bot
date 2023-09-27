import axios from 'axios';
import { IMessage } from '../types/message';

export function sendMessage(
  url: string,
  messages: IMessage[],
  state: {},
  botId: number,
  devMode: string,
  sessionId: string | null,
) {
  if (devMode === 'local') {
    const payload = {
      data: {
        message_history: messages,
        state: state,
      },
    };
    return axios.post(url, payload);
  }

  const payload: any = {
    botId: btoa(botId.toString()),
    botData: {
      message_history: messages,
      state: state,
    },
    sessionId: sessionId
  };
  return axios.post(`${url}/sendMessage`, payload);
}

export function sendMessageV2(
  url: string,
  messages: IMessage[],
  state: {},
  botName: string,
  userName: string,
  devMode: string,
) {
  let payload: any = {
    botName: botName,
    username: userName,
    botData: {
      message_history: messages,
      state: state,
    },
  };
  if (devMode === 'local') {
    payload = {
      data: {
        message_history: messages,
        state: state,
      },
    };
  }
  return axios.post(`${url}/sendMessageV2`, payload);
}

export function botDetails(url: string, botId: number) {
  return axios.get(`${url}/botDetails?botId=${btoa(botId.toString())}`);
}

export function botDetailsV2(url: string, botName: string, username: string) {
  return axios.get(
    `${url}/botDetailsV2?botName=${botName}&username=${username}`,
  );
}


export function upload(botId: Number, file: File, fileType: string):Promise<string>{
  const url = 'https://us-central1-chat-agents.cloudfunctions.net/upload-multimedia'

  let formData = new FormData();
  formData.append('file', file);
  formData.append('parent_path', 'user')
  formData.append('bot_id', botId.toString())
  formData.append('file_type', fileType)

  return axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/formdata'
    }
  }).then(resp=>{
    return resp.data.image_url
  }).catch(e=>{
    console.log(e)
    throw Error(e)
  })
}