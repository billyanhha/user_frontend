import { SET_RINGTONE } from "./action";

const initialState = {
    ringtone: null
};

export const callReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_RINGTONE: {
            state = {...state, ringtone: action.name};
            return state;
        }
        // case SET_CALL_STATUS: {
        //     state = {...state, status: action.status};
        //     return state;
        // }
        default: {
            return state;
        }
    }
};
