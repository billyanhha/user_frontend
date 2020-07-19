import React, { useEffect, useState } from 'react';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

import detailCertificate from "../../assest/image/Doctor_detail_certificate.png";
import detailLanguages from "../../assest/image/Doctor_detail_Languages.png";
import detailLicense from "../../assest/image/Doctor_detail_license.png";

import "./style.css"
import { Timeline, Rate, Pagination, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctorDetail } from '../../redux/doctor';
import { saveBookingDoctor } from '../../redux/booking';

const DetailDoctor = (props) => {

    const dispatch = useDispatch();
    const { isLoad } = useSelector(state => state.ui);
    const { doctorDetail } = useSelector(state => state.doctor);
    const [currentPage, setcurrentPage] = useState(1);
    const doctorId = props.match.params.id;


    useEffect(() => {

        window.scrollTo(0, 0) // make sure div in top
        let data = {}
        data.doctorId = doctorId;
        data.pageRatingNum = currentPage
        dispatch(getDoctorDetail(data))

    }, []);

    const onPageNumberChange = (pageNum) => {
        let data = {}
        data.pageRatingNum = pageNum
        data.doctorId = doctorId;
        setcurrentPage(pageNum)
        dispatch(getDoctorDetail(data))
    }


    const renderExperience = doctorDetail?.doctorExperience?.map((value, index) => {
        return (
            <Timeline.Item key={value.id}>{value?.content}</Timeline.Item>
        )
    })

    const renderRating = doctorDetail?.ratings?.map((value, index) => {
        return (
            <div className="doctor_rating_item" key={value.id}>
                <h3>{value?.patient_name}</h3>
                <Rate className="doctor-rate" disabled value={value?.star} />
                <h4><i>{value?.comment}</i></h4>
            </div>
        )
    });

    const renderLanguages = doctorDetail?.doctorLanguage?.map((value, index) => {
        if (index === 0) {
            return (
                <span className="doctor-detail-info">
                    {value?.language_name}
                </span>
            )
        }
        else return (
            <span>
                <span className="primary-dot">-</span>
                <span className="doctor-detail-info">
                    {value?.language_name}
                </span>
            </span>
        )
    });

    const renderDegree = doctorDetail?.doctorDegrees?.map((value, index) => {
        if (index === 0) {
            return (
                <span className="doctor-detail-info">
                    {value.degree_name}
                </span>
            )
        }
        else return (
            <span>
                <span className="primary-dot">-</span>
                <span className="doctor-detail-info">
                    {value.degree_name}
                </span>
            </span>
        )
    });

    const toBooking = () => {
        dispatch(saveBookingDoctor(doctorDetail?.doctor));
        props.history.push("/booking");

    }


    return (
        <div className="default-div">
            <Navbar />
            <Spin spinning={isLoad}>
                <div className="doctor">
                    <div className="detail-contain detail-main-about">
                        <div className="doctor-avatar"
                            style={{ backgroundImage: `url(${doctorDetail?.doctor?.avatarurl})` }}
                        >
                        </div>
                        <div className="detail-content">
                            <div className="detail-title">
                                BS. {doctorDetail?.doctor?.fullname} <br />
                                {doctorDetail?.doctor?.average_rating == 0
                                    ? <span className="rate-average">Chưa có đánh giá</span>
                                    : <>
                                        <Rate className="doctor-rate" disabled value={doctorDetail?.doctor?.average_rating} />
                                        <span className="rate-average"> ­ {doctorDetail?.doctor?.average_rating} / 5</span>
                                    </>
                                }
                            </div>
                            <div className="seperator" />
                            <div className="home-introduction">
                                Mang trải nghiệm thăm khám đa khoa hiện đại đến ngay trong ngôi nhà bạn. Từ cảm mạo thông thường đến các bệnh mãn tính - các bác sĩ ikemen thân thiện sẽ tận tình chăm sóc bạn & gia đình.                        </div>
                            <div className="detail-button">
                                <button className="link-button" onClick={toBooking}>
                                    Đặt lịch ngay
                            </button>
                            </div>
                        </div>
                    </div>
                    <div className="detail-contain doctor-infor-div">
                        <div className="detail-title">
                            Thông tin
                    </div>
                        <div className="seperator" />
                        <div className="detail-list">
                            {/* <div className="detail-list-item">
                            <div className="detail-list-item-top">
                                <img src={detailSpecialties} />
                            </div>
                            <div className="detail-list-describe">Chuyên môn</div>
                            <div className="detail-list-description">
                                {doctor.detailInfo.specializes}
                            </div>
                        </div> */}
                            <div className="detail-list-item">
                                <div className="detail-list-item-top">
                                    <img alt="language" src={detailLanguages}
                                    />
                                </div>
                                <div className="detail-list-describe">Giao tiếp</div>
                                <div className="detail-list-description">
                                    {renderLanguages}
                                </div>
                            </div>
                            <div className="detail-list-item">
                                <div className="detail-list-item-top">
                                    <img alt="certificate" src={detailCertificate} />
                                </div>
                                <div className="detail-list-describe">Học vấn</div>
                                <div className="detail-list-description">
                                    {renderDegree}
                                </div>
                            </div>
                            <div className="detail-list-item">
                                <div className="detail-list-item-top">
                                    <img alt="license" src={detailLicense} />
                                </div>
                                <div className="detail-list-describe">Chứng chỉ hành nghề</div>
                                <div className="detail-list-description doctor-detail-info">
                                    {doctorDetail?.doctor?.license}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="detail-contain">
                        <div className="detail-title">
                            Kinh nghiệm
                    </div>
                        <div className="seperator" />

                        <div className="doctor-experiece">
                            <Timeline>
                                {renderExperience}
                            </Timeline>
                        </div>
                    </div>
                    <div className="detail-contain doctor-infor-div">
                        <div className="detail-title">
                            Đánh giá
                    </div>
                        <div className="seperator" />
                        <br />
                        <h3>Bác sĩ có <span className="highlight">{doctorDetail?.ratings?.length} </span> đánh giá</h3>
                        <div className="doctor-experiece">
                            {renderRating}
                            <br />
                            {
                                doctorDetail?.ratings?.length ?
                                    <Pagination
                                        onChange={onPageNumberChange}
                                        current={currentPage}
                                        pageSize={3}
                                        total={doctorDetail?.ratings?.[0]?.full_count} showSizeChanger={false} /> : ''
                            }

                        </div>
                    </div>
                </div>
            </Spin>
            <Footer />
        </div>
    )
}

export default DetailDoctor;
