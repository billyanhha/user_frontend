import React, { useEffect } from 'react';
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css'; import { Badge } from 'antd';
import { AppstoreAddOutlined, ProfileOutlined, FolderAddOutlined, MessageOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUnreadGroup } from '../../redux/chat';

const FloatingButton = (props) => {

    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const { nonReadGroupNumber } = useSelector(state => state.chat);

    useEffect(() => {

        dispatch(getUnreadGroup({ cusId: currentUser?.cusId }))

    }, [currentUser]);

    const toMessenger = () => {
        props.history.push("/messenger/t")
    }


    return props.location.pathname.includes('/messenger') ? '' : (
        <Fab
            // mainButtonStyles={mainButtonStyles}
            // actionButtonStyles={actionButtonStyles}
            position={{ bottom: 70, right: 2 }}
            mainButtonStyles={{ backgroundColor: '#fff', border: '1px solid #00BC9A' }}
            icon={
                <Badge count={nonReadGroupNumber}>
                    <MessageOutlined style={{ fontSize: '23px', color: '#00BC9A' }} />
                </Badge>}
            text={<p>Chat với bác sĩ <br /> {nonReadGroupNumber} tin nhắn mới</p>}
            onClick={toMessenger}
        >
        </Fab>
    );
};

export default withRouter(FloatingButton);