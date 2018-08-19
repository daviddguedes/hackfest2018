import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

import AuthLoadingScreen from './../screens/auth/AuthLoadingScreen';
import Login from './../screens/auth/Login';
import Signup from './../screens/auth/Signup';
import Main from './../screens/main/Main';
import DadosPessoais from './../screens/dados-pessoais/DadosPessoais';
import Visualizar from './../screens/equipamento/Visualizar';
import Cadastrar from './../screens/equipamento/Cadastrar';
import Mapa from '../screens/mapa/Mapa';
import Localizacao from './../screens/localizacao/Localizacao';

const AuthStackNav = createStackNavigator({
	Login: Login,
	Signup: Signup
});

const DadosPessoaisStackNav = createStackNavigator({
	DadosPessoais: DadosPessoais
});

const MainStackNav = createStackNavigator({
	Main: Main,
	VisualizarEquipamento: Visualizar,
	NovoEquipamento: Cadastrar,
	MapaScreen: Mapa,
	LocalizacaoScreen: Localizacao
}, {
		navigationOptions: {
			// headerStyle: {
			// 	backgroundColor: '#8B0000',
			// 	elevation: null
			// }
		}
});

export default createSwitchNavigator({
	AuthLoading: AuthLoadingScreen,
	DadosPessoais: DadosPessoaisStackNav,
	Auth: AuthStackNav,
	Main: MainStackNav
}, {
		initialRouteName: 'AuthLoading'
	});