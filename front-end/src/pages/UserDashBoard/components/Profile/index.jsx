import React, { useState, useEffect, useRef } from 'react';
import { useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller, ErrorMessage } from "react-hook-form";
import { getUserProfile, editUserProfile, editAvatar, resetUploadStatus } from '../../../../redux/user';
import { createDependent, getPackageProgress } from '../../../../redux/patient';
import relationship from '../../../../configs/relationship'
// import { useDropzone } from 'react-dropzone';
// import Dropzone from 'react-dropzone-uploader'
import moment from 'moment';
import AvatarEditor from 'react-avatar-editor';
import DatePicker from "react-datepicker";  //input dob
import Select from 'react-select';          //input gender
import { Modal, message, Spin, Progress } from 'antd';
import { EditTwoTone, PictureTwoTone, LoadingOutlined } from '@ant-design/icons';
import vi from 'date-fns/locale/vi'

import DefaultAvatar from '../../../../assest/image/hhs-default_avatar.jpg';
import './style.css';

const Profile = (props) => {
    const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    const history = useHistory();
    const dispatch = useDispatch();
    const { isLoad } = useSelector(state => state.ui);
    const token = useSelector(state => state.auth.token);
    const { currentUser } = useSelector(state => state.user);
    const userProfile = useSelector(state => state.user.userProfile);
    const uploadStatus = useSelector(state => state.user.uploadStatus);
    const createStatus = useSelector(state => state.patient.createStatus);
    const progress = useSelector(state => state.patient.packageProgress);

    let dependentInfo = props.dependentInfo;
    // const [dependentInfo, setDependentInfo] = useState(props.dependentInfo)
    const [createNew, setCreateNew] = useState(props.createNew);

    const [profileInfo, setProfileInfo] = useState(null);
    // const avatarRef = useRef(null);
    const [avatarRef, setAvatarRef] = useState(null);
    const [avatarVisible, setAvatarVisible] = useState(false);
    const [relationGender, setRelationGender] = useState(false);
    const [avatarName, setAvatarName] = useState("")
    const [createAvatar, setCreateAvatar] = useState(null);
    const [avatarImg, setAvatarImg] = useState({ preview: "", raw: "" });

    const [avatarProperty, setAvatarProperty] = useState({
        scale: 1,
        preview: null
    });

    const { register, handleSubmit, watch, errors, control, reset } = useForm({ validateCriteriaMode: "all" });

    const options = [
        { value: "Male", label: "Nam" },
        { value: "Female", label: "Nữ" }
    ];

    const fillRelationship = (gender) => {
        let optionRelation = [];
        if (gender)
            relationship.male.map((element) => {
                optionRelation.push({ value: element, label: element })
            });
        else
            relationship.female.map((element) => {
                optionRelation.push({ value: element, label: element })
            });
        return optionRelation;
    }

    const onSubmit = (data) => {
        let userEdit = {
            fullname: data.fullname,
            address: data.address,
            gender: data.gender.value,
            dateofbirth: moment(data.Datepicker).format('YYYY-MM-DD')
        };
        if (createNew) {
            if (createAvatar?.[0]) {
                const canvas = createAvatar[0];
                let file;
                let formData = new FormData();
                canvas.toBlob(blob => {
                    file = new File([blob], avatarName == "" ? "noname.jpg" : avatarName);
                    formData.append("patientAvatar", file);
                    formData.append("fullname", data.fullname);
                    formData.append("address", data.address);
                    formData.append("gender", data.gender.value);
                    formData.append("type", data.relation.value);
                    formData.append("dateofbirth", moment(data.Datepicker).format('YYYY-MM-DD'));
                    dispatch(createDependent(token, currentUser?.customer_id, formData));

                });
            } else {
                userEdit = { ...userEdit, type: data.relation.value }
                dispatch(createDependent(token, currentUser?.customer_id, userEdit));
            }
        } else {
            if (dependentInfo)
                userEdit = { ...userEdit, type: data.relation.value }
            dispatch(editUserProfile(userEdit, currentUser?.customer_id, profileInfo.id, token));
        }
    };

    //Avatar handle function
    const handleAvatarChange = e => {
        if (e.target.files.length) {
            setAvatarImg({
                preview: "",
                raw: URL.createObjectURL(e.target.files[0])
            });
            setAvatarName(e.target.files?.[0].name)
        }
    };

    const handleAvatarScale = e => {
        const scale = parseFloat(e.target.value)
        setAvatarProperty({ scale: scale });
    };

    const saveEditedAvatar = (editor) => {
        if (editor) {
            setAvatarRef(editor);
        }
    }

    const handleAvatarUpload = async e => {
        e.preventDefault();

        if (avatarRef) {
            // const canvasRaw = avatarRef.getImage();
            // const canvasScaled = avatarRef.getImageScaledToCanvas();    //Crop to 250x250 px
            if (createNew) {
                setCreateAvatar([avatarRef.getImageScaledToCanvas(), avatarRef.getImageScaledToCanvas().toDataURL()]);
                setAvatarVisible(false);
            } else {
                const canvas = avatarRef.getImageScaledToCanvas();
                let file;
                canvas.toBlob(blob => {
                    file = new File([blob], avatarName == "" ? "noname.jpg" : avatarName);

                    const formData = new FormData();
                    formData.append("patientAvatar", file)

                    let avatar = { avatarPatient: formData };
                    dispatch(editAvatar(avatar, currentUser?.customer_id, profileInfo?.id, token));
                });
            }
        } else {
            console.log("Upload Fail")
        }
    };

    const convertImageToBlobURL = () => {
        if (avatarRef) {
            const canvas = avatarRef.getImageScaledToCanvas().toDataURL();
            fetch(canvas)
                .then(res => res.blob())
                .then(blob => (setAvatarImg({ preview: window.URL.createObjectURL(blob) })));
        } else {
            console.log("Nothing to preview!")
        }
    }

    const resetAvatar = () => {
        setAvatarImg({ preview: null, raw: null });
        setAvatarRef(null);
        setAvatarVisible(false);
    }

    const getProfile = () => {
        if (currentUser?.customer_id) {
            dispatch(getUserProfile(currentUser?.customer_id, token));
        } else {
            history.push("/login");
        }
    }

    const renderProgress = progress?.map((packages) =>
        <div key={packages.id} className="each-package">
            <div className="each-package-detail each-package-detail-patient">{packages.patient_name}</div>
            <div className="each-package-detail"><span>Bác sĩ:</span> <Link to={"/doctor/" + packages.doctor_id} target='_blank'>{packages.doctor_name}</Link></div>
            <div className="each-package-progress">
                <div className="each-package-detail">Tiến độ gói dịch vụ:</div>
                {packages.num_done && packages.num_total
                    // ? <Progress percent={Math.round((packages.num_done / packages.num_total * 100 + Number.EPSILON) * 100) / 100} status="active" format={(progress) => progress + "%"} />
                    ? <Progress percent={75} status="active" />
                    : <Progress percent={100} status="exception" />
                }
                <div className="package-end-detail">
                    <div className="convert-progress">{packages.num_done === packages.num_total ? "Đã hoàn thành" : `Hoàn thành ${packages.num_done / packages.num_total} số buổi`}</div>
                    <div className="package-show-more"><Link to={'/package/' + packages.id} target='_blank'>Chi tiết</Link></div>
                </div>
            </div>
        </div>
    );

    useEffect(() => {
        console.log(progress)
    }, [progress])

    useEffect(() => {
        if (!dependentInfo) {
            if (userProfile === null || !userProfile) {
                getProfile();
            }
            setProfileInfo(userProfile);
        }
    }, [userProfile])

    useEffect(() => {
        if (uploadStatus) {
            resetAvatar();
            dispatch(resetUploadStatus());
        }
        getProfile();
    }, [uploadStatus]);

    useEffect(() => {
        if (createStatus) {
            setCreateAvatar(null);
            setCreateNew(false);
            resetAvatar();
        }
    }, [createStatus]);

    useEffect(() => {
        setCreateNew(props.createNew)
    }, [props.createNew])

    useEffect(() => {
        if (profileInfo?.gender === "Female")
            setRelationGender(false)
        else
            setRelationGender(true)

        if (!createNew) {
            resetAvatar()
        }

        //  Update defaultValue/value
        const needReset = {
            gender: createNew ? null : profileInfo?.gender === "Male" ? { value: "Male", label: "Nam" } : { value: "Female", label: "Nữ" },
            Datepicker: createNew ? null : profileInfo?.dateofbirth ? new Date(profileInfo?.dateofbirth) : null,
            relation: createNew ? null : { value: profileInfo?.type, label: profileInfo?.type }
        }
        reset(needReset); // reset gender and dob form values
    }, [profileInfo, createNew])

    useEffect(() => {
        setProfileInfo(dependentInfo);
    }, [dependentInfo]);

    useEffect(() => {
        if (currentUser?.customer_id != undefined) {
            getProfile();
            dispatch(getPackageProgress(token, currentUser?.customer_id));
        }

        //Clean state on Unmount this component
        return () => {
            setProfileInfo(null)
            resetAvatar()
        }
    }, []);

    return (
        <div className="profile-content">
            {createNew ? <div className="dashboard-component-header">Thêm thành viên</div> : <div className="dashboard-component-header">Trang cá nhân {dependentInfo ? "của " + profileInfo?.fullname : ""}</div>}
            <div className="profile-form">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="profile-form-update">
                        <div className="profile-info">
                            <div className="profile-avatar">
                                <div className="avatar-wrapper">
                                    {createNew
                                        ? <img id="Avatar-profile" src={createAvatar?.[1] ?? DefaultAvatar} alt="Avatar" />
                                        : <img id="Avatar-profile" src={profileInfo?.avatarurl} alt="Avatar" />
                                    }
                                </div>
                                <EditTwoTone id="Avatar-icon" twoToneColor="#00BC9A" onClick={() => setAvatarVisible(true)} />
                            </div>
                            <Modal title="Đổi hình đại diện" centered visible={avatarVisible} width="450px" footer={null} onCancel={() => resetAvatar()}>
                                <Spin indicator={loadingIcon} spinning={isLoad}  >
                                    <div className="avatar-editor">
                                        <div className="avatar-editor-zone">
                                            {avatarImg?.raw
                                                ?
                                                <div className="avatar-crop">
                                                    <AvatarEditor
                                                        ref={saveEditedAvatar}
                                                        borderRadius={20}
                                                        height={250}
                                                        width={250}
                                                        scale={parseFloat(avatarProperty.scale)}
                                                        image={avatarImg.raw} />
                                                    <div>
                                                        <input
                                                            name="scale"
                                                            type="range"
                                                            onChange={handleAvatarScale}
                                                            min="1"
                                                            max="2"
                                                            step="0.01"
                                                            defaultValue="1"
                                                        />
                                                    </div>
                                                </div>
                                                : !avatarImg.preview
                                                    ? <div className="avatar-editor-message"><label htmlFor="upload-from-device"><PictureTwoTone twoToneColor="#00BC9A" /><br />Nhấn và chọn một hình ảnh</label></div>
                                                    : <img className="avatar-editor-preview" src={avatarImg.preview} />
                                            }
                                        </div>
                                        <div className="avatar-editor-upload">
                                            {avatarImg.raw || avatarImg.preview
                                                ?
                                                <div className="avatar-editor-message">
                                                    <label htmlFor="upload-from-device">Chọn một ảnh khác</label>
                                                </div>
                                                : ""
                                            }
                                            <input
                                                type="file"
                                                id="upload-from-device"
                                                accept="image/png, image/jpeg, image/jpg"
                                                style={{ display: "none" }}
                                                onChange={handleAvatarChange}
                                            />
                                        </div>
                                        {avatarRef
                                            ?
                                            <div className={!avatarImg.preview ? "avatar-editor-submit custom-display-flex" : "avatar-editor-submit"}>
                                                {!avatarImg.preview ? <div className="avatar-button-preview" onClick={() => convertImageToBlobURL()}>Xem trước</div> : ""}
                                                <button disabled={isLoad} className={isLoad ? "upload-disable-button" : ""} onClick={handleAvatarUpload}>{isLoad ? <LoadingOutlined /> : ""} {createNew ? "Chọn ảnh" : " Cập nhật"}</button>
                                            </div>
                                            : ""
                                        }
                                    </div>
                                </Spin>
                            </Modal>
                        </div>
                        <div className="main-form">
                            <p className="profile-form-label">Họ và tên</p>
                            <input type="text" className="profile-form-input" name="fullname" defaultValue={createNew ? null : profileInfo?.fullname ?? null} autoComplete="off"
                                ref={register({
                                    required: "Bạn hãy điền tên đầy đủ ",
                                    minLength: {
                                        value: 4,
                                        message: "Họ tên của bạn quá ngắn  "
                                    }, maxLength: {
                                        value: 25,
                                        message: "Họ tên không quá 25 kí tự "
                                    }
                                })}
                            />
                            <ErrorMessage errors={errors} name="fullname">
                                {({ messages }) =>
                                    messages &&
                                    Object.entries(messages).map(([type, message]) => (
                                        <span className="error-text" key={type}>{message}</span>
                                    ))
                                }
                            </ErrorMessage>

                            <div className="profile-indentify">
                                <div className="indentify-item">
                                    <p className="profile-form-label">Giới tính</p>
                                    <Controller
                                        as={<Select placeholder="Giới tính" options={options} />}
                                        name="gender"
                                        control={control}
                                        theme={theme => ({
                                            ...theme,
                                            colors: {
                                                ...theme.colors,
                                                primary25: '#e0fff9',
                                                primary: '#00bc9a',
                                            },
                                        })}
                                        className="profile-form-gender"
                                        rules={{ required: "Hãy chọn giới tính" }}
                                        onChange={([selected]) => {
                                            selected.value === "Male" ? setRelationGender(true) : setRelationGender(false)
                                            return selected;
                                        }}
                                        // defaultValue={createNew ? null : relationGender ? { value: "Male", label: "Nam" } : { value: "Female", label: "Nữ" }}
                                        defaultValue={null}
                                    />
                                    <ErrorMessage errors={errors} name="gender">
                                        {({ messages }) =>
                                            messages &&
                                            Object.entries(messages).map(([type, message]) => (
                                                <span className="error-text" key={type}>{message}</span>
                                            ))
                                        }
                                    </ErrorMessage>
                                </div>
                                <div className="indentify-item">
                                    <p className="profile-form-label">Sinh nhật</p>
                                    <Controller
                                        as={<DatePicker
                                            dateFormat="dd/MM/yyyy"
                                            peekNextMonth
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            maxDate={new Date(2002, 11, 31)}
                                            locale={vi}
                                            autoComplete="off"
                                            required
                                        />}
                                        control={control}
                                        rules={{ required: "Hãy chọn ngày sinh" }}
                                        valueName="selected" // DateSelect value's name is selected
                                        // defaultValue={createNew ? null : profileInfo?.dateofbirth ? new Date(profileInfo?.dateofbirth) : null}
                                        defaultValue={null}
                                        name="Datepicker"
                                        placeholderText="Ngày sinh"
                                    />
                                    <ErrorMessage errors={errors} name="Datepicker">
                                        {({ messages }) =>
                                            messages &&
                                            Object.entries(messages).map(([type, message]) => (
                                                <span className="error-text" key={type}>{message}</span>
                                            ))
                                        }
                                    </ErrorMessage>
                                </div>
                            </div>

                            <p className="profile-form-label">Địa chỉ</p>
                            <input type="text" className="profile-form-input" name="address" defaultValue={profileInfo?.address ?? userProfile?.address ?? null}
                                ref={register({
                                    // required: "Bạn hãy điền địa chỉ "
                                })}
                            />
                            <ErrorMessage errors={errors} name="address">
                                {({ messages }) =>
                                    messages &&
                                    Object.entries(messages).map(([type, message]) => (
                                        <span className="error-text" key={type}>{message}</span>
                                    ))
                                }
                            </ErrorMessage>
                            {dependentInfo || createNew ?
                                <>
                                    <p className="profile-form-label">Mối quan hệ</p>
                                    <Controller
                                        as={<Select placeholder="Chọn quan hệ" maxMenuHeight={200} options={fillRelationship(relationGender)} />}
                                        name="relation"
                                        control={control}
                                        theme={theme => ({
                                            ...theme,
                                            colors: {
                                                ...theme.colors,
                                                primary25: '#e0fff9',
                                                primary: '#00bc9a',
                                            },
                                        })}
                                        rules={{ required: "Chọn mối quan hệ" }}
                                        onChange={([selected]) => {
                                            return selected;
                                        }}
                                    />
                                    <ErrorMessage errors={errors} name="relation">
                                        {({ messages }) =>
                                            messages &&
                                            Object.entries(messages).map(([type, message]) => (
                                                <span className="error-text" key={type}>{message}</span>
                                            ))
                                        }
                                    </ErrorMessage>
                                </>
                                : ""}
                            <div className="profile-form-end">
                                <button disabled={isLoad} className={"recovery-button " + !isLoad ?? "recovery-button-disabled"} type="submit">{isLoad ? <LoadingOutlined /> : ""} {createNew ? " Thêm người thân" : " Cập nhật thông tin"}</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {dependentInfo || createNew ?
                ""
                : <>
                    <div className="profile-progress-header">Tiến độ các gói gần đây</div>
                    <div className="profile-progress">
                        {renderProgress}
                    </div>
                </>
            }



            {/* Chart for health detail */}
            <div className="profile-chart">Component Chart info (for each patient with props contain: patient_id)</div>
        </div>
    )
}

export default Profile;
