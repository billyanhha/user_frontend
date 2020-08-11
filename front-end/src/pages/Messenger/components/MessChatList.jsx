import React from 'react';
import "../style.css"
import { ChatItem } from 'react-chat-elements'

const MessChatList = () => {

    const renderChatList = [1, 2, 3, 4, 5, 6, 7, 8, 2, 32, 2, 3, 32, 32, 3].map((value, index) => {
        return ( <ChatItem
            avatar={'https://facebook.github.io/react/img/logo.svg'}
            alt={'Reactjs'}
            title={'Facebook'}
            subtitle={'What are you doing?'}
            date={new Date()}
            unread={0} />)
    })

    return (
        <div>
            {renderChatList}
        </div>
    );
};

export default MessChatList;