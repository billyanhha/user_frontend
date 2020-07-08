import { GET_SERVICE_FOR_HOME, SAVE_SERVICE_FOR_HOME, QUERY_SERVICE, QUERY_SERVICE_SUCCESSFUL, NEXT_QUERY_SERVICE, NEXT_QUERY_SERVICE_SUCCESSFUL, GET_ALL_CATEGORIES_SUCCESSFUL, GET_ALL_CATEGORIES } from "./action"

export const getServiceForHome = () => {    
    return {
        type: GET_SERVICE_FOR_HOME,
    }
}

export const saveServiceForHome = (services) => {    
    return {
        type: SAVE_SERVICE_FOR_HOME,
        services
    }
}

export const queryService = (query) => {    
    return {
        type: QUERY_SERVICE,
        query
    }
}

export const queryServiceSuccessful = (services) => {    
    return {
        type: QUERY_SERVICE_SUCCESSFUL,
        services
    }
}

export const nextQueryService = (query) => {    
    return {
        type: NEXT_QUERY_SERVICE,
        query
    }
}

export const nextQueryServiceSuccessful = (services) => {    
    return {
        type: NEXT_QUERY_SERVICE_SUCCESSFUL,
        services
    }
}


export const getAllCategories = (size) => {    
    return {
        type: GET_ALL_CATEGORIES,
        size
    }
}

export const getAllCategoriesSuccessful = (data) => {    
    return {
        type: GET_ALL_CATEGORIES_SUCCESSFUL,
        data
    }
}



