import React, { Fragment, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './style.css';
import { Steps } from 'antd';
import BookingReason from './BookingReason';
import BookingDoctor from './BookingDoctor';
import BookingCalendar from './BookingCalendar';
import BookingConfirm from './BookingConfirm';
import { useSelector, useDispatch } from 'react-redux';
import { nextStep, preStep } from '../../redux/booking';

const Booking = () => {

    const { currentStep } = useSelector(state => state.booking);
    const steps = ["Các thông tin cơ bản", "Chọn bác sĩ", "Chọn lịch", "Xác nhận"];
    const dispatch = useDispatch();

    useEffect(() => {

        window.scrollTo(0, 0) // make sure div in top

    }, []);

    const renderStep = steps.map((value) => {
        return <Steps.Step key={value} title={value} />
    });
    
    return (
        <div className="default-div">
            <Navbar />
                <div className="booking-process-guilde">
                    <Steps current={currentStep}>
                        {renderStep}
                    </Steps>
                </div>
                <Fragment>
                    <BookingReason />
                    <BookingDoctor />
                    <BookingCalendar />
                    <BookingConfirm />
                </Fragment>
                {/* <div className="steps-action">
                                {currentStep < steps.length - 1 && (
                                    <Button type="primary" onClick={next}>
                                        Next
                                    </Button>
                                )}
                                {currentStep === steps.length - 1 && (
                                    <Button type="primary" onClick={() => message.success('Processing complete!')}>
                                        Done
                                    </Button>
                                )}
                                {currentStep > 0 && (
                                    <Button style={{ margin: '0 8px' }} onClick={prev}>
                                        Previous
                                    </Button>
                                )}
                            </div> */}
            <Footer />
        </div >
    );
};

export default Booking;