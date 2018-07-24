import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import logo from './Icons/globe-map-icon.png';
import './App.css';
import Map from './Map';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">My favourite places</h1>
        </header>
		<hr></hr>
		<Map google={this.props.google} />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyANY6JbL54WB2hFaX3YIIlsc06vpOrBcAQ'
})(App)
