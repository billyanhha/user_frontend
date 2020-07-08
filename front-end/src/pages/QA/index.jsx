import React, { useState, useEffect } from 'react';
import "./style.css";
import { SettingOutlined } from '@ant-design/icons';
import { Collapse, Select } from 'antd';
import { Layout, Menu } from 'antd';
import detail from "../../assest/image/generated-2.json";
import {
    UserOutlined,
} from '@ant-design/icons';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
const { Content, Sider } = Layout;

const { Panel } = Collapse;

function callback(key) {
}

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const genExtra = () => (
    <SettingOutlined
        onClick={event => {
            // If you don't want click extra trigger collapse, you can prevent this:
            event.stopPropagation();
        }}
    />
);


const QA = () => {

    useEffect(() => {
        
    
        window.scroll(0,0)

    }, []);

    const [currentDetail, setCurrentDetail] = useState(0);

    const [expandIconPosition, setExpandIconPosition] = useState("right");

    const handleClickMenu = (key) => {
        console.log(key);
        console.log(currentDetail);
        setCurrentDetail(parseInt(key.key));


    }

    const allContentDetail = detail.details.map((detail, key) => (
        key === currentDetail ?
            detail.content.map((content, key) => (

                <Panel header={content.name} key={key} extra={genExtra()} className="panel-div">
                    <div>{content.description}</div>
                </Panel>
            ))
            : ""
    ));

    const allDetail = detail.details.map((detail, key) => (
        <Menu.Item key={key} icon={<UserOutlined />} onClick={key => handleClickMenu(key)}>
            {detail.name}
        </Menu.Item>
    ));

    return (
        <div className="default-div">
            <Navbar />
            <h1 className="title-div"   >Câu hỏi thường gặp</h1>
            <div className="content-div">
                <div>
                    <div className="slider-div">
                        <Sider
                            style={{
                                marginTop: "23px"
                            }}
                        >
                            <div className="logo" />
                            <Menu theme="light" mode="inline" defaultSelectedKeys='0'>
                                {allDetail}
                            </Menu>
                        </Sider>
                    </div>
                    <div className="layout-div">
                        <Layout className="site-layout layout-content-div" >

                            <Content style={{ overflow: 'initial' }}>
                                <div className="site-layout-background collapse-div" >
                                    <div style={{ background: '#fff' }}>
                                        <Collapse
                                            style={{ background: "#fff", border: 'none' }}
                                            onChange={callback}
                                            expandIconPosition={expandIconPosition}
                                        >
                                            {allContentDetail}
                                        </Collapse>
                                        <br />

                                    </div>
                                </div>
                            </Content>
                        </Layout>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default QA;