import React from 'react';
import { Tabs, Button, Descriptions, PageHeader, Popconfirm, message, Tag } from 'antd';
import './style.css';
import Info from './Info';
import { useEffect } from 'react';
import moment from "moment";
import slot from "../../configs/slot"
import appointment_status from "../../configs/appointment_status"
import package_appointment_status from "../../configs/package_appointment_status"
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { updateAppointmentPackage } from '../../redux/package';
import EditAppointment from './EditAppointment';

const { TabPane } = Tabs;

const AppointmentDetail = (props) => {

    const { currentAppointment } = props;

    const dispatch = useDispatch()
    const { packageInfo } = useSelector(state => state.package);
    const doctor = useSelector(state => state.doctor);
    const {token} = useSelector(state => state.auth);

    useEffect(() => {


    }, [currentAppointment]);

    const callback = (key) => {
    }

    const confirm = (value) => {
        
        let data = {}
        data.appointment_status_id = value
        data.token = token;
        let patientId = packageInfo.patient_id
        let appointmentId = currentAppointment.id
        let packageId = props.match.params.id
        dispatch(updateAppointmentPackage(data, appointmentId, patientId, packageId))
        props.close()
    }
    
    const cancel = (e) => {
    }

    const checkIfAppointmentNotExpire = () => { // doctor cancle , user cancle , done
        return (currentAppointment.status_id === appointment_status.pending)
            ||
            (currentAppointment.status_id === appointment_status.dueDate)
    }



    return (
        <div>
            <PageHeader
                className="site-page-header-responsive"
                title={`Cuộc hẹn vào ${moment(currentAppointment?.date).format("DD - MM - YYYY")} `}
                subTitle={`Slot : ${currentAppointment?.slot_id} từ ( ${slot?.[`${currentAppointment?.slot_id}`]?.from} - ${slot?.[`${currentAppointment?.slot_id}`]?.to}  ) `}
                extra={
                    checkIfAppointmentNotExpire() &&
                    [
                        
                        <Popconfirm
                            title="Xác nhận hủy cuộc hẹn"
                            onConfirm={(e) => confirm(appointment_status.customerCancel)}
                            placement="bottom"
                            onCancel={cancel}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <Button type="danger" key="2">Hủy</Button>
                        </Popconfirm>
                        ,
                    ]}
                footer={
                    <Tabs defaultActiveKey="1" onChange={callback}>
                        <TabPane tab="Thông tin cuộc hẹn" key="1">
                            <Info checkIfAppointmentNotExpire={checkIfAppointmentNotExpire}
                                close={() => props.close()} currentAppointment={currentAppointment} />
                        </TabPane>
                        <TabPane tab="Ghi chú kết quả" key="2">
                            <div dangerouslySetInnerHTML = {{__html: currentAppointment?.result_content}}></div>
                        </TabPane>
                        <TabPane tab="Sửa thông tin cơ bản" key="3">
                            <EditAppointment close={() => props.close()} currentAppointment={currentAppointment} />
                        </TabPane>
                    </Tabs>
                }
            >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="Thuộc gói">
                        <Link target="_blank" to={"/package/" + currentAppointment?.package_id} className="hightlight">{currentAppointment?.package_id}</Link>
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        <div>
                            <Tag color={package_appointment_status?.[`${currentAppointment?.status_id}`]?.color} > {currentAppointment?.status_name} </Tag>
                        </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ cuộc hẹn">
                        <p className="hightlight">{currentAppointment?.address}</p>
                    </Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">
                        <p className="hightlight">{currentAppointment?.phone}</p>
                    </Descriptions.Item>
                </Descriptions>
            </PageHeader>
        </div>
    );
};

export default withRouter(AppointmentDetail);
