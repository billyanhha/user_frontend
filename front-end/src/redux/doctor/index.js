import { SAVE_DOCTOR_FOR_HOME, 
    GET_DOCTOR_FOR_HOME, 
    QUERY_DOCTOR, 
    QUERY_DOCTOR_SUCCESSFUL,
    NEXT_QUERY_DOCTOR, 
    GET_DOCTOR_DETAIL_SUCCESSFUL,
    GET_DOCTOR_DETAIL,
    NEXT_QUERY_DOCTOR_SUCCESSFUL, 
    CLEAR_DOCTOR_LOGIN_INFO,
    GET_DOCTOR_LOGIN_SUCCESSFUL,
    GET_DOCTOR_LOGIN} from "./action"

export const getDoctorForHome = () => {    
    return {
        type: GET_DOCTOR_FOR_HOME,
    }
}

export const saveDoctorForHome = (doctors) => {    
    return {
        type: SAVE_DOCTOR_FOR_HOME,
        doctors
    }
}

export const queryDoctor = (query) => {    
    return {
        type: QUERY_DOCTOR,
        query
    }
}

export const queryDoctorSuccessful = (doctors) => {    
    return {
        type: QUERY_DOCTOR_SUCCESSFUL,
        doctors
    }
}

export const nextQueryDoctor = (query) => {    
    return {
        type: NEXT_QUERY_DOCTOR,
        query
    }
}

export const nextQueryDoctorSuccessful = (doctors) => {    
    return {
        type: NEXT_QUERY_DOCTOR_SUCCESSFUL,
        doctors
    }
}

export const getDoctorDetail = (id) => {    
    return {
        type: GET_DOCTOR_DETAIL,
        id
    }
}

export const getDoctorDetailSuccessful = (doctor) => {    
    return {
        type: GET_DOCTOR_DETAIL_SUCCESSFUL,
        doctor
    }
}

export const getDoctorLogin = (token) => {        
    return {
        type: GET_DOCTOR_LOGIN,
        token
    }
}

export const clearDoctorLogin = () => {    
    return {
        type: CLEAR_DOCTOR_LOGIN_INFO,
    }
}



export const getDoctorLoginSuccessful = (currentDoctor) => {
    return {
        type: GET_DOCTOR_LOGIN_SUCCESSFUL,
        currentDoctor
    }
}








