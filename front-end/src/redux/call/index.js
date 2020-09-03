import { SET_RINGTONE } from "./action"

export const setRingtone = (name) => {
    return {
        type: SET_RINGTONE,
        name
    }
}

// export const setCallStatus = (status) => {
//     return {
//         type: SET_CALL_STATUS,
//         status
//     }
// }
