import React, { useEffect, useState } from 'react';
import "../style.css"
import { ChatItem } from 'react-chat-elements'
import { useDispatch, useSelector } from 'react-redux';
import { getChat, getMoreChat } from '../../../redux/chat';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Button } from 'antd';
import moment from "moment"
import _ from "lodash";
import { withRouter } from 'react-router-dom';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const MessChatList = (props) => {

    const dispatch = useDispatch();
    const { chatList, isOutOfChatListData, getChatLoad } = useSelector(state => state.chat);
    const { currentUser } = useSelector(state => state.user);
    const { io } = useSelector(state => state.notify);

    const [disable, setdisable] = useState(false);
    const [page, setpage] = useState(1);


    useEffect(() => {

        getChatData()
        if (io) {
            io.on('server-send-notification-chat', data => {
                getChatData()
            })
        }

    }, [currentUser, io]);


    const getChatData = () => {
        if(currentUser?.cusId){
            const data = { page: 1, cusId: currentUser?.cusId }
            dispatch(getChat(data))
        }
    }



    const getMoreChatData = () => {
        if (!isOutOfChatListData && !getChatLoad) {

            setdisable(true)
            const nextPage = page + 1;
            setpage(nextPage)
            const data = { page: nextPage, cusId: currentUser?.cusId }
            dispatch(getMoreChat(data))
            setTimeout(() => {
                setdisable(false)
            }, 1000);
        }
    }

    const openChatThread = (value) => {
        props.history.push("/messenger/" + value?.doctor_id + "?name=" + value?.doctor_name + "&avatar=" + value?.doctor_avatar)
    }


    const renderChatList = chatList?.map((value, index) => {
        return (
            <div key={value?.doctor_id}
                className="chat-item-wrapper" style={{ backgroundColor: `${(props.match.params.id === value?.doctor_id) ? '#f2f2f2' : ''}` }}>
                <ChatItem
                    onClick={() => openChatThread(value)}
                    avatar={value?.doctor_avatar}
                    alt={value?.doctor_name}
                    title={value?.doctor_name}
                    subtitle={value?.msg}
                    date={new Date(moment(value?.last_created).format())}
                    unread={value?.num_customer_unread} />
            </div>
        )
    })



    return (
        <div>
            {
                (chatList?.length === 0 && !getChatLoad) ?
                    (<center><h4>Bạn chưa có cuộc hội thoại nào</h4></center>) : ''
            }
            <div>
                {renderChatList}
                <center>
                    <Button
                        loading={disable || getChatLoad}
                        style={{ display: `${isOutOfChatListData ? 'none' : ''}` }}
                        type="link" onClick={getMoreChatData} >Tải thêm</Button>
                </center>
            </div>
        </div>
    );
};

export default withRouter(MessChatList);