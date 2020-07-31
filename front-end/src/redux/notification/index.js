import { SAVE_IO_INSTANCE, CLEAR_IO_INSTANCE } from "./action"

export const saveIoInstance = (data) => {
    return {
        type: SAVE_IO_INSTANCE,
        data
    }
}

export const clearIoInstance = () => {
    return {
        type: CLEAR_IO_INSTANCE,
    }
}