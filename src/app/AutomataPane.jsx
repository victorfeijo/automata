import React, { Component } from 'react';
import styled from 'styled-components';
import { assoc, pipe, last, curry } from 'ramda';
import { message, Tooltip, Button, Row, Col, Input, Icon, Card, Table, Popconfirm } from 'antd';
import { blank_automata } from '../../samples/Deterministic';
import { toColumns, toSourceData, sourceDataToAutomata, joinWithParcials, intersectionWithParcials, differenceWithParcials, complementWithParcials, determinizeWithParcials, minimizeWithParcials } from './utils/AutomataUtils';
import EditAutomata from './EditAutomata.jsx';
import AutomataParcials from './AutomataParcials.jsx';
import store from 'store';

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
    parcials: [],
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
    const joinedParcials = joinWithParcials(automataA.automata, automataB.automata);
    const joined = last(joinedParcials).automata;

    this.setState({
      resultAutomata: {
        automata: joined,
        columns: toColumns(joined),
        sourceData: toSourceData(joined),
      },
      parcials: joinedParcials,
    });
  }

  onIntersectionClick = (e) => {
    const { automataA, automataB } = this.state;
    const intersectParcials = intersectionWithParcials(automataA.automata, automataB.automata);
    const intersect = last(intersectParcials).automata;

    this.setState({
      resultAutomata: {
        automata: intersect,
        columns: toColumns(intersect),
        sourceData: toSourceData(intersect),
      },
      parcials: intersectParcials,
    });
  }

  onDifferenceClick = (e) => {
    const { automataA, automataB } = this.state;
    const differenceParcials = differenceWithParcials(automataA.automata, automataB.automata);
    const difference = last(differenceParcials).automata;

    this.setState({
      resultAutomata: {
        automata: difference,
        columns: toColumns(difference),
        sourceData: toSourceData(difference),
      },
      parcials: differenceParcials,
    });
  }

  onComplementClick = curry((automataObj, e) => {
    const complementParcials = complementWithParcials(automataObj.automata);
    const complement = last(complementParcials).automata;

    this.setState({
      resultAutomata: {
        automata: complement,
        columns: toColumns(complement),
        sourceData: toSourceData(complement),
      },
      parcials: complementParcials,
    });
  })

  onDeterminizeClick = curry((automataObj, e) => {
    const determinizedParcials = determinizeWithParcials(automataObj.automata);
    const determinized = last(determinizedParcials).automata;

    this.setState({
      resultAutomata: {
        automata: determinized,
        columns: toColumns(determinized),
        sourceData: toSourceData(determinized),
      },
      parcials: determinizedParcials,
    });
  })

  onMinimizeClick = curry((automataObj, e) => {
    const minimizedParcials = minimizeWithParcials(automataObj.automata);
    const minimized = last(minimizedParcials).automata;

    this.setState({
      resultAutomata: {
        automata: minimized,
        columns: toColumns(minimized),
        sourceData: toSourceData(minimized),
      },
      parcials: minimizedParcials,
    });
  })

  onPasteAClick = (e) => {
    const { automata } = store.get('copied');

    this.setState({
      automataA: {
        automata: automata,
        columns: toColumns(automata),
        sourceData: toSourceData(automata),
      }
    });
  }

  onPasteBClick = (e) => {
    const { automata } = store.get('copied');

    this.setState({
      automataB: {
        automata: automata,
        columns: toColumns(automata),
        sourceData: toSourceData(automata),
      }
    });
  }

  onCopyClick = curry((automata, e) => {
    store.set('copied', { automata: automata });
    message.success('Copied automata with success!');
  });

  render() {
    const { automataA, automataB, resultAutomata, parcials } = this.state;

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
                    <Button icon="download" onClick={this.onPasteAClick}></Button>
                  </Tooltip>
                  <Tooltip title="Copy">
                    <Button icon="copy" onClick={this.onCopyClick(automataA.automata)}></Button>
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
                    <Button icon="download" onClick={this.onPasteBClick}></Button>
                  </Tooltip>
                  <Tooltip title="Copy">
                    <Button icon="copy" onClick={this.onCopyClick(automataB.automata)}></Button>
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
              <Popconfirm
                title={"Wich automata to complement?"}
                okText={"Automata A"}
                cancelText={"Automata B"}
                onConfirm={this.onComplementClick(automataA)}
                onCancel={this.onComplementClick(automataB)}>
                <Button>Complement</Button>
              </Popconfirm>
              <Popconfirm
                title={"Wich automata to determinize?"}
                okText={"Automata A"}
                cancelText={"Automata B"}
                onConfirm={this.onDeterminizeClick(automataA)}
                onCancel={this.onDeterminizeClick(automataB)}>
                <Button>Determinize</Button>
              </Popconfirm>
              <Popconfirm
                title={"Wich automata to minimize?"}
                okText={"Automata A"}
                cancelText={"Automata B"}
                onConfirm={this.onMinimizeClick(automataA)}
                onCancel={this.onMinimizeClick(automataB)}>
                <Button>Minimize</Button>
              </Popconfirm>
            </ButtonGroup>
          </Row>
          <Col span={7}>
            <CardSpace>
              <Card title="Result Automata" extra={
                <Row type="flex" justify="space-between">
                  <Tooltip title="Copy">
                    <Button icon="copy" onClick={this.onCopyClick(resultAutomata.automata)}></Button>
                  </Tooltip>
                  <Tooltip title="Expand view">
                    <AutomataParcials parcials={parcials} />
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
