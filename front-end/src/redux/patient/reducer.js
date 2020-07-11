import {
    GET_ALL_DEPENDENT_SUCCESSFUL, CREATE_DEPENDENT_SUCCESSFUL
    , GET_CURRENT_HEALTH_SUCCESSFULLY
} from './action'

const initialState = {
    dependentProfile: null,
    createStatus: false,
    currentHealth: {}
}

export const patientReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_DEPENDENT_SUCCESSFUL:
            state = { ...state, dependentProfile: action.dependentProfile }
            return state;
        case CREATE_DEPENDENT_SUCCESSFUL:
            state = { ...state, createStatus: action?.status }
            return state;
        case GET_CURRENT_HEALTH_SUCCESSFULLY:
            state = { ...state, currentHealth: action?.data }
            return state;
        default:
            return state;
    }
}