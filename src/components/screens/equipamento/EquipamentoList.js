import React, { Component } from 'react';

import { Content, List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';

export default class EquipamentoList extends Component {

   _onPress = () => {
      this.props.onPressItem(this.props.id);
   };

   render() {
      return (
         <Content style={{ paddingTop: 10, paddingBottom: 10 }}>
            <List>
               <ListItem onPress={this._onPress}>

               <Left>
                  <Text>{this.props.name}</Text>
               </Left>
               
               </ListItem>
            </List>
         </Content>
      )
   }
}