import { SAVE_SLOT } from "./action";



const initialState = {
    slots: []
}

export const slotReducer = (state = initialState, action) => {
    switch(action.type) {
        case SAVE_SLOT : {
            state = {...state , slots: action.slots};
            return state
        }
        default:  {
            return state;
        }
    }
}
