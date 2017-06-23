import React, { Component } from 'react';
import styled from 'styled-components';
import { Alert, Button, Row, Col, Input, Icon, Card, Table, message } from 'antd';
import { isValidRegex, toAutomata } from './utils/RegexUtils';
import { toColumns, toSourceData } from './utils/AutomataUtils';
import { replace } from 'ramda';
import EditAutomata from './EditAutomata.jsx';
import RegexOps from './RegexOps.jsx';
import store from 'store';

const Container = styled.div`
  margin: 24px;
`;

const CardContainer = styled.div`
  min-height: 400px;
`;

const RegexOp = styled.div`
  margin-top: 60px;
`;

const Title = styled.p`
  margin-bottom: 12px;
  font-size: 16px;
`;

class RegexPane extends Component {
  state = {
    valid: false,
    regex: '',
    automata: {},
    sourceData: {},
  };

  onRegexChange = (event) => {
    const regex = replace(/\s/g, '', event.target.value);
    this.setState({ regex });

    if (isValidRegex(regex)) {
      this.updateAutomata(regex);
    } else {
      this.setState({ valid: false });
    }
  }

  updateAutomata = (regex) => {
    const automata = toAutomata(regex);

    this.setState({
      automata: automata,
      valid: true,
      sourceData: toSourceData(automata)
    });
  }

  updateSourceData = (sourceData) => {
    this.setState({ sourceData });
  }

  onCopyClick = (e) => {
    const { automata, valid } = this.state;

    if (valid) {
      store.set('copied', { automata: this.state.automata });
      message.success('Copied automata with success!');
    } else {
      message.warning('Not a valid automata.');
    }
  }

  render() {
    const { automata, sourceData } = this.state;

    const columns = toColumns(automata);

    return (
      <Container>
        <Row type="flex" justify="space-between">
          <Col span={11}>
            <Title>Regular expression</Title>
            <Input
              onChange={this.onRegexChange}
              placeholder="Enter a regular expression: (a | b?)*"
              type="textarea"
              rows={6} />
            <RegexOps />
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
                  onSave={this.updateSourceData}></EditAutomata>
                <Button icon="copy" onClick={this.onCopyClick}>Copy</Button>
              </Row>
              }>
              <CardContainer>
                {!this.state.valid ? (
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
