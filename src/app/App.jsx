import React from 'react';
import styled from 'styled-components';
import { Layout, Menu } from 'antd';
import MainContent from './MainContent.jsx';
const { Header, Content, Footer } = Layout;

const Logo = styled.div`
  width: 120px;
  height: 31px;
  background: #333;
  border-radius: 6px;
  margin: 16px 24px 16px 0;
  float: left;
`;

const App = () => (
  <Layout className="layout">
    <Header>
      <Logo />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        style={{ lineHeight: '64px' }}
      >
        <Menu.Item key="1">Home</Menu.Item>
        <Menu.Item key="2">Documentation</Menu.Item>
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
