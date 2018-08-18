import React, { Component, Fragment } from 'react';
import { 
   AsyncStorage, 
   ActivityIndicator, 
   StatusBar, 
   DeviceEventEmitter } from 'react-native';

import Parse from 'parse/react-native';

export default class AuthLoadingScreen extends Component {

   constructor(props) {
      super(props);
      this.state = {
         dadosPessoais: null
      }
   }

   componentWillMount() {
      DeviceEventEmitter.addListener('userLoggedIn', this.redirectAuth.bind(this))
      DeviceEventEmitter.addListener('userLoggedOut', this.redirectAuth.bind(this))
   }

   componentDidMount() {
      this.redirectAuth();
   }

   componentWillUnmount() {
      // DeviceEventEmitter.removeAllListeners();
   }

   redirectAuth = async () => {
      try {
         const value = await AsyncStorage.getItem('DADOS_PESSOAIS');
         if (value !== null) {
            this.setState({ dadosPessoais: JSON.parse(value) });
            const user = await Parse.User.currentAsync();
            if (user) {
               this.props.navigation.navigate('Main');
            } else {
               this.props.navigation.navigate('Login');
            }
         } else {
            this.props.navigation.navigate('DadosPessoais');
         }
      } catch (error) {
         alert('Erro ao carregar dados pessoais');
      }
   }

   render() {
      return (
         <Fragment>
            <ActivityIndicator />
            <StatusBar barStyle='dark-content' />
         </Fragment>
      );
   }
}