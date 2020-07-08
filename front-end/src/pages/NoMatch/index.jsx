import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import "./style.css"
import { withRouter } from 'react-router-dom';

const NoMatch = (props) => {

    const toHomePage = () =>{
        props.history.push('/');
    }


    return (
        <div className="default-div nomatch-background">
            <Navbar />
            <div className="nomatch">
                <div className="nomatch-inside">
                    <p style = {{fontSize: '50px'}}>Oops</p>
                    <p style = {{fontSize: '20px'}}>Chúng tôi không tìm thấy trang bạn yêu cầu</p>
                    <div style = {{marginTop: '20px'}}>
                        <button onClick = {toHomePage} className="link-button">
                            Trang chủ
                    </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default withRouter(NoMatch);