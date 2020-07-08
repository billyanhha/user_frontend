import { GET_SLOT, SAVE_SLOT } from "./action"



export const getSlot = () => {
    return {
        type: GET_SLOT
    }
}

export const saveSlot = (slots) => {
    return {
        type: SAVE_SLOT,
        slots
    }
}
