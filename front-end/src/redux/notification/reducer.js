import {  SAVE_IO_INSTANCE, CLEAR_IO_INSTANCE } from "./action";



const initialState = {
    io: null,
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
        default:  {
            return state;
        }
    }
}
