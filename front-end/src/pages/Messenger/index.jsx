import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import "./style.css"
import { withRouter } from 'react-router-dom';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import MessChatList from './components/MessChatList';
import MessSearch from './components/MessSearch';
import Chat from './components/Chat';



const Messenger = () => {

    const [search, setsearch] = useState(false);
    const [searchText, setsearchText] = useState('');



    const closeSearch = () =>{
        setsearch(false)
        setsearchText('')
    }

    const onSearchChange = (e) => {
        setsearchText(e.target.value)

    }

    return (
        <div>
            <Navbar />
            <div className="messenger">
                <div className="messenger-chatlist">
                    <div className="messenger-chatlist-header">
                        <div>
                            Chats
                        </div>
                        <div>
                            <Input
                                // size="large"
                                onFocus={() => setsearch(true)}
                                onBlur={closeSearch}
                                onChange = {onSearchChange}
                                value = {searchText}
                                placeholder="Tìm kiếm bác sĩ" prefix={<SearchOutlined />}
                                style={{ borderRadius: '15px', marginTop: '20px' }}
                            />
                        </div>
                    </div>
                    {search ? <MessSearch searchText = {searchText} /> : <MessChatList />}
                </div>
                <Chat />
            </div>
        </div>
    );
};

export default withRouter(Messenger);