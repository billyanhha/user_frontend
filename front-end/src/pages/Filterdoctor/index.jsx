import React, { useState, useEffect } from 'react';
import "./style.css";
import Navbar from '../../components/Navbar';
import { Input, Tooltip, Rate } from 'antd';
import { Menu, Dropdown, Button } from 'antd';
import { DownOutlined, SortDescendingOutlined, LoadingOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { queryDoctor, nextQueryDoctor } from '../../redux/doctor';
import Footer from '../../components/Footer';
import _ from "lodash";
import { Link } from 'react-router-dom';


const { Search } = Input;


const FilterDoctor = (props) => {

    const [sortBy, setSortBy] = useState("average_rating");
    const [query, setquery] = useState({});
    const dispatch = useDispatch();
    const doctor = useSelector(state => state.doctor);
    const { isLoad } = useSelector(state => state.ui);
    const [page, setpage] = useState(1);
    const [disableButton, setdisableButton] = useState(false);
    const [textSearch, setTextSearch] = useState('');

    useEffect(() => {

        window.scrollTo(0, 0) // make sure div in top
        handleSearchAndSort('', sortBy)

    }, []);



    const handleSortByChange = ((key) => {
        let sortBy = key.key
        setSortBy(sortBy)
        handleSearchAndSort(textSearch, sortBy)
    });

    const onChange = (e) => {
        setTextSearch(e.target.value) // store search value
    }



    const handleSearchEnter = (value) => {
        handleSearchAndSort(value, sortBy)
    }

    const handleSearchAndSort = ((value, sortBy) => {
        let newPage = 1;
        setpage(newPage);
        const trimValue = value.trim();
        disableButtonFunc()
        if (!_.isEmpty(trimValue)) {
            let newQuery = { query: trimValue, sortBy: sortBy, page: newPage }
            setquery(newQuery)
            dispatch(queryDoctor(newQuery));
        } else {
            getNonQueryService(sortBy);
        }
    })

    const getNonQueryService = (sortBy) => {
        let newPage = 1;
        setpage(newPage);
        let newQuery = { sortBy: sortBy, page: newPage }
        setquery(newQuery)
        dispatch(queryDoctor(newQuery));
    }


    const getMoreData = () => {
        disableButtonFunc()
        let next = page + 1;
        setpage(next)
        let newQuery = { ...query, page: next }
        dispatch(nextQueryDoctor(newQuery));

    }

    const disableButtonFunc = () => {
        setdisableButton(true);
        setTimeout(() => {
            setdisableButton(false);

        }, 1000);

    }


    const doctorData = doctor?.queryDoctor?.map((value, index) => {
        return (
            <Tooltip title="Click để xem chi tiết" placement="right" color={'#00BC9A'} key={value.id}>
                <Link to={"/doctor/" + value.id}>
                    <div className="home-list-item">
                        <div className="home-list-item-image" style={{
                            backgroundImage:
                                `url(${value.avatarurl ||
                                'https://hhs.s3-ap-southeast-1.amazonaws.com/doctor-character-background_1270-84.jpg'})`
                        }}>

                        </div>
                        <div className="home-list-item-name">
                            {value?.fullname}
                        </div>
                        <div className="doctor-rate">
                            {
                                value?.average_rating == 0
                                    ? <span className="rate-average">Chưa có đánh giá</span>
                                    : <>
                                        <Rate disabled value={value?.average_rating} />
                                        <span className="rate-average"> ­ {value?.average_rating} / 5</span>
                                    </>
                            }
                        </div>
                    </div>
                </Link>
            </Tooltip>
        )
    });

    const menu = (
        <Menu selectedKeys={sortBy} onClick={handleSortByChange}>
            <Menu.Item key="average_rating" icon={<SortDescendingOutlined />}>
                Đánh giá
          </Menu.Item>
            <Menu.Item key="fullname" icon={<SortDescendingOutlined />}>
                Tên đầy đủ
          </Menu.Item>
        </Menu>
    );

    return (
        <div className="default-div">
            <Navbar />
            {/* <div className="home-contain home-main-about">
                <div className="home-content">
                    <div className="home-title">
                        Bạn Thấy Không Khỏe?
                        Hãy Để HHS Chăm Sóc Bạn!
                        </div>
                    <div className="seperator" />
                    <div className="home-introduction">
                        Mang trải nghiệm thăm khám đa khoa hiện đại đến ngay trong ngôi nhà bạn. Từ cảm mạo thông thường đến các bệnh mãn tính - các bác sĩ ikemen thân thiện sẽ tận tình chăm sóc bạn & gia đình.
                    </div>
                </div>
            </div> */}
            <div >
                <div className="service-contain">
                    <div className="home-title">
                        Đội ngũ bác sĩ
                        <div className="seperator" />
                        <div className="home-introduction">
                            Đội ngũ bác sĩ trình độ cao
                        </div>
                        <div className="search">
                            <div className="searchText">
                                <Search
                                    placeholder="Tìm kiếm dịch vụ"
                                    onSearch={handleSearchEnter}
                                    onChange={onChange}
                                    loading={disableButton || isLoad}
                                    enterButton="Tìm"
                                />
                            </div>
                            <Dropdown overlay={menu}>
                                <Button onClick={e => e.preventDefault()}>
                                    Sắp xếp theo <DownOutlined />
                                </Button>
                            </Dropdown>
                        </div>

                    </div>
                    <div className="search-list-item">
                        {doctorData}
                    </div>
                    <center>
                        {!doctor.isOutOfData && (<button
                            onClick={getMoreData}
                            disabled={disableButton || isLoad}
                            className={disableButton || isLoad ? "disable-button-service" : "link-button"}
                            id="button">
                            Hiển thị thêm {isLoad && <LoadingOutlined />}
                        </button>)}
                    </center>
                </div>
            </div>
            <Footer />
        </div >
    );
}

export default FilterDoctor;