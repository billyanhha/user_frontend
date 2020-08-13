import React, { useState, useEffect } from 'react';
import "../style.css"
import { Avatar, MessageBox } from 'react-chat-elements'
import { Input, Spin } from 'antd';
import { Upload, Button } from 'antd';
import { FolderAddFilled, CloseCircleFilled } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getThreadChat, getMoreThreadChat, sendMessage } from '../../../redux/chat';
import moment from "moment";
import { LoadingOutlined } from '@ant-design/icons';
import _ from "lodash"
import { animateScroll } from 'react-scroll'

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Chat = (props) => {

    const [fileList, setFileList] = useState([]);
    const [file, setfile] = useState({});
    const [openUploadFile, setopenUploadFile] = useState(false);
    const [disable, setdisable] = useState(false);
    const [page, setpage] = useState(1);
    const [chatText, setchatText] = useState('');
    const [isLoadMore, setisLoadMore] = useState(false);

    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const { currenThreadChat, threadLoad } = useSelector(state => state.chat);
    const { isLoad } = useSelector(state => state.ui);
    const { io } = useSelector(state => state.notify);

    const doctor_id = props.match.params.id;
    const params = new URLSearchParams(props.location.search);

    useEffect(() => {

        getChatThreadData();
        setpage(1)
        if (io && currentUser?.cusId) {
            io.emit("chat", `chat&&${currentUser?.cusId}&&${doctor_id}`)
        }

    }, [currentUser, doctor_id, io]);



    const scrollToBottomDiv = () => {
        animateScroll.scrollToBottom({
            containerId: 'messenger-chat-content-list-13'
        })
    }

    useEffect(() => {

        if(!isLoadMore) {
            scrollToBottomDiv()

        }

    }, [currenThreadChat?.data]);


    const getChatThreadData = () => {
        if ((doctor_id !== 't')) {
            setisLoadMore(false)
            const data = { cusId: currentUser?.cusId, doctor_id: doctor_id }
            dispatch(getThreadChat(data))
        }

    }


    const getMoreChatThreadData = () => {
        if (!currenThreadChat?.isOutOfData && !isLoad && (doctor_id !== 't')) {
            setisLoadMore(true)
            setdisable(true)
            const nextPage = page + 1;
            setpage(nextPage)
            const data = { page: nextPage, cusId: currentUser?.cusId, doctor_id: doctor_id }
            dispatch(getMoreThreadChat(data))
            // scrollToBottomDiv()
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

    const onSubmitChat = (e) => {
        const text = e.target.value.trim();
        if (fileList.length !== 0 && io?.id && currentUser?.cusId) {
            const formData = new FormData();
            formData.append('image', fileList[0].originFileObj)
            formData.append('doctor_id', doctor_id)
            formData.append('socketId', io?.id)
            dispatch(sendMessage(formData, currentUser?.cusId, doctor_id))
            clearChat();
        }
        if (text && io?.id && currentUser?.cusId) {
            const formData = new FormData();
            formData.append('msg', text)
            formData.append('doctor_id', doctor_id)
            formData.append('socketId', io?.id)
            dispatch(sendMessage(formData, currentUser?.cusId, doctor_id))
            clearChat()
        }
    }

    const clearChat = () => {
        if(!threadLoad) {
            setopenUploadFile(false)
            setchatText('')
            setFileList([]);
        }
    }


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
        <div className="render-upload-file">
            <Upload
                fileList={fileList}
                listType="picture-card"
                onChange={onChangeFile}
                onPreview={onPreviewImage}
            >
                {fileList.length < 1 && 'Tải ảnh'}
            </Upload>
        </div>
    )

    const openUploadImage = () => {
        setopenUploadFile(!openUploadFile)
        setFileList([]);
    }

    const renderChat = currenThreadChat?.data?.map((value, index) => {
        return (
            <div key={value?.id}>

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

                <div className={"messenger-chat-item " + (value?.sender_type === 'customer' ? 'messenger-chat-item-user' : '')}>
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


    const onTextChange = (e) => {
        setchatText(e.target.value)
    }

    return (doctor_id === 't') ?

        (
            <div className="messenger-content-wrapper"  >
                <div className="messenger-chat">
                </div>
            </div>
        )

        : (
            <div className="messenger-content-wrapper" >
                <div className="messenger-content" id="messenger-chat-content-list-13" >
                    <div className="messenger-chat" >
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
                                <Spin size="large" indicator={antIcon} spinning={threadLoad} />

                            </div>
                        </div>
                    </div>
                </div>
                <div className="messenger-chat-content-input">
                    <div className="messenger-chat-content-input-image">
                        {renderUploadFile}
                    </div>
                    {/* <Spin size="large" indicator={antIcon} spinning={threadLoad} > */}
                        <div className="messenger-chat-content-input-form">
                            <div className="messenger-chat-content-input-upload-file">
                                <Button type="link" onClick={openUploadImage}>
                                    {openUploadFile ? <CloseCircleFilled style={{ fontSize: '25px' }} /> : <FolderAddFilled style={{ fontSize: '25px' }} />}
                                </Button>
                            </div>
                            <Input.TextArea
                                // autoSize={false}
                                allowClear={true}
                                loading={threadLoad}
                                onChange={onTextChange}
                                value={chatText}
                                onPressEnter={onSubmitChat}
                                style={{ borderRadius: '10px' }}
                                className="messenger-chat-content-input-area"
                                placeholder="" />
                        </div>
                    {/* </Spin> */}
                </div>
            </div>
        );
};

export default withRouter(Chat);