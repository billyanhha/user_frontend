import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Animation from './Animation';
import { Calendar, Radio, message, Tooltip } from 'antd';
import { nextStep, preStep, getDoctorComingAppointment, saveBookingTime } from '../../redux/booking';
import { getSlot } from '../../redux/slot';
import _ from 'lodash'
import moment from 'moment';
import 'moment/locale/vi';
moment.locale('vi');

const BookingCalendar = () => {

    // step 0

    const { currentStep, doctorInfo, comingAppointments, bookingTime } = useSelector(state => state.booking);
    const { slots } = useSelector(state => state.slot);
    const [time, setTime] = useState(moment());
    const [radioBtn, setradioBtn] = useState(bookingTime?.slot_id ?? 0);
    const dispatch = useDispatch();

    useEffect(() => {

        dispatch(getSlot())

    }, []);




    if (currentStep !== 2) {
        return null;
    }

    const onSelect = value => {
        setTime(moment(value))

    };

    const onChange = e => {
        setradioBtn(e.target.value)
    };

    const onPanelChange = (value, mode) => {
    }

    const next = () => {
        if (radioBtn === 0) {
            message.error("Xin vui lòng chọn thời gian khám", 3);
            return
        }
        let bookingTime = { slot_id: radioBtn, date: moment(time).format('yyyy-MM-DD') }
        dispatch(saveBookingTime(bookingTime));
        dispatch(nextStep());
    }

    const prev = () => {
        dispatch(preStep())
    }

    const radioStyle = {
        display: 'block',
        marginBottom: '15px',
        marginTop: '15px',
    };

    const dateCellRender = (value) => {
        let slots = checkCommingSoonAppointment(value, comingAppointments);
        let text = "Bác sĩ có hẹn vào ";

        if (!_.isEmpty(slots)) {
            slots.forEach(element => {
                text += " Khung giờ " + element + " "
            });
            if (slots.length === 4) {
                return (<Tooltip placement="leftTop" title={"Bác sĩ không có lịch trống"}>
                    <div className="radio-slot-full">
                    </div>
                </Tooltip>)
            }
            return (
                <Tooltip placement="leftTop" color={"blue"} title={text}>
                    <div className="radio-slot">
                    </div>
                </Tooltip>
            )
        }
    }

    const checkCommingSoonAppointment = (time, comingAppointments) => {
        const slot = []; // slot duplicate
        if (!_.isEmpty(comingAppointments)) {
            comingAppointments.forEach(appointment => {
                if (moment(appointment.date).isSame(moment(time), 'day')) {
                    slot.push(appointment.slot_id);
                }
            });
        }
        return slot;
    }

    const renderSlot = slots.map((value, index) => {
        let disable = false;
        if (moment(time).isSame(moment(), 'day') && moment(value.hour_from, 'HH:mm:ss').isBefore(moment(), 'HH:mm:ss')) {
            disable = true
        }
        const slot = checkCommingSoonAppointment(time, comingAppointments);
        if (slot.includes(value.id)) {
            disable = true
        }
        if (slot.includes(radioBtn)) {
            setradioBtn(0)
        }
        return (
            <Radio.Button
                key={value.id}
                style={radioStyle}
                disabled={disable}
                value={value.id}>
                Khung giờ {value.id} -
                { moment(value.hour_from, 'HH:mm').format('HH:mm')} đến {moment(value.hour_to, 'HH:mm').format('HH:mm')}
            </Radio.Button>
        )
    })




    return (
        <Animation>
            <div className="booking-contain">
                <div className="booking-introduction">
                    <div className="booking-introduction-left">
                        <div className="booking-step">
                            <div className="booking-text">
                                <span className="hightlight">3. </span> Chọn lịch
                            </div>
                            <div className="booking-guide">
                                {doctorInfo?.fullname && (<p>
                                    Booking lịch với bác sĩ
                                    <span className="hightlight"> {doctorInfo?.fullname}</span>
                                </p>)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="booking-calendar">
                    <div className="site-calendar-demo-card">
                        <Calendar
                            // style = {{height: '300px'}}
                            value={time}
                            dateCellRender={dateCellRender}
                            onSelect={onSelect}
                            fullscreen={false}
                            validRange={[moment().subtract(1, 'd'), moment().add(60, 'd')]}
                            onPanelChange={onPanelChange} />
                    </div>
                    <div className="booking-calendar-slot">
                        <Radio.Group onChange={onChange} value={radioBtn}>
                            {renderSlot}
                        </Radio.Group>
                    </div>
                </div>
                <div className="steps-action">
                    <button onClick={prev} className="submit-btn-outline">Quay lại</button>
                    <button onClick={next} className="submit-btn">Tiếp theo</button>
                </div>
            </div>
        </Animation>
    );
};

export default BookingCalendar;