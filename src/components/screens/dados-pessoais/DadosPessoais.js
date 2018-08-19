import React, { Component, Fragment } from 'react';
import {
	AsyncStorage,
	DeviceEventEmitter,
	Alert
} from 'react-native';

import { Button, Text, Icon, Container, Content, Form, Item, Input } from 'native-base';
import Parse from 'parse/react-native';

import Loader from './../../loader';

const LogoTitle = (props) => {
	return <Text>Dados Pessoais</Text>
}

export default class DadosPessoais extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: false
		}
	}

	_storeData = async (dados) => {
		try {
			await AsyncStorage.setItem('DADOS_PESSOAIS', JSON.stringify(dados));
			this.props.navigation.navigate('Main');
		} catch (error) {
			alert('Erro salvando dados pessoais');
		}
	}

	static navigationOptions = ({ navigation }) => {
		doLogout = () => {
			try {
				Parse.User.logOut().then(() => {
					DeviceEventEmitter.emit('userLoggedOut');
				});
			} catch (error) {
				alert('Erro ao fazer logout...');
			}
		}

		return {
			headerTitle: <LogoTitle />,
			headerRight: (
				<Button onPress={() => this.doLogout} transparent>
					<Icon name='log-out' />
				</Button>
			)
		}
	};

	onSave = async () => {
		this.setState({ loading: true });
		const user = await Parse.User.currentAsync();
		if (user) {
			const { cpf_cnpj, nome_razao, telefone } = this.state;
			if (cpf_cnpj && nome_razao && telefone) {
				const dados = new Parse.Object("Colaborador");
				dados.set('cpf_cnpj', cpf_cnpj);
				dados.set('nome_razao', nome_razao);
				dados.set('telefone', telefone);
				dados.set('user', user);
				dados.save()
					.then(response => {
						this.setState({ loading: false });
						this._storeData(response);
					})
					.catch(error => {
						console.log(error);
						this.setState({ loading: false });
						alert('Erro ao salvar colaborador');
					});
			} else {
				this.setState({ loading: false });
				Alert.alert('Todos os campos são obrigatórios.');
			}
		} else {
			this.setState({ loading: false });
		}
	}

	render() {
		return (
			<Container>
				<Loader loading={this.state.loading} />
				<Content>
					<Form>
						<Item>
							<Input maxLength={11} onChangeText={(text) => { this.setState({ cpf_cnpj: text }) }} placeholder="CPF ou CNPJ" />
						</Item>
						<Item>
							<Input maxLength={60} onChangeText={(text) => { this.setState({ nome_razao: text }) }} placeholder="Nome ou Razão Social" />
						</Item>
						<Item>
							<Input maxLength={11} onChangeText={(text) => { this.setState({ telefone: text }) }} placeholder="Telefone" />
						</Item>
						<Button danger full>
							<Text onPress={() => { this.onSave() }}>Salvar</Text>
						</Button>
					</Form>
				</Content>
			</Container>
		);
	}
}