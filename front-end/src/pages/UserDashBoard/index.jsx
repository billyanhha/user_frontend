import React, { useEffect } from 'react'
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { Tabs, Spin, message } from 'antd';
import { UserOutlined, SettingOutlined, MessageOutlined, HeartOutlined, UsergroupAddOutlined } from '@ant-design/icons';

import Profile from './components/Profile'
import Family from './components/Family'
import Setting from './components/Setting'
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

import './style.css';
import UserPackage from './components/UserPackage';

const { TabPane } = Tabs;

const UserDashBoard = () => {

    const history = useHistory();
    const { isLoad } = useSelector(state => state.ui);
    const { currentUser } = useSelector(state => state.user);
    useEffect(() => {
        window.scroll(0, 0)
        if (currentUser?.customer_id === undefined) {
            history.push("/login");
            message.destroy()
            message.info("Xin hãy đăng nhập!", 2);
        }
    }, []);

    return (
        <Spin size="large" spinning={isLoad}>
            <div className="default-div">
                <Navbar />
                <div className="dashboard-wrapper">
                    <div className="dashboard-wrapper-tab">
                        {/* destroyInactiveTabPane is neccessary, plz don't touch it! */}
                        <Tabs destroyInactiveTabPane>
                            <TabPane tab={<span><HeartOutlined />Các gói điều dưỡng</span>} key="1">
                                <div className="dashboard-component">
                                    <UserPackage />
                                </div>
                            </TabPane>
                            <TabPane tab={<span><UserOutlined />Trang cá nhân</span>} key="2" active>
                                <Profile dependentInfo={null} createNew={false} />
                            </TabPane>
                            <TabPane tab={<span><UsergroupAddOutlined /> Người phụ thuộc</span>} key="3">
                                <Family />
                            </TabPane>
                            <TabPane tab={<span><SettingOutlined />Cài đặt</span>} key="4">
                                <Setting />
                            </TabPane>
                            <TabPane tab={<span><MessageOutlined />Thông báo</span>} key="5">
                                <div className="dashboard-component">
                                    Thông báo
                                </div>
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
                <Footer />
            </div>
        </Spin>
    )
}

export default UserDashBoard;
