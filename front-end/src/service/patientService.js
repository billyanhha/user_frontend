import axios from "../axios";

const patientService = {};

patientService.getAllDependent = (token, customerID) => new Promise((resolve, reject) => {
    const api = `/api/customer/${customerID}/patient`;
    axios.get(api, {
        headers: {
            Authorization: "Bearer " + token
        }
    })
        .then(result => {
            resolve(result.data)
        })
        .catch(err => reject(err))
});

patientService.createDependent = (token, customerID, data) => new Promise((resolve, reject) => {
    const api = `/api/customer/${customerID}/patient`;
    axios.post(api, data, {
        headers: {
            Authorization: "Bearer " + token
        }
    })
        .then(result => {
            resolve(result.data)
        })
        .catch(err => reject(err))
});

patientService.getPackageProgress = (token, customerID) => new Promise((resolve, reject) => {
    const api = `/api/customer/${customerID}/package-running`;
    axios.get(api, {
        headers: {
            Authorization: "Bearer " + token
        }
    })
        .then(result => {
            resolve(result.data)
        })
        .catch(err => reject(err))
});


patientService.getCurrentHealth = (token, patientID) => new Promise((resolve, reject) => {
    const api = `/api/patient/${patientID}/current-health`;
    axios.get(api, {
        headers: {
            Authorization: "Bearer " + token
        }
    })
        .then(result => {
            resolve(result.data)
        })
        .catch(err => reject(err))
});

export default patientService;