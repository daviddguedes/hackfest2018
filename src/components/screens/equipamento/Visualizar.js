import React, { Component } from 'react';
import { DeviceEventEmitter } from 'react-native';

import { Container, Header, Content, Card, CardItem, Text, Body, Button, Icon } from 'native-base';
import Parse from 'parse/react-native';

const LogoTitle = (props) => {
	return <Text>Visualizar</Text>
}

export default class Visualizar extends Component {

	constructor(props) {
		super(props);
		console.log(this.props.navigation.state.params.equipamento[0])
		this.state = {
			equipamento: null
		}
	}

	componentDidMount() {
		const { equipamento } = this.props.navigation.state.params;
		const query = new Parse.Query("Equipamento");
		query.include('user');
		query.get(equipamento[0].id).then(response => {
			this.setState({
				equipamento: response
			});
		})
			.catch(error => alert('Erro carregando o equipamento'));
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
				<Button onPress={this.doLogout} transparent>
					<Icon name='log-out' />
				</Button>
			)
		}
	};

	onPressViewMap = () => {
		this.props.navigation.push('MapaScreen', { equipamento: this.state.equipamento });
	}


	render() {
		const { equipamento } = this.state;
		return (
			<Container>
				{this.state.equipamento && <Content>
					<Card>
						<CardItem header>
							<Text>{equipamento.get('nome')}</Text>
						</CardItem>
						<CardItem>
							<Body>
								<Text>Tipo: {equipamento.get('tipo')}</Text>
								<Text>Marca: {equipamento.get('marca')}</Text>
								{/* <Text>Horário no dispositivo: { equipamento.get('horario') }</Text> */}
								<Text>Direção do dispositivo: {equipamento.get('posicao')}</Text>
							</Body>
						</CardItem>
						<CardItem>
							<Button transparent warning>
								<Text>Editar</Text>
							</Button>
							<Button transparent success onPress={this.onPressViewMap}>
								<Text>Ver no Mapa</Text>
							</Button>
							<Button transparent danger>
								<Text>Deletar</Text>
							</Button>
						</CardItem>
						<CardItem footer>
							<Text>Usuário: {equipamento.get('user').get('username')}</Text>
						</CardItem>
					</Card>
				</Content>}
			</Container>
		)
	}
}