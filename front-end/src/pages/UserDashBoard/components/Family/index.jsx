import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, resetUploadStatus } from '../../../../redux/user';
import { getAllDependent, createDependentSuccessful } from '../../../../redux/patient';
import Profile from '../Profile';

import { message, PageHeader, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import './style.css';

const Family = () => {
    const { Meta } = Card;
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const dependentProfile = useSelector(state => state.patient.dependentProfile);
    const token = useSelector(state => state.auth.token);
    const uploadStatus = useSelector(state => state.user.uploadStatus);
    const createStatus = useSelector(state => state.patient.createStatus);

    const [allMember, setAllMember] = useState(null);
    const [shouldAppear, setShouldAppear] = useState(false);
    const [memberInfo, setMemberInfo] = useState(null);
    const [needCreate, setNeedCreate] = useState(false);

    const disAppear = () => {
        setMemberInfo(null)
        setShouldAppear(false);
        setNeedCreate(false);
    }

    const getProfileCustomer = () => {
        dispatch(getUserProfile(currentUser?.customer_id, token));
    }

    const getDependent = () => {
        if (token != '' && currentUser?.customer_id)
            dispatch(getAllDependent(token, currentUser?.customer_id));
    }

    const addMember = () => {
        setShouldAppear(true);
        setNeedCreate(true);
    }

    const handleShowInfo = (member) => {
        setMemberInfo(member);
        setShouldAppear(true);
    }

    const filterMember = (allPatient) => {
        let filtered = [];
        allPatient.forEach(element => {
            if (element.type !== "INDEPENDENT")
                filtered.push(element);
        });
        setAllMember(filtered);
    }

    const renderDependent = allMember?.map((member) =>
        <div key={member.id} className="family-member" onClick={() => handleShowInfo(member)}>
            <Card style={{ border: "none" }}
                cover={
                    <div className="family-avatar-wrapper">
                        <img id="family-avatar-profile" src={member.avatarurl} alt="Avatar" />
                    </div>
                }>
                <Meta title={member.fullname ?? ""} />
            </Card>
        </div>
    );

    useEffect(() => {
        if (dependentProfile === null || !dependentProfile) {
            getDependent();
        } else {
            filterMember(dependentProfile);
        }
    }, [dependentProfile]);

    useEffect(() => {
        if (uploadStatus) {
            dispatch(resetUploadStatus());
            // setShouldAppear(false)
        }

        if (createStatus) {
            dispatch(createDependentSuccessful(false));
            setShouldAppear(false)
        }
        getDependent()
    }, [uploadStatus, createStatus]);

    useEffect(() => {
        console.log(shouldAppear)
    }, [shouldAppear])

    useEffect(() => {
        if (currentUser?.customer_id === undefined || token === '') {
            message.info("Xin hãy đăng nhập!", 2);
        } else {
            getProfileCustomer();
            getDependent();
        }
    }, []);

    return (
        <div className="dashboard-family">
            {/* <div className="dashboard-component-header">Thành viên </div> */}
            {!shouldAppear
                ? <div className="all-members">
                    {renderDependent}
                    <div className="family-member add-member" onClick={() => addMember()}>
                        <div className="add-member-icon"><PlusOutlined style={{ fontSize: "10em", opacity: "0.8", color: "#00bc9a" }} /></div>
                        <div>Thêm thành viên</div>
                    </div>
                </div>
                : <div className="member-info">
                    <PageHeader
                        onBack={() => disAppear()}
                        title="Quay lại"
                    >
                        <Profile dependentInfo={memberInfo ?? null} createNew={needCreate} />
                    </PageHeader>
                </div>
            }
        </div>
    )
}

export default Family;