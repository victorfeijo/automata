import React, { Component } from 'react';
import styled from 'styled-components';
import RegexPane from './RegexPane.jsx';
import AutomataPane from './AutomataPane.jsx';
import { Tabs, Icon } from 'antd';
const TabPane = Tabs.TabPane;

const Container = styled.div`
  background: #fff;
  padding: 24px;
  min-height: 650px;
  margin-top: 40px;
  border-radius: 6px;
`;

class MainContent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const regexIcon = (<span><Icon type="code-o" />Regular Expression</span>);
    const automataIcon = (<span><Icon type="fork" />Automata Operations</span>);

    return (
      <Container>
        <Tabs defaultActiveKey="1">
          <TabPane tab={regexIcon} key="1">
            <RegexPane />
          </TabPane>
          <TabPane tab={automataIcon} key="2">
            <AutomataPane />
          </TabPane>
        </Tabs>
      </Container>
    );
  }
}

export default MainContent;
