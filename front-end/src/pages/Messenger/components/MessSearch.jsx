import React from 'react';
import "../style.css"
import { Avatar } from 'react-chat-elements'

const MessSearch = (props) => {

    const renderCurrentDoctor = [1, 2, 3].map((value, index) => {
        return (
            <div className="mess-search-currentdoctor">
                <Avatar
                    src={'https://upload.wikimedia.org/wikipedia/commons/d/d5/Blur_%28band%29.png'}
                    alt={'logo'}
                    size="large"
                    type="circle flexible" />
                <div className="mess-search-currentdoctor-info">
                    <div className="mess-search-currentdoctor-info-big">
                        Qúy Anh
                    </div>
                    <div className="mess-search-currentdoctor-info-small">
                        0358108333 - Yên thắng Yên Mô Ninh Bình

                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className="mess-search">
            <div className="mess-search-currentdoctor-list">
                <h3>Bác sĩ của bạn</h3>
                {renderCurrentDoctor}
            </div>
            {props.searchText ? (

                <h4>Kết quả tìm kiếm cho "{props.searchText}"</h4>

            ) : ''}
        </div>
    );
};

export default MessSearch;