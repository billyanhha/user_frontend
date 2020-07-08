import { GET_PACKAGE_INFO, 
    GET_PACKAGE_INFO_SUCCESSFUL, GET_PACKAGE_SERVICES, 
    GET_PACKAGE_SERVICES_SUCCESSFUL, GET_PACKAGE_APPOINTMENTS, 
    GET_PACKAGE_APPOINTMENTS_SUCCESSFUL, 
    GET_PACKAGE_STATUS, 
    GET_PACKAGE_STATUS_SUCCESSFUL, UPDATE_PACKAGE, CHANGE_PACKAGE_STATUS, UPDATE_APPOINTMENT_PACKAGE,
    GET_ALL_APPOINTMENT,GET_ALL_APPOINTMENT_SUCCESSFUL,
    RATING_DOCTOR, UPDATE_RATING_DOCTOR } from "./action";



export const getPackageInfo = (id) => {
    return {
        type: GET_PACKAGE_INFO,
        id
    }
}

export const getPackageInfoSuccessful = (packageInfo) => {
    return {
        type: GET_PACKAGE_INFO_SUCCESSFUL,
        packageInfo
    }
}


export const getPackageServices = (id) => {
    return {
        type: GET_PACKAGE_SERVICES,
        id
    }
}

export const getPackageServicesSuccessful = (services) => {
    return {
        type: GET_PACKAGE_SERVICES_SUCCESSFUL,
        services
    }
}

export const getPackageAppointments = (id) => {
    return {
        type: GET_PACKAGE_APPOINTMENTS,
        id
    }
}

export const getPackageAppointmentsSuccessful = (appointments) => {
    return {
        type: GET_PACKAGE_APPOINTMENTS_SUCCESSFUL,
        appointments
    }
}

export const getPackageStatus = (id) => {
    return {
        type: GET_PACKAGE_STATUS,
        id
    }
}

export const getPackageStatusSuccessful = (status) => {
    return {
        type: GET_PACKAGE_STATUS_SUCCESSFUL,
        status
    }
}


export const updatePackage = (data) => {
    return {
        type: UPDATE_PACKAGE,
        data
    }
}


export const changePackageStatus = (data) => {
    return {
        type: CHANGE_PACKAGE_STATUS,
        data
    }
}

export const updateAppointmentPackage = (data,appointmentId,patientId, packageId) => {
    return {
        type: UPDATE_APPOINTMENT_PACKAGE,
        data,
        appointmentId,
        patientId,
        packageId
    }
}

export const getAllAppointmentByPackage = (packageId) => {
    return {
        type: GET_ALL_APPOINTMENT,
        packageId
    }
}
export const ratingDoctor = (data) => {
    return {
        type: RATING_DOCTOR,
        data
    }
}

export const updateRatingDoctor = (data) => {
    return {
        type: UPDATE_RATING_DOCTOR,
        data
    }
}



export const getAllAppointmentByPackageSuccessful = (appointments) => {
    return {
        type: GET_ALL_APPOINTMENT_SUCCESSFUL,
        appointments
    }
}











