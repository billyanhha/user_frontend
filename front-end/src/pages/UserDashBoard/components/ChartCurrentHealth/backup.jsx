import React, { useState, useEffect, Component } from 'react';
import './style.css';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import status from '../../../../configs/appointment_status';
import { Tabs, Spin } from 'antd';
import Chart from 'react-apexcharts';
import { getCurrentHealth } from '../../../../redux/patient/index';


const ChartCurrentHealth = (props) => {

    const dispatch = useDispatch();
    const [listAppointment, setListAppointment] = useState([]);
    const [temperature, setTemperature] = useState([]);
    const [pulse, setPulse] = useState([]);
    const [systolic, setSystolic] = useState([]);
    const [diastolic, setDiastolic] = useState([]);
    const token = useSelector(state => state.auth.token);
    const { currentHealth } = useSelector(state => state.patient);

    const [seriesData1, setSeries1] = useState([]);
    const [seriesData2, setSeries2] = useState([]);
    const [seriesData3, setSeries3] = useState([]);
    const [seriesData4, setSeries4] = useState([]);
    const [optionsData1, setOptions1] = useState({});
    const [optionsData2, setOptions2] = useState({});
    const [optionsData3, setOptions3] = useState({});
    const [optionsData4, setOptions4] = useState({});
    const { isLoad } = useSelector(state => state.ui);

    const { TabPane } = Tabs;

    // console.log(props.patient_id);
    // console.log(currentHealth);
    useEffect(() => {
        dispatch(getCurrentHealth(token, props.patient_id));
    }, []);

    // const pressureConfig = (systolic, diastolic) => {
    //     let result = "";
    //     if (systolic <= 90 && diastolic <= 60) {
    //         result = "Huyết áp thấp : chỉ số huyết áp tâm thu < 90 mmHg và/hoặc huyết áp tâm trương < 60 mmHg.";
    //     } else
    //         if (systolic >= 91 && systolic <= 120 && diastolic >= 61 && diastolic <= 80) {
    //             result = "Huyết áp tối ưu";
    //         } else
    //             if (systolic >= 121 && systolic <= 129 && diastolic >= 81 && diastolic <= 84) {
    //                 result = "Huyết áp bình thường: Huyết áp tâm thu từ 90 mmHg đến 129 mmHg. Huyết áp tâm trương: Từ 60 mmHg đến 84 mmHg";
    //             } else
    //                 if (systolic >= 131 && systolic <= 139 && diastolic >= 85 && diastolic <= 89) {
    //                     result = "Huyết áp bình thường cao: Huyết áp tâm thu 130-139 mmHg và/hoặc huyết áp tâm trương 85-89 mmHg.";
    //                 } else
    //                     if (systolic >= 140 && systolic <= 159 && diastolic >= 90 && diastolic <= 99) {
    //                         result = "Tăng huyết áp độ 1 (Tăng huyết áp nhẹ: Huyết áp tâm thu 140-159 mmHg và/hoặc huyết áp tâm trương 90-99 mmHg.";
    //                     } else
    //                         if (systolic >= 160 && systolic <= 179 && diastolic >= 100 && diastolic <= 109) {
    //                             result = "Tăng huyết áp độ 2 (Tăng huyết áp nặng): Huyết áp tâm thu 160-179 mmHg và/hoặc huyết áp tâm trương 100-109 mmHg.";
    //                         } else
    //                             if (systolic >= 180 && diastolic >= 110) {
    //                                 result = "Tăng huyết áp độ 3 (Tăng huyết áp cao): Huyết áp tâm thu ≥ 180 mmHg và/hoặc huyết áp tâm trương ≥ 110 mmHg.";
    //                             } else
    //                                 if (systolic >= 140 && diastolic <= 90) {
    //                                     result = "Tăng huyết áp tâm thu đơn độc: Huyết áp tâm thu ≥ 140 mmHg và huyết áp tâm trương < 90 mmHg.";
    //                                 }
    //     return result;
    // }

    // const getAnalysis = (appointments) => {
    //     let systolic = 0;
    //     let diastolic = 0;
    //     let result1 = pressureConfig(appointments[0]?.systolic, appointments[0]?.diastolic);
    //     for (let i = 0; i < appointments?.length; i++) {
    //         if (appointments[i]?.status_id === status.done) {
    //             systolic = appointments[i]?.systolic;
    //             diastolic = appointments[i]?.diastolic;
    //         }
    //     }
    //     let result2 = "";
    //     result2 = systolic !== 0 ? pressureConfig(systolic, diastolic) : "";
    //     return (
    //         <div>
    //             {appointments[0]?.systolic && appointments[0]?.diastolic && (<h3>Huyết áp ban đầu:</h3>)}
    //             <p>{result1}</p>
    //             {systolic !== 0 && diastolic !== 0 && (<h3>Huyết áp hiện tại:</h3>)}
    //             <p>{result2}</p>
    //         </div>
    //     )
    // }

    // const formatDateTime = (dateValue) => {
    //     dateValue = dateValue?.split("-");
    //     dateValue = dateValue?.[2] + "-" + dateValue?.[1] + "-" + dateValue?.[0];
    //     return dateValue;
    // }

    function innitial (serie, option, type){
        let series = [serie];

        let options = {
            chart: {
                height: 350,
                type: 'radialBar',
                toolbar: {
                    show: true
                }
            },
            plotOptions: {
                radialBar: {
                    startAngle: -135,
                    endAngle: 225,
                    hollow: {
                        margin: 0,
                        size: '70%',
                        background: '#fff',
                        image: undefined,
                        imageOffsetX: 0,
                        imageOffsetY: 0,
                        position: 'front',
                        dropShadow: {
                            enabled: true,
                            top: 3,
                            left: 0,
                            blur: 4,
                            opacity: 0.24
                        }
                    },
                    track: {
                        background: '#fff',
                        strokeWidth: '67%',
                        margin: 0, // margin is in pixels
                        dropShadow: {
                            enabled: true,
                            top: -3,
                            left: 0,
                            blur: 4,
                            opacity: 0.35
                        }
                    },

                    dataLabels: {
                        show: true,
                        name: {
                            offsetY: -10,
                            show: true,
                            color: '#888',
                            fontSize: '17px'
                        },
                        value: {
                            formatter: function (val) {
                                return parseInt(val);
                            },
                            color: '#111',
                            fontSize: '36px',
                            show: true,
                        }
                    }
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    type: 'horizontal',
                    shadeIntensity: 0.5,
                    gradientToColors: ['#ABE5A1'],
                    inverseColors: true,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 100]
                }
            },
            stroke: {
                lineCap: 'round'
            },
            labels: ['Percent'],
        };
        switch (type) {
            case 1:
                setSeries1(series);
                setOptions1(options);
                break;
            case 2:
                setSeries2(series);
                setOptions2(options);
                break;
            case 3:
                setSeries3(series);
                setOptions3(options);
                break;
            case 4:
                setSeries4(series);
                setOptions4(options);
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        let systolic = currentHealth?.systolic;
        let diastolic = currentHealth?.diastolic;
        let temperature = currentHealth?.temperature;
        let pulse = currentHealth?.pulse;
        innitial(systolic,0,1);
        innitial(diastolic,0,2)
        innitial(temperature,0,3)
        innitial(pulse,0,4);

    }, [currentHealth]);

    return (
        <div >

            <div >
                <Chart
                    options={optionsData1}
                    series={seriesData1}
                    type="radialBar"
                    height="450"
                    width="100%"
                />
                <Chart
                    options={optionsData2}
                    series={seriesData2}
                    type="radialBar"
                    height="450"
                    width="100%"
                />
                <Chart
                    options={optionsData3}
                    series={seriesData3}
                    type="radialBar"
                    height="450"
                    width="100%"
                />
                <Chart
                    options={optionsData4}
                    series={seriesData4}
                    type="radialBar"
                    height="450"
                    width="100%"
                />
            </div>

        </div>
    );
};

export default ChartCurrentHealth;