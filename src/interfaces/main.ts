import {Moment} from "moment/moment";

export type MessageType = 'raw' | 'button' | 'info';

export interface Channel {
    id: string
    name: string
    messages: Message[]
    type: 'topic' | 'user'
    source?: User
    selected?: boolean
    removable?: boolean
    joinable?: boolean
}

export interface Message {
    message: string
    date: Moment
    isMe: boolean
    isRead: boolean
    source: User
    type: MessageType
    action?: (channels: Channel[]) => void
}

export interface User {
    id: string
    username: string
}
