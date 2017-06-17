import React, { Component } from 'react';
import { Alert, Button, Row, Col, Icon, Input } from 'antd';
import { checkEquivalence, checkIsContained } from './utils/RegexUtils';
import styled from 'styled-components';

const Container = styled.div`
  margin-top: 60px;
`;

const Title = styled.p`
  margin-bottom: 12px;
  font-size: 16px;
`;

const ButtonGroup = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  margin-left: 30%;
  margin-right: 30%;
`;

const AlertContainer = styled.div`
  margin-top: 30px;
`;

class RegexOps extends Component {
  state = {
    valid: true,
    regexA: '',
    regexB: '',
    alertData: {
      message: 'Waiting the regular expressions.',
      type: 'info',
    }
  };

  onRegexAChange = (e) => {
    this.setState({
      regexA: e.target.value,
    });
  }

  onRegexBChange = (e) => {
    this.setState({
      regexB: e.target.value,
    });
  }

  onClickEquivalence = (e) => {
    const { regexA, regexB } = this.state;
    const isEquivalent = checkEquivalence(regexA, regexB);

    if (isEquivalent) {
      this.setState({
        alertData: {
          message: 'The regular expressions are equivalent.',
          type: 'success',
        }
      });
    } else {
      this.setState({
        alertData: {
          message: 'The regular expressions are not equivalent.',
          type: 'error',
        }
      });
    }
  }

  onClickContained = (e) => {
    const { regexA, regexB } = this.state;
    const isContained = checkIsContained(regexA, regexB);

    if (isContained) {
      this.setState({
        alertData: {
          message: 'The regular expression A is contained in B.',
          type: 'success',
        }
      });
    } else {
      this.setState({
        alertData: {
          message: 'The regular expression A is not contained in B.',
          type: 'warning',
        }
      });
    }
  }

  render() {
    const { alertData } = this.state;

    return (
      <Container>
        <Title>Operations</Title>
        <Row justify="space-between">
          <Col span={11}>
            <Input
              placeholder="Enter a regular expression: (a | b?)*"
              type="textarea"
              onChange={this.onRegexAChange}
              rows={3} />
          </Col>
          <Col span={2}>
          </Col>
          <Col span={11}>
            <Input
              placeholder="Enter a regular expression: (a | b?)*"
              type="textarea"
              onChange={this.onRegexBChange}
              rows={3} />
          </Col>
        </Row>
        <Row>
          <ButtonGroup>
            <Button onClick={this.onClickEquivalence}>Equivalence</Button>
            <Button onClick={this.onClickContained}>Contains</Button>
          </ButtonGroup>
        </Row>
        <Row>
          <AlertContainer>
            <Alert message={alertData.message} type={alertData.type} showIcon />
          </AlertContainer>
        </Row>
      </Container>
    );
  }
}

export default RegexOps;
