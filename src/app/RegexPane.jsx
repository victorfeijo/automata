import React, { Component } from 'react';
import styled from 'styled-components';
import { Row, Col, Input, Icon, Card, Table } from 'antd';

import { isValidRegex, toAutomata } from './Utils/RegexUtils';
import { toColumns, toSourceData } from './Utils/AutomataUtils';

const Container = styled.div`
  margin: 24px;
`;

const CardContainer = styled.div`
  min-height: 400px;
`;

class RegexPane extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      regex: '',
      automata: {}
    };
  }

  onRegexChange = (event) => {
    const regex = event.target.value;
    this.setState({ regex });

    if (isValidRegex(regex)) {
      this.updateAutomata(regex);
    }
  };

  updateAutomata = (regex) => {
    const automata = toAutomata(regex);

    this.setState({ automata: automata, loading: false });
  }

  render() {
    const { automata } = this.state;

    const columns = toColumns(automata);
    const data = toSourceData(automata);

    return (
      <Container>
        <Row type="flex" justify="space-between">
          <Col span={11}>
            <Input
              onChange={this.onRegexChange}
              placeholder="Enter a regular expression: (a | b?)*"
              type="textarea"
              rows={6} />
          </Col>
          <Row type="flex" span={1} jusify="center" align="middle">
            <Icon type="arrow-right" />
          </Row>
          <Col span={11}>
            <Card title="Result Automata" extra={<a href="#">Copy</a>}>
              <CardContainer>
                {this.state.loading ? (
                  <p> Loading.. </p>
                ) : (
                  <Table columns={columns} dataSource={data} pagination={false} />
                )}
              </CardContainer>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default RegexPane;
