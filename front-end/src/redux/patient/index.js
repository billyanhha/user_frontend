import {
    GET_ALL_DEPENDENT, GET_ALL_DEPENDENT_SUCCESSFUL, CREATE_DEPENDENT, CREATE_DEPENDENT_SUCCESSFUL, GET_PACKAGE_PROGRESS, GET_PACKAGE_PROGRESS_SUCCESSFUL
} from './action'

export const getAllDependent = (token, customerID) => {
    return {
        type: GET_ALL_DEPENDENT,
        token,
        customerID
    }
}

export const getAllDependentSuccessful = (dependentProfile) => {
    return {
        type: GET_ALL_DEPENDENT_SUCCESSFUL,
        dependentProfile
    }
}

export const createDependent = (token, customerID, data) => {
    return {
        type: CREATE_DEPENDENT,
        token,
        customerID,
        data
    }
}

export const createDependentSuccessful = (status) => {
    return {
        type: CREATE_DEPENDENT_SUCCESSFUL,
        status
    }
}

export const getPackageProgress = (token, customerID) => {
    return {
        type: GET_PACKAGE_PROGRESS,
        token,
        customerID
    }
}

export const getPackageProgressSuccessful = (data) => {
    return {
        type: GET_PACKAGE_PROGRESS_SUCCESSFUL,
        data
    }
}