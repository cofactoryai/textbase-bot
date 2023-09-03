import axios from "axios"
import { IMessage } from "../types/message"

export function sendMessage(url: string, messages: IMessage[], state: {}, botId: number, devMode: string){
    console.log(messages);
    if(devMode === 'local'){
        const payload = {
            data: {
                message_history: messages,
                state: state
            }
        }
        return axios.post(url, payload)
    }

    const payload:any = {
        botId: btoa(botId.toString()),
        botData: {
            message_history: messages,
            state: state
        }
    }
    return axios.post(`${url}/chat-with-llm`, payload)
}

export function sendMessageV2(url: string, messages: IMessage[], state: {}, botName: string, userName: string, devMode: string){
    let payload:any = {
        botName: botName,
        username: userName,
        botData: {
            message_history: messages,
            state: state
        }
    }
    return axios.post(`${url}/sendMessageV2`, payload)
}

export function botDetails(url: string, botId: number){
    return axios.get(`${url}/botDetails?botId=${btoa(botId.toString())}`)
}

export function botDetailsV2(url: string, botName: string, username: string){
    return axios.get(`${url}/botDetailsV2?botName=${botName}&username=${username}`)
}

export function getBotList(url: string){
    return axios.get(`${url}/botList`);
}

