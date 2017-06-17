import React, { Component } from 'react';
import styled from 'styled-components';
import { assoc, pipe } from 'ramda';
import { Tooltip, Button, Row, Col, Input, Icon, Card, Table } from 'antd';
import { blank_automata } from '../../samples/Deterministic';
import { joinAutomatas, complementAutomata, intersectionAutomata, differenceAutomata } from '../core/Relations';
import { minimize, determineze } from '../core/Transformations';
import { toColumns, toSourceData, sourceDataToAutomata } from './utils/AutomataUtils';
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
    resultAutomata: {
      automata: blank_automata,
      columns: toColumns(blank_automata),
      sourceData: toSourceData(blank_automata),
    },
  }

  onSaveAutomataA = (sourceData) => {
    const automataA = pipe(
      assoc('automata', sourceDataToAutomata(sourceData)),
      assoc('sourceData', sourceData)
    )(this.state.automataA);

    this.setState({ automataA });
  }

  onSaveAutomataB = (sourceData) => {
    const automataB = pipe(
      assoc('automata', sourceDataToAutomata(sourceData)),
      assoc('sourceData', sourceData)
    )(this.state.automataB);

    this.setState({ automataB });
  }

  onUnionClick = (e) => {
    const { automataA, automataB } = this.state;

    const joined = joinAutomatas(automataA.automata, automataB.automata);

    this.setState({
      resultAutomata: {
        automata: joined,
        columns: toColumns(joined),
        sourceData: toSourceData(joined),
      }
    });
  }

  onIntersectionClick = (e) => {
    const { automataA, automataB } = this.state;

    const intersect = intersectionAutomata(automataA.automata, automataB.automata);

    this.setState({
      resultAutomata: {
        automata: intersect,
        columns: toColumns(intersect),
        sourceData: toSourceData(intersect),
      }
    });
  }

  onDifferenceClick = (e) => {
    const { automataA, automataB } = this.state;

    const difference = differenceAutomata(automataA.automata, automataB.automata);

    this.setState({
      resultAutomata: {
        automata: difference,
        columns: toColumns(difference),
        sourceData: toSourceData(difference),
      }
    });
  }

  onComplementClick = (e) => {
    const { automataA } = this.state;

    const complement = complementAutomata(automataA.automata);

    this.setState({
      resultAutomata: {
        automata: complement,
        columns: toColumns(complement),
        sourceData: toSourceData(complement),
      }
    });
  }

  onDeterminizeClick = (e) => {
    const { automataA } = this.state;

    const determinized = determineze(automataA.automata);

    this.setState({
      resultAutomata: {
        automata: determinized,
        columns: toColumns(determinized),
        sourceData: toSourceData(determinized),
      }
    });
  }

  onMinimizeClick = (e) => {
    const { automataA } = this.state;

    const minimized = minimize(automataA.automata);

    this.setState({
      resultAutomata: {
        automata: minimized,
        columns: toColumns(minimized),
        sourceData: toSourceData(minimized),
      }
    });
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
              <Button onClick={this.onUnionClick}>Union</Button>
              <Button onClick={this.onIntersectionClick}>Intersection</Button>
              <Button onClick={this.onDifferenceClick}>Difference</Button>
              <Button onClick={this.onComplementClick}>Complement</Button>
              <Button onClick={this.onDeterminizeClick}>Determinize</Button>
              <Button onClick={this.onMinimizeClick}>Minimize</Button>
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
                  <Table columns={resultAutomata.columns} dataSource={resultAutomata.sourceData} pagination={false} />
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