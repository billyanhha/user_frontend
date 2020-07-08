import React, { useEffect, useState } from 'react';
import moment from "moment"
import { Modal } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import package_appointment_status from "../../../../configs/package_appointment_status"
import { withRouter } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';
import slot from "../../../../configs/slot";
import _ from "lodash";
import interactionPlugin from '@fullcalendar/interaction';

const Mycalendar = (props) => {

    const { packageData } = useSelector(state => state.package)



    const eventAppointment = packageData?.appointments?.map((value, index) => {

        //     start: '2014-11-10T10:00:00',
        //   end: '2014-11-10T16:00:00',
        //   display: 'background'
        let start = value?.date + "T" + slot?.[`${value?.slot_id}`]?.from;
        let end = value?.date + "T" + slot?.[`${value?.slot_id}`]?.to;
        let color = package_appointment_status?.[`${value?.status_id}`]?.color;
        if (value?.id) {
            return {
                id: value?.id,
                start: start,
                end: end,
                title: value?.note ?? '',
                backgroundColor: color,
            }
        }
        return {
            id: value?.appointment_id,
            start: start,
            end: end,
            title: (value?.note ?? '') + '(Gói khác)' ,
            backgroundColor: color,
            packageId: `/package/${value?.package_id}#${value.appointment_id}`

        }
    })


    const renderCell = (data) => {
        let classCss = "";
        if (!_.isEmpty(packageData?.appointments)) {
            packageData.appointments.forEach(element => {
                if (moment(element.date).isSame(data.date, 'day')) {
                    classCss = 'current-package-appointment'
                }
            });
        }
        return classCss
    }


    const eventClick = (event) => {
        
        if (event.event._def?.extendedProps?.packageId) {
            window.open(event.event._def?.extendedProps?.packageId, "_blank");
        }
        window.location.hash = (event?.event?._def?.publicId);

    }


    const slotLaneDidMount = (info) => {
        let classCss = "";

        classCss = 'slotlabel'
        return classCss

    }

    return (
        <div className="my-calendar">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                locale="vi"
                firstDay={1}
                allDaySlot={false}
                nowIndicator={true}
                slotLabelFormat={(data) => moment(data.date).format("HH:mm") + " ~ " + moment(data.date).add(150, 'minutes').format("HH:mm")}
                eventTimeFormat={(data) => moment(data.date).format("HH:mm") + " ~ " + moment(data.date).add(150, 'minutes').format("HH:mm")}
                eventClick={eventClick}
                dayCellClassNames={renderCell}
                slotLaneClassNames={slotLaneDidMount}
                displayEventEnd={true}
                navLinks={true}
                slotMinTime={"07:00:00"}
                slotMaxTime={"19:00:00"}
                slotDuration={"3:00:00"}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                buttonText={{
                    today: 'Hôm nay',
                    month: 'Tháng',
                    week: 'Tuần',
                    day: 'Ngày',
                }}
                height="80vh"
                events={eventAppointment}
            />
        </div>
    );
};

export default withRouter(Mycalendar);