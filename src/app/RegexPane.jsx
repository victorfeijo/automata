import React, { Component } from 'react';
import styled from 'styled-components';
import { Row, Col, Input, Icon, Card, Table } from 'antd';

const Container = styled.div`
  margin: 24px;
`;

const CardContainer = styled.div`
  min-height: 400px;
`;

const columns = [{
  title: 'State',
  dataIndex: 'state',
  key: 'state',
}, {
  title: 'a',
  dataIndex: 'a',
  key: 'a',
}, {
  title: 'b',
  dataIndex: 'b',
  key: 'b'
}];

const data = [{
  state: 'q0',
  a: 'q1',
  b: 'ERROR',
}, {
  state: 'q1',
  a: 'q1',
  b: 'q2',
}, {
  state: 'q2',
  a: 'q2',
  b: 'q1',
}];

class RegexPane extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      regex: '',
      automata: {}
    };
  }

  render() {
    return (
      <Container>
        <Row type="flex" justify="space-between">
          <Col span={11}>
            <Input
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
