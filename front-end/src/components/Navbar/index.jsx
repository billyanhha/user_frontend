import React, { useState, useEffect } from 'react';
import { UnorderedListOutlined } from "@ant-design/icons";
import './style.css'
import { Link, withRouter, useHistory } from "react-router-dom";
import { Menu, Dropdown, Button, Badge, Avatar } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { getUser } from '../../redux/user';
import _ from 'lodash'
import { userLogout } from '../../redux/auth';
import logoxz from '../../assest/logo/logo3 2.png';
import Notification from '../Notification';
const Navbar = (props) => {

    const { location } = props;
    const history = useHistory();
    const [menu_class, setMenu_class] = useState('');
    const [drawerVisible, setdrawerVisible] = useState(false);
    const { currentUser } = useSelector(state => state.user);
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const closeDrawer = () => {
        setdrawerVisible(false)
    }

    useEffect(() => {
        if (auth.isLoggedIn && auth.token) {
            dispatch(getUser(auth.token));
        }
    }, []);

    const CustomLink = (to, name) => {
        return (
            <Link to={to} className={'top-menu-item ' + (location.pathname === to ? 'link-active' : '')} >
                {name}
            </Link>
        )
    }

    const setToggleTopMenuClass = () => {
        if (menu_class === '') {
            setMenu_class('toggled')
        } else {
            setMenu_class('')
        }
    }

    let top_menu_class = `top-menu ${menu_class}`

    const toLoginPage = () => {
        props.history.push('/login');
    }

    const toBookingPage = () => {
        props.history.push('/booking');
    }

    const handleUserMenuClick = e => {
        if (e.key === 'logout') {
            dispatch(userLogout());
        }
        else if (e.key === 'profile') {
            history.push('/profile');
        } else if (e.key === 'notify') {
            setdrawerVisible(true)
        }
    };

    const userMenu = (
        <Menu onClick={handleUserMenuClick}>
            <Menu.Item key="profile">
                Trang quản lý của tôi
            </Menu.Item>
            <Menu.Item key="notify">
                Thông báo
            </Menu.Item>
            <Menu.Item key="logout">
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    const renderAuth = auth.isLoggedIn ?
        (
            <div className="nav-user-div nav-userInfo">
                <Dropdown overlay={userMenu} className="nav-userInfo-user">
                    <span className="nav-userInfo-user-name" >
                        <span className="avatar-item">
                            <Badge count={1}>
                                <Avatar size="large" shape={"square"} src={currentUser?.avatarurl} />
                            </Badge>
                        </span>
                        {currentUser?.fullname}
                    </span>
                </Dropdown>
                <button onClick={toBookingPage} className="fancyButton-background">Đặt lịch</button>
            </div>

        )
        : (
            <button onClick={toLoginPage} className="fancyButton">Đăng nhập</button>
        )

    return (
        <div>
            <Notification visible={drawerVisible} closeDrawer={closeDrawer} />
            <div className={top_menu_class}>
                <Link to="/" className='top-menu-lead primary-color'>
                    <div className="nav-logo"><img alt='logo' src={logoxz} /></div> {/* needed ? change logo later : */}
                    {/* <Avatar size={100} src={logo8} /> */}
                </Link>
                <div className='right'>
                    {CustomLink("/", 'Trang chủ')}
                    {CustomLink("/service", 'Các dịch vụ')}
                    {CustomLink("/doctors", 'Bác sĩ')}
                    {CustomLink("/qa", 'Hỏi đáp')}
                    {renderAuth}
                </div>
                <UnorderedListOutlined className='top-menu-icon' onClick={setToggleTopMenuClass} />
            </div>
        </div>
    );
};

export default withRouter(Navbar);
