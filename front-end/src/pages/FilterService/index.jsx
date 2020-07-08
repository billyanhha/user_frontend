import React, { useState, useEffect } from 'react';
import "./style.css";
import axios from '../../axios';
import Navbar from '../../components/Navbar';
import { Input } from 'antd';
import { Menu, Dropdown, Button } from 'antd';
import { DownOutlined, SortAscendingOutlined, LoadingOutlined } from '@ant-design/icons';
import Footer from '../../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { queryService, nextQueryService, getAllCategories } from '../../redux/service';
import _ from "lodash";

const { Search } = Input;

const FilterService = (props) => {

    const [sortBy, setSortBy] = useState("name");
    const [query, setquery] = useState({});
    // const [firstLoad, setfisrLoad] = useState(true);
    const dispatch = useDispatch();
    const service = useSelector(state => state.service);
    const { isLoad } = useSelector(state => state.ui);
    const [page, setpage] = useState(1);
    const [disableButton, setdisableButton] = useState(false);
    const [textSearch, setTextSearch] = useState('');

    useEffect(() => {

        window.scrollTo(0, 0)
        dispatch(getAllCategories())
        // handleSearchAndSort('', sortBy)

    }, []);



    // const handleSortByChange = ((key) => {    
    //     let sortBy = key.key    
    //     setSortBy(sortBy)
    //     handleSearchAndSort(textSearch, sortBy)

    // });

    // const onChange =(e) => {
    //     setTextSearch(e.target.value) // store search value
    // }

    

    // const handleSearchEnter = (value) => {
    //     handleSearchAndSort(value, sortBy)
    // }

    // const handleSearchAndSort = ((value, sortBy) => {        
    //     let newPage = 1;
    //     setpage(newPage);
    //     const trimValue = value.trim();
    //     disableButtonFunc()
    //     if (!_.isEmpty(trimValue)) {
    //         let newQuery = { query: trimValue, sortBy:sortBy, page: newPage }
    //         setquery(newQuery)
    //         dispatch(queryService(newQuery));
    //     } else {
    //         getNonQueryService(sortBy);
    //     }
    // })

    // const getNonQueryService = (sortBy) => {
    //     let newPage = 1;
    //     setpage(newPage);
    //     let newQuery = { sortBy: sortBy, page: newPage }
    //     setquery(newQuery)
    //     dispatch(queryService(newQuery));
    // }


    // const getMoreData = () => {
    //     disableButtonFunc()
    //     let next = page + 1;
    //     setpage(next)
    //     let newQuery = { ...query, page: next }
    //     dispatch(nextQueryService(newQuery));

    // }

    // const disableButtonFunc = () => {
    //     setdisableButton(true);
    //     setTimeout(() => {
    //         setdisableButton(false);

    //     }, 1000);

    // }

    const categories = service?.categories?.map((value, index) => (
        <div className="home-list-item service-list" key={value?.id}>
            <div style = {{backgroundImage: `url(${value?.image})`}} className = "service-list-image"></div>
            <div className="home-list-item-name">
                {value?.name}
                <div className="home-list-item-description service_descripton">
                    {value?.description}
                </div>
            </div>

        </div>
    ));

    // const menu = (
    //     <Menu selectedKeys={sortBy} onClick={handleSortByChange}>
    //         <Menu.Item key="name" icon={<SortAscendingOutlined />}>
    //             Tên đầy đủ
    //       </Menu.Item>
    //         <Menu.Item key="price" icon={<SortAscendingOutlined />}>
    //             Giá
    //       </Menu.Item>
    //         <Menu.Item key="created_at" icon={<SortAscendingOutlined />}>
    //             Ngày tạo
    //       </Menu.Item>
    //     </Menu>
    // );

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
                        Các danh mục chăm sóc sức khỏe 
                        <div className="seperator" />
                        <div className="home-introduction">
                            HHS cung cấp đa dạng các loại dịch vụ liên quan đến nhiều vấn đề
                            sức khỏe khác nhau
                        </div>
                        {/* <div className="search">
                            <div className="searchText">
                                <Search
                                    placeholder="Tìm kiếm dịch vụ"
                                    onSearch={handleSearchEnter}
                                    onChange={onChange}
                                    loading = {disableButton || isLoad}
                                    enterButton="Tìm"
                                />
                            </div>
                            <Dropdown overlay={menu}>
                                <Button onClick={e => e.preventDefault()}>
                                    Sắp xếp theo <DownOutlined />
                                </Button>
                            </Dropdown>
                        </div> */}

                    </div>
                    <div className="search-list-item">
                        {categories}
                    </div>
                    {/* <center>
                        {!service.isOutOfData && (<button
                            onClick={getMoreData}
                            disabled={disableButton || isLoad}
                            className={disableButton || isLoad ? "disable-button-service" : "link-button"}
                            id="button">
                            Hiển thị thêm {isLoad && <LoadingOutlined />}
                        </button>)}
                    </center> */}
                </div>
            </div>
            <Footer />
        </div >
    );
}

export default FilterService;