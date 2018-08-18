import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

import AuthLoadingScreen from './../screens/auth/AuthLoadingScreen';
import Login from './../screens/auth/Login';
import Signup from './../screens/auth/Signup';
import Main from './../screens/main/Main';
import DadosPessoais from './../screens/dados-pessoais/DadosPessoais';
import Visualizar from './../screens/equipamento/Visualizar';
import Cadastrar from './../screens/equipamento/Cadastrar';

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
	NovoEquipamento: Cadastrar
});

export default createSwitchNavigator({
	AuthLoading: AuthLoadingScreen,
	DadosPessoais: DadosPessoaisStackNav,
	Auth: AuthStackNav,
	Main: MainStackNav
}, {
		initialRouteName: 'AuthLoading'
	});