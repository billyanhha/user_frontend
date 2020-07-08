import { put, takeLatest, select, all, takeEvery } from 'redux-saga/effects';
import { openLoading, closeLoading } from '../ui';
import { message } from 'antd';
import { GET_SERVICE_FOR_HOME, QUERY_SERVICE, NEXT_QUERY_SERVICE, GET_ALL_CATEGORIES } from './action';
import sService from '../../service/sService'
import { saveServiceForHome, queryServiceSuccessful, nextQueryServiceSuccessful, getAllCategoriesSuccessful } from '.';
import _ from 'lodash'

function* watchGetServiceForHomeWorker() {
    try {
        yield put(openLoading())
        const result = yield sService.getServiceForHome();
        if (!_.isEmpty(result) && !_.isEmpty(result?.services) && !_.isEmpty(result?.services)) {

            yield put(saveServiceForHome(result?.services));
        }
    } catch (error) {
        console.log(error);
    } finally {
        yield put(closeLoading())
    }
}

function* watchQueryServiceWorker(action) {
    try {
        yield put(openLoading());
        const result = yield sService.getServiceQuery(action.query);
        
        if (!_.isEmpty(result)&& !_.isEmpty(result?.services)) {            
            yield put(queryServiceSuccessful(result?.services));
        }
    } catch (error) {
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

function* watchNextQueryServiceWorker(action) {
    try {
        yield put(openLoading());
        const result = yield sService.getServiceQuery(action.query);
        
        if (!_.isEmpty(result)&& !_.isEmpty(result?.services)) {            
            yield put(nextQueryServiceSuccessful(result?.services));
        }
    } catch (error) {
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}


function* watchgetAllCategoriesWorker(action) {
    try {
        yield put(openLoading());
        const result = yield sService.getAllCategories(action?.size);
        
        if (!_.isEmpty(result?.categorires)) {            
            yield put(getAllCategoriesSuccessful(result?.categorires));
        }
    } catch (error) {
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}





export function* serviceSaga() {
    yield takeLatest(GET_SERVICE_FOR_HOME, watchGetServiceForHomeWorker);
    yield takeLatest(QUERY_SERVICE, watchQueryServiceWorker);
    yield takeLatest(NEXT_QUERY_SERVICE, watchNextQueryServiceWorker);
    yield takeLatest(GET_ALL_CATEGORIES, watchgetAllCategoriesWorker);
}