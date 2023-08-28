import axios from "axios"
import { IMessage } from "../types/message"

export function sendMessage(url: string, messages: IMessage[], state: {}, botId: number, devMode: string){
    let payload:any = {
        botId: btoa(botId.toString()),
        botData: {
            message_history: messages,
            state: state
        }
    }
    if(devMode === 'local'){
        payload = {
            message_history: messages,
            state: state
        }
    }
    return axios.post(`${url}/sendMessage`, payload)
}

export function botDetails(url: string, botId: number){
    return axios.get(`${url}/botDetails?botId=${btoa(botId.toString())}`)
}