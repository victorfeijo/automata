import React from 'react';
import { DatePicker } from 'antd';
import styled from 'styled-components';

const Content = styled.div`
  text-align: center;
  font-size: 20px;
`;

const Title = styled.h1`
  font-weight: 600;
`;

const App = () => (
  <Content>
    <Title>Hello World</Title>
    <DatePicker />
  </Content>
);

export default App;
