import { SAVE_IO_INSTANCE, CLEAR_IO_INSTANCE, GET_USER_NOTIFICATION, GET_USER_NOTIFICATION_SUCCESSFUL, GET_MORE_USER_NOTIFICATION, GET_MORE_USER_NOTIFICATION_SUCCESSFUL, MARK_READ_NOTIFY, MARK_ALL_READ, COUNT_UNREAD_NOTIFY, COUNT_UNREAD_NOTIFY_SUCCESSFUL, SET_CALL_STATUS } from "./action"

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

export const getUserNotification = (data) => {
    return {
        type: GET_USER_NOTIFICATION,
        data
    }
}

export const getUserNotificationSuccessful = (data) => {
    return {
        type: GET_USER_NOTIFICATION_SUCCESSFUL,
        data
    }
}

export const getMoreUserNotification = (data) => {
    return {
        type: GET_MORE_USER_NOTIFICATION,
        data
    }
}

export const getMoreUserNotificationSuccessful = (data) => {
    return {
        type: GET_MORE_USER_NOTIFICATION_SUCCESSFUL,
        data
    }
}


export const markReadNotify = (data) => {
    return {
        type: MARK_READ_NOTIFY,
        data
    }
}


export const markAllRead = (data) => {
    return {
        type: MARK_ALL_READ,
        data
    }
}

export const countUnreadNotify = (data) => {
    return {
        type: COUNT_UNREAD_NOTIFY,
        data
    }
}

export const countUnreadNotifySuccessful = (data) => {
    return {
        type: COUNT_UNREAD_NOTIFY_SUCCESSFUL,
        data
    }
}

export const setCallStatus = (status) => {
    console.log("call status change "+status)
    return {
        type: SET_CALL_STATUS,
        status
    }
}