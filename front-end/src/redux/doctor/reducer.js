import { SAVE_DOCTOR_FOR_HOME, QUERY_DOCTOR_SUCCESSFUL, NEXT_QUERY_DOCTOR_SUCCESSFUL, 
    GET_DOCTOR_DETAIL_SUCCESSFUL, CLEAR_DOCTOR_LOGIN_INFO, GET_DOCTOR_LOGIN_SUCCESSFUL } from "./action";
import _ from "lodash"


const initialState = {
    homeDoctor: [],
    queryDoctor: [],
    isOutOfData: false,
    doctorDetail: {},
    currentDoctor: {}
}

export const doctorReducer = (state = initialState, action) => {
    if (action.type === SAVE_DOCTOR_FOR_HOME) {
        let newState = { ...state, homeDoctor: action?.doctors?.result }
        return newState;
    } else if (action.type === QUERY_DOCTOR_SUCCESSFUL) {
        state = { ...state, queryDoctor: action?.doctors?.result, isOutOfData: action?.doctors?.isOutOfData }
        return state;
    } else if (action.type === NEXT_QUERY_DOCTOR_SUCCESSFUL) {
        state.queryDoctor.push(...action?.doctors?.result);
        state.isOutOfData = action?.doctors?.isOutOfData
        return state;
    } else if (action.type === GET_DOCTOR_DETAIL_SUCCESSFUL) {
        state = {...state, doctorDetail: action.doctor}
        return state;
    } else if (action.type === GET_DOCTOR_LOGIN_SUCCESSFUL) {
        state = {...state, currentDoctor: action.currentDoctor}      
        return state;
    } else if(action.type === CLEAR_DOCTOR_LOGIN_INFO){
        state = {...state, currentDoctor: {}}
        return state;      
    } else {
        return state
    }
}
