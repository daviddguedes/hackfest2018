import React, { Component } from 'react';
import { AsyncStorage, DeviceEventEmitter, FlatList, Alert, RefreshControl } from 'react-native';

import { Button, Icon, Text, Container, Fab } from 'native-base';
import { ListItem } from 'react-native-elements'
import Parse from 'parse/react-native';
import EquipamentoList from '../equipamento/EquipamentoList';

import Loader from './../../loader';

const LogoTitle = (props) => {
   return <Text>Home</Text>
}

export default class Main extends Component {

   constructor(props) {
      super(props);
      this.state = {
         user: null,
         dadosPessoais: null,
         dataSource: [],
         active: true,
         loading: false,
         refreshing: false
      }
   }

   _onRefresh = () => {
      this.setState({ refreshing: true });
      this.refreshEquipamentos();
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
      // this.getDadosPessoais();
   }

   refreshEquipamentos() {
      return new Promise( async (resolve, reject) => {
         this.setState({ dataSource: [] });
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
                           dataSource: lista
                        }));
                        this.setState({ refreshing: false });
                        resolve();
                     }
                  }

               })
               .catch(error => {
                  this.setState({ refreshing: false });
                  reject();
                  alert('Erro buscando a lista de equipamentos');
               });
         } else {
            reject();
            this.setState({ refreshing: false });
         };
      });
   }

   async getEquipamentos() {
      const user = await Parse.User.currentAsync();
      if (user) {
         this.setState({loading: true});
         const query = new Parse.Query("Equipamento");
         query.equalTo("user", user);
         query.find()
            .then(equipamentos => {
               const lista = [];
               const size = equipamentos.length;
               if (size > 0) {
                  for (let i = 0; i < size; i++) {
                     lista.push({
                        id: equipamentos[i].id,
                        name: equipamentos[i].get('nome')
                     });

                     if (i === size - 1) {
                        this.setState(prevState => ({
                           dataSource: lista
                        }));
                        this.setState({ loading: false });
                     }
                  }
               } else {
                  this.setState({ loading: false });
               }
            })
            .catch(error => {
               this.setState({ loading: false });
               alert('Erro buscando a lista de equipamentos');
            });
      } else {
         this.setState({ loading: false });
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
      doLogout = () => {
         try {
            Parse.User.logOut().then(() => {
               DeviceEventEmitter.emit('userLoggedOut');
            });
         } catch (error) {
            // DeviceEventEmitter.emit('userLoggedOut');
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
      const { dataSource } = this.state;

      return (
         <Container>
            <FlatList
               refreshControl={
                  <RefreshControl
                     refreshing={this.state.refreshing}
                     onRefresh={this._onRefresh}
                  />
               }
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

            <Loader loading={this.state.loading} />
         </Container>
      );
   }
}