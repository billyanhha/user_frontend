import React from 'react';
import './style.css';
import { Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import logo from '../../assest/logo/IkemenHHS_w.png';

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer-logo"><img alt='logo' src={logo} /></div>
            <Row gutter={[3, 12]} >
                <Col xs={24} sm={12} md={12}>
                    <p><b>Điện thoại</b> 123456789</p>
                    <p><b>Hotline </b> 987654321</p>
                    <p><b>Hỗ trợ </b> support@ikemen.com</p>
                    <p>Copyright © 2020 IKEMEN</p>
                </Col>
                <Col xs={24} sm={12} md={4}>
                    <p><b>Dịch vụ</b></p>
                    <p><Link className="footer-link">Đặt lịch dịch vụ</Link></p>
                    <p><Link className="footer-link">Nhận xét của khách hàng</Link></p>
                </Col>
                <Col xs={24} sm={12} md={4} >
                    <p><b>Tìm hiểu thêm</b></p>
                    <p><Link className="footer-link">Đội ngũ bác sĩ</Link></p>
                    <p><Link className="footer-link">Chi tiết quy trình</Link></p>
                    <p><Link className="footer-link">Tuyển dụng</Link></p>
                </Col>
                <Col xs={24} sm={12} md={4} >
                    <p><b>Hỗ trợ khách hàng</b></p>
                    <p><Link className="footer-link">Câu hỏi thường gặp</Link></p>
                    <p><Link className="footer-link">Chính sách bảo mật</Link></p>
                    <p> <Link className="footer-link">Điều khoản</Link></p>
                    <p><Link className="footer-link">Liên hệ</Link></p>
                    <p> <Link className="footer-link">Chính sách giải quyết khiếu nại</Link></p>
                </Col>
            </Row>
        </div>
    );
};

export default Footer;