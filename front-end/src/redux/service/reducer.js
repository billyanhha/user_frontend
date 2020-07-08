import { SAVE_SERVICE_FOR_HOME, QUERY_SERVICE_SUCCESSFUL, NEXT_QUERY_SERVICE_SUCCESSFUL, GET_ALL_CATEGORIES_SUCCESSFUL } from "./action";
import _ from "lodash"


const initialState = {
    homService: [],
    queryService: [],
    isOutOfData: false,
    categories: [],
}

export const serviceReducer = (state = initialState, action) => {
    if (action.type === SAVE_SERVICE_FOR_HOME) {        
        let newState = { ...state, homService: action?.services?.result }
        return newState;
    } else if (action.type ===  QUERY_SERVICE_SUCCESSFUL) {                
        state = {...state , queryService : action?.services?.result , isOutOfData: action?.services?.isOutOfData}
        return state;
    }else if (action.type === NEXT_QUERY_SERVICE_SUCCESSFUL) {        
        state.queryService.push(...action?.services?.result);
        state.isOutOfData = action?.services?.isOutOfData
        return state;
    }else if (action.type === GET_ALL_CATEGORIES_SUCCESSFUL) {        
        state = {...state , categories : action?.data}
        return state;
    }  else {
        return state
    }
}
