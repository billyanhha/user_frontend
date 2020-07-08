import React from 'react';
import './style.css'
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Modal, Rate, Input, message } from 'antd';
import { Link, withRouter } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment'
import _ from "lodash"
import packageStatus from "../../configs/package_status"
import { useState } from 'react';
import { ratingDoctor, updateRatingDoctor } from '../../redux/package';

const desc = ['Rất kém', 'Kém', 'Trung Bình', 'Tốt', 'Rất Tốt'];
const { TextArea } = Input;

const CustomerPackage = (props) => {

    const dispatch = useDispatch();
    const { userPackage } = useSelector(state => state.userPackage);
    const { currentUser } = useSelector(state => state.user);
    const [visible, setvisible] = useState(false);
    const [currentPacakge, setcurrentPacakge] = useState({});
    const [rateValue, setrateValue] = useState(3);
    const [note, setnote] = useState('');

    const onNoteChange = (e) => {
        setnote(e.target.value)
    }

    const handleChange = value => {
        setrateValue(value)
    };

    const handleHoverChange = (value) => {
    }

    const openRateModal = (value) => {
        setvisible(true)
        setrateValue(value?.star ?? 3)
        setnote(value?.comment ?? '')
        setcurrentPacakge(value)
    }

    const handleOk = () => {
        let data = {};

        data.star = rateValue;
        data.comment = note;
        
        data.packageId = currentPacakge?.package_id;
        data.customer_id  = currentUser?.customer_id;

        if (currentPacakge?.package_rating_id) { // edit
            data.package_rating_id = currentPacakge?.package_rating_id
            dispatch(updateRatingDoctor(data))
        } else { //add

            dispatch(ratingDoctor(data))

        }

    };

    const handleCancel = () => {
        setvisible(false)
    };

    const renderRateButton = (value) => {
        if (value.status_id === packageStatus.done) {
            if (value.package_rating_id) {
                return (
                    <Button onClick={() => openRateModal(value)}
                        style={{ marginRight: '5px' }} size="large">
                        Xem đánh giá
                    </Button>
                )
            }
            else {
                return (
                    <Button type="primary" onClick={() => openRateModal(value)}
                        style={{ marginRight: '5px' }} size="large">Đánh giá</Button>
                )
            }
        }
    }

    const toPackageDetail = (id) => {
        if (id) {
            props.history.push(`/package/${id}`)
        }
    }

    const renderCustomerPackage = userPackage?.map((value, index) => {
        return (
            <div className="customer-package">
                <div className="hhs-border-delivery "></div>
                <div className="customer-package-item">
                    <div className="customer-package-item-doctor">
                        <Avatar shape="square" size={80} icon={<UserOutlined />} />
                        {
                            value?.doctor_name ? (
                                <div className="doctor-info">
                                    Bác sĩ <Link to={`/doctor/${value?.doctor_id}`}>{value?.doctor_name}</Link>
                                    <br />
                                    Địa chỉ : {value?.doctor_address}
                                    <br />Số điện thoại: {value?.doctor_phone}
                                </div>
                            ) : <div className="doctor-info"> Chưa có bác sĩ nhận</div>
                        }
                    </div>
                    <div>
                        Ngày tạo {moment(value?.created_at).format('DD-MM-YYYY')}
                        <span className="customer-package-item-status">{value?.status_name}</span>
                    </div>
                </div>
                <div className="customer-package-item">
                    <div>
                        <h2>Địa chỉ đặt khám , chăm sóc sức khỏe</h2>
                    Khám cho {value?.patient_type === 'INDEPENDENT' ? 'Tôi' : value?.patient_type}
                        <span className="package-highlight"> {value?.patient_name}</span>
                        <div className="small-text">
                            <br />
                            {value?.reason}
                            <br /><br />
                            {value?.phone}
                            <br /><br />
                            {value?.address}
                        </div>
                    </div>
                </div>
                <div className="customer-package-item">
                    <div>
                        {renderRateButton(value)}
                        <Button onClick={() => toPackageDetail(value?.package_id)} size="large">Xem chi tiết</Button>
                    </div>
                </div>
                <div className="hhs-border-delivery "></div>
            </div>
        )
    })

    return (
        <div>
            {renderCustomerPackage}
            {_.isEmpty(userPackage) && <div>

                <br />
                Không có gói nào
                </div>}
            <Modal
                visible={visible}
                title={"Đánh giá " + currentPacakge?.doctor_name}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Quay lại
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        Xác nhận
                    </Button>,
                ]}
            >
                <span>
                    <Rate tooltips={desc} autoAdjustOverflow={true} onHoverChange={handleHoverChange} onChange={handleChange} value={rateValue} />
                    {rateValue ? <span className="ant-rate-text">{desc[rateValue - 1]}</span> : ''}
                    <br /><br />
                    <h3>Ghi chú</h3>
                    <TextArea onChange = {onNoteChange} value={note} rows={4} />
                </span>
            </Modal>
        </div>
    );
};

export default withRouter(CustomerPackage);