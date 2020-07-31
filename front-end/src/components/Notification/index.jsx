import React from 'react';
import './style.css'
import { Drawer } from 'antd';

const Notification = (props) => {
    return (
        <div>
            <Drawer
                title="Thông báo"
                placement="right"
                onClose={props.closeDrawer}
                visible={props.visible}
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
        </div>
    );
};

export default Notification;