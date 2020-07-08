import React, { useState, useEffect } from 'react';
import { UnorderedListOutlined } from "@ant-design/icons";
import './style.css'
import { Link, withRouter, Redirect, useHistory } from "react-router-dom";
import { Menu, Dropdown, Button, Badge, Avatar } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { getUser } from '../../redux/user';
import _ from 'lodash'
import { userLogout } from '../../redux/auth';

const Navbar = (props) => {

    const { location } = props;
    const history = useHistory();
    const [redirect, setRedirect] = useState(false);
    const [menu_class, setMenu_class] = useState('');
    const { currentUser } = useSelector(state => state.user);
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (auth.isLoggedIn && auth.token) {
            dispatch(getUser(auth.token));
        }
    }, []);

    if (redirect) {
        return <Redirect to="/login" />
    }

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

    const toBookingPage =() => {
        props.history.push('/booking');
    }

    const handleUserMenuClick = e => {
        if (e.key === 'logout') {
            dispatch(userLogout());
            setRedirect(true);
        }
        if (e.key === 'profile') {
            history.push('/profile');
        }
    };

    const userMenu = (
        <Menu onClick={handleUserMenuClick}>
            <Menu.Item key="profile">
                Trang quản lý của tôi
            </Menu.Item>
            <Menu.Item key="logout">
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    const renderAuth = auth.isLoggedIn ?
        (
            <div className="nav-user-div nav-userInfo">
                <span className="avatar-item">
                    <Badge count={1}>
                        <Avatar shape={"square"} src={currentUser?.avatarurl} />
                    </Badge>
                </span>
                <Dropdown overlay={userMenu} className="nav-userInfo-user">
                    <Button type='link' className="nav-userInfo-user-name" >
                        {currentUser?.fullname}
                    </Button>
                </Dropdown>
                <button onClick={toBookingPage} className="fancyButton-background">Đặt lịch</button>
            </div>

        )
        : (
            <button onClick={toLoginPage} className="fancyButton">Đăng nhập</button>
        )

    return (
        <div className={top_menu_class} >
            <Link to="/" className='top-menu-lead primary-color'>
                Logo
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
    );
};

export default withRouter(Navbar);
