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
    const [data, setdata] = useState({});

    useEffect(() => {

        if (_.isEmpty(token)) {
            setioConnect(null)
        }

    }, [token]);

    useEffect(() => {

        if (_.isEmpty(ioConnect) && !_.isEmpty(user?.currentUser)) {
            const ioConnectData = io(process.env.REACT_APP_SERVER);
            setioConnect(ioConnectData)
            ioConnectData.emit("client-send-userId", user?.currentUser?.cusId + "customer")
        }

    }, [user?.currentUser]);

    useEffect(() => {
        
        getMessage()

    }, []);


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
        if(ioConnect) {
            ioConnect.on("server-send-notification", (data) => {
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