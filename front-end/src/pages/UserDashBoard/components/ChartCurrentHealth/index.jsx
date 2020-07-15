import React, { useState, useEffect, Component } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chart from 'react-apexcharts';
import moment from 'moment';
import { getCurrentHealth } from '../../../../redux/patient/index';
import { ExclamationOutlined, HeartTwoTone, HeartOutlined, LineChartOutlined, ClockCircleOutlined, FireTwoTone } from '@ant-design/icons';
import './style.css';

const ChartCurrentHealth = (props) => {

    const dispatch = useDispatch();
    const [listAppointment, setListAppointment] = useState([]);
    const [temperature, setTemperature] = useState([]);
    const [pulse, setPulse] = useState([]);
    const [systolic, setSystolic] = useState([]);
    const [diastolic, setDiastolic] = useState([]);
    const [length, setLength] = useState([]);
    const token = useSelector(state => state.auth.token);
    const { currentHealth } = useSelector(state => state.patient);
    const [isNoData, setIsNoData] = useState(true);

    const [seriesData1, setSeries1] = useState([]);
    const [seriesData2, setSeries2] = useState([]);

    const [optionsData1, setOptions1] = useState({});
    const [optionsData2, setOptions2] = useState({});

    useEffect(() => {
        dispatch(getCurrentHealth(token, props.patient_id));
    }, []);

    const handleCreated_at = (value) => {
        return moment(value).format('DD/MM/YYYY HH:mm');
    }

    useEffect(() => {
        let systolic = [];
        let diastolic = [];
        let temperature = [];
        let pulse = [];
        let length = 0;
        let data = [];

        let labels = [];

        //Only get 4 newest
        if (currentHealth?.result?.length > 4) {
            data = currentHealth?.result?.slice(currentHealth?.result?.length - 4, currentHealth?.result?.length);

        //     setIsNoData(false);
        // } else if (currentHealth?.result?.length < 1) {
        //     setIsNoData(true);

        } else {
            data = currentHealth?.result;
            setIsNoData(false);
        }


        let initialize = data?.map((appointment, key) => {
            systolic[length] = appointment.systolic;
            diastolic[length] = appointment.diastolic;
            pulse[length] = appointment.pulse;
            temperature[length] = appointment.temperature;
            length++;
            return appointment;
        });
        labels = data?.map((appointment, key) => {
            let updated_at = handleCreated_at(appointment?.updated_at);

            return updated_at;
        });

        setSystolic(systolic);
        setDiastolic(diastolic);
        setPulse(pulse);
        setTemperature(temperature);
        setLength(length);

        let series1 = [{
            name: 'Huyết áp tâm thu',
            data: systolic
        }];
        setSeries1(series1);
        let optionsTest1 = {
            chart: {
                height: 200,
                type: 'line',
                background: '#000',
                selection: {
                    enabled: false
                },
                zoom: {
                    enabled: false
                },
                toolbar: {
                    show: false
                },
            },

            grid: {
                show: true,
                borderColor: '#90A4AE',
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: true
                    }
                },
            },
            stroke: {
                width: 3,
                curve: 'smooth',
                lineCap: 'butt',
            },
            xaxis: {
                labels: {
                    show: false
                },
                axisBorder: {
                    show: false
                }
            },
            colors: ['#f44336'],
            fill: {
                type: 'solid',
            },
            markers: {
                size: 4,
                colors: ["#000"],
                strokeColors: "#f44336",
                strokeWidth: 2,
                hover: {
                    size: 7,
                }
            }, yaxis: {
                tickAmount: 3,
                labels: {
                    show: true,
                    align: 'right',
                    minWidth: 0,
                    maxWidth: 160,
                    style: {
                        colors: '#000',
                        fontSize: '10px',
                        fontFamily: 'Open Sans, sans-serif',
                        fontWeight: 500,
                        cssClass: 'apexcharts-yaxis-label',
                    },
                }
            }

        };
        setOptions1(optionsTest1);

        let series2 = [{
            name: 'Huyết áp tâm trương',
            data: diastolic
        }];
        setSeries2(series2);
        let optionsTest2 = {
            chart: {
                height: 180,
                type: 'line',
                background: '#fff',
                selection: {
                    enabled: false
                },
                zoom: {
                    enabled: false
                },
                toolbar: {
                    show: false
                },
            },
            labels: labels,
            grid: {
                show: true,
                borderColor: '#90A4AE',
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: true
                    }
                },
            },
            stroke: {
                width: 3,
                curve: 'smooth',
                lineCap: 'butt',
            },
            xaxis: {
                labels: {
                    show: false
                },
                axisBorder: {
                    show: false
                }
            },
            colors: ['#8d0491'],
            fill: {
                type: 'solid',
            },
            markers: {
                size: 4,
                colors: ["#fff"],
                strokeColors: "#8d0491",
                strokeWidth: 2,
                hover: {
                    size: 7,
                }
            }, yaxis: {
                tickAmount: 3,
                labels: {
                    show: true,
                    align: 'right',
                    minWidth: 0,
                    maxWidth: 160,
                    style: {
                        colors: '#dadada',
                        fontSize: '15px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 1000,
                        cssClass: 'apexcharts-yaxis-label',
                    },
                }
            }

        };
        setOptions2(optionsTest2);

    }, [currentHealth]);

    return (

        // <div >
        //     {!isNoData ?
        //         <div className="chart-content-div">

        //             <div className="systolic-div">
        //                 <div className="systolic-content-div">
        //                     <div style={{ display: 'flex' }}>
        //                         <div className="systolic-name-div">Huyết áp tâm thu</div>
        //                         <div className="systolic-icon-div"><HeartOutlined /></div>
        //                     </div>
        //                     <div className="systolic-data-div">{systolic[length - 1]}</div><span>mmHg</span>
        //                 </div>
        //                 <Chart
        //                     options={optionsData2}
        //                     series={seriesData1}
        //                     type="line"
        //                     height="300px"
        //                     width='75%'
        //                 />
        //             </div>

        //             <div className="diastolic-div">
        //                 <div className="diastolic-content-div">
        //                     <div style={{ display: 'flex' }}>
        //                         <div className="diastolic-name-div">Huyết áp tâm trương</div>
        //                         <div className="diastolic-icon-div"><HeartOutlined /></div>
        //                     </div>
        //                     <div className="diastolic-data-div">{diastolic[length - 1]}</div><span>mmHg</span>
        //                 </div>
        //                 <Chart
        //                     options={optionsData2}
        //                     series={seriesData2}
        //                     type="line"
        //                     height="300px"
        //                     width='75%'
        //                 />
        //             </div>

        //             <div className="pulse-tem-div">
        //                 <div className="pulse-div">
        //                     <div className="pulse-content-div">
        //                         <div style={{ display: 'flex' }}>
        //                             <div className="pulse-name-div">Nhịp tim</div>
        //                             <div className="pulse-icon-div"><LineChartOutlined /></div>
        //                         </div>
        //                         <div className="pulse-data-div">{pulse[length - 1]}</div><span>BPM</span>
        //                     </div>

        //                 </div>
        //                 <div className="temperature-div">
        //                     <div className="temperature-content-div">
        //                         <div style={{ display: 'flex' }}>
        //                             <div className="temperature-name-div">Nhiệt độ</div>
        //                             <div className="temperature-icon-div"><ClockCircleOutlined /></div>
        //                         </div>
        //                         <div className="temperature-data-div">{temperature[length - 1]}</div><span> Độ C</span>
        //                     </div>

        //                 </div>
        //             </div>
        //         </div> : 
        //         <div>
        //             <h2>Hiện tại, bạn đang chưa trong quá trình sử dụng dịch vụ. Xin vui lòng sử dụng đặt lịch!</h2>
        //         </div>}



        <div className="chart-profile-content">
            <div className="chart-wrapper">
                <div>
                    <div className="chart-profile-header">
                        <div className="chart-profile-title">Huyết áp tâm thu</div>
                        <div className="chart-profile-icon"><HeartOutlined /></div>
                    </div>
                    <div className="chart-profile-data">{systolic[length - 1]}<span> mmHg</span></div>
                </div>
                <div className="chart-profile">
                    <Chart
                        options={optionsData2}
                        series={seriesData1}
                        type="line"
                        height="100%"
                        width="90%"
                    />
                </div>
            </div>
            <div className="chart-wrapper">
                <div>
                    <div className="chart-profile-header">
                        <div className="chart-profile-title">Huyết áp tâm trương</div>
                        <div className="chart-profile-icon"><HeartTwoTone twoToneColor="#ff0000" /></div>
                    </div>
                    <div className="chart-profile-data">{diastolic[length - 1]}<span> mmHg</span></div>
                </div>
                <div className="chart-profile">
                    <Chart
                        options={optionsData2}
                        series={seriesData2}
                        type="line"
                        height="100%"
                        width="90%"
                    />
                </div>
            </div>
            <div className="pulse-tem-div">
                <div className="health-index-wrapper">
                    <div className="chart-profile-header">
                        <div className="chart-profile-title">Nhịp tim</div>
                        <div className="chart-profile-icon"><LineChartOutlined /></div>
                    </div>
                    <div className="chart-profile-data">{pulse[length - 1]}<span> BPM</span></div>
                </div>
                <span className="health-index-split"></span>
                <div className="health-index-wrapper toggle-temperature">
                    <div className="chart-profile-header">
                        <div className="health-index-title">Nhiệt độ</div>
                        {/* <div className="chart-profile-icon"><FireTwoTone  twoToneColor="#eb4034" /></div> */}
                        <div className="chart-profile-icon"><ExclamationOutlined /></div>
                        {/* <div className="chart-profile-icon-custom">🌡</div> */}
                    </div>
                    <div className="chart-profile-data">{temperature[length - 1]}<span> °C</span></div>
                    <div className="chart-profile-data-convert">{Math.round((temperature[length - 1] * 9 / 5 + 32 + Number.EPSILON) * 100) / 100}<span> °F</span><br />{Math.round((temperature[length - 1] + 273.15 + Number.EPSILON) * 100) / 100}<span> °K</span></div>
                </div>
            </div>
        </div>
    );
};

export default ChartCurrentHealth;