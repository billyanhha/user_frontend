import React from 'react';
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css'; import { Badge } from 'antd';
import { AppstoreAddOutlined, ProfileOutlined, FolderAddOutlined, MessageOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';

const FloatingButton = (props) => {



    const toMessenger = () => {
        props.history.push("/messenger/t")
    }


    return props.location.pathname === '/messenger/t' ? '' : (
        <Fab
            // mainButtonStyles={mainButtonStyles}
            // actionButtonStyles={actionButtonStyles}
            position={{ bottom: 70, right: 2 }}
            mainButtonStyles={{ backgroundColor: '#fff', border: '1px solid #00BC9A' }}
            icon={
                <Badge count={5}>
                    <MessageOutlined style={{ fontSize: '23px', color: '#00BC9A' }} />
                </Badge>}
            text={<p>Chat với bác sĩ <br /> 5 tin nhắn mới</p>}
            onClick={toMessenger}
        >
        </Fab>
    );
};

export default withRouter(FloatingButton);