import React from 'react';
import './style.css'
import { Drawer, Button, Badge } from 'antd';
import { NotificationOutlined } from '@ant-design/icons';

const Notification = (props) => {

    const renderHeader = () => {
        return (
            <div className="drawer-header">
                <div>
                    <Badge count={1000} overflowCount={999} offset={[20, 0]}>
                        <h3>Thông báo <NotificationOutlined/></h3>
                    </Badge>
                </div>
                <Button type="link" primary>
                    Đánh dấu tất cả là đã xem
                </Button>
            </div>
        )
    }

    const renderNotify = [1, 3, 4, 5, 6, 7, 8, 9, 3, 4, 4, 56, 5, 55, 5, 5, 5, 55, 5, 5, 5, 5].map((value, index) => {
        return (
            <div className="notify-item">
                <Badge status="processing" />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut augue quam, blandit ac ultrices ut, euismod a ante. Nam egestas, nunc a luctus pretium, erat diam scelerisque erat, a volutpat arcu eros sed libero. Sed elementum, metus non cursus mollis, elit purus molestie urna, quis pellentesque eros arcu a metus. Fusce eleifend elit at finibus accumsan. Curabitur a auctor sapien. Fusce eu feugiat dui. Cras nisl est, auctor a tincidunt eu, suscipit id metus. Suspendisse eget aliquet elit, hendrerit auctor massa. Cras posuere volutpat sagittis. Curabitur vel erat erat. Mauris facilisis tempus elit, in ultrices ipsum pharetra et.
            </div>
        )
    })

    return (
        <div className="notify-drawer">
            <Drawer
                title={renderHeader()}
                placement="right"
                drawerStyle={{ maxWidth: '500px' }}
                onClose={props.closeDrawer}
                visible={props.visible}
                bodyStyle={{ padding: 0 }}
            >
                {renderNotify}
                <div className="notify-loadmore">
                    <center>
                        <Button className = "notify-loadmore-btn" type="primary">Tải thêm</Button>
                    </center>
                </div>
            </Drawer>
        </div>
    );
};

export default Notification;