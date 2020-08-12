import React, { useState, useEffect } from 'react';
import "../style.css"
import { Avatar, MessageBox } from 'react-chat-elements'
import { Input, Spin } from 'antd';
import { Upload, Button } from 'antd';
import { FolderAddFilled, CloseCircleFilled } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getThreadChat, getMoreThreadChat } from '../../../redux/chat';
import moment from "moment";
import { LoadingOutlined } from '@ant-design/icons';
import { createRef } from 'react';
import { animateScroll } from "react-scroll";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Chat = (props) => {


    const [fileList, setFileList] = useState([]);
    const [file, setfile] = useState({});
    const [openUploadFile, setopenUploadFile] = useState(false);
    const [disable, setdisable] = useState(false);
    const [page, setpage] = useState(1);

    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const { currenThreadChat } = useSelector(state => state.chat);
    const { isLoad } = useSelector(state => state.ui);

    const doctor_id = props.match.params.id;
    const params = new URLSearchParams(props.location.search);

    useEffect(() => {

        getChatThreadData();
        setpage(1)

    }, [currentUser, doctor_id]);


    const scrollToBottom = () => {
        animateScroll.scrollToBottom({
            containerId: "messenger-chat-content-list-13"
        });
    }

    const getChatThreadData = () => {
        if ((doctor_id !== 't')) {

            const data = { cusId: currentUser?.cusId, doctor_id: doctor_id }
            dispatch(getThreadChat(data))
            scrollToBottom()
        }

    }


    const getMoreChatThreadData = () => {
        if (!currenThreadChat?.isOutOfData && !isLoad && (doctor_id !== 't')) {
            setdisable(true)
            const nextPage = page + 1;
            setpage(nextPage)
            const data = { page: nextPage, cusId: currentUser?.cusId, doctor_id: doctor_id }
            dispatch(getMoreThreadChat(data))
            scrollToBottom()
            setTimeout(() => {
                setdisable(false)
            }, 1000);
        }
    }

    const getdocName = () => {
        return params.get('name');
    }

    const getdocAva = () => {
        return params.get('avatar');
    }


    const renderChat = currenThreadChat?.data?.map((value, index) => {
        return (
            <div>

                {index === 0 ? (
                    <center>
                        <h5>
                            {
                                moment(value?.created_at).format('DD-MM-YYYY [ vào lúc ] hh [ giờ ] mm [ phút ]')
                            }
                        </h5>
                        <Button
                            loading={disable || isLoad}
                            style={{ display: `${currenThreadChat?.isOutOfData ? 'none' : ''}` }}
                            type="link" onClick={getMoreChatThreadData} >Tải thêm</Button>
                    </center>
                ) : ''}

                <div key={value?.id} className={"messenger-chat-item " + (value?.sender_type === 'customer' ? 'messenger-chat-item-user' : '')}>
                    {value?.sender_type == 'customer' ?
                        '' : (
                            <Avatar
                                src={getdocAva()}
                                alt={getdocName()}
                                type="circle flexible" />
                        )}
                    <div className={value?.sender_type === 'customer' ? 'messenger-chat-item-content-user' : "messenger-chat-item-content-nonuser"}>
                        {value?.msg_type === 'text' ? value?.msg : (
                            <a target="_blank" href={value?.msg}>
                                <img className="messenger-chat-item-content-image" src={value?.msg} alt={value?.id} />
                            </a>

                        )}
                        <br />
                        <div className="chat-date">{moment(value?.created_at).fromNow()}</div>
                    </div>
                </div>
            </div>
        )
    })


    const onChangeFile = async ({ fileList: newFileList }) => {

        setFileList(newFileList);
        if (newFileList[0]) {
            setfile(newFileList[0].originFileObj)
        }
    };

    const onPreviewImage = async file => {
        let src = file.url;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => {
                    resolve(reader.result);
                };
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
    };

    const renderUploadFile = openUploadFile && (
        <Upload
            fileList={fileList}
            listType="picture-card"
            onChange={onChangeFile}
            onPreview={onPreviewImage}
        >
            {fileList.length < 1 && 'Tải ảnh'}
        </Upload>
    )

    const openUploadImage = () => {
        setopenUploadFile(!openUploadFile)
        setFileList([]);
    }


    return (doctor_id === 't') ?

        (
            <div className="messenger-content-wrapper"  >
                <div className="messenger-chat">
                </div>
            </div>
        )

        : (
            <div className="messenger-content-wrapper"  >
                <div className="messenger-content">
                    <div className="messenger-chat">
                        <div className="messenger-chat-header">
                            <Avatar
                                src={getdocAva()}
                                alt={getdocName()}
                                size="large"
                                type="circle flexible" />
                            <b>{getdocName()}</b>
                        </div>
                        <div className="messenger-chat-content" >
                            <div className="messenger-chat-content-list">
                                {renderChat}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="messenger-chat-content-input">
                    <div className="messenger-chat-content-input-image">
                        {renderUploadFile}
                    </div>
                    <div className="messenger-chat-content-input-form">
                        <div className="messenger-chat-content-input-upload-file">
                            <Button type="link" onClick={openUploadImage}>
                                {openUploadFile ? <CloseCircleFilled style={{ fontSize: '25px' }} /> : <FolderAddFilled style={{ fontSize: '25px' }} />}
                            </Button>
                        </div>
                        <Input.TextArea
                            // autoSize={false}
                            allowClear={true}
                            style={{ borderRadius: '10px' }}
                            className="messenger-chat-content-input-area"
                            placeholder="" />
                    </div>
                </div>
            </div>
        );
};

export default withRouter(Chat);