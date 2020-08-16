import axios from "../axios";
import _ from "lodash";
import status from '../configs/appointment_status';
const packageService = {};

packageService.getDoctorPackage = (doctorId, params, token) => new Promise((reslove, reject) => {
    const api = `/api/doctor/${doctorId}/packages`;

    axios.get(api, {
        params: params,
        headers: {
            authorization: "Bearer " + token,
            Accept: '*/*'
        }
    }
    )
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})

packageService.getPackageInfo = (id, token) => new Promise((reslove, reject) => {
    const api = `/api/package/${id}`;

    axios.get(api, {
        headers: {
            authorization: "Bearer " + token,
            Accept: '*/*'
        }
    })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})


packageService.changePackageStatus = (data, token) => new Promise((reslove, reject) => {
    const api = `/api/package/${data.packageId}/status/${data.statusId}`;

    axios.post(api, data , {
        headers: {
            authorization: "Bearer " + token,
            Accept: '*/*'
        }
    })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})

packageService.ratingDoctor = (data, token) => new Promise((reslove, reject) => {
    const api = `/api/package/${data.packageId}/ratings`;

    axios.post(api, data , {
        headers: {
            authorization: "Bearer " + token,
            Accept: '*/*'
        }
    })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})


packageService.updateRatingDoctor = (data, token) => new Promise((reslove, reject) => {
    const api = `/api/package-rating/${data?.package_rating_id}`;

    axios.put(api, data , {
        headers: {
            authorization: "Bearer " + token,
            Accept: '*/*'
        }
    })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})



packageService.updateAppointmentPackage = (patientId, appointmentId, data) => new Promise((reslove, reject) => {
    const api = `/api/patient/${patientId}/appointments/${appointmentId}`;


    axios.put(api, data, {
        headers: {
            authorization: "Bearer " + data?.token,
            Accept: '*/*'
        },
    })
        .then(result =>  {
            reslove(result.data)
        })
        .catch(err => reject(err))
})









packageService.getPackageServices = (id, token) => new Promise((reslove, reject) => {
    const api = `/api/package/${id}/services`;

    axios.get(api,
        {
            headers: {
                authorization: "Bearer " + token,
                Accept: '*/*'
            },
        })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})


packageService.getPackageAppointments = (id, token) => new Promise((reslove, reject) => {
    const api = `/api/package/${id}/appointments`;

    axios.get(api, {
        headers: {
            authorization: "Bearer " + token,
            Accept: '*/*'
        },
    })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})

packageService.getPackageStatus = (id, token) => new Promise((reslove, reject) => {
    const api = `/api/package/${id}/status`;

    axios.get(api, {
        headers: {
            authorization: "Bearer " + token,
            Accept: '*/*'
        },
    })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})





packageService.editPackage = (data, token) => new Promise((reslove, reject) => {
    const api = `/api/patient/${data.patient_id}/packages/${data.package_id}`;

    
    axios.put(api, data ,{
        headers: {
            authorization: "Bearer " + token,
            Accept: '*/*'
        }
    })
        .then(result => {
            if (!_.isEmpty(result?.data)) {
                console.log(result?.data);
            }
            reslove(result.data)
        })
        .catch(err => reject(err))
})



packageService.changePackageStatus = (data, token) => new Promise((reslove, reject) => {
    const api = `/api/package/${data.packageId}/status/${data.statusId}`;

    axios.post(api, data , {
        headers: {
            authorization: "Bearer " + token,
            Accept: '*/*'
        }
    })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})

packageService.getAllAppointmentByPackageID = (packageId,token) => new Promise((reslove, reject) => {
    axios.get(`/api/package/${packageId}/appointments/status/${status.done}`, {
        params: {

        },
        headers: {
            authorization: "Bearer " + token,
            Accept: '*/*'
        }
    })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
});



export default packageService;