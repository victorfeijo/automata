import React, { Component } from 'react';
import styled from 'styled-components';
import { indexOf, inc, curry, equals, map, has, without,
         assoc, last, keys, reduce, update, append, head } from 'ramda';
import { Modal, Button, Table, Input, Switch } from 'antd';
import { toColumns, toSourceData } from './utils/AutomataUtils';

const ButtonCnt = styled.div`
  margin-top: 10px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  min-width: 100px;
`;

class EditAutomata extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      automata: {},
      title: 'Title',
      columns: [],
      sourceData: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { automata, title, autoUpdate } = nextProps;

    if (autoUpdate) {
      this.updateStateAutomata(automata, title);
    }
  }

  componentDidMount() {
    const { automata, title } = this.props;

    this.updateStateAutomata(automata, title);
  }

  updateStateAutomata = (automata, title) => {
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
    const { sourceData } = this.state;
    const rowIndex = indexOf(rowValue, sourceData);

    this.setState({ sourceData: update(rowIndex, newValue, sourceData) });
  });

  updateFinal = curry((rowValue, isFinal) => {
    const newState = assoc('final', isFinal, rowValue.state);

    this.updateSourceData(rowValue, rowValue.state,
      assoc('state', newState, rowValue));
  });

  updateText = curry((rowValue, colValue, newValue) => {
    const isState = has('state', colValue);
    const updateKey = isState ? 'state' : colValue.value;

    const updated = assoc(updateKey, isState ?
      { text: newValue.target.value, state: newValue.target.value, final: false } :
      { text: newValue.target.value, value: colValue.value }, rowValue);

    this.updateSourceData(rowValue, colValue, updated);
  });

  mapColumns = (automata) => {
    const actionCol = {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (t, r) => (
        <Actions>
          <Switch
            checkedChildren="Final"
            defaultChecked={r.state.final}
            onChange={this.updateFinal(r)}/>
          <Button
            type="danger"
            key="remove"
            shape="circle"
            icon="close"
            onClick={this.onRemoveTransition(r)} >
          </Button>
        </Actions>
      )
    };

    const withRender = map(assoc('render',
      (textObj, rowValue) => (
        <Input
          onChange={this.updateText(rowValue, textObj)}
          defaultValue={textObj.state || textObj.text}>
        </Input>
      )
    ), toColumns(automata));

    return append(actionCol, withRender);
  }

  onAddTransition = (e) => {
    const lastData = last(this.state.sourceData);

    const newBlank = reduce((obj, key) => {
      if (equals(key, 'key')) {
        return assoc(key, inc(lastData.key), obj)
      }
      if (equals(key, 'state')) {
        return assoc(key, { text: '', state: '', final: false }, obj);
      }

      return assoc(key, { text: '', value: key }, obj);
    }, {}, keys(lastData));

    this.setState({ sourceData: [...this.state.sourceData, newBlank] });
  }

  onRemoveTransition = curry((rowValue, e) => {
    const { sourceData } = this.state;
    const initial = head(sourceData);

    if (initial !== rowValue) {
      this.setState({
        sourceData: without([rowValue], this.state.sourceData)
      });
    }
  })

  onSave = curry((saveCallback, e) => {
    this.setState({ visible: false });

    saveCallback(this.state.sourceData);
  })

  render() {
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
            <Button
              key="submit"
              type="primary"
              onClick={this.onSave(this.props.onSave)}
              icon="save"> Save </Button>, ]}
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
