import axios from "../axios";
const notifycationService = {};

// item perpage : 6

notifycationService.getCustomerNotify = (data, token) => new Promise((reslove, reject) => {
    const url = `/api/customer/${data.id}/notification`
    axios.get(url, {
        params: data,
        headers: {
            authorization: "Bearer " + token,
            Accept: '*/*'
        },
    })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})


notifycationService.markReadNotify = (data, token) => new Promise((reslove, reject) => {
    const url = `/api/notification/${data.id}`
    axios.put(url,
        {
            is_read: data?.is_read
        },
        {
            headers: {
                authorization: "Bearer " + token,
                Accept: '*/*'
            },
        })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})

notifycationService.markAllRead = (data, token) => new Promise((reslove, reject) => {
    const url = `/api/notification/receiver/${data?.receiver_id}`
    axios.put(url,
        {
            receiver_type: 'customer'
        },
        {
            headers: {
                authorization: "Bearer " + token,
                Accept: '*/*'
            },
        })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})

notifycationService.countUnreadNotify = (data, token) => new Promise((reslove, reject) => {
    const url = `/api/notification/num-unread-msg/${data?.receiver_id}`
    axios.get(url,
        {
            params: {
                receiver_type: 'customer'
            },
            headers: {
                authorization: "Bearer " + token,
                Accept: '*/*'
            },
        })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})


export default notifycationService;
