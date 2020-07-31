import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from "lodash";
import { notification } from 'antd';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { saveIoInstance, clearIoInstance } from '../../redux/notification';

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

    const notifyPanel = (data) => {
        if(!_.isEmpty(data)) {
            const btn = (
                <a href={data?.url}>Chi tiết</a>
            );
            notification["info"]({
                key: data?.id,
                message: 'Thông báo',
                description: data?.content,
                btn,
                duration: 4
            });
        }
    }

    const getMessage = () => {
        if(notify?.io) {
            notify.io.on("server-send-notification", (data) => {
                notifyPanel(data)
            })
        }
    }

    return !_.isEmpty(token) ? (
        <div>
            {getMessage()}
        </div>
    ) : '';
};

export default Notify;