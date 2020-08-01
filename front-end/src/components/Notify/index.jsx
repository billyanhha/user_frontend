import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from "lodash";
import { notification } from 'antd';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { saveIoInstance, clearIoInstance, countUnreadNotify, markReadNotify, getUserNotification } from '../../redux/notification';

const Notify = () => {

    const notify = useSelector(state => state.notify);
    const user = useSelector(state => state.user);
    const { token } = useSelector(state => state.auth);

    const dispatch = useDispatch();

    useEffect(() => {

        if (_.isEmpty(token)) {
            dispatch(clearIoInstance())
        }

    }, [token]);

    useEffect(() => {


        if (_.isEmpty(notify?.io) && !_.isEmpty(user?.currentUser)) {
            const ioConnectData = io(process.env.REACT_APP_SERVER);
            dispatch(saveIoInstance(ioConnectData))
            ioConnectData.emit("client-send-userId", user?.currentUser?.cusId + "customer")
        }

    }, [user?.currentUser]);

    const markReadNotifyFunc = (id) => {
        const data = { id: id, is_read: true }
        dispatch(markReadNotify(data))
    }


    const notifyPanel = (data) => {
        if (!_.isEmpty(data)) {
            const btn = (
                <div onClick={() => markReadNotifyFunc(data?.id)}>
                    <a href={data?.url}>Chi tiết</a>
                </div>
            );
            notification["info"]({
                key: data?.id,
                message: 'Thông báo',
                description: data?.content,
                btn,
                duration: 0,
                placement: 'bottomLeft'
            });
        }
    }

    const getMessage = () => {
        if (notify?.io) {
            notify.io.on("server-send-notification", (data) => {
                getNewNotify()
                getNotifyNum();
                notifyPanel(data)
            })
        }
    }

    const getNewNotify = () => {
        const data = { id: user?.currentUser?.cusId, itemsPage: 30, page: 1 }
        dispatch(getUserNotification(data))
    }

    const getNotifyNum = () => {
        const data = { receiver_id: user?.currentUser?.cusId }
        dispatch(countUnreadNotify(data))
    }

    return !_.isEmpty(token) ? (
        <div>
            {getMessage()}
        </div>
    ) : '';
};

export default Notify;