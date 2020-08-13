import axios from "../axios";

const userService = {};

userService.getUser = token =>
    new Promise((resolve, reject) => {
        const api = "/api/customer/jwt/one";
        axios
            .get(api, {
                headers: {
                    Authorization: "Bearer " + token,
                    Accept: "*/*"
                }
            })
            .then(result => {
                resolve(result.data);
            })
            .catch(err => reject(err));
    });

userService.getCustomerPatient = (id, token) =>
    new Promise((resolve, reject) => {
        const api = `/api/customer/${id}/patient`;
        axios
            .get(api, {
                headers: {
                    Authorization: "Bearer " + token,
                    Accept: "*/*"
                }
            })
            .then(result => {
                resolve(result.data);
            })
            .catch(err => reject(err));
    });

userService.getUserProfile = (id, token) =>
    new Promise((resolve, reject) => {
        const api = `/api/customer/${id}/independent/`;
        const headers = {
            Authorization: `Bearer ${token}`
        };
        axios
            .get(api, {headers: headers})
            .then(result => {
                resolve(result.data);
            })
            .catch(err => reject(err));
    });

userService.editUserProfile = (newProfile, customer_id, patient_id, token) =>
    new Promise((resolve, reject) => {
        const api = `/api/customer/${customer_id}/patient/${patient_id}`;
        const headers = {
            Authorization: `Bearer ${token}`
        };
        axios
            .put(api, newProfile, {headers: headers})
            .then(result => {
                resolve(result.data);
            })
            .catch(err => reject(err));
    });

userService.editAvatar = (data, customer_id, patient_id, token) =>
    new Promise((resolve, reject) => {
        const api = `/api/customer/${customer_id}/patient/${patient_id}`;
        const headers = {
            Authorization: `Bearer ${token}`
        };
        axios
            .put(api, data.avatarPatient, {headers: headers})
            .then(result => {
                resolve(result.data);
            })
            .catch(err => reject(err));
    });

userService.changeEmail = (token, data, customer_id) =>
    new Promise((resolve, reject) => {
        const api = `/api/auth/customer/${customer_id}/change-email`;
        const headers = {
            Authorization: `Bearer ${token}`
        };
        axios
            .put(api, data, {headers: headers})
            .then(result => {
                resolve(result.data);
            })
            .catch(err => reject(err));
    });

userService.verifyChangePhone = (token, data, customer_id) =>
    new Promise((resolve, reject) => {
        const api = `/api/auth/customer/${customer_id}/check-before-change-phone`;
        const headers = {
            Authorization: `Bearer ${token}`
        };
        axios
            .post(api, data, {headers: headers})
            .then(result => {
                resolve(result.data);
            })
            .catch(err => reject(err));
    });

userService.cancelChangePhone = request_id =>
    new Promise((resolve, reject) => {
        const api = "/api/auth/verifyCancel";
        const params = new URLSearchParams();
        params.append("request_id", request_id);

        axios
            .post(api, params)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
    });

userService.changePhone = (token, data, customer_id) =>
    new Promise((resolve, reject) => {
        const api = `/api/auth/customer/${customer_id}/change-phone`;
        const headers = {
            Authorization: `Bearer ${token}`
        };
        axios
            .put(api, data, {headers: headers})
            .then(result => {
                resolve(result.data);
            })
            .catch(err => reject(err));
    });

userService.changePassword = (token, data, customer_id) =>
    new Promise((resolve, reject) => {
        const api = `/api/auth/customer/${customer_id}/change-password`;
        const headers = {
            Authorization: `Bearer ${token}`
        };
        axios
            .put(api, data, {headers: headers})
            .then(result => {
                resolve(result.data);
            })
            .catch(err => reject(err));
    });

userService.getUserPackage = (params, id, token) =>
    new Promise((resolve, reject) => {
        const api = `/api/customer/${id}/package`;
        axios
            .get(api, {
                params,
                headers: {
                    Authorization: "Bearer " + token,
                    Accept: "*/*"
                }
            })
            .then(result => {
                resolve(result.data);
            })
            .catch(err => reject(err));
    });

userService.verifyEmail = token =>
    new Promise((resolve, reject) => {
        const api = `/api/auth/verify-email/${token} `;
        axios
            .put(api, {role: "customer"})
            .then(result => {
                resolve(result.data);
            })
            .catch(err => reject(err));
    });

userService.subcribeEmail = (token, id, data) =>
    new Promise((resolve, reject) => {
        const api = `/api/customer/${id}/mail-subscribe`;
        axios
            .put(api, data, {
                headers: {
                    Authorization: "Bearer " + token,
                    Accept: "*/*"
                }
            })
            .then(result => {
                resolve(result.data);
            })
            .catch(err => reject(err));
    });

export default userService;
