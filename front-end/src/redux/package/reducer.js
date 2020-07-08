import {
    GET_PACKAGE_INFO_SUCCESSFUL,
    GET_PACKAGE_SERVICES_SUCCESSFUL,
    GET_PACKAGE_APPOINTMENTS_SUCCESSFUL,
    GET_PACKAGE_STATUS_SUCCESSFUL,
    GET_ALL_APPOINTMENT_SUCCESSFUL
} from "./action";
import _ from "lodash"


const initialState = {
    packageInfo: {},
    packageData: {services: [] , appointments: [], status: []},
    allAppointmentByPackage:[]
}

export const packageReducer = (state = initialState, action) => {
     if (action.type === GET_PACKAGE_INFO_SUCCESSFUL) {
        state = { ...state, packageInfo: action.packageInfo }
        return state;
    } else if (action.type === GET_PACKAGE_SERVICES_SUCCESSFUL) {
        let {packageData} = state;
        packageData.services = action.services
        state = { ...state, packageData:  packageData}
        return state;
    } else if (action.type === GET_PACKAGE_APPOINTMENTS_SUCCESSFUL) {
        let {packageData} = state;
        packageData.appointments = action.appointments
        state = { ...state, packageData:  packageData}
        return state;
    } else if (action.type === GET_PACKAGE_STATUS_SUCCESSFUL) {
        let {packageData} = state;
        packageData.status = action.status
        state = { ...state, packageData:  packageData}
        return state;
    } else  if (action.type === GET_ALL_APPOINTMENT_SUCCESSFUL) {
        state = { ...state, allAppointmentByPackage: action?.appointments }
        return state;
    }else {
        return state;
    }
}
