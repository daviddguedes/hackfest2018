import React, { Component, Fragment } from 'react';
import { DeviceEventEmitter, AsyncStorage, StyleSheet } from 'react-native';
import Loader from './../../loader';

import {
   Container,
   Button,
   Text,
   Form,
   Item as FormItem,
   Input,
   Label,
   List,
   ListItem,
   InputGroup,
   Icon
} from 'native-base';
import Parse from 'parse/react-native';

export default class Login extends Component {

   constructor(props) {
      super(props);
      this.state = {
         username: null,
         password: null,
         error: null,
         Parse: Parse,
         loading: false
      }
      this.doLogin = this.doLogin.bind(this);
      this.signUp = this.signUp.bind(this);
   }

   doLogin() {
      const { username, password, Parse } = this.state;

      if (username && password) {
         this.setState({loading: true});
         Parse.User.logIn(username, password, {
            success: async (user) => {
               this.setState({ loading: false });
               const uss = await Parse.User.currentAsync();
               DeviceEventEmitter.emit('userLoggedIn');
            },
            error: (user, error) => {
               this.setState({ loading: false });
               this.setState({
                  error: error
               });
               DeviceEventEmitter.emit('userLoggedOut');
            }
         });
      } else {
         this.setState({
            error: { message: "Digite username e senha" }
         });
      }

   }

   signUp() {
      return this.props.navigation.push('Signup', {
         Parse: this.state.Parse
      });
   }

   render() {
      return (
         <Container style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 20}}>
            {/* <Form>
               <FormItem floatingLabel>
                  <Label>Email or Username</Label>
                  <Input autoCapitalize='none' onChangeText={(username) => this.setState({ username })} />
               </FormItem>
               <FormItem floatingLabel last>
                  <Label>Password</Label>
                  <Input onChangeText={(password) => this.setState({ password })} secureTextEntry={true} />
               </FormItem>

               <Button full primary onPress={() => this.doLogin()} style={{ paddingBottom: 4 }}>
                  <Text> Login </Text>
               </Button>
               <Button full light onPress={() => this.signUp()}><Text> Sign Up </Text></Button>
            </Form>
            {this.state.error && <Text>{JSON.stringify(this.state.error.message)}</Text>}
            <Loader loading={this.state.loading} /> */}


            <List>
               <ListItem>
                  <InputGroup>
                     <Icon name="ios-person" style={{ color: '#0A69FE' }} />
                     <Input
                        autoCapitalize='none'
                        onChangeText={(username) => this.setState({ username})}
                        value={this.state.email}
                        placeholder={"Email or Username"} />
                  </InputGroup>
               </ListItem>
               <ListItem>
                  <InputGroup>
                     <Icon name="ios-unlock" style={{ color: '#0A69FE' }} />
                     <Input
                        onChangeText={(password) => this.setState({ password })}
                        value={this.state.password}
                        secureTextEntry={true}
                        placeholder={"Password"} />
                  </InputGroup>
               </ListItem>
            </List>
            <Button full primary onPress={() => { this.doLogin()}}>
               <Text>Login</Text>
              </Button>
            <Button full onPress={() => { this.signUp()}} light>
               <Text>Sign Up</Text>
              </Button>

            {this.state.error && <Text>{JSON.stringify(this.state.error.message)}</Text>}
            <Loader loading={this.state.loading} />

         </Container>
      );
   }
}