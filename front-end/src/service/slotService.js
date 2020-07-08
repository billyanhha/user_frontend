import axios from "../axios";
import { message } from "antd";


const slotService = {};

slotService.getSlot = (token) => new Promise((resolve, reject) => {
    const api = '/api/slot';

    axios.get(api, {
        headers: {
            Authorization: "Bearer " + token,
            Accept: '*/*'
        }
    })
        .then(result => {
            resolve(result.data);
        })
        .catch(err => {
            reject(err);
        })
})


export default slotService;