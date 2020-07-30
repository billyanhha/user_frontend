import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import _ from "lodash";
import { notification } from 'antd';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

const Notify = () => {

    const user = useSelector(state => state.user);
    const { token } = useSelector(state => state.auth);
    const [ioConnect, setioConnect] = useState(null);


    useEffect(() => {

        if (_.isEmpty(ioConnect) && !_.isEmpty(user?.currentUser)) {
            const ioConnectData = io(process.env.REACT_APP_SERVER);
            setioConnect(ioConnectData)
            ioConnectData.emit("client-send-userId", user?.currentUser?.cusId + "customer")
        }

    }, [user?.currentUser]);

    const notifyPanel = (data) => {
        if(!_.isEmpty(data)) {
            const key = `open${Date.now()}`;
            const btn = (
                <a href={data?.url}>Chi tiết</a>
            );
            notification.open({
                message: 'Thông báo',
                description: data?.content,
                btn,
                key,
            });
        }
    }

    const getMessage = () => {
        if(ioConnect) {
            ioConnect.on("server-send-notification", (data) => {
                console.log(data);
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