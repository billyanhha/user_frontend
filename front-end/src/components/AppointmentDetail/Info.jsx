import React, { useEffect, useState } from 'react';
import moment from "moment"
import priorityData from "../../configs/prioritiy"
import { Select, Tag, Input, InputNumber, Button, Form } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import _ from "lodash"
import slot from "../../configs/slot"
// import { updateAppointmentPackage } from '../../redux/package';
import { withRouter } from 'react-router-dom';

const Info = (props) => {

    const [form] = Form.useForm();
    const layout = {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
    };

    const { currentAppointment } = props;

    const { appointment_service } = props?.currentAppointment

    const getCurrentService = !_.isEmpty(appointment_service) ? appointment_service.map((value, index) => {
        return (
            value.id
        )
    }) : []

    const dispatch = useDispatch()
    const { packageData } = useSelector(state => state.package)
    const doctor = useSelector(state => state.doctor);
    const { token } = useSelector(state => state.auth)
    const { isLoad } = useSelector(state => state.ui)
    const [services, setservices] = useState([]);
    const [disable, setdisable] = useState(false);

    useEffect(() => {

        setservices(getCurrentService)
        form.resetFields()

    }, [currentAppointment]);

    const renderServices = packageData?.services?.map((value, index) => {
        return (
            <Select.Option key={value?.id}>
                <Tag
                    className="service-tag"
                    color={priorityData[`${value?.priority}`].color}>{value?.name}</Tag>
                <br />
            </Select.Option>
        )
    })

    const handleChange = (value) => {
        setservices(value)
    }

    const submitForm = values => {

    };

    const onFinishFailed = errorInfo => {
        // console.log('Failed:', errorInfo);
    };


    return (
        <div>
            <h2 className="label-info">- Các dịch vụ</h2>
            <Select
                mode="multiple"
                disabled={props.checkIfAppointmentNotExpire}
                style={{ width: '100%' }}
                placeholder="Chọn dịch vụ"
                value={services}
                onChange={handleChange}
            >
                {renderServices}
            </Select>
            <h2 className="label-info">- Ghi chú</h2>
            <div>
                {currentAppointment?.note || 'Không có dữ liệu'}
            </div>
            <h2 className="label-info">- Các số liệu</h2>

            <Form
                {...layout}
                name="basic"
                form={form}
                initialValues={currentAppointment}
                onFinish={submitForm}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label={'Huyết áp tâm trương : ' + (currentAppointment?.diastolic ? currentAppointment?.diastolic  + ' mmHg' : 'Chưa có dữ liệu')}
                    name='diastolic'
                    rules={[{ type: 'number', message: 'Điền số' }]}
                >
                </Form.Item>
                <Form.Item
                    label={'Huyết áp tâm trương : ' + (currentAppointment?.systolic? currentAppointment?.systolic + ' mmHg' : 'Chưa có dữ liệu')}
                    name='systolic'
                    rules={[{ type: 'number', message: 'Điền số' }]}
                >
                </Form.Item>
                <Form.Item
                    label={'Mạch : ' + (currentAppointment?.pulse? currentAppointment?.pulse + ' nhịp/phút ' : 'Chưa có dữ liệu')}
                    name='pulse'
                    rules={[{ type: 'number', message: 'Điền số' }]}
                >
                </Form.Item>
                <Form.Item
                    label={'Nhiệt độ : ' + (currentAppointment?.temperature? currentAppointment?.temperature + ' °C' : 'Chưa có dữ liệu')}
                    name='temperature'
                    rules={[{ type: 'number', message: 'Điền số' }]}
                >
                </Form.Item>
            </Form>
        </div>
    );
};

export default withRouter(Info);