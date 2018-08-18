import React, { Component, Fragment } from 'react';
import { AsyncStorage} from 'react-native';
import Navigator from './src/components/navigator/Navigator';
import Parse from 'parse/react-native';

Parse.initialize('app_id', 'javascript_key');
Parse.serverURL = 'http://localhost:1337/parse'
// Parse.serverURL = 'https://eed3fd96.ngrok.io/parse'
Parse.setAsyncStorage(AsyncStorage);

export default class App extends Component {

  render() {
    return <Navigator />
  }
}