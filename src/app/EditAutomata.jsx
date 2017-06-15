import React, { Component } from 'react';
import styled from 'styled-components';
import { curry, equals, map, assoc, tail, keys, reduce } from 'ramda';
import { Modal, Button, Table, Input } from 'antd';

import { toColumns, toSourceData } from './Utils/AutomataUtils';

const ButtonCnt = styled.div`
  margin-top: 10px;
`;

class EditAutomata extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      automata: {},
      title: 'Title',
      savedTransitions: [],
      columns: [],
      sourceData: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { automata, title } = nextProps;
    const columns = this.mapColumns(automata);
    const sourceData = toSourceData(automata);

    this.setState({ automata, title, columns, sourceData });
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

  updateSourceData = curry((rowValue, colValue, newValue) => {
    console.log('row', rowValue);

    console.log('col', colValue);

    console.log('new', newValue.target.value);
  });

  mapColumns = (automata) => {
    const parsed = toColumns(automata);

    return map(assoc('render',
      (textObj, rowValue) => (
        <Input
          onChange={this.updateSourceData(rowValue, textObj)}
          defaultValue={textObj.text}>
        </Input>
      )
    ), parsed);
  }

  onAddTransition = (e) => {
    const lastData = tail(this.state.sourceData)[0];

    const newBlank = reduce((obj, key) => (
      assoc(key, equals(key, 'key') ? lastData.key++ : '', obj)
    ), {}, keys(lastData));

    this.setState({ sourceData: [...this.state.sourceData, newBlank] });
  }

  render() {
    const { onSave } = this.props;
    const { title, columns, sourceData } = this.state;

    return (
      <div>
        <Button onClick={this.showModal} icon="edit">Edit</Button>
        <Modal
          title={title}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel} icon="close"> Return</Button>,
            <Button key="submit" type="primary" onClick={this.onSave} icon="save"> Save </Button>,
          ]}
        >
          <Table columns={columns} dataSource={sourceData} pagination={false} />
          <ButtonCnt>
            <Button key="add" shape="circle" icon="plus" onClick={this.onAddTransition}></Button>
          </ButtonCnt>
        </Modal>
      </div>
    );
  }
}

export default EditAutomata;
