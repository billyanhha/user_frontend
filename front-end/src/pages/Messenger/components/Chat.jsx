import React from 'react';
import "../style.css"
import { Avatar, MessageBox } from 'react-chat-elements'


const Chat = () => {

    const renderChat = [1, 2, 3, 4, 5, 6, 7, 8, 2, 32, 2, 3, 32, 32, 3].map((value, index) => {
        return (<MessageBox
            position={'left'}
            type={'photo'}
            text={'react.svg'}
            data={{
                uri: 'https://facebook.github.io/react/img/logo.svg',
                status: {
                    click: false,
                    loading: 0,
                }
            }} />)
    })

    return (
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
                <div className="messenger-chat-content-input">

                </div>
            </div>
        </div>
    );
};

export default Chat;