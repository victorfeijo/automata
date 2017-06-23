import React, { Component } from 'react';
import { Modal, Button, Tooltip, Select } from 'antd';
import store from 'store';
import { map, curry, addIndex, find } from 'ramda';

class LoadAutomata extends Component {
  state = {
    visible: false,
    automatas: {},
    selected: '',
  }

  showModal = () => {
    this.setState({
      visible: true,
      automatas: store.get('savedList'),
    });
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  handleSelectChange = (value) => {
    this.setState({ selected: value });
  }

  onSaveSelected = curry((saveCallback, e) => {
    const { automatas, selected } = this.state;
    const selectedAutomata = find(a => a.name === selected, automatas);

    saveCallback(selectedAutomata);
    this.setState({ visible: false });
  });

  render() {
    const { onSave } = this.props;
    const { visible, automatas } = this.state;
    const mapIdx = addIndex(map);

    return (
      <div>
        <Tooltip title="Load">
          <Button icon="inbox" onClick={this.showModal}></Button>
        </Tooltip>
        <Modal
          title="Save automata to current store."
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel} icon="close"> Return</Button>,
            <Button
              key="submit"
              type="primary"
              onClick={this.onSaveSelected(onSave)}
              icon="inbox"> Load </Button>, ]}
        >
          <Select defaultValue="Select automata" style={{ width: 240 }} onChange={this.handleSelectChange}>
            {
              mapIdx((automata, idx) => (
                <Select.Option value={automata.name} key={idx}>{automata.name}</Select.Option>
              ), automatas)
            }
          </Select>
        </Modal>
      </div>
    );
  }
}

export default LoadAutomata
