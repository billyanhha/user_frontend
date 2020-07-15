import { NEXT_STEP, PRE_STEP, SAVE_BOOKING_INFO, SAVE_BOOKING_DOCTOR, SAVE_DOCTOR_COMING_APPOINTMENT, CLEAR_DOCTOR_COMING_APPOINTMENT, SAVE_BOOKING_TIME, ADD_PACKAGE_SUCCESSFUL, RESET_PACKAGE_FORM } from "./action";



const initialState = {
    currentStep: 0,
    infos: {},
    doctorInfo: {},
    bookingTime: {},
    comingAppointments: [],
    addPackageSuccess: false
}

export const bookingReducer = (state = initialState, action) => {
    switch(action.type) {
        case NEXT_STEP : {
            state = {...state , currentStep: ++state.currentStep};
            return state
        }
        case PRE_STEP : {
            state = {...state , currentStep: --state.currentStep};
            return state
        }
        case SAVE_BOOKING_INFO : {
            console.log('action ne',action.infos);
            state = {...state , infos: action.infos};
            return state
        }
        case SAVE_BOOKING_DOCTOR : {
            state = {...state , doctorInfo: action.doctor};
            return state
        }
        case SAVE_DOCTOR_COMING_APPOINTMENT : {
            state = {...state , comingAppointments: action.comingAppointments};
            return state
        }
        case CLEAR_DOCTOR_COMING_APPOINTMENT : {
            state = {...state , comingAppointments: []};
            return state
        }
        case SAVE_BOOKING_TIME : {
            state = {...state , bookingTime: action.time};
            return state
        }
        case ADD_PACKAGE_SUCCESSFUL : {
            state = {...state , addPackageSuccess: action.success};
            return state
        }
        case RESET_PACKAGE_FORM : {
            return initialState
        }
        default:  {
            return state;
        }
    }
}
