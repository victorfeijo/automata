import React, { Component } from 'react';
import styled from 'styled-components';
import { Button, Row, Col, Input, Icon, Card, Table } from 'antd';

import EditAutomata from './EditAutomata.jsx';

import { isValidRegex, toAutomata } from './utils/RegexUtils';
import { toColumns, toSourceData } from './utils/AutomataUtils';

const Container = styled.div`
  margin: 24px;
`;

const CardContainer = styled.div`
  min-height: 400px;
`;

class RegexPane extends Component {
  state = {
    valid: true,
    regex: '',
    automata: {},
    sourceData: {},
  };

  onRegexChange = (event) => {
    const regex = event.target.value;
    this.setState({ regex });

    if (isValidRegex(regex)) {
      this.updateAutomata(regex);
    } else {
      this.setState({ valid: true });
    }
  }

  updateAutomata = (regex) => {
    const automata = toAutomata(regex);

    this.setState({
      automata: automata,
      valid: false,
      sourceData: toSourceData(automata)
    });
  }

  updateSourceData = (sourceData) => {
    this.setState({ sourceData });
  }

  render() {
    const { automata, sourceData } = this.state;

    const columns = toColumns(automata);

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
          <Row type="flex" span={1} justify="center" align="middle">
            <Icon type="arrow-right" />
          </Row>
          <Col span={11}>
            <Card title="Result Automata" extra={
              <Row type="flex" justify="space-between">
                <EditAutomata
                  title={"Edit Automata"}
                  automata={automata}
                  autoUpdate={true}
                  onSave={this.updateSourceData}></EditAutomata>
                <Button icon="copy">Copy</Button>
              </Row>
              }>
              <CardContainer>
                {this.state.valid ? (
                  <p> Write a valid regular expression.. </p>
                ) : (
                  <Table columns={columns} dataSource={sourceData} pagination={false} />
                )}
              </CardContainer>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default RegexPane;
