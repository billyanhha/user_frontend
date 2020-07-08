import axios from "../axios";


const authService = {};

authService.userLogin = (values) => new Promise((resolve, reject) => {
    const api = '/api/auth/customer/signin';
    const params = new URLSearchParams();
    params.append("phone", values.phone);
    params.append("password", values.password);

    axios.post(api, params)
        .then(result => {
            resolve(result.data);
        })
        .catch(err => {
            reject(err);
        })
})


authService.doctorLogin = (values) => new Promise((resolve, reject) => {
    const api = '/api/auth/doctor/signin';
    const params = new URLSearchParams();
    params.append("email", values.email);
    params.append("password", values.password);

    axios.post(api, params)
        .then(result => {
            resolve(result.data);
        })
        .catch(err => {
            reject(err);
        })
})

authService.handleForgotPasswordSendPhone = (phone) => new Promise((resolve, reject) => {
    const api = '/api/auth/customer/check-before-reset-password';
    const params = new URLSearchParams();
    params.append("phone", phone);
    axios.post(api, params)
        .then(result => {
            resolve(result.data.request_id);
        })
        .catch(err => {
            reject(err);
        });
});

authService.handleForgotPasswordSendOTP = (data) => new Promise((resolve, reject) => {
    const api = '/api/auth/verifyCheck';
    const params = new URLSearchParams();
    params.append("request_id", data.requestID);
    params.append("code", data.otp);
    axios.post(api, params)
        .then(result => {
            resolve(result);
        })
        .catch(err => {
            reject(err);
        });
});

authService.handleResetPassword = (data) => new Promise((resolve, reject) => {
    const api = '/api/auth/customer/reset-password';
    const params = new URLSearchParams();
    params.append("request_id", data.requestID);
    params.append("new_password", data.password);
    params.append("confirm_password", data.confirm_password);

    axios.put(api, params)
        .then((res) => {
            resolve(res);
        })
        .catch(err => {
            reject(err);
        });
});

authService.handleForgotPasswordCancelRequest = (request_id) => new Promise((resolve, reject) => {
    const api = '/api/auth/verifyCancel';
    const params = new URLSearchParams();
    params.append("request_id", request_id);

    axios.post(api, params)
        .then((res) => {
            resolve(res);
        })
        .catch(err => {
            reject(err);
        });
});

authService.handleGuestSendPhone = (data) => new Promise((resolve, reject) => {
    const api = '/api/auth/verifyRequest';
    const params = new URLSearchParams();
    params.append("phone", data.basicData.phone);

    axios.post(api, params)
        .then(result => {
            let basicData = {
                phone: data.basicData.phone,
                fullName: data.basicData.fullName,
                gender: data.basicData.gender,
                dob: data.basicData.dob,
                request_id: result.data.request_id
            }
            resolve(basicData);
        })
        .catch(err => {
            reject(err);
        });
});

authService.handleGuestSendOTP = (data) => new Promise((resolve, reject) => {
    const api = '/api/auth/verifyCheck';
    const params = new URLSearchParams();
    params.append("request_id", data.otpID);
    params.append("code", data.otp);
    axios.post(api, params)
        .then(result => {
            resolve(result.data);
        })
        .catch(err => {
            reject(err);
        });
});

authService.handleGuestRegister = (registerInfo) => new Promise((resolve, reject) => {
    const api = '/api/auth/customer/signup';
    const params = new URLSearchParams();
    params.append("request_id", registerInfo.otpID);
    params.append("phone", registerInfo.phone);
    params.append("password", registerInfo.password);
    params.append("fullname", registerInfo.fullName);
    params.append("gender", registerInfo.gender);
    params.append("dob", registerInfo.dob);

    axios.post(api, params)
        .then(result => {
            resolve(result.data);
        })
        .catch(err => {
            reject(err);
        });
});

export default authService;