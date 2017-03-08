import React, { Component } from 'react';
import { DatePicker } from 'antd';
import './App.css';

export default class App extends Component {
  render() {
    return (
      <div className='App'>
        <h1>Hello World</h1>
        <DatePicker />
      </div>
    );
  }
}
