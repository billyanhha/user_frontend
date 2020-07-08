import { put, takeLatest, select } from 'redux-saga/effects';
import { GET_SLOT } from './action';
import slotService from "../../service/slotService"
import { saveSlot } from '.';
import _ from 'lodash';
import { openLoading, closeLoading } from '../ui';



function* watchGetSlotWorker() {
    try {
        yield put(openLoading())
        const {token} = yield select(state => state.auth)
        const result = yield slotService.getSlot(token);
        if (!_.isEmpty(result?.slots)) {

            yield put(saveSlot(result?.slots));
        }
    } catch (error) {
        console.log(error);
    } finally {
        yield put(closeLoading())
    }

}





export function* slotSaga() {
    yield takeLatest(GET_SLOT, watchGetSlotWorker);
}