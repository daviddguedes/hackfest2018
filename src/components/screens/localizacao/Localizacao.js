import React, { Component } from 'react';
import { StyleSheet, DeviceEventEmitter } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Button, Icon, Text, Container, Header, Item, Input, Content } from 'native-base';
import Parse from 'parse/react-native';

const LogoTitle = (props) => {
	return <Text>Localização</Text>
}

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		height: 400,
		width: 400,
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	map: {
		...StyleSheet.absoluteFillObject,
	},
});

export default class Localizacao extends Component {

	constructor(props) {
		super(props);
	}

	componentWillMount() {
		// const { equipamento } = this.props.navigation.state.params;
		// this.setState({
		//    latitude: equipamento.get('localizacao').latitude,
		//    longitude: equipamento.get('localizacao').longitude,
		//    tipo: equipamento.get('tipo'),
		//    marca: equipamento.get('marca')
		// });
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

	render() {
		return (
			<Container>
				<Header searchBar rounded>
					<Item>
						<Icon name="ios-search" />
						<Input placeholder="Buscar" />
						<Icon name="ios-people" />
					</Item>
					<Button transparent>
						<Text>Buscar</Text>
					</Button>
				</Header>
				<Container>
					<MapView
						style={styles.map}
						region={{
							latitude: -7.110929,
							longitude: -34.870291,
							latitudeDelta: 0.015,
							longitudeDelta: 0.0121,
						}}
					>
						<Marker
							coordinate={{ latitude: -7.110929, longitude: -34.870291 }}
						/>
					</MapView>
				</Container>
			</Container>
		)
	}

}