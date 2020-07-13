import {
    GET_ALL_DEPENDENT_SUCCESSFUL, CREATE_DEPENDENT_SUCCESSFUL, GET_PACKAGE_PROGRESS_SUCCESSFUL
} from './action'

const initialState = {
    dependentProfile: null,
    createStatus: false,
    packageProgress: null
}

export const patientReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_DEPENDENT_SUCCESSFUL:
            state = { ...state, dependentProfile: action.dependentProfile }
            return state;
        case CREATE_DEPENDENT_SUCCESSFUL:
            state = { ...state, createStatus: action?.status }
            return state;
        case GET_PACKAGE_PROGRESS_SUCCESSFUL:
            state = { ...state, packageProgress: action?.data }
            return state;
        default:
            return state;
    }
}