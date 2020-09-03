import {  SAVE_IO_INSTANCE, CLEAR_IO_INSTANCE, GET_MORE_USER_NOTIFICATION_SUCCESSFUL, GET_USER_NOTIFICATION_SUCCESSFUL,COUNT_UNREAD_NOTIFY_SUCCESSFUL, SET_CALL_STATUS } from "./action";



const initialState = {
    io: null,
    notifications: [],
    isOutOfData: false,
    unreadNotifyNumber: 0,
    callStatus: false
}

export const notifyReducer = (state = initialState, action) => {
    switch(action.type) {
        case SAVE_IO_INSTANCE : {
            state = {...state , io: action.data};
            return state
        }
        case CLEAR_IO_INSTANCE : {
            return initialState
        }
        case GET_MORE_USER_NOTIFICATION_SUCCESSFUL : {
            const notifications = [...state.notifications , ...action.data?.result]
            state = {...state , notifications: notifications, isOutOfData: action?.data?.isOutOfData};
            return state
        }
        case GET_USER_NOTIFICATION_SUCCESSFUL : {
            state = {...state , notifications: action.data?.result, isOutOfData: action?.data?.isOutOfData};
            return state
        }
        case COUNT_UNREAD_NOTIFY_SUCCESSFUL : {
            state = {...state , unreadNotifyNumber: action.data};
            return state
        }
        case SET_CALL_STATUS: {
            state = {...state, callStatus: action.status};
            return state;
        }
        default:  {
            return state;
        }
    }
}
