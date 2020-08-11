import React, { useState } from 'react';
import "../style.css"
import { Avatar, MessageBox } from 'react-chat-elements'
import { Input } from 'antd';
import { Upload, Button } from 'antd';
import { FolderAddFilled, CloseCircleFilled  } from '@ant-design/icons';
const Chat = () => {

    const [fileList, setFileList] = useState([]);
    const [file, setfile] = useState({});
    const [openUploadFile, setopenUploadFile] = useState(false);


    const renderChat = [1, 2, 3, 4, 5, 3, 32, 2, 2, 3, 32, 2, 2, 2, 2, 2, 3, 45, 5, 6, 78].map((value, index) => {
        return (
            <div className="messenger-chat-item">
                <Avatar
                    src={'https://upload.wikimedia.org/wikipedia/commons/d/d5/Blur_%28band%29.png'}
                    alt={'logo'}
                    type="circle flexible" />
                <div className="messenger-chat-item-content">
                    <MessageBox
                        className="messenger-chat-item-content-box"
                        position={'left'}
                        type={'text'}
                        text={'react.svg'}
                    // data={{
                    //     uri: 'https://facebook.github.io/react/img/logo.svg',
                    //     status: {
                    //         click: false,
                    //         loading: 0,
                    //     }
                    // }} 
                    />
                </div>
            </div>)
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


    return (
        <div className="messenger-content">
            <div className="messenger-chat">
                <div className="messenger-chat-header">
                    <Avatar
                        src={'https://upload.wikimedia.org/wikipedia/commons/d/d5/Blur_%28band%29.png'}
                        alt={'logo'}
                        size="large"
                        type="circle flexible" />
                    <b>Quy Anh</b>
                </div>
                <div className="messenger-chat-content">
                    <div className="messenger-chat-content-list">
                        {renderChat}
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
                           {openUploadFile ? <CloseCircleFilled style={{ fontSize: '25px' }}/> : <FolderAddFilled style={{ fontSize: '25px' }} />}
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

export default Chat;