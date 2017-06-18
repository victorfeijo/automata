import React from 'react';
import styled from 'styled-components';
import { Layout, Menu } from 'antd';
import MainContent from './MainContent.jsx';
const { Header, Content, Footer } = Layout;

const Logo = styled.div`
  width: 120px;
  height: 31px;
  float: left;
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  color: white;
  padding-bottom: 16px;
`;

const App = () => (
  <Layout className="layout">
    <Header>
      <Logo>
        UFSC
      </Logo>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        style={{ lineHeight: '64px' }}
      >
        <Menu.Item key="1">Home</Menu.Item>
        <Menu.Item key="2">
          <a href={"/docs/index.html"}> Documentation </a>
        </Menu.Item>
      </Menu>
    </Header>
    <Content style={{ padding: '0 50px' }}>
      <MainContent />
    </Content>
    <Footer style={{ textAlign: 'center' }}>
      Automata ©2017 Created by Victor Feijó and Emmanuel
    </Footer>
  </Layout>
);

export default App;
