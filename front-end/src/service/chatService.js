import axios from "../axios";

const chatService = {}


chatService.getChat = (payload , token) => new Promise((reslove, reject) => {
    const api = `/api/chat/group/customer/${payload.cusId}`;
    axios.get(api,  {
        params: {
            page : 1,
            // itemsPage: 1
        },
        headers: {
            Authorization: "Bearer " + token,
            Accept: '*/*'
        }
    })
        .then(result => {            
            reslove(result.data)
        })
        .catch(err => reject(err))
});

chatService.getMoreChat = (payload , token) => new Promise((reslove, reject) => {
    const api = `/api/chat/group/customer/${payload.cusId}`;    
    axios.get(api,  {
        params: {
            page : payload?.page
        },
        headers: {
            Authorization: "Bearer " + token,
            Accept: '*/*'
        }
    })
        .then(result => {            
            reslove(result.data)
        })
        .catch(err => reject(err))
});

export default chatService