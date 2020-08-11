import React, { useEffect, useState } from 'react';
import "../style.css"
import { ChatItem } from 'react-chat-elements'
import { useDispatch, useSelector } from 'react-redux';
import { getChat, getMoreChat } from '../../../redux/chat';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import moment from "moment"
import InfiniteScroll from 'react-infinite-scroller';
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const MessChatList = () => {

    const dispatch = useDispatch();
    const { chatList, isOutOfChatListData } = useSelector(state => state.chat);
    const { isLoad } = useSelector(state => state.ui);
    const { currentUser } = useSelector(state => state.user);

    const [page, setpage] = useState(1);

    useEffect(() => {

        getChatData()

    }, [currentUser]);

    const getChatData = () => {
        const data = { page: page, cusId: currentUser?.cusId }
        dispatch(getChat(data))
    }

    const getMoreChatData = () => {
        const nextPage = page++;
        setpage(nextPage)
        const data = { page: nextPage, cusId: currentUser?.cusId }
        dispatch(getMoreChat(data))
    }


    const renderChatList = chatList?.map((value, index) => {
        return (<ChatItem
            key={value?.doctor_id}
            avatar={value?.doctor_avatar}
            alt={value?.doctor_name}
            title={value?.doctor_name}
            subtitle={value?.msg}
            date={moment(value?.last_created).format()}
            unread={value?.num_customer_unread} />)
    })



    return (
        <div>
            <Spin indicator={antIcon} spinning={isLoad}>
                {
                    (chatList?.length === 0 && !isLoad) ?
                        (<center><h4>Bạn chưa có cuộc hội thoại nào</h4></center>) : ''
                }
                <div>
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={getMoreChatData}
                        hasMore= {!isOutOfChatListData}
                        loader={<Spin indicator={antIcon} />}
                    >
                        {renderChatList}
                    </InfiniteScroll>
                </div>
            </Spin>
        </div>
    );
};

export default MessChatList;