import React, { Component } from 'react';
import { StyleSheet, DeviceEventEmitter } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Button, Icon, Text, Container } from 'native-base';
import Parse from 'parse/react-native';

const LogoTitle = (props) => {
	return <Text>Ver no Mapa</Text>
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

export default class Mapa extends Component {

	constructor(props) {
		super(props);
		console.log(this.props.navigation.state.params.equipamento)
	}

	componentWillMount() {
		const { equipamento } = this.props.navigation.state.params;
		this.setState({
			latitude: equipamento.get('localizacao').latitude,
			longitude: equipamento.get('localizacao').longitude,
			tipo: equipamento.get('tipo'),
			marca: equipamento.get('marca')
		});
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
				{this.state.latitude && this.state.longitude && <MapView
					style={styles.map}
					region={{
						latitude: this.state.latitude,
						longitude: this.state.longitude,
						latitudeDelta: 0.015,
						longitudeDelta: 0.0121,
					}}
				>
					<Marker
						coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }}
						title={this.state.tipo}
						description={this.state.marca}
					/>
				</MapView>}
			</Container>
		)
	}

}