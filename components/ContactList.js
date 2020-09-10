//import React from 'react';
import React, { useEffect } from 'react';
import {StyleSheet, Text, StatusBar} from 'react-native';
import { List, ListItem } from 'native-base';

class ContactList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <React.Fragment>
      <Text>Contacts</Text>
      <List>
        {this.props.data && this.props.data.map((items, i) => {
            return (
              <ListItem key={i}>
                <Text onPress={() => this.props.navigation.navigate('GetUserAmount', { id: items.id })}>{items.name}</Text>
              </ListItem>
            );
        })}
      </List>
      </React.Fragment>  
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#ccc',
    padding: 5,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default ContactList