import { GET_CHAT, GET_MORE_CHAT, GET_CHAT_SUCCESSFUL, GET_MORE_CHAT_SUCCESSFUL, GET_THREAD_CHAT_SUCCESSFUL, GET_THREAD_CHAT, GET_MORE_THREAD_CHAT, GET_MORE_THREAD_CHAT_SUCCESSFUL } from "./action"

export const getChat = (payload) => {    
    return {
        type: GET_CHAT,
        payload
    }
}

export const getMoreChat = (payload) => {    
    return {
        type: GET_MORE_CHAT,
        payload
    }
}

export const getChatSuccessful = (payload) => {    
    return {
        type: GET_CHAT_SUCCESSFUL,
        payload
    }
}

export const getMoreChatSuccessful = (payload) => {    
    return {
        type: GET_MORE_CHAT_SUCCESSFUL,
        payload
    }
}




export const getThreadChat = (payload) => {    
    return {
        type: GET_THREAD_CHAT,
        payload
    }
}



export const getThreadChatSuccessful = (payload) => {    
    return {
        type: GET_THREAD_CHAT_SUCCESSFUL,
        payload
    }
}



export const getMoreThreadChat = (payload) => {    
    return {
        type: GET_MORE_THREAD_CHAT,
        payload
    }
}



export const getMoreThreadChatSuccessful = (payload) => {    
    return {
        type: GET_MORE_THREAD_CHAT_SUCCESSFUL,
        payload
    }
}


