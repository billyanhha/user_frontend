import axios from "../axios";
import { message } from "antd";
import configStatus from '../configStatus.json'
import moment from 'moment';

const bookingService = {};

bookingService.getDoctorComingAppointment = (doctor_id, token) => new Promise((resolve, reject) => {
    const api = `/api/doctor/${doctor_id}/appointments/status/${configStatus.COMING_SOON}`;

    axios.get(api, {
        params: {
            from: moment().format('yyyy-MM-DD'),
            to: moment().add(60, 'd').format('yyyy-MM-DD')
        },
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
});

bookingService.addPackage = (request, token) => new Promise((resolve, reject) => {
    const api = `/api/patient/${request?.patient_id}/package`;


    axios.post(api,request, {
        headers: {
            Authorization: "Bearer " + token,
            Accept: '*/*'
        }
    }, request)
        .then(result => {
            resolve(result.data);
        })
        .catch(err => {
            reject(err);
        })
})



export default bookingService;