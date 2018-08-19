import React, { Component, Fragment } from 'react';
import {
	AsyncStorage,
	ActivityIndicator,
	StatusBar,
	DeviceEventEmitter
} from 'react-native';

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
			const user = await Parse.User.currentAsync();
			if (user) {
				const value = await this.getColaborador(user);
				if (value === 1) {
					this.props.navigation.navigate('Main');
				} else {
					this.props.navigation.navigate('DadosPessoais');
				}
			} else {
				this.props.navigation.navigate('Login');
			}
		} catch (error) {
			alert('Não foi possível recuperar os dados de login');
			this.props.navigation.navigate('Login');
		}
	}

	getColaborador = (user) => {
		return new Promise((resolve, reject) => {
			const query = new Parse.Query('Colaborador');
			query.equalTo('user', user);
			query.find()
				.then(response => {
					if (response.length > 0) {
						resolve(1);
					} else {
						resolve(0);
					}
				})
				.catch(error => {
					reject(error);
				});
		});
	}

	render() {
		return (
			<Fragment>
				<ActivityIndicator />
			</Fragment>
		);
	}
}