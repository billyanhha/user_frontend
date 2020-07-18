import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, withRouter } from "react-router-dom"
import moment from 'moment'
import _ from "lodash"
import packageStatus from "../../configs/package_status"

import { Avatar, Modal, Rate, Input } from 'antd';
import { MobileTwoTone } from '@ant-design/icons';
import DefaultAvatar from '../../assest/image/hhs-default_avatar.jpg';

import './style.css'

const desc = ['Rất kém', 'Kém', 'Trung Bình', 'Tốt', 'Rất Tốt'];

const { TextArea } = Input;

const CustomerPackage = (props) => {

    const { userPackage } = useSelector(state => state.userPackage);

    const toPackageDetail = (id) => {
        if (id) {
            window.scroll(0, 0);
            props.history.push(`/package/${id}`)
        }
    }

    const renderCustomerPackage = userPackage?.map(value => {
        return (
            <div key={value?.package_id} className="cp-each-package">
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
                    <div className="cp-package-info-status">Tình trạng: <span className={value?.status_name.includes('từ chối') || value?.status_name.includes('đã hủy') ? 'reject-color' : 'primary-color'}>{value?.status_name}</span></div>
                    {value.status_id === packageStatus.done
                        ? <div>
                            Đánh giá gói: {value?.star && value?.star > 0 ? <Rate tooltips={desc} autoAdjustOverflow={true} value={value?.star} /> : 'Chưa đánh giá'}
                        </div>
                        : ''
                    }
                </div>

                <div className="cp-indentify cp-package-info">
                    <div className="create-date">
                        Ngày tạo gói: {moment(value?.created_at).format('DD/MM/YYYY')}
                    </div>
                    <div className="cp-package-show-more" onClick={() => toPackageDetail(value?.package_id)}>Xem chi tiết</div>
                </div>

                {value?.doctor_name
                    ?
                    <div className="cp-indentify cp-indentify-doctor">
                        {/* <div className="cp-indentify-title cp-describe">Người điều dưỡng</div> */}
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
                    <div className="cp-indentify cp-indentify-doctor">Chưa có bác sĩ</div>
                }
            </div>
        )
    });

    return (
        <div>
            <div className="customer-package">
                {renderCustomerPackage}
            </div>
            {_.isEmpty(userPackage) &&
                <div className="package-bad-customer primary-color">Hiện tại không có gói nào</div>
            }
        </div>
    );
};

export default withRouter(CustomerPackage);