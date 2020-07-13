import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, withRouter } from "react-router-dom"
import moment from 'moment'
import _ from "lodash"
import packageStatus from "../../configs/package_status"
import { ratingDoctor, updateRatingDoctor } from '../../redux/package';

import { Avatar, Modal, Rate, Input } from 'antd';
import { MobileTwoTone } from '@ant-design/icons';
import DefaultAvatar from '../../assest/image/hhs-default_avatar.jpg';

import './style.css'

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
        data.customer_id = currentUser?.customer_id;

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
                    <button onClick={() => openRateModal(value)}
                        style={{ marginRight: '5px' }} size="large">
                        Xem đánh giá
                    </button>
                )
            }
            else {
                return (
                    <button type="primary" onClick={() => openRateModal(value)}
                        style={{ marginRight: '5px' }} size="large">Đánh giá</button>
                )
            }
        }
    }

    const toPackageDetail = (id) => {
        if (id) {
            window.scroll(0, 0);
            props.history.push(`/package/${id}`)
        }
    }

    const renderCustomerPackage = userPackage?.map(value => {
        return (
            <div key={value?.package_id} className="cp-each-package">
                {console.log(value)}
                {/* <div className="cp-each-package-detail"> */}
                <div className="cp-info cp-indentify-patient">
                    <div>
                        {value?.patient_avatarurl ?
                            <Avatar size={100} style={{ borderRadius: '10px' }} src={value.patient_avatarurl} />
                            :
                            <Avatar size={100} style={{ borderRadius: '10px' }} src={DefaultAvatar} />
                        }
                    </div>
                    <div className="cp-info-content">{value?.patient_name}</div>
                </div>

                <div className="cp-indentify cp-indentify-service">
                    {/* <div className="cp-indentify-title">Thông tin gói</div>
                    <div>Dịch vụ: <span>Chưa lựa chọn dịch vụ</span></div> */}
                    <div>SĐT đăng kí: <span>{value?.phone}</span></div>
                    <div className="cp-package-info-status">Tình trạng: <span className="primary-color">{value?.status_name}</span></div>
                </div>

                <div className="cp-indentify cp-package-info">
                    <div className="create-date">
                        Ngày tạo gói: {moment(value?.created_at).format('DD/MM/YYYY')}
                    </div>
                    <div className="cp-package-show-more" onClick={() => toPackageDetail(value?.package_id)}>Xem chi tiết</div>
                    {renderRateButton(value)}
                </div>

                {value?.doctor_name
                    ?
                    <div className="cp-indentify cp-indentify-doctor">
                        <div className="cp-indentify-title cp-describe">Người điều dưỡng</div>
                        <div className="cp-info">
                            <div>
                                {value?.doctor_avatarurl ?
                                    <Avatar size={60} style={{ borderRadius: '10px' }} src={value.doctor_avatarurl} />
                                    :
                                    <Avatar size={60} style={{ borderRadius: '10px' }} src={DefaultAvatar} />
                                }
                            </div>
                            <div className="cp-info-content">
                                BS.<span><Link to={`/doctor/${value?.doctor_id}`} target='_blank'>{value?.doctor_name}</Link></span>
                                <br />Địa chỉ : <span>{value?.doctor_address}</span>
                                <br /><span className="primary-color"><MobileTwoTone twoToneColor="#47c7be" /> {value?.doctor_phone}</span>
                            </div>
                        </div>
                    </div>
                    :
                    <div>Chưa có</div>
                }
            </div>
        )
    });

    return (
        <div>
            <div className="customer-package">
                {/* <div className="hhs-border-delivery "></div> */}
                {renderCustomerPackage}
            </div>
            {_.isEmpty(userPackage) && <div>
                <br />
                Hiện tại không có gói dịch vụ
                </div>}
            <Modal
                visible={visible}
                title={"Đánh giá " + currentPacakge?.doctor_name}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <button key="back" onClick={handleCancel}>
                        Quay lại
                    </button>,
                    <button key="submit" type="primary" onClick={handleOk}>
                        Xác nhận
                    </button>,
                ]}
            >
                <span>
                    <Rate tooltips={desc} autoAdjustOverflow={true} onHoverChange={handleHoverChange} onChange={handleChange} value={rateValue} />
                    {rateValue ? <span className="ant-rate-text">{desc[rateValue - 1]}</span> : ''}
                    <br /><br />
                    <h3>Ghi chú</h3>
                    <TextArea onChange={onNoteChange} value={note} rows={4} />
                </span>
            </Modal>
        </div>
    );
};

export default withRouter(CustomerPackage);