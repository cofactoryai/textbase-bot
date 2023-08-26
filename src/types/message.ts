export type IMessage = {
    role: string
    content: IContent[];
}

export type IContent = {
    data_type: string
    value: string
}