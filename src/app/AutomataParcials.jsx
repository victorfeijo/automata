import React, { Component } from 'react';
import styled from 'styled-components';
import { indexOf, inc, curry, equals, map, has, without,
         assoc, last, keys, reduce, update, append, head } from 'ramda';
import { Modal, Button, Table, Input, Tabs, message } from 'antd';
import { toColumns, toSourceData } from './utils/AutomataUtils';
import store from 'store';

const ButtonCnt = styled.div`
  margin-top: 14px;
`;

class AutomataParcials extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      parcials: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { parcials } = nextProps;

    this.setState({ parcials });
  }

  componentDidMount() {
    const { parcials } = this.props;

    this.setState({ parcials });
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  onCopyClick = curry((automata, e) => {
    store.set('copied', { automata: automata });
    message.success('Copied automata with success!');
  });

  render() {
    const { parcials } = this.state;

    return (
      <div>
        <Button onClick={this.showModal} icon="scan"></Button>
        <Modal
          title={"Parcial automatas"}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={[<Button key="back" onClick={this.handleCancel} icon="close"> Return</Button>]}>
          <Tabs>
            {parcials.map((parcial, i) => (
              <Tabs.TabPane tab={parcial.operation} key={i+1}>
                <Table
                  columns={toColumns(parcial.automata)}
                  dataSource={toSourceData(parcial.automata)}
                  pagination={false} />
                <ButtonCnt>
                  <Button
                    key="copy"
                    icon="copy"
                    onClick={this.onCopyClick(parcial.automata)}>Copy</Button>
                </ButtonCnt>
              </Tabs.TabPane>
            ))}
          </Tabs>
        </Modal>
      </div>
    );
  }
}

export default AutomataParcials;
