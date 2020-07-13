import React, { useEffect, useState } from 'react';
import "./style.css";
import { Menu, Dropdown, Button, Tabs, Pagination } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { getPatient, getUserPackage } from '../../../../redux/user';
import packageStatus from "../../../../configs/packageStatus"
import CustomerPackage from "../../../../components/CustomerPackage"
import { Input } from 'antd';
import _ from "lodash"

const { Search } = Input;

const { TabPane } = Tabs;

const UserPackage = () => {

    const dispatch = useDispatch();
    const { patients, userPackage } = useSelector(state => state.userPackage);
    const [curPatient, setcurPatient] = useState('-1');
    const [curStatus, setstatus] = useState('-1');
    const [searchText, setsearchText] = useState('');
    const [curPage, setcurrentPage] = useState(1);

    useEffect(() => {

        // curPatient, curStatus, curPage, searchText
        Promise.all([
            dispatch(getPatient()),
            handleGetUserPackage(curPatient, curStatus, curPage, searchText)
        ])

    }, []);

    useEffect(() => {

        window.scroll(0, 0);

    }, [curPage]);


    const resetGet = () => {
        setsearchText('')
        setcurrentPage(1)
    }

    const handleMenuClick = (e) => {
        resetGet()
        setcurPatient(e.key)
        handleGetUserPackage(e.key, curStatus, 1, '')
    }

    const onStatusChange = (key) => {
        resetGet()
        setstatus(key)
        handleGetUserPackage(curPatient, key, 1, '')

    }

    const onPageNumberChange = (pageNum) => {
        setcurrentPage(pageNum)
        handleGetUserPackage(curPatient, curStatus, pageNum, searchText)
    }

    const onSearchChange = _.debounce((value) => {
        setsearchText(value)
        setcurrentPage(1)
        handleGetUserPackage(curPatient, '-1', 1, value)

    }, 300)

    const onSerchDebounce = (e) => {
        onSearchChange(e?.target?.value?.trim())
    }

    const handleGetUserPackage = (curPatient, curStatus, curPage, searchText) => {
        const params = {
            page: curPage,
            doctor_name: searchText,
            patient_id: curPatient === "-1" ? "" : curPatient,
            status_id: curStatus === "-1" ? "" : curStatus,
            itemsPage: 3
        }
        dispatch(getUserPackage(params))
    }

    const renderMenuPatients = patients?.map((value, index) => {
        return (
            <Menu.Item key={value?.id}>
                {value?.fullname} - {(value?.type === 'INDEPENDENT' ? 'Tôi' : value?.type)}
            </Menu.Item>
        )
    })

    const getPatientByID = () => {
        if (curPatient === '-1') {
            return { fullname: 'Tất cả' }
        }
        let ele = {};
        patients.forEach(element => {
            if (element.id === curPatient) {
                ele = element
            }
        });
        return ele;
    }

    const menu = (
        <Menu selectedKeys={[curPatient?.id]} onClick={handleMenuClick}>
            <Menu.Item key="-1">
                Tất cả
            </Menu.Item>
            {renderMenuPatients}
        </Menu>
    );

    const { status } = packageStatus;

    const renderPackageStatus = Object.keys(status).map((value, index) => {
        return (
            <TabPane tab={status[value].msg} key={status[value].id}>
                <div className="package-main-wrapper">
                    <Search
                        size="large"
                        defaultValue={searchText}
                        className="package-search"
                        placeholder="Tìm kiếm theo tên bác sĩ"
                        onChange={onSerchDebounce}
                    />
                    <CustomerPackage />
                    {
                        !_.isEmpty(userPackage)
                        && (
                            <div className="package-pagination">
                                <Pagination
                                    onChange={onPageNumberChange}
                                    current={curPage}
                                    pageSize={3}
                                    style={{ color: '#00bc9a', borderColor: '#00bc9a' }}
                                    total={userPackage[0]?.full_count} showSizeChanger={false}
                                />
                            </div>

                        )
                    }
                </div>
            </TabPane>
        )
    })

    return (
        <div className="userPackage">
            Lọc gói theo: <Dropdown overlay={menu}>
                <Button>
                    {getPatientByID().fullname}  <DownOutlined />
                </Button>
            </Dropdown>
            <div className="userPackage-content">
                <Tabs onTabClick={onStatusChange} defaultActiveKey={curStatus} size={"small"}>
                    {renderPackageStatus}
                </Tabs>
            </div>
        </div>
    );
};

export default UserPackage;