import React, { Component, Fragment } from 'react';
import Loader from './../../loader';
import Parse from 'parse/react-native';


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

export default class Signup extends Component {

   constructor(props) {
      super(props);
      this.state = {
         username: null,
         password: null,
         email: null,
         Parse: Parse,
         error: null,
         loading: false
      }
   }

   doSignIn() {
      const { username, password, email, Parse } = this.state;

      if (username && password && email) {
         this.setState({ loading: true });
         const user = new Parse.User();
         user.set("username", username);
         user.set("password", password);
         user.set("email", email);

         user.signUp(null, {
            success: (user) => {
               this.setState({ loading: false });
               this.props.navigation.push('Login');
            },
            error: (user, error) => {
               this.setState({ loading: false });
               this.setState({
                  error: error.message
               });
            }
         });
      } else {
         this.setState({
            error: { message: "Né assim não, oxe..." }
         });
      }
   }

   render() {
      return (
         <Container style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 20
         }}>
            <List>
               <ListItem>
                  <InputGroup>
                     <Icon name="mail" style={{ color: '#0A69FE' }} />
                     <Input
                        autoCapitalize='none'
                        onChangeText={(email) => this.setState({ email })}
                        value={this.state.email}
                        placeholder={"Email"} />
                  </InputGroup>
               </ListItem>
               <ListItem>
                  <InputGroup>
                     <Icon name="ios-person" style={{ color: '#0A69FE' }} />
                     <Input
                        autoCapitalize='none'
                        onChangeText={(username) => this.setState({ username })}
                        value={this.state.username}
                        placeholder={"Username"} />
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
            <Button full primary onPress={() => { this.doSignIn() }}>
               <Text>Sign In</Text>
            </Button>

            {this.state.error && <Text>{ JSON.stringify(this.state.error) }</Text>}
            <Loader loading={this.state.loading} />

         </Container>
      );
   }
}