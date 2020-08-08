import React, { useEffect, useState } from 'react';
import './style.css'
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPackageInfo, getPackageStatus, getPackageServices, changePackageStatus, ratingDoctor, updateRatingDoctor } from '../../redux/package';
import { PageHeader, Button, Descriptions, Tag, Tabs, Spin, Avatar, Popconfirm, Input, Modal, Rate } from 'antd';
import packageStatus from "../../configs/packageStatus"
import _ from "lodash"
import { UserOutlined } from '@ant-design/icons';
import moment from "moment"
import priorityData from "../../configs/prioritiy";
import package_status from "../../configs/package_status";
import PackageAppointment from './components/PackageAppointment';
import PackageHistory from './components/PackageHistory';
import EditPackage from './components/EditPackage';
import ChartForPackage from '../PackageDetail/components/ChartForPackage';

// const desc = ['Rất kém', 'Kém', 'Trung Bình', 'Tốt', 'Rất Tốt'];
// const desc = ['Tệ', '','Không Hài Lòng', 'Cần Cải Thiện', 'Bình thường', 'Hài Lòng', 'Rất Hài Lòng', 'Tuyệt vời', 'Hoàn Hảo'];
const desc = ['Tệ', 'Không Hài Lòng', 'Cần Cải Thiện', 'Hài Lòng', 'Tuyệt Vời'];

const { TextArea } = Input;

const { TabPane } = Tabs;

const PackageDetail = (props) => {

    const dispatch = useDispatch();
    const { isLoad } = useSelector(state => state.ui);
    const { packageInfo, packageData } = useSelector(state => state.package);
    const [service, setservice] = useState(null);
    const [visible, setvisible] = useState(false);
    const [rateVisible, setRateVisible] = useState(false);
    const [rateValue, setrateValue] = useState(0);
    const [rateDefault, setRateDefault] = useState(0);
    const [note, setnote] = useState('');
    const [rateNote, setRateNote] = useState('');
    const [currentPacakge, setcurrentPacakge] = useState({});

    const id = props.match.params.id

    const handleChangeRate = value => {
        setrateValue(value)
    };

    const onNoteChange = (e) => {
        setRateNote(e.target.value)
    }

    const openRateModal = (value) => {
        setRateVisible(true)
        setrateValue(value?.star ?? 3)
        setRateNote(value?.comment ?? '')
        setcurrentPacakge(value)
    }

    const handleOk = () => {
        let data = {};

        data.star = rateValue;
        data.comment = rateNote;

        data.packageId = currentPacakge?.id;
        data.customer_id = currentPacakge?.customer_id;
        // data.customer_id = currentUser?.customer_id;

        if (currentPacakge?.package_rating_id) { // edit
            data.package_rating_id = currentPacakge?.package_rating_id;
            dispatch(updateRatingDoctor(data))
        } else { //add
            dispatch(ratingDoctor(data))
        }
    };

    const handleRateModalCancel = () => {
        setRateVisible(false)
    };

    const renderRateButton = (value) => {
        // if (packageData?.status[packageData?.status.length - 1]?.package_status_detail_id === package_status.done) {
            if (value.package_rating_id) {
                return (
                    <Button onClick={() => openRateModal(value)} style={{ marginLeft: '10px' }} size="small">
                        Xem đánh giá
                    </Button>
                )
            }
            else {
                return (
                    <Button type="primary" onClick={() => openRateModal(value)} style={{ marginLeft: '10px' }} size="small">
                        Thêm đánh giá
                    </Button>
                )
            }
        // }
    }

    const backToPreviousPage = () => {
        props.history.push("/profile")
    }

    const checkStatusPackage = () => {
        return (
            packageData?.status[packageData?.status.length - 1]?.package_status_detail_id === package_status.waiting
        ) ||
            (
                packageData?.status[packageData?.status.length - 1]?.package_status_detail_id === package_status.running
            )
    }

    const renderData = service && (
        <div className={"package-service-description"}
            style={{ borderLeft: `10px solid ${priorityData?.[`${service?.priority}`].color}` }}
        >

            <p style={{ color: `${priorityData?.[`${service?.priority}`].color}` }}> {service?.name} </p>
                    Mức độ ưu tiên  <span style={{ color: `${priorityData?.[`${service?.priority}`].color}` }}>
                - {service?.priority} ({priorityData?.[`${service?.priority}`].class})
                    </span>
            <br />
            <div className="package-service-description-note">
                * Chú thích :  {service?.description}
            </div>
        </div>
    )

    const showModal = (value) => {
        setvisible(true)
        let newValue = {
            package_service_id: value?.id,
            package_id: value?.package_id,
            id: value?.service_id,
            priority: value?.priority,
            description: value?.description,
            active: value?.active,
            name: value?.name
        }
        setservice(newValue)
    }

    const handleCancel = () => {
        setvisible(false)
    }

    const renderServices = packageData?.services.length !== 0 ? packageData?.services.map((value, index) => {
        return (
            <Tag
                onClick={() => showModal(value)}
                className="service-tag"
                color={priorityData[`${value?.priority}`].color}>{value?.name}</Tag>
        )
    }) : 'Hiện chưa có dịch vụ nào'

    const onChange = (e) => {
        setnote(e.target.value)
    }

    const confirm = (value) => {
        const data = {};
        data.note = note;
        data.packageId = id;
        data.statusId = value;
        dispatch(changePackageStatus(data))
    }

    useEffect(() => {
        if (packageInfo?.star)
            setRateDefault(packageInfo?.star)
    }, [packageInfo]);

    useEffect(() => {

        dispatch(getPackageInfo(id))
        dispatch(getPackageStatus(id))
        dispatch(getPackageServices(id))

    }, []);

    return (
        <div className=" default-div">
            <Modal
                visible={visible}
                onCancel={handleCancel}
                footer={[
                    <Button onClick={handleCancel}>Hủy</Button>
                ]}
            >
                {renderData}
            </Modal>

            <Modal
                visible={rateVisible}
                title={"Đánh giá chất lượng gói dịch vụ BS." + currentPacakge?.doctor_name}
                onOk={handleOk}
                onCancel={handleRateModalCancel}
                footer={[
                    <Button key="back" onClick={handleRateModalCancel}>
                        Quay lại
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        Xác nhận
                    </Button>,
                ]}
            >
                <span>
                    <Rate tooltips={desc} autoAdjustOverflow={true} onChange={handleChangeRate} value={rateValue} />
                    {rateValue ? <span className="ant-rate-text">{desc[rateValue - 1]}</span> : ''}
                    <br /><br />
                    <h3>Ghi chú</h3>
                    <TextArea onChange={onNoteChange} value={rateNote} rows={4} />
                </span>
            </Modal>

            <div className="site-page-header-ghost-wrapper">
                <Spin size="large" spinning={isLoad}>
                    <PageHeader
                        ghost={false}
                        tags={<Tag color="blue">{!_.isEmpty(packageData?.status) ? packageData?.status[packageData.status.length - 1]?.status_name : ''}</Tag>}
                        onBack={backToPreviousPage}
                        title="Thông tin gói"
                        subTitle={id}
                        extra={[

                            checkStatusPackage()

                            &&
                            <Popconfirm
                                title={<Input
                                    onChange={onChange}
                                    placeholder="Ghi chú hủy" />}
                                onConfirm={(e) => confirm(package_status.customerCancel)}
                                placement="bottom"
                                // onCancel={cancel}
                                okText="Xác nhận"
                                cancelText="Hủy"
                            >
                                <Button type="danger" key="2">Hủy</Button>
                            </Popconfirm>
                        ]}
                        footer={
                            <Tabs defaultActiveKey="1">
                                <TabPane tab="Lịch hẹn" key="1" href="#package-appointment">
                                    <PackageAppointment id={id} />
                                </TabPane>
                                <TabPane tab="Lịch sử" key="2" >
                                    <PackageHistory id={id} />
                                </TabPane>
                                <TabPane tab="Ghi chú" key="3" >
                                    <div dangerouslySetInnerHTML={{ __html: packageInfo?.plan_overview ?? '<p>Không có dữ liệu</p>' }}></div>
                                </TabPane>
                                <TabPane tab="Kết quả" key="4" >
                                    <div dangerouslySetInnerHTML={{ __html: packageInfo?.result_content ?? '<p>Không có dữ liệu</p>' }}></div>
                                </TabPane>
                                <TabPane tab="Sửa thông tin cơ bản" key="5" >
                                    <EditPackage infos={packageInfo} />
                                </TabPane>
                                <TabPane tab="Biểu đồ sức khoẻ" key="6" >
                                    <ChartForPackage id={id} />
                                </TabPane>
                            </Tabs>
                        }
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="Khám cho">
                                <a target="_blank"
                                // href={`/doctor/${packageInfo?.doctor_id}`} // to patient
                                >
                                    {packageInfo?.patient_name}</a>
                            </Descriptions.Item>
                            <Descriptions.Item label="Bác sĩ">
                                <a target="_blank" href={packageInfo?.doctor_id && `/doctor/${packageInfo?.doctor_id}`}>
                                    <Avatar shape="square" size={50} icon={<UserOutlined />}
                                        src={packageInfo?.doctor_avatar} />
                                    {packageInfo?.doctor_name ?? 'Chưa có bác sĩ nào chọn gói'}</a>
                            </Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">
                                {packageInfo.phone}
                            </Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ">{packageInfo?.address}</Descriptions.Item>
                            <Descriptions.Item label="Ngày tạo">
                                {moment(packageInfo?.created_at).format('DD/MM/YYYY')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Lý do">
                                {packageInfo?.reason}
                            </Descriptions.Item>
                            {packageData?.status[packageData?.status.length - 1]?.package_status_detail_id === package_status.done
                            || packageData?.status[packageData?.status.length - 1]?.package_status_detail_id === package_status.customerCancel
                            || packageData?.status[packageData?.status.length - 1]?.package_status_detail_id === package_status.systemCancel
                            || packageData?.status[packageData?.status.length - 1]?.package_status_detail_id === package_status.doctorCancel
                                ? <Descriptions.Item label="Đánh giá">
                                    {packageInfo?.package_rating_id
                                        ? <Rate tooltips={desc} disabled autoAdjustOverflow={true} value={rateDefault} />
                                        : <>Chưa có đánh giá </>
                                    }
                                    {renderRateButton(packageInfo)}
                                </Descriptions.Item>
                                :''
                            }
                            <Descriptions.Item label="Dịch vụ sử dụng">
                                {renderServices}
                            </Descriptions.Item>
                        </Descriptions>
                    </PageHeader>
                </Spin>
            </div>
            <div></div>
        </div>
    );
};

export default withRouter(PackageDetail);