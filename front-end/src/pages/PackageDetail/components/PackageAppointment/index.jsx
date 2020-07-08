import React from 'react';
import "./style.css"
import { Spin, Table, Tag, Row, Col } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Appointment from './Appointment.jsx';
import Mycalendar from './Calendar';
import { useEffect } from 'react';
import { getPackageServices, getPackageAppointments } from '../../../../redux/package';


const PackageAppointment = (props) => {

    const { isLoad } = useSelector(state => state.ui);
    const dispatch = useDispatch();

    useEffect(() => {

        Promise.all([
            dispatch(getPackageAppointments(props.id)),
            dispatch(getPackageServices(props.id)),
        ])


    }, [props.id]);


    return (
        <Spin size="large" spinning={isLoad}  >
            <div className="package-appointment">
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={8} lg={7}>
                        <Appointment id={props.id} />
                    </Col>
                    <Col xs={24} md={16} lg={17}>
                        <Mycalendar id={props.id}  />
                    </Col>
                </Row>
            </div>
        </Spin>
    );
};

export default PackageAppointment;