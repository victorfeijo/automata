import React, { Component } from 'react';
import styled from 'styled-components';
import { indexOf, inc, curry, equals, map, has, without,
         assoc, last, keys, reduce, update, append, head } from 'ramda';
import { sourceDataToAutomata } from './utils/AutomataUtils';
import { message, Modal, Button, Table, Input, Switch, Tooltip } from 'antd';
import { toColumns, toSourceData, nextToND } from './utils/AutomataUtils';
import store from 'store';

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
      saveVisible: false,
      automata: {},
      name: '',
      title: 'Title',
      columns: [],
      sourceData: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { automata, title } = nextProps;

    this.updateStateAutomata(automata, title);
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
    let newState = assoc('final', isFinal, rowValue.state);

    newState = isFinal ?
      assoc('text', `* ${rowValue.state.state}`, newState) :
      assoc('text', rowValue.state.state, newState)

    this.updateSourceData(rowValue, rowValue.state,
      assoc('state', newState, rowValue));
  });

  updateText = curry((rowValue, colValue, newValue) => {
    const val = newValue.target.value;
    const isState = has('state', colValue);
    const updateKey = isState ? 'state' : colValue.value;

    const updated = assoc(updateKey, isState ?
      { text: val, state: val, final: false } :
      { text: val, value: colValue.value, next: nextToND(val) }, rowValue);

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

      return assoc(key, { text: '', value: key, next: [''] }, obj);
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
  });

  onAutomataName = (e) => {
    this.setState({ name: e.target.value });
  }

  onSaveStore = (e) => {
    const { sourceData, name } = this.state;
    if (name === '' || sourceData === {}) {
      message.error('Fill the name or automata.');
      return;
    }

    const newAutomata = {
      name: name,
      automata: sourceDataToAutomata(sourceData),
      sourceData: sourceData,
    };
    const saveds = store.get('savedList');
    store.set('savedList', append(newAutomata, saveds));

    this.setState({ saveVisible: false });
    message.success('Automata saved with success!');
  }

  render() {
    const { title, columns, sourceData } = this.state;
    const { saveText, hideEdit } = this.props;

    return (
      <div>
        { !hideEdit &&
            <Button onClick={this.showModal} icon="edit">Edit</Button> }
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
          { this.state.visible &&
              <Table columns={columns} dataSource={sourceData} pagination={false} />
          }
          <ButtonCnt>
            <Button key="add" shape="circle" icon="plus" onClick={this.onAddTransition}></Button>
          </ButtonCnt>
        </Modal>
        <Tooltip title="Save">
          <Button icon="file-add" onClick={(e) => this.setState({ saveVisible: true })}>{ saveText && "Save"}</Button>
        </Tooltip>
        <Modal
          title="Save automata"
          visible={this.state.saveVisible}
          onCancel={(e) => this.setState({ saveVisible: false })}
          footer={[
            <Button key="back" onClick={(e) => this.setState({ saveVisible: false })} icon="close"> Return</Button>,
            <Button
              key="submit"
              type="primary"
              onClick={this.onSaveStore}
              icon="save"> Save </Button>, ]}
        >
          <Input placeholder="Automata Name" onChange={this.onAutomataName} />
        </Modal>
      </div>
    );
  }
}

export default EditAutomata;
