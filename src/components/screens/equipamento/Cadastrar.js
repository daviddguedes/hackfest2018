// marca, tipo(pode ser PTZ - 360), posicao, horário

import React, { Component } from 'react';
import { DeviceEventEmitter, Dimensions, Alert } from 'react-native';

import { Text, Button, Icon, Container, Content, Form, Item, Label, Input, Picker } from 'native-base';
import Parse from 'parse/react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

const LogoTitle = (props) => {
   return <Text>Cadastrar</Text>
}

export default class Cadastrar extends Component {

   constructor(props) {
      super(props);
      this.state = {
         isDateTimePickerVisible: false,
         showOutros: false,
         nome: undefined,
         tipo: undefined,
         marca: undefined,
         posicao: undefined,
         horario: moment().format(),
         latitude: null,
         longitude: null
      }
   }

   componentDidMount() {
      console.log(this.state);
      this.confirmLocation();
   }

   _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

   _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

   _handleDatePicked = (date) => {
      this.setState({ horario: moment(date).format() });
      this._hideDateTimePicker();
   };

   onPickerTipoChange(value) {
      if (value !== 'outros') {
         this.setState({ showOutros: false });
         this.setState({
            tipo: value
         });
      } else {
         this.setState({ tipo: undefined, showOutros: true });
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

   onSave = async () => {
      const { latitude, longitude } = this.state;
      try {
         // const geolocation = await this.confirmLocation();
         // if (geolocation && geolocation.coords) {
         if (latitude && longitude) {
            // const { latitude, longitude } = geolocation.coords;
            const point = new Parse.GeoPoint({ latitude, longitude });

            const user = await Parse.User.currentAsync();
            if (user) {
               const { nome, tipo, marca, posicao, horario } = this.state;
               if (tipo && marca && posicao && horario) {
                  const formatHora = moment(horario).format('h:mm a') ? moment(horario).format('h:mm a') : horario;
                  const dados = new Parse.Object("Equipamento");
                  dados.set('nome', nome);
                  dados.set('tipo', tipo);
                  dados.set('marca', marca);
                  dados.set('posicao', posicao);
                  dados.set('horario', formatHora);
                  dados.set("localizacao", point);
                  dados.set('user', user);
                  dados.save()
                     .then(response => {
                        this.props.navigation.goBack();
                     })
                     .catch(error => {
                        console.log(error);
                        alert('Erro ao salvar colaborador');
                     });
               } else {
                  Alert.alert('É necessário enviar todos os campos preenchidos');
               }
            }
         } else {
            Alert.alert('É necessário enviar a localização do dispositivo');
         }
      } catch (error) {
         Alert.alert('É necessário enviar a localização do dispositivo');
      }
   }

   confirmLocation = () => {
      const Geolocation = navigator.geolocation;
      // Geolocation.requestAuthorization();
      return new Promise((resolve, reject) => {
         Geolocation.getCurrentPosition((position) => {
            Alert.alert(
               'Confirmar',
               'Você está no local onde o dispositivo está instalado?',
               [
                  { text: 'Não', onPress: () => resolve(), style: 'cancel' },
                  { text: 'SIM', onPress: () => {
                     this.setState({ 
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                     });
                     resolve();
                  }}
               ],
               { cancelable: false }
            )
         }, error => {
            console.log(error);
            reject(error);
         });
      });
   }

   render() {
      const { height, width } = Dimensions.get('window');

      return (
         <Container>
            <Content>
               <Form>
                  <Item stackedLabel>
                     <Label>Dê um nome/apelido</Label>
                     <Input onChangeText={(text) => { this.setState({ nome: text }) }} />
                  </Item>
                  {!this.state.showOutros && <Item picker stackedLabel>
                     <Label>Tipo</Label>
                     <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="ios-arrow-down-outline" />}
                        style={{ width: width }}
                        selectedValue={this.state.tipo}
                        onValueChange={this.onPickerTipoChange.bind(this)}
                        right
                     >
                        <Picker.Item label="Câmera" value="Câmera" />
                        <Picker.Item label="Sensor de presença" value="Aensor de Presenca" />
                        <Picker.Item label="Sensor de estampido" value="Sensor de Estampido" />
                        <Picker.Item label="Outros" value="outros" />
                     </Picker>
                  </Item>}
                  {this.state.showOutros && <Item stackedLabel>
                     <Label>Especifique o tipo</Label>
                     <Input onChangeText={(text) => { this.setState({ tipo: text }) }} />
                  </Item>}

                  <Item stackedLabel>
                     <Label>Marca</Label>
                     <Input onChangeText={(text) => { this.setState({ marca: text }) }} />
                  </Item>
                  <Item stackedLabel>
                     <Label>Posição</Label>
                     <Input onChangeText={(text) => { this.setState({ posicao: text }) }} />
                  </Item>
                  <Item stackedLabel>
                     <Label>Horário</Label>
                     <Input onFocus={this._showDateTimePicker} value={moment(this.state.horario).format('h:mm a')} />
                  </Item>

                  <Button danger full>
                     <Text onPress={() => { this.onSave() }}>Salvar</Text>
                  </Button>
               </Form>
            </Content>

            <DateTimePicker
               isVisible={this.state.isDateTimePickerVisible}
               onConfirm={this._handleDatePicked}
               onCancel={this._hideDateTimePicker}
               mode='time'
            />

         </Container>
      )
   }
}