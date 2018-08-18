import React, { Component } from 'react';
import { AsyncStorage, DeviceEventEmitter, FlatList, Alert } from 'react-native';

import { Button, Icon, Text, Container, Fab } from 'native-base';
import { ListItem } from 'react-native-elements'
import Parse from 'parse/react-native';
import EquipamentoList from '../equipamento/EquipamentoList';

const LogoTitle = (props) => {
   return <Text>Home</Text>
}

const list = [
   {
      id: 'wokiJUh7x',
      name: 'Câmera'
   },
   {
      id: 'plAK98Yhu',
      name: 'Sensor de presença'
   }
]

export default class Main extends Component {

   constructor(props) {
      super(props);
      this.state = {
         user: null,
         dadosPessoais: null,
         dataSource: [],
         active: true
      }
   }

   keyExtractor = (item, index) => item.id;

   renderItem = ({ item }) => {
      return (
         <EquipamentoList
            id={item.id}
            name={item.name}
            onPressItem={this._onPressItem}
         />
      )
   };

   _onPressItem = (id) => {
      const equipamento = this.state.dataSource
         .filter(equip => equip.id === id);

      this.props.navigation.push('VisualizarEquipamento', { equipamento });
   };

   componentWillMount() {
      this.getEquipamentos();
   }

   componentDidMount() {
      this.getUserData();
      this.getDadosPessoais();
   }

   async getEquipamentos() {
      const user = await Parse.User.currentAsync();
      if (user) {
         const query = new Parse.Query("Equipamento");
         query.equalTo("user", user);
         query.find()
            .then(equipamentos => {
               const lista = [];
               const size = equipamentos.length;
               for (let i = 0; i < size; i++) {
                  lista.push({
                     id: equipamentos[i].id,
                     name: equipamentos[i].get('nome')
                  });

                  if (i === size - 1) {
                     this.setState(prevState => ({
                        dataSource: lista,
                     }));
                  }
               }

            })
            .catch(error => alert('Erro buscando a lista de equipamentos'));
      };
   }

   async getDadosPessoais() {
      try {
         const value = await AsyncStorage.getItem('DADOS_PESSOAIS');
         if (value) {
            // console.log(JSON.parse(value))
         } else {
            this.props.navigation.navigate('DadosPessoais');
         }
      } catch (error) {
         Alert.alert('Erro ao carregar dados pessoais');
      }
   }

   async getUserData() {
      const user = await Parse.User.currentAsync();
      if (user) { this.setState({ user: user.toJSON() }) };
   }

   deleteDadosPessoais = async () => {
      try {
         const value = await AsyncStorage.removeItem('DADOS_PESSOAIS');
         this.props.navigation.navigate('DadosPessoais');
      } catch (error) {
         alert('Erro ao carregar dados pessoais');
      }
   }

   static navigationOptions = ({ navigation }) => {
      doLogout = async () => {
         try {
            const logout = await Parse.User.logOut();
            DeviceEventEmitter.emit('userLoggedOut');
         } catch (error) {
            alert('Erro ao fazer logout...');
         }
      }

      return {
         headerTitle: <LogoTitle />,
         headerRight: (
            <Button onPress={() => doLogout()} transparent>
               <Icon name='log-out' />
            </Button>
         )
      }
   };

   render() {
      const { dataSource } = this.state;

      return (
         <Container>
            <FlatList
               keyExtractor={this.keyExtractor}
               data={dataSource}
               renderItem={this.renderItem}
            />

            <Fab
               active={this.state.active}
               direction="up"
               containerStyle={{}}
               style={{ backgroundColor: '#5067FF' }}
               position="bottomRight"
               onPress={() => this.props.navigation.push('NovoEquipamento')}>
               <Icon name="ios-add-circle" />
            </Fab>
         </Container>
      );
   }
}