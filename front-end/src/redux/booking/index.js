import { NEXT_STEP, PRE_STEP, SAVE_BOOKING_INFO, SAVE_BOOKING_DOCTOR, GET_DOCTOR_COMING_APPOINTMENT, SAVE_DOCTOR_COMING_APPOINTMENT, CLEAR_DOCTOR_COMING_APPOINTMENT, SAVE_BOOKING_TIME, ADD_PACKAGE, ADD_PACKAGE_SUCCESSFUL, RESET_PACKAGE_FORM } from "./action"



export const nextStep = () => {
    return {
        type: NEXT_STEP
    }
}

export const preStep = () => {
    return {
        type: PRE_STEP
    }
}

export const saveBookingInfo = (infos) => {
    return {
        type: SAVE_BOOKING_INFO,
        infos
    }
}

export const saveBookingDoctor = (doctor) => {
    return {
        type: SAVE_BOOKING_DOCTOR,
        doctor
    }
}

export const getDoctorComingAppointment = (doctorId) => {
    return {
        type: GET_DOCTOR_COMING_APPOINTMENT,
        doctorId
    }
}

export const saveDoctorComingAppointment = (comingAppointments) => {
    return {
        type: SAVE_DOCTOR_COMING_APPOINTMENT,
        comingAppointments
    }
}

export const clearDoctorComingAppointment = () => {
    return {
        type: CLEAR_DOCTOR_COMING_APPOINTMENT
    }
}

export const saveBookingTime = (time) => {
    return {
        type: SAVE_BOOKING_TIME,
        time
    }
}

export const addPackage = (request) => {
    return {
        type: ADD_PACKAGE,
        request
    }
}

export const addPackageSuccessful = (success) => {
    return {
        type: ADD_PACKAGE_SUCCESSFUL,
        success
    }
}

export const resetPackageForm = () => {
    return {
        type: RESET_PACKAGE_FORM,
    }
}


