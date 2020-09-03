import React, { useEffect } from 'react';
import "./style.css"
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Row, Col, Tooltip, Rate, message } from 'antd';
import clock from "../../assest/image/clock.png";
import timeLine from "../../assest/image/time-line.png";
import call from "../../assest/image/call.png";
import arrow from "../../assest/image/arrow.png";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from '../../redux/service';
import { getDoctorForHome } from '../../redux/doctor';
import { Link } from 'react-router-dom';
import { isEmpty } from 'lodash';


const Home = (props) => {

    const dispatch = useDispatch();
    const service = useSelector(state => state.service);
    const { currentUser } = useSelector(state => state.user);
    const doctor = useSelector(state => state.doctor);
    const { isLoad } = useSelector(state => state.ui);


    useEffect(() => {

        window.scrollTo(0, 0) // make sure div in top


        dispatch(getAllCategories({itemsPage:3, active: true}))
        dispatch(getDoctorForHome())
    }, []);

    const toServicePage = () => {
        props.history.push('/service');
    }

    const toDoctorPage = () => {
        props.history.push('/doctors');
    }

    const renderService = service?.categories?.map((value, index) => (
        <div className="home-list-item service-list" key={value?.id}>
            <div style = {{backgroundImage: `url(${value?.image})`}} className = "service-list-image"></div>
            <div className="home-list-item-name">
                {value?.name}
                <div className="home-list-item-description service_descripton">
                    {value?.description}
                </div>
            </div>

        </div>
    ));

    const renderDoctor = doctor?.homeDoctor?.map((value, index) => {
        return (
            // sau nay se fix thank doctor profile
            <Tooltip title="Click để xem chi tiết" placement="right" color={'#00BC9A'} key={value.id}>
                <Link to={"/doctor/" + value.id}>
                    <div className="home-list-item">
                        <div className="home-list-item-image" style={{
                            backgroundImage:
                                `url(${value?.avatarurl || 'https://hhs.s3-ap-southeast-1.amazonaws.com/doctor-character-background_1270-84.jpg'})`
                        }}>

                        </div>
                        <div className="home-list-item-name">
                            {value?.fullname}
                        </div>
                        <center>
                            <Rate  disabled value={value?.average_rating} />
                        </center>
                    </div>
                </Link>
            </Tooltip>
        )
    })

    const toBooking = () => {
        if(!isEmpty(currentUser)) {
            if (currentUser?.active === true) {
                props.history.push("/booking");
            } else {
                message.destroy();
                message.info("Tài khoản của bạn chưa được phê duyệt! Xin hãy kiên nhẫn hoặc liên hệ với chúng tôi để được giải đáp thêm.", 5);
            }
        } else {
            message.destroy();
            message.info("Xin hãy đăng nhập để đặt lịch.", 3);
            props.history.push("/booking");
        }   
    }


    return (
        <div className="default-div home-background">
            <Navbar />
            <div className="home">
                <div className="home-contain home-main-about">
                    <div className="home-content">
                        <div className="home-title">
                            Bạn Thấy Không Khỏe?
                            Hãy Để IKEMEN Chăm Sóc Bạn!
                        </div>
                        <div className="seperator" />
                        <div className="home-introduction">
                            Mang trải nghiệm thăm khám đa khoa hiện đại đến ngay trong ngôi nhà bạn. Từ cảm mạo thông thường đến các bệnh mãn tính - các bác sĩ ikemen thân thiện sẽ tận tình chăm sóc bạn & gia đình.                        </div>
                        <div className="home-button">
                            <button className="link-button" onClick = {toBooking}>
                                Đặt lịch ngay
                            </button>
                        </div>
                    </div>
                </div>
                <div className="home-process">
                    <div className="home-process-title">
                        Quy trình hoạt động
                    </div>
                    <div className="home-process-content">
                        <Row gutter={[50, 12]} justify="center" align="top">
                            <Col xs={24} md={8}>
                                <div className="home-process-item">
                                    <img src={clock} />
                                    <h2 className="overview-heading">Đăng kí nhanh chóng</h2>
                                    <p>
                                        Tìm hiểu dịch vụ, thông tin bác sĩ, đặt lịch, hệ thống sẽ lo những công việc còn lại
                                  </p>
                                    <img className="process-arrow" src={arrow} />

                                </div>
                            </Col>
                            <Col xs={24} md={8}>
                                <div className="home-process-item">
                                    <img src={call} />
                                    <h2 className="overview-heading">Hệ thống tiếp nhận</h2>
                                    <p>
                                        Hệ thống ghi nhận yêu cầu của bạn rồi gửi đến đội ngũ bác sĩ
                                    </p>
                                    <img className="process-arrow" src={arrow} />
                                </div>
                            </Col>
                            <Col xs={24} md={8} >
                                <div className="home-process-item">
                                    <img src={timeLine} />
                                    <h2 className="overview-heading">Bác sĩ triển khai dịch vụ</h2>
                                    <p>
                                        Bác sĩ nhận yêu cầu, khám lâm sàng, đưa ra lộ trình dịch vụ
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className="home-contain">
                    <div className="home-title home-content-reverse">
                        Chăm sóc sức khỏe của bạn tại nhà
                        </div>
                    <div className="home-content-reverse">
                        <div className="seperator " />
                    </div>
                    <div className="home-list">
                        {renderService}
                    </div>
                    <center>
                        <button onClick={toServicePage} className="link-button">
                            Các danh mục điều dưỡng
                            </button>
                    </center>
                </div>
                <div className="home-contain">
                    <div className="home-title">
                        Đội ngũ bác sĩ tận tâm
                    </div>
                    <div className="seperator " />
                    <div className="home-list">
                        {renderDoctor}
                    </div>
                    <center>
                        <button onClick={toDoctorPage} className="link-button">
                            Đội ngũ bác sĩ
                        </button>
                    </center>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;