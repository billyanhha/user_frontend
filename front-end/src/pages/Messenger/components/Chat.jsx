import React, { useState, useEffect, useRef } from 'react';
import "../style.css"
import { Avatar, MessageBox } from 'react-chat-elements'
import { Input, Spin } from 'antd';
import { Upload, Button, Tooltip, message, Modal } from 'antd';
import { FolderAddFilled, CloseCircleFilled } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getThreadChat, getMoreThreadChat, sendMessage, updateIsRead, getChat } from '../../../redux/chat';
import moment from "moment";
import { LoadingOutlined, VideoCameraOutlined } from '@ant-design/icons';
import _ from "lodash"
import { animateScroll } from 'react-scroll'
import Portal from "./VideoCall/Portal";


const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Chat = (props) => {

    const ref = useRef(null)
    const [fileList, setFileList] = useState([]);
    const [file, setfile] = useState({});
    const [openUploadFile, setopenUploadFile] = useState(false);
    const [disable, setdisable] = useState(false);
    const [page, setpage] = useState(1);
    const [chatText, setchatText] = useState('');
    const [isLoadMore, setisLoadMore] = useState(false);

    const [openVideoCall, setOpenVideoCall] = useState(false);
    // const [incomingCall, setIncomingCall] = useState(false);
    // const [senderData, setSenderData] = useState(null);
    // const [senderPeerID, setSenderPeerID] = useState(null);
    
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const { currenThreadChat, threadLoad, sendChatLoad } = useSelector(state => state.chat);
    const { isLoad } = useSelector(state => state.ui);
    const { io } = useSelector(state => state.notify);

    const doctor_id = props.match.params.id;
    const params = new URLSearchParams(props.location.search);

    useEffect(() => {

        getChatThreadData();
        updateThreadIsReadFunc()
        setpage(1)
        if (io && currentUser?.cusId && doctor_id) {
            io.emit("disconnect-chat", "")
            io.emit("chat", `chat&&${currentUser?.cusId}&&${doctor_id}`)
            io.on('chat-thread', data => {
                getChatThreadData()
                if (doctor_id === data?.doctor_id) { // if doctor chat is exactly the one just send the message
                    const payloadThread = { cusId: data?.customer_id, doctor_id: data?.doctor_id }
                    dispatch(getThreadChat(payloadThread))
                    const payloadUpdate = { cusId: data?.customer_id, doctor_id:  data?.doctor_id, socketId: io?.id }
                    dispatch(updateIsRead(payloadUpdate))
                }
            })

            //listen when someone call, this func should move to component that exist on everywhere to listen.
            // io.on("connect-video-room", (getSenderPeerID, getSenderData) => {
            //     if(getSenderPeerID && !_.isEmpty(getSenderData)){
            //         setSenderData(getSenderData);
            //         setSenderPeerID(getSenderPeerID);
            //         setIncomingCall(true);
            //     }
            // });
        }

    }, [currentUser, doctor_id, io]);



    const scrollToBottomDiv = () => {
        animateScroll.scrollToBottom({
            containerId: 'messenger-chat-content-list-13',
        })
    }

    useEffect(() => {

        if(!isLoadMore) {
            scrollToBottomDiv()

        }

    }, [currenThreadChat?.data]);


    const getChatThreadData = () => {
        if ((doctor_id !== 't')  && doctor_id && currentUser?.cusId) {
            setisLoadMore(false)
            const data = { cusId: currentUser?.cusId, doctor_id: doctor_id}
            dispatch(getThreadChat(data))
        }

    }

    const updateThreadIsReadFunc = () => {
        if ((doctor_id !== 't') && io?.id && doctor_id && currentUser?.cusId) {
            const data = { cusId: currentUser?.cusId, doctor_id: doctor_id, socketId: io?.id }
            dispatch(updateIsRead(data))
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
        if(!sendChatLoad) {
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
        ref.current.focus()
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

    const toggleVideoCall = () => {
        if(openVideoCall) setOpenVideoCall(false)
        else {
            setOpenVideoCall(true);
        }
    }

    const closeWindowPortal = () => {
        if(openVideoCall) setOpenVideoCall(false);
    }

    // const handleAcceptCall = () => {
    //     if(senderPeerID){
    //         setOpenVideoCall(true);
    //     }else{
    //         message.destroy();
    //         message.error("Không thể kết nối với đối phương!",4);
    //     }
    //     setIncomingCall(false);
    // }

    // const handleCancelCall = () => {
    //     setIncomingCall(false);
    //     setSenderData(null);
    //     setSenderPeerID(null);
    // }

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
                        {openVideoCall && <Portal url={`${process.env.PUBLIC_URL}/call/video/${doctor_id?doctor_id:"cancel"}`} closeWindowPortal={closeWindowPortal} />}
                        {/* <VideoCall toggleVideoCall={toggleVideoCall} isOpen={openVideoCall} /> */}
                        {/* <Modal
                            title="Cuộc gọi đến"
                            visible={incomingCall}
                            style={{ top: 20 }}
                            closable={false}
                            footer={[
                                <Button key="accept" type="primary" loading={isLoad} onClick={()=>handleAcceptCall()}>
                                    Trả lời
                                </Button>,
                                <Button key="decline" onClick={()=>handleCancelCall()} danger>
                                    Từ chối
                                </Button>,
                            ]}
                            >
                            <Avatar src={senderData?.avatar} alt={senderData?.name??"customerName"}
                                    size="large"
                                    type="circle flexible" /> {senderData?.name} gọi video cho bạn.
                        </Modal> */}
                        <div className="messenger-chat-header">
                            <div>
                                <Avatar
                                    src={getdocAva()}
                                    alt={getdocName()}
                                    size="large"
                                    type="circle flexible" />
                                <b>{getdocName()}</b>
                            </div>
                            <Tooltip title="Bắt đầu gọi video" placement="bottom">
                                <div className="messenger-chat-video" onClick={toggleVideoCall}>
                                    <VideoCameraOutlined style={{fontSize:"1.2rem", color:"#00BC9A"}} />
                                </div>
                            </Tooltip>
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
                    <Spin size="large" indicator={antIcon} spinning={sendChatLoad} >
                        <div className="messenger-chat-content-input-form">
                            <div className="messenger-chat-content-input-upload-file">
                                <Button type="link" onClick={openUploadImage}>
                                    {openUploadFile ? <CloseCircleFilled style={{ fontSize: '25px' }} /> : <FolderAddFilled style={{ fontSize: '25px' }} />}
                                </Button>
                            </div>
                            <Input.TextArea
                                // autoSize={false}
                                ref = {ref}
                                allowClear={true}
                                autoFocus
                                loading={threadLoad}
                                onChange={onTextChange}
                                value={chatText}
                                onPressEnter={onSubmitChat}
                                style={{ borderRadius: '10px' }}
                                className="messenger-chat-content-input-area"
                                placeholder="" />
                        </div>
                    </Spin>
                </div>
            </div>
        );
};

export default withRouter(Chat);