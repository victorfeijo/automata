import React, { Component } from 'react';
import styled from 'styled-components';
import { assoc } from 'ramda';
import { Tooltip, Button, Row, Col, Input, Icon, Card, Table } from 'antd';
import { blank_automata } from '../../samples/Deterministic';
import { toColumns, toSourceData } from './utils/AutomataUtils';
import EditAutomata from './EditAutomata.jsx';

const Container = styled.div`
  margin: 24px;
`;

const CardSpace = styled.div`
  margin: 10px;
`;

const CardContainer = styled.div`
  min-height: 300px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const OpTitle = styled.p`
  text-align: center;
  padding-bottom: 20px;
  font-size: 15px;
`;

class AutomataPane extends Component {
  state = {
    automataA: {
      automata: blank_automata,
      columns: toColumns(blank_automata),
      sourceData: toSourceData(blank_automata),
    },
    automataB: {
      automata: blank_automata,
      columns: toColumns(blank_automata),
      sourceData: toSourceData(blank_automata),
    },
    resultAutomata: {},
  }

  onSaveAutomataA = (sourceData) => {
    const { automataA } = this.state;

    this.setState({ automataA: assoc('sourceData', sourceData, automataA )});
  }

  onSaveAutomataB = (sourceData) => {
    const { automataB } = this.state;

    this.setState({ automataB: assoc('sourceData', sourceData, automataB )});
  }

  render() {
    const { automataA, automataB, resultAutomata } = this.state;

    return (
      <Container>
        <Row type="flex" justify="space-between">
          <Col span={7}>
            <CardSpace>
              <Card title="Automata A" extra={
                <Row type="flex" justify="space-between">
                  <EditAutomata
                    title={"Edit Automata A"}
                    automata={automataA.automata}
                    onSave={this.onSaveAutomataA} />
                  <Tooltip title="Paste">
                    <Button icon="download"></Button>
                  </Tooltip>
                  <Tooltip title="Copy">
                    <Button icon="copy"></Button>
                  </Tooltip>
                </Row>}>
                <CardContainer>
                  <Table columns={automataA.columns} dataSource={automataA.sourceData} pagination={false} />
                </CardContainer>
              </Card>
            </CardSpace>
          </Col>
          <Col span={7}>
            <CardSpace>
              <Card title="Automata B" extra={
                <Row type="flex" justify="space-between">
                  <EditAutomata
                    title={"Edit Automata B"}
                    automata={automataB.automata}
                    onSave={this.onSaveAutomataB} />
                  <Tooltip title="Paste">
                    <Button icon="download"></Button>
                  </Tooltip>
                  <Tooltip title="Copy">
                    <Button icon="copy"></Button>
                  </Tooltip>
                </Row>}>
                <CardContainer>
                  <Table columns={automataB.columns} dataSource={automataB.sourceData} pagination={false} />
                </CardContainer>
              </Card>
            </CardSpace>
          </Col>
          <Row type="flex" span={3} justify="center" align="middle">
            <ButtonGroup>
              <OpTitle>Operation</OpTitle>
              <Button>Union</Button>
              <Button>Intersection</Button>
              <Button>Difference</Button>
              <Button>Complement</Button>
            </ButtonGroup>
          </Row>
          <Col span={7}>
            <CardSpace>
              <Card title="Result Automata" extra={
                <Row type="flex" justify="space-between">
                  <Tooltip title="Copy">
                    <Button icon="copy"></Button>
                  </Tooltip>
                  <Tooltip title="Expand view">
                    <Button icon="scan"></Button>
                  </Tooltip>
                </Row>}>
                <CardContainer>
                </CardContainer>
              </Card>
            </CardSpace>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default AutomataPane;
